import base64
import json
import tempfile
from collections.abc import Callable, Iterator
from pathlib import Path
from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response, StreamingResponse
from muscriptor.events import NoteEndEvent, NoteStartEvent, ProgressEvent

from backend.core.muscriptor_engine import (
    ModelNotReadyError,
    TranscriptionEvent,
    muscriptor_engine,
)


router = APIRouter()


def encode_sse(event_name: str, payload: dict[str, Any]) -> str:
    return (
        f"event: {event_name}\n"
        f"data: {json.dumps(payload)}\n\n"
    )


def serialise_transcription_event(
    event: TranscriptionEvent,
) -> tuple[str, dict[str, Any]]:
    if isinstance(event, NoteStartEvent):
        return (
            "note_start",
            {
                "pitch": event.pitch,
                "start_time": event.start_time,
                "index": event.index,
                "instrument": event.instrument,
            },
        )

    if isinstance(event, NoteEndEvent):
        return (
            "note_end",
            {
                "end_time": event.end_time,
                "start_event_index": event.start_event_index,
            },
        )

    if isinstance(event, ProgressEvent):
        return (
            "progress",
            {
                "completed": event.completed,
                "total": event.total,
            },
        )

    raise TypeError(f"Unsupported transcription event: {type(event)!r}")


def generate_transcription_stream(
    *,
    temporary_path: Path,
    original_name: str,
    transcribe_events: Callable[
        [Path],
        Iterator[TranscriptionEvent],
    ],
    events_to_midi_bytes: Callable[
        [Iterator[TranscriptionEvent]],
        bytes,
    ],
) -> Iterator[str]:
    collected_events: list[TranscriptionEvent] = []

    try:
        for event in transcribe_events(temporary_path):
            collected_events.append(event)
            event_name, payload = serialise_transcription_event(event)
            yield encode_sse(event_name, payload)

        midi_bytes = events_to_midi_bytes(iter(collected_events))
        output_name = f"{Path(original_name).stem}.mid"

        yield encode_sse(
            "complete",
            {
                "output_filename": output_name,
                "midi_base64": base64.b64encode(midi_bytes).decode("ascii"),
            },
        )

    except Exception as error:
        yield encode_sse(
            "error",
            {
                "message": str(error),
            },
        )

    finally:
        temporary_path.unlink(missing_ok=True)


@router.post("/api/upload-test")
async def upload_test(file: UploadFile = File(...)) -> dict[str, Any]:
    contents = await file.read()

    return {
        "filename": file.filename or "Unnamed file",
        "content_type": file.content_type or "Unknown",
        "size_bytes": len(contents),
    }


@router.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)) -> Response:
    try:
        transcribe_to_midi = muscriptor_engine.prepare_transcription()
    except ModelNotReadyError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from None

    audio_data = await file.read()

    original_name = file.filename or "audio.wav"
    suffix = Path(original_name).suffix or ".wav"

    temporary_path: Path | None = None

    try:
        with tempfile.NamedTemporaryFile(
            suffix=suffix,
            delete=False,
        ) as temporary_file:
            temporary_file.write(audio_data)
            temporary_path = Path(temporary_file.name)

        import asyncio

        midi_bytes = await asyncio.to_thread(
            transcribe_to_midi,
            temporary_path,
        )

        output_name = f"{Path(original_name).stem}.mid"

        return Response(
            content=midi_bytes,
            media_type="audio/midi",
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{output_name}"'
                ),
            },
        )

    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)


@router.post("/api/transcribe-stream")
async def transcribe_audio_stream(
    file: UploadFile = File(...),
) -> StreamingResponse:
    try:
        transcribe_events, events_to_midi_bytes = (
            muscriptor_engine.prepare_event_transcription()
        )
    except ModelNotReadyError as error:
        raise HTTPException(
            status_code=503,
            detail=str(error),
        ) from None

    audio_data = await file.read()

    original_name = file.filename or "audio.wav"
    suffix = Path(original_name).suffix or ".wav"

    with tempfile.NamedTemporaryFile(
        suffix=suffix,
        delete=False,
    ) as temporary_file:
        temporary_file.write(audio_data)
        temporary_path = Path(temporary_file.name)

    return StreamingResponse(
        generate_transcription_stream(
            temporary_path=temporary_path,
            original_name=original_name,
            transcribe_events=transcribe_events,
            events_to_midi_bytes=events_to_midi_bytes,
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
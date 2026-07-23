from collections.abc import Callable, Iterator
from pathlib import Path
from threading import Lock, Thread

from muscriptor import TranscriptionModel
from muscriptor.events import NoteEndEvent, NoteStartEvent, ProgressEvent


TranscriptionEvent = NoteStartEvent | NoteEndEvent | ProgressEvent


class ModelNotReadyError(RuntimeError):
    pass


class MuscriptorEngine:
    def __init__(self, *, weights_path: str, device: str) -> None:
        self._weights_path = weights_path
        self._device = device
        self._model: TranscriptionModel | None = None
        self._model_status = "not_started"
        self._model_error: str | None = None
        self._model_lock = Lock()

    def start_background_loading(self) -> None:
        loader = Thread(
            target=self._load_model,
            daemon=True,
            name="muscriptor-model-loader",
        )
        loader.start()

    def status_snapshot(self) -> tuple[str, str | None]:
        with self._model_lock:
            return self._model_status, self._model_error

    def prepare_transcription(self) -> Callable[[Path], bytes]:
        ready_model = self._get_ready_model()

        def transcribe_to_midi(audio_path: Path) -> bytes:
            return ready_model.transcribe_to_midi(audio_path)

        return transcribe_to_midi

    def prepare_event_transcription(
        self,
    ) -> tuple[
        Callable[[Path], Iterator[TranscriptionEvent]],
        Callable[[Iterator[TranscriptionEvent]], bytes],
    ]:
        ready_model = self._get_ready_model()

        return ready_model.transcribe, ready_model.events_to_midi_bytes

    def _load_model(self) -> None:
        with self._model_lock:
            self._model_status = "loading"
            self._model_error = None

        try:
            loaded_model = TranscriptionModel.load_model(
                weights_path=self._weights_path,
                device=self._device,
            )

            with self._model_lock:
                self._model = loaded_model
                self._model_status = "ready"

        except Exception as error:
            with self._model_lock:
                self._model = None
                self._model_status = "error"
                self._model_error = str(error)

    def _get_ready_model(self) -> TranscriptionModel:
        with self._model_lock:
            current_model = self._model
            current_status = self._model_status
            current_error = self._model_error

        if current_model is None or current_status != "ready":
            detail = "MuScriptor Large is not ready."

            if current_error:
                detail += f" {current_error}"

            raise ModelNotReadyError(detail)

        return current_model


muscriptor_engine = MuscriptorEngine(
    weights_path="large",
    device="cuda",
)
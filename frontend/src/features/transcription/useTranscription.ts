import { useState } from "react";
import { transcribeAudio } from "./transcriptionApi";
import type { TranscriptionResult, TranscriptionStatus } from "./types";

export function useTranscription() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcriptionResult, setTranscriptionResult] =
    useState<TranscriptionResult | null>(null);
  const [uploadStatus, setUploadStatus] = useState<TranscriptionStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  function selectFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setTranscriptionResult(null);
    setUploadStatus("idle");
    setUploadMessage(null);
  }

  async function startTranscription() {
    const audioFile = selectedFile;

    if (!audioFile) {
      return;
    }

    setTranscriptionResult(null);
    setUploadStatus("uploading");
    setUploadMessage("Transcribing audio with MuScriptor Large…");

    try {
      const result = await transcribeAudio(audioFile);

      setTranscriptionResult(result);
      setUploadStatus("success");
      setUploadMessage(
        `Transcription complete. ${result.outputFilename} is ready for review.`,
      );
    } catch (caughtError: unknown) {
      setUploadStatus("error");
      setUploadMessage(
        caughtError instanceof Error
          ? caughtError.message
          : "Transcription failed",
      );
    }
  }

  return {
    selectedFile,
    transcriptionResult,
    uploadStatus,
    uploadMessage,
    selectFile,
    startTranscription,
  };
}

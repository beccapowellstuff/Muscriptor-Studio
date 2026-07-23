import { requestTranscription } from "../../services/engineClient";
import type { TranscriptionResult } from "./types";

export async function transcribeAudio(
  audioFile: File,
): Promise<TranscriptionResult> {
  const response = await requestTranscription(audioFile);

  return {
    midiBlob: response.midiBlob,
    outputFilename: response.outputFilename,
    sourceFilename: audioFile.name,
  };
}

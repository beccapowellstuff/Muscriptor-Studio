export type TranscriptionStatus = "idle" | "uploading" | "success" | "error";

export type TranscriptionResult = {
  midiBlob: Blob;
  outputFilename: string;
  sourceFilename: string;
};

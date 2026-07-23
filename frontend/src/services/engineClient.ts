export type EngineTranscriptionResponse = {
  midiBlob: Blob;
  outputFilename: string;
};

export async function requestTranscription(
  audioFile: File,
): Promise<EngineTranscriptionResponse> {
  const formData = new FormData();
  formData.append("file", audioFile);

  const response = await fetch("/api/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = `Transcription failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { detail?: string };

      if (errorBody.detail) {
        message = errorBody.detail;
      }
    } catch {
      // Keep the fallback message if the response was not JSON.
    }

    throw new Error(message);
  }

  const midiBlob = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition") ?? "";
  const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
  const outputFilename =
    filenameMatch?.[1] ?? `${audioFile.name.replace(/\.[^/.]+$/, "")}.mid`;

  return { midiBlob, outputFilename };
}

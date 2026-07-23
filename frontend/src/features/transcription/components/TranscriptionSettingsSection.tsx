import type { TranscriptionStatus } from '../types'

type TranscriptionSettingsSectionProps = {
  selectedFile: File | null
  uploadStatus: TranscriptionStatus
  uploadMessage: string | null
  readyToTranscribe: boolean
  onStartTranscription: () => Promise<void>
}

export function TranscriptionSettingsSection({
  selectedFile,
  uploadStatus,
  uploadMessage,
  readyToTranscribe,
  onStartTranscription,
}: TranscriptionSettingsSectionProps) {
  return (
    <section className="score-section settings-section">
      <header className="section-heading">
        <span>3.</span>
        <h2>Transcription settings</h2>
      </header>

      <label className="field">
        <span>Model</span>
        <select defaultValue="large">
          <option value="large">MuScriptor Large</option>
        </select>
      </label>

      <label className="field">
        <span>Instrument focus</span>
        <select defaultValue="auto">
          <option value="auto">Auto-detect all instruments</option>
          <option value="guided">Use selected instruments</option>
        </select>
      </label>

      <label className="field">
        <span>Transcription type</span>
        <select defaultValue="polyphonic">
          <option value="polyphonic">Full polyphonic score</option>
          <option value="melody">Melody only</option>
        </select>
      </label>

      <label className="field">
        <span>Quality</span>
        <select defaultValue="maximum">
          <option value="maximum">Maximum quality</option>
          <option value="balanced">Balanced</option>
        </select>
      </label>

      <label className="field">
        <span>Quantisation</span>
        <select defaultValue="1/16">
          <option value="1/16">1/16 note</option>
          <option value="1/8">1/8 note</option>
          <option value="none">None</option>
        </select>
      </label>

      <button className="advanced-options" type="button">
        Advanced options
        <span>⌄</span>
      </button>

      <button
        className="start-transcription"
        type="button"
        disabled={!readyToTranscribe || uploadStatus === 'uploading'}
        onClick={onStartTranscription}
      >
        <span>♪</span>

        {uploadStatus === 'uploading'
          ? 'Transcribing audio…'
          : selectedFile
            ? readyToTranscribe
              ? 'Start transcription'
              : 'Waiting for model'
            : 'Select audio first'}
      </button>

      {uploadMessage && (
        <p className={`upload-feedback upload-feedback-${uploadStatus}`}>
          {uploadMessage}
        </p>
      )}
    </section>
  )
}

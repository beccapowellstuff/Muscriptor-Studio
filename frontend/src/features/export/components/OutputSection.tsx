import type { TranscriptionResult } from '../../transcription/types'
import { saveBlob } from '../exportService'

type OutputSectionProps = {
  transcriptionResult: TranscriptionResult | null
}

export function OutputSection({
  transcriptionResult,
}: OutputSectionProps) {
  function exportTranscription() {
    if (!transcriptionResult) {
      return
    }

    saveBlob(
      transcriptionResult.midiBlob,
      transcriptionResult.outputFilename,
    )
  }

  return (
    <footer className="output-section">
      <header className="section-heading output-heading">
        <span>5.</span>
        <h2>Output</h2>
      </header>

      <label className="output-field">
        <span>Format</span>
        <select defaultValue="midi">
          <option value="midi">MIDI (.mid)</option>
          <option value="musicxml">MusicXML (.mxl)</option>
        </select>
      </label>

      <fieldset className="include-options">
        <legend>Include</legend>

        <label>
          <input type="checkbox" defaultChecked />
          Notes
        </label>

        <label>
          <input type="checkbox" defaultChecked />
          Instruments
        </label>

        <label>
          <input type="checkbox" />
          Tempo
        </label>
      </fieldset>

      <div className="export-destination">
        <span>Destination</span>
        <strong>
          {transcriptionResult
            ? transcriptionResult.outputFilename
            : 'Choose after transcription'}
        </strong>
      </div>

      <button
        className="export-button"
        type="button"
        disabled={!transcriptionResult}
        onClick={exportTranscription}
      >
        Export transcription
      </button>
    </footer>
  )
}
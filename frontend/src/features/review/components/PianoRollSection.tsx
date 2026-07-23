import type { CSSProperties } from 'react'
import { pianoNotes } from '../reviewData'
import { InstrumentList } from './InstrumentList'

type PianoRollSectionProps = {
  hasSelectedFile: boolean
}

export function PianoRollSection({
  hasSelectedFile,
}: PianoRollSectionProps) {
  return (
    <section className="piano-roll-section">
      <header className="section-heading roll-heading">
        <span>4.</span>
        <h2>Piano roll / review</h2>
      </header>

      <div className="transport-bar">
        <div className="transport-controls">
          <button type="button" aria-label="Return to beginning">
            |◀
          </button>
          <button type="button">▶ Play</button>
          <button type="button">Ⅱ Pause</button>
          <button type="button">■ Stop</button>
        </div>

        <div className="transport-time">00:00.000 / 00:00.000</div>

        <div className="view-controls">
          <label>
            Grid
            <select defaultValue="1/16">
              <option value="1/16">1/16</option>
              <option value="1/8">1/8</option>
            </select>
          </label>

          <label>
            View
            <select defaultValue="notes">
              <option value="notes">Notes</option>
              <option value="velocity">Velocity</option>
            </select>
          </label>
        </div>
      </div>

      <div className="piano-roll-layout">
        <div className="piano-keyboard" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <div
              key={index}
              className={`piano-key ${
                index % 7 === 1 || index % 7 === 3 || index % 7 === 6
                  ? 'piano-key-dark'
                  : ''
              }`}
            />
          ))}
        </div>

        <div className="note-grid">
          <div className="measure-labels">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
          </div>

          <div className="playhead" />

          {pianoNotes.map((note, index) => (
            <span
              key={`${note.instrument}-${index}`}
              className={`piano-note note-${note.instrument}`}
              style={
                {
                  '--note-left': `${note.left}%`,
                  '--note-top': `${note.top}%`,
                  '--note-width': `${note.width}%`,
                } as CSSProperties
              }
            />
          ))}

          {!hasSelectedFile && (
            <div className="empty-roll-message">
              <strong>No transcription yet</strong>
              <span>
                Select an audio file and start transcription to populate the
                piano roll.
              </span>
            </div>
          )}
        </div>

        <InstrumentList />
      </div>

      <div className="waveform-overview">
        <div className="waveform-shape" />
        <div className="waveform-selection" />
      </div>
    </section>
  )
}

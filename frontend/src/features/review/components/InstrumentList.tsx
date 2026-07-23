import { instruments } from '../reviewData'

export function InstrumentList() {
  return (
    <aside className="instrument-list">
      <header>
        <h3>Instruments</h3>
        <button type="button" aria-label="Show all instruments">
          ◉
        </button>
      </header>

      {instruments.map((instrument) => (
        <div className="instrument-row" key={instrument.name}>
          <span className={`instrument-marker ${instrument.className}`} />

          <strong>{instrument.name}</strong>

          <button type="button" title="Solo">
            S
          </button>

          <button type="button" title="Mute">
            M
          </button>

          <button type="button" title="More options">
            …
          </button>
        </div>
      ))}

      <button className="detect-instruments" type="button">
        + Add / detect instruments
      </button>
    </aside>
  )
}

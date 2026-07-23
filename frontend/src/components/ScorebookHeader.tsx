type ScorebookHeaderProps = {
  backendError: string | null
}

export function ScorebookHeader({ backendError }: ScorebookHeaderProps) {
  return (
    <header className="scorebook-header">
      <div className="brand">
        <span className="brand-clef" aria-hidden="true">
          𝄞
        </span>

        <div>
          <h1>MuScriptor Studio</h1>
          <p>Music transcription and review</p>
        </div>
      </div>

      <nav className="main-navigation" aria-label="Main navigation">
        <button className="nav-item nav-item-active" type="button">
          Scorebook
        </button>
        <button className="nav-item" type="button">
          Projects
        </button>
        <button className="nav-item" type="button">
          Library
        </button>
        <button className="nav-item" type="button">
          Settings
        </button>
      </nav>

      <div className="header-actions">
        <button type="button" aria-label="Help">
          ?
        </button>

        <button type="button" aria-label="Settings">
          ⚙
        </button>

        <div
          className={`connection-status ${backendError ? 'has-error' : ''}`}
        >
          <span />
          {backendError ? 'Backend unavailable' : 'Engine ready'}
        </div>
      </div>
    </header>
  )
}

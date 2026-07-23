type ProjectBannerProps = {
  selectedFile: File | null
}

export function ProjectBanner({ selectedFile }: ProjectBannerProps) {
  return (
    <header className="project-banner">
      <div className="project-illustration" aria-hidden="true">
        ❧
      </div>

      <div className="project-title">
        <span>Current project</span>

        <h2>
          {selectedFile?.name.replace(/\.[^/.]+$/, '') ??
            'Untitled transcription'}
        </h2>

        <p>
          {selectedFile
            ? 'Ready for analysis and transcription'
            : 'Choose an audio recording to begin'}
        </p>
      </div>

      <div className="project-music" aria-hidden="true">
        ♩ ♪ ♫ · ♩ ♬ ♪
      </div>

      <dl className="project-details">
        <div>
          <dt>Format</dt>
          <dd>{selectedFile?.name.split('.').pop()?.toUpperCase() ?? '—'}</dd>
        </div>

        <div>
          <dt>Size</dt>
          <dd>
            {selectedFile
              ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`
              : '—'}
          </dd>
        </div>

        <div>
          <dt>Status</dt>
          <dd>{selectedFile ? 'Ready' : 'Waiting'}</dd>
        </div>
      </dl>
    </header>
  )
}

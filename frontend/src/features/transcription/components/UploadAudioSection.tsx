import { useRef } from 'react'

type UploadAudioSectionProps = {
  selectedFile: File | null
  onSelectFile: (file: File | undefined) => void
}

export function UploadAudioSection({
  selectedFile,
  onSelectFile,
}: UploadAudioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="score-section upload-section">
      <header className="section-heading">
        <span>1.</span>
        <h2>Upload audio</h2>
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.wav,.mp3,.flac,.ogg,.m4a,.aac,.aiff"
        hidden
        onChange={(event) => {
          onSelectFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />

      <button
        className="upload-dropzone"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        <span className="upload-symbol">♬</span>

        <strong>
          {selectedFile ? selectedFile.name : 'Drop audio files here'}
        </strong>

        <small>
          {selectedFile
            ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`
            : 'or click to browse'}
        </small>

        {!selectedFile && (
          <span className="file-types">WAV, MP3, FLAC, OGG, M4A</span>
        )}
      </button>

      {selectedFile && (
        <button
          className="change-file-button"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose a different file
        </button>
      )}
    </section>
  )
}

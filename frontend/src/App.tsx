import './App.css'
import { ProjectBanner } from './components/ProjectBanner'
import { ScorebookHeader } from './components/ScorebookHeader'
import { DeviceStatusSection } from './features/engine-status/components/DeviceStatusSection'
import { useEngineHealth } from './features/engine-status/useEngineHealth'
import { OutputSection } from './features/export/components/OutputSection'
import { PianoRollSection } from './features/review/components/PianoRollSection'
import { TranscriptionSettingsSection } from './features/transcription/components/TranscriptionSettingsSection'
import { UploadAudioSection } from './features/transcription/components/UploadAudioSection'
import { useTranscription } from './features/transcription/useTranscription'

function App() {
  const { health, error } = useEngineHealth()
  const {
    selectedFile,
    transcriptionResult,
    uploadStatus,
    uploadMessage,
    selectFile,
    startTranscription,
  } = useTranscription()

  const readyToTranscribe =
    selectedFile !== null && health?.model_loaded === true

  return (
    <main className="scorebook-app">
      <ScorebookHeader backendError={error} />

      <div className="scorebook-workspace">
        <aside className="control-column">
          <UploadAudioSection
            selectedFile={selectedFile}
            onSelectFile={selectFile}
          />
          <DeviceStatusSection health={health} />
          <TranscriptionSettingsSection
            selectedFile={selectedFile}
            uploadStatus={uploadStatus}
            uploadMessage={uploadMessage}
            readyToTranscribe={readyToTranscribe}
            onStartTranscription={startTranscription}
          />
        </aside>

        <section className="main-workspace">
          <ProjectBanner selectedFile={selectedFile} />
          <PianoRollSection hasSelectedFile={selectedFile !== null} />
        </section>
      </div>

      <OutputSection transcriptionResult={transcriptionResult} />
    </main>
  )
}

export default App

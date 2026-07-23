import type { HealthResponse } from '../types'

type DeviceStatusSectionProps = {
  health: HealthResponse | null
}

export function DeviceStatusSection({ health }: DeviceStatusSectionProps) {
  return (
    <section className="score-section">
      <header className="section-heading">
        <span>2.</span>
        <h2>Device / model status</h2>
      </header>

      <div className="device-summary">
        <div className="device-icon">GPU</div>

        <div className="device-copy">
          <strong>{health?.device ?? 'Checking device…'}</strong>
          <span>
            PyTorch {health?.pytorch_version ?? '…'} · CUDA{' '}
            {health?.cuda_version ?? '…'}
          </span>

          <small>
            <i />
            {health?.model_loaded
              ? 'MuScriptor Large ready'
              : 'Loading model'}
          </small>
        </div>
      </div>

      <div className="device-meters">
        <div>
          <span>CUDA</span>
          <strong>{health?.cuda_available ? 'Active' : 'Unavailable'}</strong>
        </div>

        <div>
          <span>Model</span>
          <strong>{health?.model_status ?? 'Checking'}</strong>
        </div>
      </div>
    </section>
  )
}

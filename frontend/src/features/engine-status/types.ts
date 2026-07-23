export type HealthResponse = {
  status: string
  application: string
  cuda_available: boolean
  device: string
  pytorch_version: string
  cuda_version: string
  model: string
  model_status: string
  model_loaded: boolean
  model_error: string | null
}

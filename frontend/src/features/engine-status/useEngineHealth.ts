import { useEffect, useState } from 'react'
import { fetchEngineHealth } from './engineApi'
import type { HealthResponse } from './types'

export function useEngineHealth() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEngineHealth()
      .then((data) => {
        setHealth(data)
      })
      .catch((caughtError: unknown) => {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unknown backend error',
        )
      })
  }, [])

  return { health, error }
}

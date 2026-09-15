import { useState, useEffect } from "react"
import type { ResumoCargo } from "@/types"
import { estadoService } from "@/services/estadoService"

interface UseEstadoCargosResult {
  data: ResumoCargo[]
  isLoading: boolean
  error: string | null
}

export function useEstadoCargos(sigla: string | undefined): UseEstadoCargosResult {
  const [data, setData] = useState<ResumoCargo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sigla) return
    setIsLoading(true)
    setError(null)
    estadoService
      .buscarCargos(sigla)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [sigla])

  return { data, isLoading, error }
}


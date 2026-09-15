import { useState, useEffect } from "react"
import type { ResumoEstado } from "@/types"
import { estadoService } from "@/services/estadoService"

interface UseEstadosResult {
  data: ResumoEstado[]
  isLoading: boolean
  error: string | null
}

export function useEstados(): UseEstadosResult {
  const [data, setData] = useState<ResumoEstado[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    estadoService
      .listarResumos()
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}


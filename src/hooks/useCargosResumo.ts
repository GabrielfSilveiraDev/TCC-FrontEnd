import { useState, useEffect } from "react"
import type { ResumoCargo } from "@/types"
import { cargoService } from "@/services/cargoService"

interface UseCargosResumoResult {
  data: ResumoCargo[]
  isLoading: boolean
  error: string | null
}

export function useCargosResumo(): UseCargosResumoResult {
  const [data, setData] = useState<ResumoCargo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    cargoService
      .listarResumos()
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}


import { useState, useEffect } from "react"
import type { ResumoEstado } from "@/types"
import { cargoService } from "@/services/cargoService"

interface UseCargoEstadosResult {
  data: ResumoEstado[]
  isLoading: boolean
  error: string | null
}

export function useCargoEstados(cargo: string | undefined): UseCargoEstadosResult {
  const [data, setData] = useState<ResumoEstado[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cargo) return
    setIsLoading(true)
    setError(null)
    cargoService
      .buscarEstados(cargo)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [cargo])

  return { data, isLoading, error }
}


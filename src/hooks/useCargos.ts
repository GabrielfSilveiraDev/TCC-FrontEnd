import { useState, useEffect } from "react"
import type { Cargo } from "@/types"
import { cargoService } from "@/services/cargoService"

interface UseCargosResult {
  data: Cargo[]
  isLoading: boolean
  error: string | null
}

export function useCargos(): UseCargosResult {
  const [data, setData] = useState<Cargo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    cargoService
      .listar()
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}


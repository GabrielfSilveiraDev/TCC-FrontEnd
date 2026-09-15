import { useState, useEffect } from "react"
import type { TrendNacional } from "@/types"
import { overviewService } from "@/services/overviewService"

interface UseOverviewHistoricoResult {
  data: TrendNacional[]
  isLoading: boolean
  error: string | null
}

export function useOverviewHistorico(inicio = "2020-01", fim?: string): UseOverviewHistoricoResult {
  const [data, setData] = useState<TrendNacional[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    overviewService
      .buscarHistorico(inicio, fim)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [inicio, fim])

  return { data, isLoading, error }
}


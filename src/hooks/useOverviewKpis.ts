import { useState, useEffect } from "react"
import type { OverviewKPIs } from "@/types"
import { overviewService } from "@/services/overviewService"

interface UseOverviewKpisResult {
  data: OverviewKPIs | null
  isLoading: boolean
  error: string | null
}

export function useOverviewKpis(competencia?: string): UseOverviewKpisResult {
  const [data, setData] = useState<OverviewKPIs | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    overviewService
      .buscarKPIs(competencia)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [competencia])

  return { data, isLoading, error }
}


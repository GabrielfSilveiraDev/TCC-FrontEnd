import { useState, useEffect } from "react"
import type { ServidorHistoricoItem } from "@/types"
import { servidorService } from "@/services/servidorService"

interface UseServidorHistoricoResult {
  data: ServidorHistoricoItem[]
  isLoading: boolean
  error: string | null
}

/**
 * Busca o histórico mensal de um servidor.
 * estado + matricula são obrigatórios; se matricula for null, não faz fetch.
 */
export function useServidorHistorico(
  estado: string | undefined,
  matricula: string | null | undefined
): UseServidorHistoricoResult {
  const [data, setData] = useState<ServidorHistoricoItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!estado || !matricula) return
    setIsLoading(true)
    setError(null)
    servidorService
      .buscarHistorico(estado, matricula)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [estado, matricula])

  return { data, isLoading, error }
}

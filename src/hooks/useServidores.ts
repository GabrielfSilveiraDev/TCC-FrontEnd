import { useState, useEffect, useCallback } from "react"
import type { SortingState } from "@tanstack/react-table"
import type { Servidor, ServidorFiltros, PaginatedResponse } from "@/types"
import { servidorService } from "@/services/servidorService"
import { useDebounce } from "./useDebounce"

interface UseServidoresResult {
  data: PaginatedResponse<Servidor> | null
  isLoading: boolean
  error: string | null
  filtros: ServidorFiltros
  setFiltros: React.Dispatch<React.SetStateAction<ServidorFiltros>>
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  sorting: SortingState
  setSorting: (s: SortingState) => void
  refetch: () => void
}

export function useServidores(initialFiltros?: ServidorFiltros): UseServidoresResult {
  const [data, setData] = useState<PaginatedResponse<Servidor> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<ServidorFiltros>(initialFiltros ?? {})
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [sorting, setSorting] = useState<SortingState>([])
  const [trigger, setTrigger] = useState(0)

  const debouncedFiltros = useDebounce(filtros, 400)

  const refetch = useCallback(() => setTrigger((t) => t + 1), [])

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    const sortParam = sorting[0]
      ? { sort_by: sorting[0].id, sort_order: sorting[0].desc ? "desc" : "asc" }
      : {}
    servidorService
      .listar(debouncedFiltros, { page, page_size: pageSize }, sortParam)
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [debouncedFiltros, page, pageSize, sorting, trigger])

  // Reseta para página 1 quando filtros mudam
  useEffect(() => {
    setPage(1)
  }, [debouncedFiltros])

  return {
    data,
    isLoading,
    error,
    filtros,
    setFiltros,
    page,
    setPage,
    pageSize,
    setPageSize,
    sorting,
    setSorting,
    refetch,
  }
}


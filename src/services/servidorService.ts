import apiClient from "./apiClient"
import type {
  Servidor,
  ServidorFiltros,
  PaginationParams,
  PaginatedResponse,
  ServidorHistoricoItem,
} from "@/types"

export const servidorService = {
  async listar(
    filtros: ServidorFiltros = {},
    paginacao: PaginationParams = { page: 1, page_size: 25 },
    ordenacao: { sort_by?: string; sort_order?: string } = {}
  ): Promise<PaginatedResponse<Servidor>> {
    const { data } = await apiClient.get<PaginatedResponse<Servidor>>(
      "/servidores",
      {
        params: { ...filtros, ...paginacao, ...ordenacao },
      }
    )
    return data
  },

  async buscarPorId(id: string): Promise<Servidor> {
    const { data } = await apiClient.get<Servidor>(`/servidores/${id}`)
    return data
  },

  async buscarHistorico(estado: string, matricula: string): Promise<ServidorHistoricoItem[]> {
    const { data } = await apiClient.get<ServidorHistoricoItem[]>(
      `/servidores/${estado}/${matricula}/historico`
    )
    return data
  },
}




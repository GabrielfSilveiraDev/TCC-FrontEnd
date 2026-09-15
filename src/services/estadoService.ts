import apiClient from "./apiClient"
import type { ResumoEstado, ResumoCargo } from "@/types"

export const estadoService = {
  async listarResumos(): Promise<ResumoEstado[]> {
    const { data } = await apiClient.get<ResumoEstado[]>("/estados/resumo")
    return data
  },

  async buscarResumo(sigla: string): Promise<ResumoEstado> {
    const { data } = await apiClient.get<ResumoEstado>(`/estados/${sigla}/resumo`)
    return data
  },

  /** Top cargos de um estado: GET /estados/{sigla}/cargos/resumo */
  async buscarCargos(sigla: string): Promise<ResumoCargo[]> {
    const { data } = await apiClient.get<ResumoCargo[]>(`/estados/${sigla}/cargos/resumo`)
    return data
  },
}


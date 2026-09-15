import apiClient from "./apiClient"
import type { Cargo, ResumoCargo, ResumoEstado } from "@/types"

export const cargoService = {
  async listar(): Promise<Cargo[]> {
    const { data } = await apiClient.get<Cargo[]>("/cargos")
    return data
  },

  async listarResumos(): Promise<ResumoCargo[]> {
    const { data } = await apiClient.get<ResumoCargo[]>("/cargos/resumo")
    return data
  },

  /** Resumo de um cargo específico: GET /cargos/{cargo}/resumo */
  async buscarResumo(cargo: string): Promise<ResumoCargo> {
    const { data } = await apiClient.get<ResumoCargo>(`/cargos/${encodeURIComponent(cargo)}/resumo`)
    return data
  },

  /** Distribuição de um cargo por estado: GET /cargos/{cargo}/estados/resumo */
  async buscarEstados(cargo: string): Promise<ResumoEstado[]> {
    const { data } = await apiClient.get<ResumoEstado[]>(`/cargos/${encodeURIComponent(cargo)}/estados/resumo`)
    return data
  },
}


import apiClient from "./apiClient"
import type { OverviewKPIs, TrendNacional } from "@/types"

export const overviewService = {
  async buscarKPIs(competencia?: string): Promise<OverviewKPIs> {
    const { data } = await apiClient.get<OverviewKPIs>("/overview/kpis", {
      params: competencia ? { competencia } : undefined,
    })
    return data
  },

  async buscarHistorico(inicio = "2020-01", fim?: string): Promise<TrendNacional[]> {
    const { data } = await apiClient.get<TrendNacional[]>("/overview/historico", {
      params: { inicio, ...(fim ? { fim } : {}) },
    })
    return data
  },
}


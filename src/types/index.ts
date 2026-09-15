/** Registro de remuneração de um servidor público */
export interface Servidor {
  id: string
  nome: string
  cpf: string
  cargo: string
  orgao: string
  estado: string
  /** Matrícula do servidor — null para estados sem matrícula (ex: RS) */
  matricula: string | null
  /** Indica se há histórico mensal disponível para este servidor */
  tem_historico: boolean
  /** Remuneração bruta (salário base + gratificações) */
  remuneracao_bruta: number
  /** Total de descontos (INSS, IR, etc.) */
  descontos: number
  /** Benefícios (auxílios, etc.) */
  beneficios: number
  /** Remuneração líquida final */
  remuneracao_liquida: number
  competencia: string // "YYYY-MM"
}

/** Resumo agregado por estado */
export interface ResumoEstado {
  estado: string
  total_servidores: number
  media_bruta: number
  media_liquida: number
  media_descontos: number
  media_beneficios: number
}

/** Resumo agregado por cargo */
export interface ResumoCargo {
  cargo: string
  total_servidores: number
  media_bruta: number
  media_liquida: number
  media_descontos: number
  media_beneficios: number
}

/** Item do histórico mensal de um servidor */
export interface ServidorHistoricoItem {
  competencia: string
  remuneracao_bruta: number
  descontos: number
  beneficios: number
  remuneracao_liquida: number
}

/** Ponto de tendência nacional (histórico do overview) */
export interface TrendNacional {
  competencia: string
  media_bruta: number
  media_liquida: number
  media_descontos: number
}

/** Cargo disponível no banco */
export interface Cargo {
  id: number
  descricao: string
}

/** KPIs do overview */
export interface OverviewKPIs {
  total_servidores: number
  media_nacional_bruta: number
  media_nacional_liquida: number
  total_folha: number
  variacao_mes: number | null // percentual — null quando não há mês anterior para comparar
}

/** Parâmetros de paginação para API */
export interface PaginationParams {
  page: number
  page_size: number
}

/** Parâmetros de filtro para servidores */
export interface ServidorFiltros {
  nome?: string
  cargo?: string
  estado?: string
  orgao?: string
  competencia?: string
}

/** Resposta paginada genérica da API */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}


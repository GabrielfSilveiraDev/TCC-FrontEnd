/**
 * Estados disponíveis no banco de dados do backend.
 * O banco atual contém dados apenas para esses 6 estados.
 * Atualizar esta lista conforme o backend for expandido.
 */
export const ESTADOS_BR = [
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
]

export const PAGE_SIZES = [10, 25, 50, 100]

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api"


# Dashboard — Remuneração de Servidores Públicos

> **EN:** React + TypeScript dashboard from an undergraduate thesis (Information Systems, UFSC) for exploring the payroll of staff at 7 Brazilian State Courts of Accounts (ES, MG, PR, RJ, RS, SC, SP). It consumes a FastAPI backend that is not public yet.

> TCC — Sistemas de Informação | UFSC

Dashboard analítico para comparar remunerações de servidores dos Tribunais de Contas Estaduais (TCEs) de 7 estados — ES, MG, PR, RJ, RS, SC e SP — por estado, cargo e pessoa.

## Contexto no TCC

Este repositório é a última etapa (visualização) do pipeline do TCC:

```
web scraping (Python) → normalização → data warehouse → API REST (FastAPI) → dashboard (este repositório)
```

- **Coleta:** os scrapers e os dados brutos estão em [GabrielfSilveiraDev/TCC](https://github.com/GabrielfSilveiraDev/TCC).
- **Normalização, data warehouse e API FastAPI:** ainda não são públicos. Este repositório contém apenas o front-end; para exibir dados, ele precisa de uma API que implemente os [endpoints esperados](#endpoints-esperados-na-api).

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + Vite |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS v3 |
| Componentes UI | Shadcn/UI (Radix UI) |
| Tabelas | TanStack Table v8 |
| Gráficos | Recharts |
| Roteamento | React Router v6 |
| HTTP Client | Axios |
| Backend (consumido) | FastAPI (Python) — ainda não público |

## Páginas

| Rota | Página | Conteúdo |
|---|---|---|
| `/overview` | Visão Geral | KPIs gerais, remuneração média por estado e evolução das médias desde 2020 |
| `/servidores` | Servidores | Tabela paginada com filtros e ordenação |
| `/servidores/:id` | Detalhe do servidor | Remuneração por competência e histórico mensal |
| `/estados` | Por Estado | Comparativo e ranking das médias por estado |
| `/estados/:sigla` | Detalhe do estado | KPIs, top 10 cargos e servidores do estado |
| `/cargos` | Por Cargo | Remuneração média por cargo |
| `/cargos/:cargo` | Detalhe do cargo | KPIs, distribuição por estado e servidores do cargo |
| `/comparativo` | Comparativo | Comparação de estados ou cargos selecionados por métrica |

A rota `/` redireciona para `/overview`.

## Estrutura de Pastas

```
src/
├── components/
│   ├── ui/               # Primitivos Shadcn/UI (Button, Card, Table…)
│   ├── layout/           # AppShell, Sidebar, Topbar, KpiCard
│   ├── tables/           # DataTable genérico + SortableHeader
│   └── charts/           # SalaryBarChart, SalaryLineChart, SalaryPieChart, SalaryRadarChart
├── features/
│   └── servidores/       # columns.tsx + ServidoresFilters.tsx
├── hooks/                # Hooks de dados (useServidores, useEstados, useCargosResumo…) + useDebounce
├── lib/                  # utils.ts (cn, formatCurrency…), constants.ts (estados, API_BASE_URL)
├── pages/                # Overview, Servidores, Estados, Cargos, Comparativo + páginas de detalhe
├── services/             # apiClient.ts, servidorService.ts, estadoService.ts, cargoService.ts, overviewService.ts
└── types/                # Interfaces TypeScript (Servidor, ResumoEstado…)
```

## Executar em Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar dev server (porta 5173, proxy /api → localhost:8000)
npm run dev

# Build de produção (checagem de tipos + bundle em dist/)
npm run build
```

O proxy do Vite remove o prefixo `/api`: `GET /api/servidores` é repassado para `http://localhost:8000/servidores`. Sem a API rodando nessa porta, as páginas não conseguem carregar os dados.

## Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL da API FastAPI (em produção, informe a URL completa) |

## Endpoints esperados na API

Rotas relativas a `VITE_API_URL`:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/servidores` | Lista paginada com filtros (nome, cargo, estado, competencia) e ordenação (sort_by, sort_order) |
| GET | `/servidores/{id}` | Detalhe de um servidor |
| GET | `/servidores/{estado}/{matricula}/historico` | Histórico mensal de um servidor |
| GET | `/estados/resumo` | Resumo agregado por UF |
| GET | `/estados/{sigla}/resumo` | Resumo de um estado |
| GET | `/estados/{sigla}/cargos/resumo` | Resumo por cargo dentro de um estado |
| GET | `/cargos` | Lista de cargos (usada no filtro de servidores) |
| GET | `/cargos/resumo` | Resumo agregado por cargo |
| GET | `/cargos/{cargo}/resumo` | Resumo de um cargo |
| GET | `/cargos/{cargo}/estados/resumo` | Distribuição de um cargo por estado |
| GET | `/overview/kpis` | KPIs da Visão Geral (parâmetro opcional `competencia`) |
| GET | `/overview/historico` | Série histórica das médias (`inicio`, padrão `2020-01`; `fim` opcional) |

### Parâmetros de paginação

```
GET /servidores?page=1&page_size=25&nome=joao&estado=SC&sort_by=remuneracao_bruta&sort_order=desc
```

### Formato da resposta paginada

Valores ilustrativos:

```json
{
  "items": [...],
  "total": 1250,
  "page": 1,
  "page_size": 25,
  "total_pages": 50
}
```

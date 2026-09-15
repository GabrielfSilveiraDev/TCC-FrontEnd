# Dashboard — Remuneração de Servidores Públicos

> TCC — Sistemas de Informação | UFSC

Dashboard analítico para comparar remunerações de servidores públicos federais brasileiros por estado, cargo e pessoa.

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
| Backend | FastAPI (Python) |

## Estrutura de Pastas

```
src/
├── assets/               # Imagens e fontes estáticas
├── components/
│   ├── ui/               # Primitivos Shadcn/UI (Button, Card, Table…)
│   ├── layout/           # AppShell, Sidebar, Topbar, KpiCard
│   ├── tables/           # DataTable genérico + SortableHeader
│   └── charts/           # SalaryBarChart, SalaryLineChart, SalaryPieChart, SalaryRadarChart
├── features/
│   └── servidores/       # columns.tsx + ServidoresFilters.tsx
├── hooks/                # useServidores, useDebounce
├── lib/                  # utils.ts (cn, formatCurrency…), constants.ts
├── pages/                # OverviewPage, ServidoresPage, EstadosPage, CargosPage
├── services/             # apiClient.ts, servidorService.ts, estadoService.ts…
└── types/                # Interfaces TypeScript (Servidor, ResumoEstado…)
```

## Executar em Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar dev server (porta 5173, proxy /api → localhost:8000)
npm run dev
```

## Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL da API FastAPI |

## Endpoints esperados na API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/servidores` | Lista paginada com filtros (nome, cargo, estado, competencia) |
| GET | `/servidores/{id}` | Detalhe de um servidor |
| GET | `/estados/resumo` | Resumo agregado por UF |
| GET | `/overview/kpis` | KPIs nacionais |

### Parâmetros de paginação

```
GET /servidores?page=1&page_size=25&nome=joao&estado=SC
```

### Formato da resposta paginada

```json
{
  "items": [...],
  "total": 1243870,
  "page": 1,
  "page_size": 25,
  "total_pages": 49755
}
```


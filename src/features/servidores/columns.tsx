import { type ColumnDef } from "@tanstack/react-table"
import { useNavigate } from "react-router-dom"
import type { Servidor } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { SortableHeader } from "@/components/tables/SortableHeader"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, History } from "lucide-react"

// Célula de nome: link para detalhe, ícone de histórico se disponível
function NomeCell({ row }: { row: { original: Servidor } }) {
  const navigate = useNavigate()
  const { nome, id, tem_historico, matricula } = row.original
  const hasHistorico = tem_historico === true || (tem_historico === undefined && matricula != null)
  // Fallback: se nome ausente, usa matrícula; se ambos ausentes, usa id
  const displayNome = nome?.trim() || matricula || id
  return (
    <button
      onClick={() => navigate(`/servidores/${id}`)}
      className="flex items-center gap-1.5 text-left font-medium hover:text-primary hover:underline underline-offset-2 transition-colors"
    >
      <span className={!nome?.trim() ? "italic text-muted-foreground" : ""}>{displayNome}</span>
      {hasHistorico
        ? <History className="h-3.5 w-3.5 text-primary opacity-60" aria-label="Histórico disponível" />
        : <ExternalLink className="h-3 w-3 opacity-30" />
      }
    </button>
  )
}

export const servidorColumns: ColumnDef<Servidor>[] = [
  {
    accessorKey: "nome",
    size: 220,
    header: ({ column }) => <SortableHeader column={column} title="Nome" />,
    cell: ({ row }) => <NomeCell row={row} />,
  },
  {
    accessorKey: "cargo",
    size: 180,
    header: ({ column }) => <SortableHeader column={column} title="Cargo" />,
    cell: ({ row }) => (
      <span className="truncate text-sm">{row.getValue("cargo")}</span>
    ),
  },
  {
    accessorKey: "estado",
    size: 70,
    header: ({ column }) => <SortableHeader column={column} title="UF" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono text-xs">
        {row.getValue("estado")}
      </Badge>
    ),
  },
  {
    accessorKey: "remuneracao_bruta",
    size: 135,
    header: ({ column }) => (
      <SortableHeader column={column} title="Rendimento Bruto" className="text-right" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm text-green-700 dark:text-green-400">
        {formatCurrency(row.getValue("remuneracao_bruta"))}
      </div>
    ),
  },
  {
    accessorKey: "beneficios",
    size: 120,
    header: ({ column }) => (
      <SortableHeader column={column} title="Benefícios" className="text-right" />
    ),
    cell: ({ row }) => {
      const val: number = row.getValue("beneficios")
      return (
        <div className={`text-right font-mono text-sm ${val >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}`}>
          {val >= 0 ? "+" : ""}{formatCurrency(val)}
        </div>
      )
    },
  },
  {
    accessorKey: "descontos",
    size: 120,
    header: ({ column }) => (
      <SortableHeader column={column} title="Descontos" className="text-right" />
    ),
    cell: ({ row }) => (
      <div className="text-right font-mono text-sm text-red-600 dark:text-red-400">
        -{formatCurrency(row.getValue("descontos"))}
      </div>
    ),
  },
  // Salário Líquido: salário por contrato sem bonificações = bruto + descontos − beneficios
  {
    id: "salario_liquido",
    size: 140,
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader column={column} title="Sal. Líquido" className="text-right" />
    ),
    cell: ({ row }) => {
      const { remuneracao_bruta, descontos, beneficios } = row.original
      return (
        <div className="text-right font-mono text-sm font-semibold">
          {formatCurrency(Math.max(0, remuneracao_bruta - descontos - beneficios))}
        </div>
      )
    },
  },
  // Renda Total: Sal. Líquido + benefícios
  {
    id: "renda_total",
    size: 140,
    enableSorting: true,
    header: ({ column }) => (
      <SortableHeader column={column} title="Renda Total" className="text-right" />
    ),
    cell: ({ row }) => {
      const { remuneracao_bruta, descontos } = row.original
      return (
        <div className="text-right font-mono text-sm font-bold text-emerald-700 dark:text-emerald-400">
          {formatCurrency(remuneracao_bruta - descontos)}
        </div>
      )
    },
  },
  {
    accessorKey: "competencia",
    size: 100,
    header: ({ column }) => (
      <SortableHeader column={column} title="Competência" />
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground font-mono">
        {(row.getValue("competencia") as string).replace("-", "/")}
      </span>
    ),
  },
]

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, AlertCircle, Users, DollarSign,
  TrendingDown, Gift, Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { KpiCard } from "@/components/layout/KpiCard"
import { SalaryBarChart } from "@/components/charts/SalaryBarChart"
import { DataTable } from "@/components/tables/DataTable"
import { servidorColumns } from "@/features/servidores/columns"
import { ServidoresFilters } from "@/features/servidores/ServidoresFilters"
import { formatCurrency, formatCompact } from "@/lib/utils"
import { estadoService } from "@/services/estadoService"
import { useEstadoCargos } from "@/hooks/useEstadoCargos"
import { useServidores } from "@/hooks/useServidores"
import { ESTADOS_BR } from "@/lib/constants"
import type { ResumoEstado } from "@/types"

export default function EstadoDetailPage() {
  const { sigla } = useParams<{ sigla: string }>()
  const navigate = useNavigate()

  const [resumo, setResumo] = useState<ResumoEstado | null>(null)
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [errorResumo, setErrorResumo] = useState<string | null>(null)

  const nomeEstado = ESTADOS_BR.find((e) => e.sigla === sigla)?.nome ?? sigla

  // Resumo KPIs
  useEffect(() => {
    if (!sigla) return
    setLoadingResumo(true)
    estadoService
      .buscarResumo(sigla)
      .then(setResumo)
      .catch((err: Error) => setErrorResumo(err.message))
      .finally(() => setLoadingResumo(false))
  }, [sigla])

  // Top cargos do estado
  const { data: cargos, isLoading: loadingCargos } = useEstadoCargos(sigla)

  // Servidores do estado — pré-filtrado com estado fixo, sem possibilidade de mudar UF
  const {
    data, isLoading: loadingServidores, error: errorServidores,
    filtros, setFiltros, page, setPage, pageSize, setPageSize, setSorting,
  } = useServidores(sigla ? { estado: sigla } : {})

  const barData = cargos.slice(0, 10).map((c) => ({
    name: c.cargo.length > 18 ? c.cargo.slice(0, 16) + "…" : c.cargo,
    remuneracao_bruta: c.media_bruta,
    descontos: c.media_descontos,
    beneficios: c.media_beneficios,
    remuneracao_liquida: c.media_liquida,
  }))

  if (errorResumo) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{errorResumo}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/estados")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-sm">{sigla}</Badge>
          <h1 className="text-xl font-bold">{nomeEstado}</h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loadingResumo ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-lg" />
          ))
        ) : resumo ? (
          <>
            <KpiCard
              title="Total de Servidores"
              value={formatCompact(resumo.total_servidores)}
              description="registros disponíveis"
              icon={Users}
            />
            <KpiCard
              title="Média Bruta"
              value={formatCurrency(resumo.media_bruta)}
              description="salário base médio"
              icon={DollarSign}
            />
            <KpiCard
              title="Média Descontos"
              value={formatCurrency(resumo.media_descontos)}
              description="INSS, IR, etc."
              icon={TrendingDown}
              iconClassName="bg-red-100 dark:bg-red-900/30"
            />
            <KpiCard
              title="Média Benefícios"
              value={formatCurrency(resumo.media_beneficios)}
              description="auxílios e adicionais"
              icon={Gift}
              iconClassName="bg-blue-100 dark:bg-blue-900/30"
            />
            <KpiCard
              title="Média Líquida"
              value={formatCurrency(resumo.media_liquida)}
              description="após descontos"
              icon={Wallet}
              iconClassName="bg-emerald-100 dark:bg-emerald-900/30"
            />
          </>
        ) : null}
      </div>

      {/* Top Cargos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top 10 Cargos — Média Bruta em {sigla}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCargos ? (
            <Skeleton className="h-[320px] w-full" />
          ) : barData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Endpoint <code className="mx-1 rounded bg-muted px-1">/estados/{sigla}/cargos/resumo</code> ainda não implementado.
            </p>
          ) : (
            <SalaryBarChart data={barData} height={320} />
          )}
        </CardContent>
      </Card>

      {/* Tabela de Servidores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Servidores de {nomeEstado}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ServidoresFilters
            filtros={filtros}
            onChange={(f) => setFiltros({ ...f, estado: sigla })}
            hideEstado
            estado={sigla}
          />

          {errorServidores && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorServidores}</span>
            </div>
          )}

          <DataTable
            columns={servidorColumns}
            data={data?.items ?? []}
            totalRows={data?.total ?? 0}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onSortingChange={setSorting}
            isLoading={loadingServidores}
            emptyMessage={`Nenhum servidor encontrado em ${nomeEstado}.`}
          />
        </CardContent>
      </Card>
    </div>
  )
}





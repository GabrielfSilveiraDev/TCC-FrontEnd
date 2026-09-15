import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, AlertCircle, Users, DollarSign,
  TrendingDown, Gift, Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { KpiCard } from "@/components/layout/KpiCard"
import { SalaryBarChart } from "@/components/charts/SalaryBarChart"
import { DataTable } from "@/components/tables/DataTable"
import { servidorColumns } from "@/features/servidores/columns"
import { ServidoresFilters } from "@/features/servidores/ServidoresFilters"
import { formatCurrency, formatCompact } from "@/lib/utils"
import { cargoService } from "@/services/cargoService"
import { useCargoEstados } from "@/hooks/useCargoEstados"
import { useServidores } from "@/hooks/useServidores"
import type { ResumoCargo } from "@/types"

export default function CargoDetailPage() {
  const { cargo: cargoParam } = useParams<{ cargo: string }>()
  const navigate = useNavigate()
  const cargo = decodeURIComponent(cargoParam ?? "")

  const [resumo, setResumo] = useState<ResumoCargo | null>(null)
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [errorResumo, setErrorResumo] = useState<string | null>(null)

  // Resumo KPIs do cargo
  useEffect(() => {
    if (!cargo) return
    setLoadingResumo(true)
    cargoService
      .buscarResumo(cargo)
      .then(setResumo)
      .catch((err: Error) => setErrorResumo(err.message))
      .finally(() => setLoadingResumo(false))
  }, [cargo])

  // Distribuição por estado
  const { data: estados, isLoading: loadingEstados } = useCargoEstados(cargo)

  // Servidores com este cargo — pré-filtrado, sem possibilidade de mudar cargo
  const {
    data, isLoading: loadingServidores, error: errorServidores,
    filtros, setFiltros, page, setPage, pageSize, setPageSize, setSorting,
  } = useServidores(cargo ? { cargo } : {})

  const barData = estados.map((e) => ({
    name: e.estado,
    remuneracao_bruta: e.media_bruta,
    descontos: e.media_descontos,
    beneficios: e.media_beneficios,
    remuneracao_liquida: e.media_liquida,
  }))

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cargos")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{cargo}</h1>
          <p className="text-sm text-muted-foreground">Detalhe do cargo</p>
        </div>
      </div>

      {errorResumo && (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Resumo do cargo indisponível (endpoint não implementado). Exibindo dados parciais.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loadingResumo ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-lg" />
          ))
        ) : resumo ? (
          <>
            <KpiCard title="Total de Servidores" value={formatCompact(resumo.total_servidores)} description="neste cargo" icon={Users} />
            <KpiCard title="Média Bruta" value={formatCurrency(resumo.media_bruta)} description="salário base médio" icon={DollarSign} />
            <KpiCard title="Média Descontos" value={formatCurrency(resumo.media_descontos)} description="INSS, IR, etc." icon={TrendingDown} iconClassName="bg-red-100 dark:bg-red-900/30" />
            <KpiCard title="Média Benefícios" value={formatCurrency(resumo.media_beneficios)} description="auxílios" icon={Gift} iconClassName="bg-blue-100 dark:bg-blue-900/30" />
            <KpiCard title="Média Líquida" value={formatCurrency(resumo.media_liquida)} description="após descontos" icon={Wallet} iconClassName="bg-emerald-100 dark:bg-emerald-900/30" />
          </>
        ) : !loadingResumo ? (
          <p className="col-span-5 text-sm text-muted-foreground">KPIs não disponíveis.</p>
        ) : null}
      </div>

      {/* Comparativo por Estado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Remuneração por Estado — {cargo}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingEstados ? (
            <Skeleton className="h-[300px] w-full" />
          ) : barData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Endpoint <code className="mx-1 rounded bg-muted px-1">/cargos/{encodeURIComponent(cargo)}/estados/resumo</code> ainda não implementado.
            </p>
          ) : (
            <SalaryBarChart data={barData} height={300} />
          )}
        </CardContent>
      </Card>

      {/* Tabela de Servidores */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Servidores — {cargo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ServidoresFilters
            filtros={filtros}
            onChange={(f) => setFiltros({ ...f, cargo })}
            hideCargo
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
            emptyMessage={`Nenhum servidor encontrado para o cargo ${cargo}.`}
          />
        </CardContent>
      </Card>
    </div>
  )
}




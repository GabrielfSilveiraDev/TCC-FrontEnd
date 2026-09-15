import { AlertCircle } from "lucide-react"
import { Users, DollarSign, TrendingUp, Wallet } from "lucide-react"
import { KpiCard } from "@/components/layout/KpiCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SalaryBarChart } from "@/components/charts/SalaryBarChart"
import { SalaryLineChart } from "@/components/charts/SalaryLineChart"
import { formatCurrency, formatCompact } from "@/lib/utils"
import { useOverviewKpis } from "@/hooks/useOverviewKpis"
import { useEstados } from "@/hooks/useEstados"
import { useOverviewHistorico } from "@/hooks/useOverviewHistorico"

export default function OverviewPage() {
  const { data: kpis, isLoading: kpisLoading } = useOverviewKpis()
  const { data: estados, isLoading: estadosLoading } = useEstados()
  const { data: historico, isLoading: historicoLoading, error: historicoError } = useOverviewHistorico("2020-01")

  const barData = estados.map((e) => ({
    name: e.estado,
    remuneracao_bruta: e.media_bruta,
    descontos: e.media_descontos,
    beneficios: e.media_beneficios,
    remuneracao_liquida: e.media_liquida,
  }))

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpisLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-lg" />
          ))
        ) : (
          <>
            <KpiCard
              title="Total de Servidores"
              value={formatCompact(kpis?.total_servidores ?? 0)}
              description="registros ativos"
              icon={Users}
              trend={kpis?.variacao_mes ?? undefined}
            />
            <KpiCard
              title="Média Nacional Bruta"
              value={formatCurrency(kpis?.media_nacional_bruta ?? 0)}
              description="vs. mês anterior"
              icon={DollarSign}
              trend={kpis?.variacao_mes ?? undefined}
            />
            <KpiCard
              title="Média Nacional Líquida"
              value={formatCurrency(kpis?.media_nacional_liquida ?? 0)}
              description="após descontos"
              icon={Wallet}
            />
            <KpiCard
              title="Total da Folha"
              value={`R$ ${formatCompact(kpis?.total_folha ?? 0)}`}
              description="estimativa mensal"
              icon={TrendingUp}
              trend={kpis?.variacao_mes ?? undefined}
            />
          </>
        )}
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Remuneração Média por Estado ({estadosLoading ? "…" : `${estados.length} disponíveis`})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {estadosLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <SalaryBarChart data={barData} height={300} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Evolução da Média Nacional (desde 2020)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historicoLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : historicoError ? (
              <div className="flex h-[300px] items-center justify-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Erro ao carregar histórico: {historicoError}</span>
              </div>
            ) : historico.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                Endpoint <code className="mx-1 rounded bg-muted px-1">/overview/historico</code> ainda não
                implementado no backend.
              </div>
            ) : (
              <SalaryLineChart data={historico} height={300} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

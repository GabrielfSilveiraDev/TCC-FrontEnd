import { AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SalaryBarChart } from "@/components/charts/SalaryBarChart"
import { SalaryRadarChart } from "@/components/charts/SalaryRadarChart"
import { useEstados } from "@/hooks/useEstados"
import { formatCurrency } from "@/lib/utils"

export default function EstadosPage() {
  const { data: estados, isLoading, error } = useEstados()
  const navigate = useNavigate()

  // Adapta o formato da API para os gráficos
  const barData = estados.map((e) => ({
    name: e.estado,
    remuneracao_bruta: e.media_bruta,
    descontos: e.media_descontos,
    beneficios: e.media_beneficios,
    remuneracao_liquida: e.media_liquida,
  }))

  const radarData = estados.map((e) => ({
    estado: e.estado,
    media_bruta: e.media_bruta,
    media_liquida: e.media_liquida,
  }))

  const rankingOrdenado = [...estados].sort((a, b) => b.media_bruta - a.media_bruta)

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>Erro ao carregar dados: {error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho informativo */}
      <p className="text-sm text-muted-foreground">
        Dados disponíveis para <strong>{isLoading ? "…" : estados.length}</strong> estado(s) no banco atual.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Gráfico de barras */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Comparativo de Remuneração Média por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[340px] w-full" />
            ) : (
              <SalaryBarChart data={barData} height={340} />
            )}
          </CardContent>
        </Card>

        {/* Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Radar: Média Bruta × Líquida
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[340px] w-full" />
            ) : (
              <SalaryRadarChart data={radarData} height={340} />
            )}
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ranking — Média Bruta</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : rankingOrdenado.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível.</p>
            ) : (
              <ol className="space-y-2">
                {rankingOrdenado.map((e, i) => (
                  <li
                    key={e.estado}
                    onClick={() => navigate(`/estados/${e.estado}`)}
                    className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm odd:bg-muted/40 hover:bg-primary/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-center font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="font-medium">{e.estado}</span>
                      <span className="text-xs text-muted-foreground">
                        ({e.total_servidores.toLocaleString("pt-BR")} serv.)
                      </span>
                    </span>
                    <span className="font-mono text-green-700 dark:text-green-400">
                      {formatCurrency(e.media_bruta)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}





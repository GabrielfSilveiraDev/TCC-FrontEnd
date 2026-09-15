import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SalaryBarChart } from "@/components/charts/SalaryBarChart"
import { SalaryPieChart } from "@/components/charts/SalaryPieChart"
import { formatCurrency } from "@/lib/utils"
import { useCargosResumo } from "@/hooks/useCargosResumo"

export default function CargosPage() {
  const { data: cargos, isLoading, error } = useCargosResumo()
  const [cargoPizzaSelecionado, setCargoPizzaSelecionado] = useState<string | null>(null)
  const navigate = useNavigate()

  const barData = cargos.map((c) => ({
    name: c.cargo.length > 22 ? c.cargo.slice(0, 20) + "…" : c.cargo,
    remuneracao_bruta: c.media_bruta,
    descontos: c.media_descontos,
    beneficios: c.media_beneficios,
    remuneracao_liquida: c.media_liquida,
  }))

  const cargoAtivo = cargoPizzaSelecionado
    ? cargos.find((c) => c.cargo === cargoPizzaSelecionado)
    : cargos.reduce((max, c) => (c.media_bruta > (max?.media_bruta ?? 0) ? c : max), cargos[0])

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>Erro ao carregar cargos: {error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Barras comparativas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Remuneração Média por Cargo</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[320px] w-full" />
            ) : (
              <SalaryBarChart data={barData} height={320} />
            )}
          </CardContent>
        </Card>

        {/* Pizza — clique na tabela muda o cargo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Composição — {cargoAtivo ? (cargoAtivo.cargo.length > 18 ? cargoAtivo.cargo.slice(0, 16) + "…" : cargoAtivo.cargo) : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[260px] w-full" />
            ) : cargoAtivo ? (
              <SalaryPieChart
                bruto={cargoAtivo.media_bruta}
                descontos={cargoAtivo.media_descontos}
                beneficios={cargoAtivo.media_beneficios}
                height={260}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Tabela resumo — linha clicável para mudar pizza */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Resumo por Cargo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Cargo</th>
                    <th className="pb-2 pr-4 text-right font-medium">Servidores</th>
                    <th className="pb-2 pr-4 text-right font-medium">Bruto</th>
                    <th className="pb-2 pr-4 text-right font-medium">Descontos</th>
                    <th className="pb-2 pr-4 text-right font-medium">Benefícios</th>
                    <th className="pb-2 text-right font-medium">Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {cargos.map((c) => (
                    <tr
                      key={c.cargo}
                      onClick={() => setCargoPizzaSelecionado(c.cargo)}
                      onDoubleClick={() => navigate(`/cargos/${encodeURIComponent(c.cargo)}`)}
                      className={`group border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                        cargoAtivo?.cargo === c.cargo ? "bg-primary/5" : ""
                      }`}
                      title="Clique para ver na pizza • Duplo clique para abrir detalhes"
                    >
                      <td className="py-2.5 pr-4 font-medium">
                        <div className="flex items-center justify-between gap-2">
                          <span>{c.cargo}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/cargos/${encodeURIComponent(c.cargo)}`) }}
                            className="shrink-0 text-xs text-primary opacity-0 group-hover:opacity-100 hover:underline"
                          >
                            Ver →
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 text-right text-muted-foreground">
                        {c.total_servidores.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-green-700 dark:text-green-400">
                        {formatCurrency(c.media_bruta)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-red-600 dark:text-red-400">
                        -{formatCurrency(c.media_descontos)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatCurrency(c.media_beneficios)}
                      </td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(c.media_liquida)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

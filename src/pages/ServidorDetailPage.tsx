import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, AlertCircle, User, Briefcase, MapPin, Building2, Calendar, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SalaryLineChart } from "@/components/charts/SalaryLineChart"
import { SalaryPieChart } from "@/components/charts/SalaryPieChart"
import { KpiCard } from "@/components/layout/KpiCard"
import { formatCurrency } from "@/lib/utils"
import { servidorService } from "@/services/servidorService"
import { useServidorHistorico } from "@/hooks/useServidorHistorico"
import type { Servidor } from "@/types"
import { DollarSign, TrendingDown, TrendingUp, Gift, Wallet } from "lucide-react"

export default function ServidorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [servidor, setServidor] = useState<Servidor | null>(null)
  const [loadingServidor, setLoadingServidor] = useState(true)
  const [errorServidor, setErrorServidor] = useState<string | null>(null)
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState<string>("")

  const { data: historico, isLoading: loadingHistorico, error: errorHistorico } = useServidorHistorico(
    servidor?.estado,
    servidor?.matricula
  )

  // Carrega dados básicos do servidor
  useEffect(() => {
    if (!id) return
    setLoadingServidor(true)
    servidorService
      .buscarPorId(id)
      .then((s) => {
        setServidor(s)
        setCompetenciaSelecionada(s.competencia)
      })
      .catch((err: Error) => setErrorServidor(err.message))
      .finally(() => setLoadingServidor(false))
  }, [id])

  // Mês selecionado (usa último mês do servidor por default)
  const mesSelecionado = historico.find((h) => h.competencia === competenciaSelecionada)
    ?? historico[historico.length - 1]

  // Adapta histórico para o gráfico de linha — usa remuneracao_liquida da API diretamente
  const lineData = historico.map((h) => ({
    competencia: h.competencia,
    media_bruta: h.remuneracao_bruta,
    media_liquida: h.remuneracao_liquida,
    media_descontos: h.descontos,
  }))

  if (errorServidor) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{errorServidor}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          {loadingServidor ? (
            <Skeleton className="h-7 w-60" />
          ) : (
            <h1 className="text-xl font-bold">
              {servidor?.nome?.trim() || servidor?.matricula || "—"}
              {!servidor?.nome?.trim() && (
                <span className="ml-2 text-sm font-normal text-muted-foreground italic">(sem nome)</span>
              )}
            </h1>
          )}
          <p className="text-sm text-muted-foreground">Detalhe do servidor</p>
        </div>
      </div>

      {/* Informações básicas */}
      <Card>
        <CardContent className="pt-6">
          {loadingServidor ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Cargo</p>
                  <p className="font-medium">{servidor?.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Órgão</p>
                  <p className="font-medium">{servidor?.orgao}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <Badge variant="outline" className="font-mono mt-0.5">{servidor?.estado}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">CPF</p>
                  <p className="font-medium font-mono">{servidor?.cpf}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Banner: sem histórico — APENAS quando matricula é explicitamente null */}
      {!loadingServidor && servidor && servidor.matricula === null && (
        <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            O estado <strong>{servidor.estado}</strong> não fornece matrícula nos dados abertos,
            portanto o histórico mensal não está disponível para este servidor.
          </span>
        </div>
      )}

      {/* Seletor de mês — exibe se tem matrícula válida (string não-nula) */}
      {servidor?.matricula != null && (
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Visualizando competência:</span>
        {loadingHistorico ? (
          <Skeleton className="h-9 w-32" />
        ) : (
          <Select
            value={competenciaSelecionada}
            onValueChange={setCompetenciaSelecionada}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              {[...historico].reverse().map((h) => (
                <SelectItem key={h.competencia} value={h.competencia}>
                  {h.competencia.replace("-", "/")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      )}

      {/* KPIs do mês selecionado */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loadingHistorico ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px] w-full rounded-lg" />
          ))
        ) : mesSelecionado ? (
          <>
            <KpiCard
              title="Total Bruto"
              value={formatCurrency(mesSelecionado.remuneracao_bruta)}
              description={competenciaSelecionada}
              icon={DollarSign}
            />
            <KpiCard
              title="Descontos"
              value={formatCurrency(mesSelecionado.descontos)}
              description="INSS, IR e outros"
              icon={TrendingDown}
              iconClassName="bg-red-100 dark:bg-red-900/30"
            />
            <KpiCard
              title="Benefícios"
              value={formatCurrency(mesSelecionado.beneficios)}
              description={mesSelecionado.beneficios < 0 ? "Estorno/Reversão" : "Auxílios e adicionais"}
              icon={Gift}
              iconClassName={mesSelecionado.beneficios < 0 ? "bg-orange-100 dark:bg-orange-900/30" : "bg-blue-100 dark:bg-blue-900/30"}
            />
            <KpiCard
              title="Sal. Líquido"
              value={formatCurrency(Math.max(0, mesSelecionado.remuneracao_bruta - mesSelecionado.descontos - mesSelecionado.beneficios))}
              description="Salário sem bonificações"
              icon={Wallet}
              iconClassName="bg-slate-100 dark:bg-slate-900/30"
            />
            <KpiCard
              title="Renda Total"
              value={formatCurrency(mesSelecionado.remuneracao_liquida)}
              description="Rendimento bruto − descontos"
              icon={TrendingUp}
              iconClassName="bg-emerald-100 dark:bg-emerald-900/30"
            />
          </>
        ) : (
          <p className="col-span-4 text-sm text-muted-foreground">
            Selecione um mês para ver os dados.
          </p>
        )}
      </div>

      {/* Gráficos */}
      {errorHistorico && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Erro ao carregar histórico: {errorHistorico}</span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Linha histórica */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evolução da Remuneração</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHistorico ? (
              <Skeleton className="h-[280px] w-full" />
            ) : lineData.length > 0 ? (
              <SalaryLineChart data={lineData} height={280} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Histórico não disponível.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pizza do mês selecionado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Composição — {competenciaSelecionada || "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingHistorico ? (
              <Skeleton className="h-[280px] w-full" />
            ) : mesSelecionado ? (
              <SalaryPieChart
                bruto={mesSelecionado.remuneracao_bruta}
                descontos={mesSelecionado.descontos}
                beneficios={mesSelecionado.beneficios}
                height={280}
              />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Sem dados para este mês.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabela histórica */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico Mensal Completo</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistorico ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : historico.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum histórico disponível.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Competência</th>
                    <th className="pb-2 pr-4 text-right font-medium">Bruto</th>
                    <th className="pb-2 pr-4 text-right font-medium">Descontos</th>
                    <th className="pb-2 pr-4 text-right font-medium">Benefícios</th>
                    <th className="pb-2 text-right font-medium">Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {[...historico].reverse().map((h) => (
                    <tr
                      key={h.competencia}
                      className={`border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                        h.competencia === competenciaSelecionada ? "bg-primary/5" : ""
                      }`}
                      onClick={() => setCompetenciaSelecionada(h.competencia)}
                    >
                      <td className="py-2.5 pr-4 font-mono font-medium">{h.competencia.replace("-", "/")}</td>
                      <td className="py-2.5 pr-4 text-right font-mono text-green-700 dark:text-green-400">
                        {formatCurrency(h.remuneracao_bruta)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-red-600 dark:text-red-400">
                        -{formatCurrency(h.descontos)}
                      </td>
                      <td className="py-2.5 pr-4 text-right font-mono text-blue-600 dark:text-blue-400">
                        {formatCurrency(h.beneficios)}
                      </td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(h.remuneracao_liquida)}
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


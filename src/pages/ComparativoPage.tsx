import { useState } from "react"
import { GitCompare, X, Plus, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts"
import { useEstados } from "@/hooks/useEstados"
import { useCargosResumo } from "@/hooks/useCargosResumo"
import { formatCurrency, formatCompact } from "@/lib/utils"

// Paleta de cores para múltiplas séries
const COLORS = [
  "hsl(221.2 83.2% 53.3%)",
  "hsl(0 84.2% 60.2%)",
  "hsl(160 60% 45%)",
  "hsl(38 92% 50%)",
  "hsl(280 65% 60%)",
  "hsl(199 89% 48%)",
]

type ComparativoTipo = "estados" | "cargos"
type MetricaTipo = "media_bruta" | "media_liquida" | "media_descontos" | "media_beneficios" | "total_servidores"

const METRICAS: { value: MetricaTipo; label: string }[] = [
  { value: "media_bruta", label: "Média Bruta" },
  { value: "media_liquida", label: "Média Líquida" },
  { value: "media_descontos", label: "Média Descontos" },
  { value: "media_beneficios", label: "Média Benefícios" },
  { value: "total_servidores", label: "Total Servidores" },
]

export default function ComparativoPage() {
  const [tipo, setTipo] = useState<ComparativoTipo>("estados")
  const [metrica, setMetrica] = useState<MetricaTipo>("media_bruta")
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [popoverOpen, setPopoverOpen] = useState(false)

  const { data: estados, isLoading: loadingEstados, error: errorEstados } = useEstados()
  const { data: cargos, isLoading: loadingCargos, error: errorCargos } = useCargosResumo()

  const isLoading = tipo === "estados" ? loadingEstados : loadingCargos
  const error = tipo === "estados" ? errorEstados : errorCargos

  // Opções disponíveis para seleção
  const opcoes = tipo === "estados"
    ? estados.map((e) => ({ id: e.estado, label: e.estado }))
    : cargos.map((c) => ({ id: c.cargo, label: c.cargo }))

  // Dados filtrados pelos selecionados (ou todos se nenhum selecionado)
  const dadosBase = tipo === "estados" ? estados : cargos
  const dadosFiltrados = selecionados.length === 0
    ? dadosBase
    : dadosBase.filter((d) => {
        const key = tipo === "estados" ? (d as typeof estados[0]).estado : (d as typeof cargos[0]).cargo
        return selecionados.includes(key)
      })

  // Helper para extrair campos numéricos sem erros de cast
  function num(d: unknown, field: string): number {
    return Number((d as Record<string, unknown>)[field] ?? 0)
  }

  // Formata para recharts
  const barData = dadosFiltrados.map((d) => {
    const key = tipo === "estados" ? (d as typeof estados[0]).estado : (d as typeof cargos[0]).cargo
    return { name: key, value: num(d, metrica) }
  })

  // Dados para comparação lado a lado de todas as métricas
  const multiBarData = dadosFiltrados.map((d) => {
    const key = tipo === "estados" ? (d as typeof estados[0]).estado : (d as typeof cargos[0]).cargo
    return {
      name: key.length > 20 ? key.slice(0, 18) + "…" : key,
      "Bruto": num(d, "media_bruta"),
      "Liquido": num(d, "media_liquida"),
      "Descontos": num(d, "media_descontos"),
      "Beneficios": num(d, "media_beneficios"),
    }
  })

  function toggleSelecionado(id: string) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function limparSelecao() {
    setSelecionados([])
  }

  const metricaLabel = METRICAS.find((m) => m.value === metrica)?.label ?? metrica
  const isCurrency = metrica !== "total_servidores"

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCompare className="h-4 w-4" />
            Configurar Comparativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            {/* Tipo */}
            <div className="flex min-w-[160px] flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Comparar por</Label>
              <Select
                value={tipo}
                onValueChange={(v) => {
                  setTipo(v as ComparativoTipo)
                  setSelecionados([])
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estados">Estados</SelectItem>
                  <SelectItem value="cargos">Cargos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Métrica */}
            <div className="flex min-w-[200px] flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Métrica principal</Label>
              <Select value={metrica} onValueChange={(v) => setMetrica(v as MetricaTipo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRICAS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de itens */}
            <div className="flex min-w-[240px] flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">
                Selecionar {tipo === "estados" ? "estados" : "cargos"} (vazio = todos)
              </Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start gap-2 font-normal">
                    <Plus className="h-4 w-4 opacity-50" />
                    Adicionar {tipo === "estados" ? "estado" : "cargo"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={`Pesquisar ${tipo}...`} />
                    <CommandList>
                      <CommandEmpty>Nenhum resultado.</CommandEmpty>
                      <CommandGroup>
                        {opcoes.map((op) => (
                          <CommandItem
                            key={op.id}
                            value={op.id}
                            onSelect={() => {
                              toggleSelecionado(op.id)
                            }}
                          >
                            <span className={`mr-2 h-2 w-2 rounded-full inline-block ${
                              selecionados.includes(op.id) ? "bg-primary" : "bg-muted"
                            }`} />
                            {op.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Limpar */}
            {selecionados.length > 0 && (
              <Button variant="ghost" size="sm" onClick={limparSelecao} className="text-muted-foreground">
                <X className="mr-1 h-4 w-4" />
                Limpar seleção
              </Button>
            )}
          </div>

          {/* Badges dos selecionados */}
          {selecionados.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selecionados.map((s, i) => (
                <Badge
                  key={s}
                  style={{ backgroundColor: COLORS[i % COLORS.length] + "33", borderColor: COLORS[i % COLORS.length] }}
                  className="cursor-pointer border text-foreground"
                  onClick={() => toggleSelecionado(s)}
                >
                  {s} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Erros */}
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Gráfico Principal — métrica selecionada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {metricaLabel} por {tipo === "estados" ? "Estado" : "Cargo"}
            {selecionados.length > 0 && ` (${selecionados.length} selecionados)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[320px] w-full" />
          ) : barData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Nenhum dado disponível.</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 8, right: 16, left: 16, bottom: tipo === "cargos" ? 80 : 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: tipo === "cargos" ? 10 : 12 }}
                  tickLine={false}
                  axisLine={false}
                  angle={tipo === "cargos" ? -35 : 0}
                  textAnchor={tipo === "cargos" ? "end" : "middle"}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(v) => isCurrency ? formatCompact(v) : v.toLocaleString("pt-BR")}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  formatter={(v: number) =>
                    isCurrency ? [formatCurrency(v), metricaLabel] : [v.toLocaleString("pt-BR"), metricaLabel]
                  }
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Bar
                  dataKey="value"
                  name={metricaLabel}
                  radius={[4, 4, 0, 0]}
                  fill={COLORS[0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico Comparativo — todas as métricas salariais lado a lado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Comparativo Completo — Bruto × Líquido × Descontos × Benefícios
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[360px] w-full" />
          ) : multiBarData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">Nenhum dado.</p>
          ) : (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={multiBarData}
                margin={{ top: 8, right: 16, left: 16, bottom: tipo === "cargos" ? 80 : 8 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: tipo === "cargos" ? 10 : 12 }}
                  tickLine={false}
                  axisLine={false}
                  angle={tipo === "cargos" ? -35 : 0}
                  textAnchor={tipo === "cargos" ? "end" : "middle"}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(v) => formatCompact(v)}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />
                <Tooltip
                  formatter={(v: number, name: string) => [formatCurrency(v), name]}
                  contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} iconType="circle" iconSize={8} />
                <Bar dataKey="Bruto" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Liquido" name="Liquido" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Descontos" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Beneficios" name="Beneficios" fill={COLORS[3]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de linha — comparativo de líquido entre os selecionados */}
      {selecionados.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linha — Média Líquida comparada</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={multiBarData}
                  margin={{ top: 8, right: 16, left: 16, bottom: tipo === "cargos" ? 60 : 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
                  <Tooltip
                    formatter={(v: number, name: string) => [formatCurrency(v), name]}
                    contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="Liquido" name="Liquido" stroke={COLORS[2]} strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Bruto" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabela resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tabela de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">{tipo === "estados" ? "Estado" : "Cargo"}</th>
                    <th className="pb-2 pr-4 text-right font-medium">Servidores</th>
                    <th className="pb-2 pr-4 text-right font-medium">Média Bruta</th>
                    <th className="pb-2 pr-4 text-right font-medium">Descontos</th>
                    <th className="pb-2 pr-4 text-right font-medium">Benefícios</th>
                    <th className="pb-2 text-right font-medium">Média Líquida</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.map((d, i) => {
                    const key = tipo === "estados"
                      ? (d as typeof estados[0]).estado
                      : (d as typeof cargos[0]).cargo
                    const rec = d as unknown as Record<string, number | string>
                    return (
                      <tr key={key} className="border-b last:border-0 hover:bg-muted/40">
                        <td className="py-2.5 pr-4">
                          <span
                            className="inline-block h-2 w-2 rounded-full mr-2"
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                          />
                          <span className="font-medium">{key}</span>
                        </td>
                        <td className="py-2.5 pr-4 text-right text-muted-foreground">
                          {Number(rec.total_servidores).toLocaleString("pt-BR")}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-green-700 dark:text-green-400">
                          {formatCurrency(Number(rec.media_bruta))}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-red-600 dark:text-red-400">
                          -{formatCurrency(Number(rec.media_descontos))}
                        </td>
                        <td className="py-2.5 pr-4 text-right font-mono text-blue-600 dark:text-blue-400">
                          {formatCurrency(Number(rec.media_beneficios))}
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(Number(rec.media_liquida))}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}








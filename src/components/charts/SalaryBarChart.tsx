import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency, formatCompact } from "@/lib/utils"

interface SalaryDataPoint {
  name: string
  remuneracao_bruta: number
  descontos: number
  beneficios: number
  remuneracao_liquida: number
}

interface SalaryBarChartProps {
  data: SalaryDataPoint[]
  /** Altura do gráfico em px */
  height?: number
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md text-sm">
      <p className="mb-2 font-semibold">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function SalaryBarChart({ data, height = 320 }: SalaryBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
        barCategoryGap="25%"
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatCompact(v)}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          dataKey="remuneracao_bruta"
          name="Rem. Bruta"
          fill="hsl(221.2 83.2% 53.3%)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="descontos"
          name="Descontos"
          fill="hsl(0 84.2% 60.2%)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="beneficios"
          name="Benefícios"
          fill="hsl(160 60% 45%)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="remuneracao_liquida"
          name="Líquido"
          fill="hsl(280 65% 60%)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}


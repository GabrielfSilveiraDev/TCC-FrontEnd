import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { formatCurrency, formatCompact } from "@/lib/utils"

interface TrendDataPoint {
  competencia: string
  media_bruta: number
  media_liquida: number
  media_descontos: number
}

interface SalaryLineChartProps {
  data: TrendDataPoint[]
  height?: number
}

export function SalaryLineChart({ data, height = 280 }: SalaryLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, left: 16, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="competencia"
          tick={{ fontSize: 11 }}
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
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name,
          ]}
          labelStyle={{ fontWeight: 600 }}
          contentStyle={{
            borderRadius: "8px",
            fontSize: "12px",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          iconType="circle"
          iconSize={8}
        />
        <Line
          type="monotone"
          dataKey="media_bruta"
          name="Média Bruta"
          stroke="hsl(221.2 83.2% 53.3%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="media_liquida"
          name="Média Líquida"
          stroke="hsl(160 60% 45%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="media_descontos"
          name="Média Descontos"
          stroke="hsl(0 84.2% 60.2%)"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}


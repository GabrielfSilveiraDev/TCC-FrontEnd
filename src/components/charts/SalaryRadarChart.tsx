import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { formatCompact } from "@/lib/utils"

interface RadarDataPoint {
  estado: string
  media_bruta: number
  media_liquida: number
}

interface SalaryRadarChartProps {
  data: RadarDataPoint[]
  height?: number
}

export function SalaryRadarChart({ data, height = 320 }: SalaryRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="estado" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis
          tickFormatter={(v) => formatCompact(v)}
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          formatter={(value: number) => formatCompact(value)}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          iconType="circle"
          iconSize={8}
        />
        <Radar
          name="Média Bruta"
          dataKey="media_bruta"
          stroke="hsl(221.2 83.2% 53.3%)"
          fill="hsl(221.2 83.2% 53.3%)"
          fillOpacity={0.25}
        />
        <Radar
          name="Média Líquida"
          dataKey="media_liquida"
          stroke="hsl(160 60% 45%)"
          fill="hsl(160 60% 45%)"
          fillOpacity={0.25}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}


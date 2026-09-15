import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface SalaryBreakdownItem {
  name: string
  value: number
  color: string
}

interface SalaryPieChartProps {
  bruto: number
  descontos: number
  beneficios: number
  height?: number
}

export function SalaryPieChart({
  bruto,
  descontos,
  beneficios,
  height = 280,
}: SalaryPieChartProps) {
  // bruto = salario_base + beneficios; liquido = bruto - descontos
  // salarioBase = bruto - beneficios; Sal.Líquido = salarioBase - descontos (sem bonificações)
  const salarioLiquido = Math.max(0, bruto - descontos - beneficios)  // clampado a 0 se negativo
  // Base visual = bruto; as fatias devem somar bruto:
  //   salarioLiquido + max(0,beneficios) + descontos
  //   = (bruto - descontos - beneficios) + beneficios + descontos = bruto ✓ (quando não clamped)
  const total = bruto  // 100% = rendimento bruto

  const allSlices: SalaryBreakdownItem[] = [
    { name: "Sal. Líquido", value: salarioLiquido,            color: "hsl(160 60% 45%)" },
    { name: "Benefícios",   value: Math.max(0, beneficios),   color: "hsl(221.2 83.2% 53.3%)" },
    { name: "Descontos",    value: descontos,                 color: "hsl(0 84.2% 60.2%)" },
  ]
  const slices = allSlices.filter((s) => s.value > 0)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={slices as SalaryBreakdownItem[]}
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="80%"
          paddingAngle={3}
          dataKey="value"
        >
          {slices.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [
            `${formatCurrency(value)} (${formatPercent((value / total) * 100)})`,
          ]}
          contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}


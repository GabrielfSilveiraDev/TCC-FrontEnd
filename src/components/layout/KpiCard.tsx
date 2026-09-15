import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  /** Percentual de variação (+/-). Se undefined ou null não exibe tendência. */
  trend?: number | null
  iconClassName?: string
}

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconClassName,
}: KpiCardProps) {
  // trend é number | null | undefined — só mostra tendência se for um número real
  const hasTrend = trend !== undefined && trend !== null
  const isPositive = hasTrend && trend >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10",
            iconClassName
          )}
        >
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description !== undefined || hasTrend) && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            {hasTrend && (
              <>
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {(trend as number).toFixed(1)}%
                </span>
                {description && <span className="text-muted-foreground">{description}</span>}
              </>
            )}
            {!hasTrend && description && <span>{description}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}


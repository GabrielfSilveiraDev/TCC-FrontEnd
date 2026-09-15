import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SortableHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
}

export function SortableHeader<TData, TValue>({
  column,
  title,
  className,
}: SortableHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("font-medium", className)}>{title}</div>
  }

  const sorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-1 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </Button>
  )
}

/** Botão para ocultar coluna */
export function HideColumnButton<TData, TValue>({
  column,
}: {
  column: Column<TData, TValue>
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 opacity-50 hover:opacity-100"
      onClick={() => column.toggleVisibility(false)}
      title="Ocultar coluna"
    >
      <EyeOff className="h-3 w-3" />
    </Button>
  )
}


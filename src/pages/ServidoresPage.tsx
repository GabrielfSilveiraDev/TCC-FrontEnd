import { AlertCircle } from "lucide-react"
import { DataTable } from "@/components/tables/DataTable"
import { ServidoresFilters } from "@/features/servidores/ServidoresFilters"
import { servidorColumns } from "@/features/servidores/columns"
import { useServidores } from "@/hooks/useServidores"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServidoresPage() {
  const {
    data,
    isLoading,
    error,
    filtros,
    setFiltros,
    page,
    setPage,
    pageSize,
    setPageSize,
    setSorting,
  } = useServidores()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <ServidoresFilters filtros={filtros} onChange={setFiltros} />
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        columns={servidorColumns}
        data={data?.items ?? []}
        totalRows={data?.total ?? 0}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSortingChange={setSorting}
        isLoading={isLoading}
        emptyMessage="Nenhum servidor encontrado com os filtros aplicados."
      />
    </div>
  )
}


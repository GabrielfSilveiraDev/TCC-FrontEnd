import { useLocation } from "react-router-dom"

const titles: Record<string, string> = {
  "/overview": "Visão Geral",
  "/servidores": "Tabela de Servidores",
  "/estados": "Comparativo por Estado",
  "/cargos": "Comparativo por Cargo",
}

export function Topbar() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? "Dashboard"

  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground">
          Análise de remunerações do serviço público federal
        </p>
      </div>
    </header>
  )
}


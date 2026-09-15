import { NavLink } from "react-router-dom"
import {
  BarChart2,
  Users,
  MapPin,
  Briefcase,
  LandmarkIcon,
  GitCompare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { to: "/overview", label: "Visão Geral", icon: BarChart2 },
  { to: "/servidores", label: "Servidores", icon: Users },
  { to: "/estados", label: "Por Estado", icon: MapPin },
  { to: "/cargos", label: "Por Cargo", icon: Briefcase },
  { to: "/comparativo", label: "Comparativo", icon: GitCompare },
]

export function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r bg-card">
      {/* Logo / Título */}
      <div className="flex h-16 items-center gap-2.5 px-5">
        <LandmarkIcon className="h-6 w-6 text-primary" />
        <div className="leading-tight">
          <p className="text-sm font-semibold">Remunerações</p>
          <p className="text-[10px] text-muted-foreground">Servidores Públicos BR</p>
        </div>
      </div>

      <Separator />

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="border-t p-4 text-center text-[10px] text-muted-foreground">
        TCC • UFSC • Sistemas de Informação
      </div>
    </aside>
  )
}

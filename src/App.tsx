import { Routes, Route, Navigate } from "react-router-dom"
import AppShell from "@/components/layout/AppShell"
import OverviewPage from "@/pages/OverviewPage"
import ServidoresPage from "@/pages/ServidoresPage"
import ServidorDetailPage from "@/pages/ServidorDetailPage"
import EstadosPage from "@/pages/EstadosPage"
import EstadoDetailPage from "@/pages/EstadoDetailPage"
import CargosPage from "@/pages/CargosPage"
import CargoDetailPage from "@/pages/CargoDetailPage"
import ComparativoPage from "@/pages/ComparativoPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="servidores" element={<ServidoresPage />} />
        <Route path="servidores/:id" element={<ServidorDetailPage />} />
        <Route path="estados" element={<EstadosPage />} />
        <Route path="estados/:sigla" element={<EstadoDetailPage />} />
        <Route path="cargos" element={<CargosPage />} />
        <Route path="cargos/:cargo" element={<CargoDetailPage />} />
        <Route path="comparativo" element={<ComparativoPage />} />
      </Route>
    </Routes>
  )
}

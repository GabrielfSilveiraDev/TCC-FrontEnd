import { useState } from "react"
import { Search, X, ChevronsUpDown, Check } from "lucide-react"
import type { ServidorFiltros } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ESTADOS_BR } from "@/lib/constants"
import { useCargos } from "@/hooks/useCargos"
import { useEstadoCargos } from "@/hooks/useEstadoCargos"
import { cn } from "@/lib/utils"

interface ServidoresFiltersProps {
  filtros: ServidorFiltros
  onChange: (filtros: ServidorFiltros) => void
  /** Oculta o campo de estado (quando já está fixo, ex: página de detalhe do estado) */
  hideEstado?: boolean
  /** Oculta o campo de cargo (quando já está fixo, ex: página de detalhe do cargo) */
  hideCargo?: boolean
  /** Restringe cargos ao estado especificado */
  estado?: string
}

export function ServidoresFilters({ filtros, onChange, hideEstado, hideCargo, estado }: ServidoresFiltersProps) {
  const [cargoOpen, setCargoOpen] = useState(false)

  // Se estado fornecido, busca apenas cargos daquele estado; caso contrário, todos
  const { data: todosCargos } = useCargos()
  const { data: cargosDoEstado } = useEstadoCargos(estado)

  // Normaliza para formato comum { label: string }
  const cargosDisponiveis: string[] = estado
    ? cargosDoEstado.map((c) => c.cargo)
    : todosCargos.map((c) => c.descricao)

  const hasFilters = !!(filtros.nome || (!hideCargo && filtros.cargo) || (!hideEstado && filtros.estado) || filtros.competencia)

  function handleClear() {
    onChange({
      nome: "",
      cargo: hideCargo ? filtros.cargo : "",
      estado: hideEstado ? filtros.estado : "",
      competencia: "",
    })
  }

  // Normaliza entrada do competencia: aceita YYYY/MM ou YYYY-MM, envia sempre YYYY-MM
  function handleCompetenciaChange(raw: string) {
    const normalized = raw.replace("/", "-")
    onChange({ ...filtros, competencia: normalized })
  }

  // Exibe competencia no formato YYYY/MM
  const competenciaDisplay = (filtros.competencia ?? "").replace("-", "/")

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Nome */}
      <div className="flex min-w-[200px] flex-1 flex-col gap-1.5">
        <Label htmlFor="filter-nome" className="text-xs text-muted-foreground">
          Nome do Servidor
        </Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="filter-nome"
            placeholder="Buscar por nome..."
            className="pl-8"
            value={filtros.nome ?? ""}
            onChange={(e) => onChange({ ...filtros, nome: e.target.value })}
          />
        </div>
      </div>

      {/* Cargo — Combobox pesquisável */}
      {!hideCargo && (
      <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Cargo</Label>
        <Popover open={cargoOpen} onOpenChange={setCargoOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={cargoOpen}
              className="justify-between font-normal"
            >
              <span className="truncate">
                {filtros.cargo ? filtros.cargo : "Todos os cargos"}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Pesquisar cargo..." />
              <CommandList>
                <CommandEmpty>Nenhum cargo encontrado.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="__all__"
                    onSelect={() => {
                      onChange({ ...filtros, cargo: "" })
                      setCargoOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", !filtros.cargo ? "opacity-100" : "opacity-0")}
                    />
                    Todos os cargos
                  </CommandItem>
                  {cargosDisponiveis.map((descricao) => (
                    <CommandItem
                      key={descricao}
                      value={descricao}
                      onSelect={(val) => {
                        onChange({ ...filtros, cargo: val === filtros.cargo ? "" : val })
                        setCargoOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filtros.cargo === descricao ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {descricao}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      )}

      {/* Estado */}
      {!hideEstado && (
      <div className="flex min-w-[140px] flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Estado (UF)</Label>
        <Select
          value={filtros.estado ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filtros, estado: v === "all" ? "" : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os estados</SelectItem>
            {ESTADOS_BR.map((e) => (
              <SelectItem key={e.sigla} value={e.sigla}>
                {e.sigla} — {e.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      )}

      {/* Competência (Mês/Ano) */}
      <div className="flex min-w-[140px] flex-col gap-1.5">
        <Label htmlFor="filter-competencia" className="text-xs text-muted-foreground">
          Mês/Ano
        </Label>
        <Input
          id="filter-competencia"
          placeholder="YYYY/MM"
          value={competenciaDisplay}
          maxLength={7}
          onChange={(e) => handleCompetenciaChange(e.target.value)}
        />
      </div>

      {/* Limpar */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  )
}

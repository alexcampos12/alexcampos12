"use client"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type DateFilterPeriod = "today" | "week" | "month" | "quarter" | "year" | "custom"

interface DateFilterProps {
  selectedPeriod: DateFilterPeriod
  onPeriodChange: (period: DateFilterPeriod) => void
  customStartDate?: Date
  customEndDate?: Date
  onCustomStartDateChange: (date: Date | undefined) => void
  onCustomEndDateChange: (date: Date | undefined) => void
  className?: string
}

export function DateFilter({
  selectedPeriod,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  className,
}: DateFilterProps) {
  const periodOptions = [
    { value: "today", label: "Hoje" },
    { value: "week", label: "Esta Semana" },
    { value: "month", label: "Este Mês" },
    { value: "quarter", label: "Este Trimestre" },
    { value: "year", label: "Este Ano" },
    { value: "custom", label: "Período Personalizado" },
  ]

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-48">
          <SelectValue>
            {periodOptions.find((option) => option.value === selectedPeriod)?.label || "Selecione um período"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedPeriod === "custom" && (
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !customStartDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customStartDate ? format(customStartDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Data início</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customStartDate}
                onSelect={onCustomStartDateChange}
                initialFocus
                locale={ptBR}
                disabled={(date) => (customEndDate ? date > customEndDate : false)}
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">até</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[140px] justify-start text-left font-normal",
                  !customEndDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customEndDate ? format(customEndDate, "dd/MM/yyyy", { locale: ptBR }) : <span>Data fim</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={customEndDate}
                onSelect={onCustomEndDateChange}
                initialFocus
                locale={ptBR}
                disabled={(date) => (customStartDate ? date < customStartDate : false)}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useMemo, useCallback } from "react"
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateFilterPeriod } from "@/components/date-filter"

export function useDateFilter(initialPeriod: DateFilterPeriod = "month") {
  const [selectedPeriod, setSelectedPeriod] = useState<DateFilterPeriod>(initialPeriod)
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined)
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined)

  const dateRange = useMemo(() => {
    const now = new Date()

    switch (selectedPeriod) {
      case "today":
        return {
          start: startOfDay(now),
          end: endOfDay(now),
        }
      case "week":
        return {
          start: startOfWeek(now, { locale: ptBR }),
          end: endOfWeek(now, { locale: ptBR }),
        }
      case "month":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }
      case "quarter":
        return {
          start: startOfQuarter(now),
          end: endOfQuarter(now),
        }
      case "year":
        return {
          start: startOfYear(now),
          end: endOfYear(now),
        }
      case "custom":
        if (customStartDate && customEndDate) {
          return {
            start: startOfDay(customStartDate),
            end: endOfDay(customEndDate),
          }
        }
        // Fallback para mês atual se datas customizadas não estão definidas
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        }
    }
  }, [selectedPeriod, customStartDate, customEndDate])

  const previousPeriodRange = useMemo(() => {
    const { start, end } = dateRange
    const periodLength = end.getTime() - start.getTime()

    return {
      start: new Date(start.getTime() - periodLength),
      end: new Date(start.getTime() - 1),
    }
  }, [dateRange])

  const getPeriodLabel = useCallback(() => {
    const now = new Date()

    switch (selectedPeriod) {
      case "today":
        return "Hoje"
      case "week":
        return "Esta Semana"
      case "month":
        return now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      case "quarter":
        const quarter = Math.floor(now.getMonth() / 3) + 1
        return `${quarter}º Trimestre ${now.getFullYear()}`
      case "year":
        return `Ano ${now.getFullYear()}`
      case "custom":
        if (customStartDate && customEndDate) {
          return `${customStartDate.toLocaleDateString("pt-BR")} - ${customEndDate.toLocaleDateString("pt-BR")}`
        }
        return "Período personalizado"
      default:
        return selectedPeriod
    }
  }, [selectedPeriod, customStartDate, customEndDate])

  const filterDataByDateRange = useCallback(
    <T extends { date: string }>(data: T[]) => {
      return data.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= dateRange.start && itemDate <= dateRange.end
      })
    },
    [dateRange],
  )

  const filterDataByPreviousPeriod = useCallback(
    <T extends { date: string }>(data: T[]) => {
      return data.filter((item) => {
        const itemDate = new Date(item.date)
        return itemDate >= previousPeriodRange.start && itemDate <= previousPeriodRange.end
      })
    },
    [previousPeriodRange],
  )

  const handlePeriodChange = useCallback(
    (period: DateFilterPeriod) => {
      setSelectedPeriod(period)
      // Inicializa as datas personalizadas quando necessário
      if (period === "custom" && !customStartDate && !customEndDate) {
        const now = new Date()
        setCustomStartDate(startOfMonth(now))
        setCustomEndDate(endOfMonth(now))
      }
    },
    [customStartDate, customEndDate],
  )

  return {
    selectedPeriod,
    setSelectedPeriod: handlePeriodChange,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    dateRange,
    previousPeriodRange,
    getPeriodLabel,
    filterDataByDateRange,
    filterDataByPreviousPeriod,
  }
}

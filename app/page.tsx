"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, MoreHorizontal, Plus } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardDetailModal } from "@/components/card-detail-modal"
import { DateFilter } from "@/components/date-filter"
import { useDateFilter } from "@/hooks/use-date-filter"

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
  recurring?: boolean
}

export default function Dashboard() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const [quickAddData, setQuickAddData] = useState({
    type: "receita",
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
    recurring: false,
  })

  // Dados históricos para comparação
  const [currentData, setCurrentData] = useState({
    receita: 0,
    despesas: 0,
    lucro: 0,
    clientes: 42,
    projetos: 18,
    mrr: 0,
    arr: 0,
  })

  // Dados para gráficos (simulados - em produção viriam do backend)
  const [chartData] = useState({
    monthlyRevenue: [
      { month: "Jan", receita: 120000, despesas: 85000, lucro: 35000, mrr: 45000 },
      { month: "Fev", receita: 135000, despesas: 90000, lucro: 45000, mrr: 48000 },
      { month: "Mar", receita: 142000, despesas: 95000, lucro: 47000, mrr: 50000 },
      { month: "Abr", receita: 148000, despesas: 98000, lucro: 50000, mrr: 52000 },
      { month: "Mai", receita: 150000, despesas: 121620, lucro: 28380, mrr: 50000 },
      { month: "Jun", receita: 165000, despesas: 110000, lucro: 55000, mrr: 55000 },
    ],
    categoryDistribution: [
      { name: "Serviços", value: 85000, percentage: 56.7 },
      { name: "Produtos", value: 45000, percentage: 30.0 },
      { name: "Consultoria", value: 20000, percentage: 13.3 },
    ],
    teamPerformance: [
      { name: "Desenvolvimento", members: 8, productivity: 92, revenue: 85000 },
      { name: "Marketing", members: 4, productivity: 88, revenue: 35000 },
      { name: "Vendas", members: 3, productivity: 95, revenue: 45000 },
    ],
  })

  const [cardDetails, setCardDetails] = useState({
    receita: {
      title: "Receita Mensal",
      value: "",
      growth: 8.2,
      previousValue: "R$ 145.000",
      description: "Receita total do período selecionado",
      target: 160000,
      current: 150000,
      trend: "up" as const,
      details: {
        period: "Maio 2024",
        breakdown: [
          { label: "Serviços de Desenvolvimento", value: "R$ 85.000", percentage: 57 },
          { label: "Consultoria", value: "R$ 35.000", percentage: 23 },
          { label: "Marketing Digital", value: "R$ 30.000", percentage: 20 },
        ],
        insights: [
          "Crescimento de 8% em relação ao mês anterior",
          "Serviços de desenvolvimento representam 57% da receita",
          "Consultoria teve crescimento de 15% no período",
        ],
        actions: [
          "Expandir equipe de desenvolvimento para atender demanda",
          "Criar pacotes de consultoria premium",
          "Investir em marketing para novos clientes",
        ],
      },
    },
    despesas: {
      title: "Despesas Totais",
      value: "",
      growth: 24.1,
      previousValue: "R$ 98.000",
      description: "Total de despesas operacionais e custos",
      target: 110000,
      current: 121620,
      trend: "up" as const,
      details: {
        period: "Maio 2024",
        breakdown: [
          { label: "Salários e Encargos", value: "R$ 65.000", percentage: 53 },
          { label: "Custos Fixos", value: "R$ 20.000", percentage: 16 },
          { label: "Custos Variáveis", value: "R$ 36.620", percentage: 31 },
        ],
        insights: [
          "Aumento de 24% devido a novas contratações",
          "Salários representam 53% das despesas totais",
          "Custos variáveis cresceram com aumento da demanda",
        ],
        actions: [
          "Otimizar processos para reduzir custos variáveis",
          "Revisar contratos de fornecedores",
          "Implementar automação para reduzir custos operacionais",
        ],
      },
    },
    lucro: {
      title: "Lucro Líquido",
      value: "",
      growth: -39.6,
      previousValue: "R$ 47.000",
      description: "Lucro líquido após todas as deduções",
      target: 35000,
      current: 28380,
      trend: "down" as const,
      details: {
        period: "Maio 2024",
        breakdown: [
          { label: "Receita Bruta", value: "R$ 150.000", percentage: 100 },
          { label: "Custos Variáveis", value: "R$ 36.620", percentage: 24 },
          { label: "Custos Fixos", value: "R$ 85.000", percentage: 57 },
        ],
        insights: [
          "Margem líquida de 18,9% está abaixo da meta de 25%",
          "Custos fixos aumentaram devido a novas contratações",
          "Necessário otimizar processos para reduzir custos",
        ],
        actions: [
          "Revisar contratos de fornecedores",
          "Automatizar processos operacionais",
          "Renegociar custos fixos principais",
        ],
      },
    },
    margem: {
      title: "Margem Líquida",
      value: "",
      growth: -15.2,
      previousValue: "32.4%",
      description: "Percentual de lucro sobre a receita total",
      target: 25,
      current: 18.9,
      trend: "down" as const,
      details: {
        period: "Maio 2024",
        breakdown: [
          { label: "Margem Bruta", value: "75.6%", percentage: 76 },
          { label: "Margem Operacional", value: "22.3%", percentage: 22 },
          { label: "Margem Líquida", value: "18.9%", percentage: 19 },
        ],
        insights: [
          "Margem líquida caiu 15% em relação ao mês anterior",
          "Margem bruta mantém-se saudável em 75%",
          "Custos operacionais impactaram a margem final",
        ],
        actions: [
          "Focar em produtos/serviços de maior margem",
          "Reduzir custos operacionais desnecessários",
          "Implementar pricing strategy mais eficiente",
        ],
      },
    },
    mrr: {
      title: "Receita Recorrente Mensal (MRR)",
      value: "",
      growth: 10,
      previousValue: "R$ 45.000",
      description: "Receita mensal previsível de assinaturas",
      target: 60000,
      current: 50000,
      trend: "up" as const,
      details: {
        period: "Maio 2024",
        breakdown: [
          { label: "Plano Básico", value: "R$ 15.000", percentage: 30 },
          { label: "Plano Premium", value: "R$ 25.000", percentage: 50 },
          { label: "Plano Corporativo", value: "R$ 10.000", percentage: 20 },
        ],
        insights: [
          "MRR cresceu 10% em relação ao mês anterior",
          "Plano Premium representa 50% da receita recorrente",
          "Foco na aquisição de novos clientes para aumentar o MRR",
        ],
        actions: [
          "Lançar campanha de marketing para atrair novos assinantes",
          "Criar programa de fidelidade para reter clientes existentes",
          "Oferecer descontos para upgrade de planos",
        ],
      },
    },
    arr: {
      title: "Receita Recorrente Anual (ARR)",
      value: "",
      growth: 10,
      previousValue: "R$ 540.000",
      description: "Receita anual previsível de assinaturas",
      target: 720000,
      current: 600000,
      trend: "up" as const,
      details: {
        period: "2024",
        breakdown: [{ label: "MRR Projetado", value: "R$ 50.000", percentage: 100 }],
        insights: [
          "ARR projetado com base no MRR atual",
          "Potencial de crescimento com novas assinaturas",
          "Importância da retenção de clientes para manter o ARR",
        ],
        actions: [
          "Monitorar churn rate e implementar ações de retenção",
          "Investir em melhorias no produto para aumentar a satisfação do cliente",
          "Explorar novos mercados para expandir a base de clientes",
        ],
      },
    },
  })

  // Estado para tooltips
  const [tooltip, setTooltip] = useState<{
    show: boolean
    x: number
    y: number
    data: any
  } | null>(null)

  const dateFilter = useDateFilter("month")

  // Carregar dados iniciais
  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      const data = JSON.parse(savedData)
      setFinancialData(data)
    } else {
      const initialData: FinancialData[] = [
        { id: "1", category: "receita", description: "Receita de Clientes", value: 150000, date: "2024-05-01" },
        { id: "2", category: "custo-fixo", description: "Aluguel do Escritório", value: 8000, date: "2024-05-01" },
        { id: "3", category: "salarios", description: "Salários da Equipe", value: 45000, date: "2024-05-01" },
        { id: "4", category: "prolabore", description: "Pró-labore Sócios", value: 20000, date: "2024-05-01" },
        { id: "5", category: "impostos", description: "Impostos e Taxas", value: 12000, date: "2024-05-01" },
        { id: "6", category: "custo-variavel", description: "Custos Variáveis", value: 36620, date: "2024-05-01" },
        {
          id: "7",
          category: "receita",
          description: "Assinatura Mensal Premium",
          value: 25000,
          date: "2024-05-01",
          recurring: true,
        },
        {
          id: "8",
          category: "receita",
          description: "Assinatura Mensal Básica",
          value: 15000,
          date: "2024-05-01",
          recurring: true,
        },
        {
          id: "9",
          category: "receita",
          description: "Assinatura Mensal Corporativa",
          value: 10000,
          date: "2024-05-01",
          recurring: true,
        },
      ]
      setFinancialData(initialData)
      localStorage.setItem("financialData", JSON.stringify(initialData))
    }
  }, [])

  // Recalcular dados
  useEffect(() => {
    const filteredData = dateFilter.filterDataByDateRange(financialData)

    const receita = filteredData
      .filter((item) => item.category === "receita")
      .reduce((sum, item) => sum + item.value, 0)

    const despesas = filteredData
      .filter((item) => item.category !== "receita")
      .reduce((sum, item) => sum + item.value, 0)

    const lucro = receita - despesas

    const mrr = filteredData
      .filter((item) => item.category === "receita" && item.recurring)
      .reduce((sum, item) => sum + item.value, 0)

    const arr = mrr * 12

    setCurrentData({
      receita,
      despesas,
      lucro,
      clientes: 42,
      projetos: 18,
      mrr,
      arr,
    })
  }, [financialData, dateFilter.dateRange])

  // Atualizar valores dos cards
  useEffect(() => {
    setCardDetails((prev) => ({
      ...prev,
      receita: {
        ...prev.receita,
        value: formatCurrency(currentData.receita),
        current: currentData.receita,
      },
      despesas: {
        ...prev.despesas,
        value: formatCurrency(currentData.despesas),
        current: currentData.despesas,
      },
      lucro: {
        ...prev.lucro,
        value: formatCurrency(currentData.lucro),
        current: currentData.lucro,
      },
      margem: {
        ...prev.margem,
        value: `${currentData.receita > 0 ? ((currentData.lucro / currentData.receita) * 100).toFixed(1) : "0.0"}%`,
        current: currentData.receita > 0 ? (currentData.lucro / currentData.receita) * 100 : 0,
      },
      mrr: {
        ...prev.mrr,
        value: formatCurrency(currentData.mrr),
        current: currentData.mrr,
      },
      arr: {
        ...prev.arr,
        value: formatCurrency(currentData.arr),
        current: currentData.arr,
      },
    }))
  }, [currentData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0
    return (
      <div
        className={`flex items-center text-xs ${isPositive ? "text-emerald-600 dark:text-orange-400" : "text-red-500 dark:text-red-400"}`}
      >
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {isPositive ? "+" : ""}
        {growth.toFixed(1)}%
      </div>
    )
  }

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: FinancialData = {
      id: Date.now().toString(),
      category: quickAddData.type as FinancialData["category"],
      description: quickAddData.description,
      value: Number.parseFloat(quickAddData.value),
      date: quickAddData.date,
      recurring: quickAddData.recurring,
    }

    const newData = [...financialData, newItem]
    setFinancialData(newData)
    localStorage.setItem("financialData", JSON.stringify(newData))

    setQuickAddData({
      type: "receita",
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0],
      recurring: false,
    })
    setIsQuickAddOpen(false)
  }

  // Componente para gráfico de linha minimalista
  const MinimalLineChart = ({ data }: { data: any[] }) => {
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
    const maxValue = Math.max(...data.map((d) => d.receita))
    const minValue = Math.min(...data.map((d) => d.receita))
    const range = maxValue - minValue

    const getCoordinates = (index: number, value: number) => {
      const x = (index / (data.length - 1)) * 100
      const y = range > 0 ? 100 - ((value - minValue) / range) * 80 : 50
      return { x, y }
    }

    const pathData = data
      .map((item, index) => {
        const coords = getCoordinates(index, item.receita)
        return `${index === 0 ? "M" : "L"} ${coords.x} ${coords.y}`
      })
      .join(" ")

    return (
      <div className="h-64 relative">
        <svg className="w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#areaGradient)"
            className="text-blue-600 dark:text-orange-500/20"
          />

          <path
            d={pathData}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-blue-700 dark:text-orange-400 transition-all duration-300"
          />

          {data.map((item, index) => {
            const coords = getCoordinates(index, item.receita)
            const isHovered = hoveredPoint === index
            const growth = index > 0 ? ((item.receita - data[index - 1].receita) / data[index - 1].receita) * 100 : 0

            return (
              <g key={index}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="3"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredPoint(index)
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTooltip({
                      show: true,
                      x: rect.left + window.scrollX,
                      y: rect.top + window.scrollY - 10,
                      data: {
                        month: item.month,
                        receita: item.receita,
                        growth,
                        index,
                      },
                    })
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null)
                    setTooltip(null)
                  }}
                />

                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? "0.8" : "0.4"}
                  fill="currentColor"
                  className={`text-blue-700 dark:text-orange-400 transition-all duration-200 ${
                    isHovered ? "text-blue-900 dark:text-orange-300" : ""
                  }`}
                />

                {isHovered && (
                  <line
                    x1={coords.x}
                    y1="0"
                    x2={coords.x}
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="0.2"
                    className="text-blue-400 dark:text-orange-600 opacity-50"
                    strokeDasharray="1,1"
                  />
                )}
              </g>
            )
          })}
        </svg>

        <div className="absolute bottom-0 left-4 right-4 flex justify-between">
          {data.map((item, index) => (
            <span
              key={index}
              className={`text-xs transition-all duration-200 ${
                hoveredPoint === index
                  ? "text-navy-700 dark:text-orange-300 font-medium"
                  : "text-navy-500 dark:text-orange-400"
              }`}
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // Componente para gráfico de barras
  const MinimalBarChart = ({ data }: { data: any[] }) => {
    const [hoveredBar, setHoveredBar] = useState<{ index: number; type: "receita" | "despesas" } | null>(null)
    const maxValue = Math.max(...data.map((d) => Math.max(d.receita, d.despesas)))
    const recentData = data.slice(-4)

    return (
      <div className="h-64 relative">
        <div className="h-full flex items-end justify-between gap-6 p-4">
          {recentData.map((item, index) => {
            const receitaHeight = (item.receita / maxValue) * 180
            const despesasHeight = (item.despesas / maxValue) * 180

            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex gap-2 items-end mb-2 h-48">
                  <div
                    className={`flex-1 transition-all duration-300 cursor-pointer relative group ${
                      hoveredBar?.index === index && hoveredBar?.type === "receita"
                        ? "bg-blue-600 dark:bg-orange-400"
                        : "bg-blue-500 dark:bg-orange-500 hover:bg-blue-600 dark:hover:bg-orange-400"
                    }`}
                    style={{ height: `${receitaHeight}px` }}
                    onMouseEnter={(e) => {
                      setHoveredBar({ index, type: "receita" })
                      const rect = e.currentTarget.getBoundingClientRect()
                      const scrollY = window.scrollY
                      const windowHeight = window.innerHeight

                      // Calcular posição inteligente do tooltip
                      let tooltipY = rect.top + scrollY - 80

                      // Se o tooltip vai aparecer muito embaixo, mover para cima
                      if (rect.top > windowHeight * 0.6) {
                        tooltipY = rect.top + scrollY - 120
                      }

                      // Se muito em cima, mover para baixo
                      if (rect.top < 100) {
                        tooltipY = rect.bottom + scrollY + 20
                      }

                      setTooltip({
                        show: true,
                        x: rect.left + rect.width / 2 + window.scrollX,
                        y: tooltipY,
                        data: {
                          month: item.month,
                          type: "Receita",
                          value: item.receita,
                          comparison: {
                            receita: item.receita,
                            despesas: item.despesas,
                            lucro: item.receita - item.despesas,
                          },
                        },
                      })
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null)
                      setTooltip(null)
                    }}
                  />

                  <div
                    className={`flex-1 transition-all duration-300 cursor-pointer relative group ${
                      hoveredBar?.index === index && hoveredBar?.type === "despesas"
                        ? "bg-slate-800 dark:bg-red-400"
                        : "bg-slate-700 dark:bg-red-500 hover:bg-slate-800 dark:hover:bg-red-400"
                    }`}
                    style={{ height: `${despesasHeight}px` }}
                    onMouseEnter={(e) => {
                      setHoveredBar({ index, type: "despesas" })
                      const rect = e.currentTarget.getBoundingClientRect()
                      const scrollY = window.scrollY
                      const windowHeight = window.innerHeight

                      // Calcular posição inteligente do tooltip
                      let tooltipY = rect.top + scrollY - 80

                      // Se o tooltip vai aparecer muito embaixo, mover para cima
                      if (rect.top > windowHeight * 0.6) {
                        tooltipY = rect.top + scrollY - 120
                      }

                      // Se muito em cima, mover para baixo
                      if (rect.top < 100) {
                        tooltipY = rect.bottom + scrollY + 20
                      }

                      setTooltip({
                        show: true,
                        x: rect.left + rect.width / 2 + window.scrollX,
                        y: tooltipY,
                        data: {
                          month: item.month,
                          type: "Despesas",
                          value: item.despesas,
                          comparison: {
                            receita: item.receita,
                            despesas: item.despesas,
                            lucro: item.receita - item.despesas,
                          },
                        },
                      })
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null)
                      setTooltip(null)
                    }}
                  />
                </div>

                <span className="text-xs text-navy-500 dark:text-orange-400">{item.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Tooltip Global
  const Tooltip = () => {
    if (!tooltip) return null

    return (
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          left: tooltip.x,
          top: tooltip.y,
          transform: "translate(-50%, -100%)",
        }}
      >
        <div className="bg-white dark:bg-gray-800 border border-navy-200 dark:border-orange-700 rounded-lg shadow-xl p-4 min-w-56 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
          {tooltip.data.month && (
            <div className="font-semibold text-navy-900 dark:text-orange-100 mb-2 text-center border-b border-navy-200 dark:border-orange-700 pb-2">
              {tooltip.data.month}
            </div>
          )}

          {tooltip.data.type && (
            <div className="text-sm text-navy-600 dark:text-orange-400 mb-1 text-center">{tooltip.data.type}</div>
          )}

          <div className="text-xl font-bold text-navy-900 dark:text-orange-100 mb-3 text-center">
            {formatCurrency(tooltip.data.value || tooltip.data.receita)}
          </div>

          {tooltip.data.growth !== undefined && tooltip.data.growth !== 0 && (
            <div
              className={`text-sm flex items-center justify-center gap-1 mb-3 ${
                tooltip.data.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              }`}
            >
              {tooltip.data.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">
                {tooltip.data.growth >= 0 ? "+" : ""}
                {tooltip.data.growth.toFixed(1)}%
              </span>
              <span className="text-navy-500 dark:text-orange-400">vs anterior</span>
            </div>
          )}

          {tooltip.data.percentage && (
            <div className="text-sm text-navy-600 dark:text-orange-400 mb-3 text-center">
              <span className="font-medium">{tooltip.data.percentage}%</span> do total
            </div>
          )}

          {tooltip.data.comparison && (
            <div className="border-t border-navy-200 dark:border-orange-700 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-navy-600 dark:text-orange-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-orange-400 rounded-full"></div>
                  Receita:
                </span>
                <span className="font-semibold text-navy-900 dark:text-orange-100">
                  {formatCurrency(tooltip.data.comparison.receita)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-navy-600 dark:text-orange-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                  Despesas:
                </span>
                <span className="font-semibold text-navy-900 dark:text-orange-100">
                  {formatCurrency(tooltip.data.comparison.despesas)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-navy-200 dark:border-orange-700 pt-2">
                <span className="text-navy-600 dark:text-orange-400 font-medium">Lucro:</span>
                <span
                  className={`font-bold ${
                    tooltip.data.comparison.lucro >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {formatCurrency(tooltip.data.comparison.lucro)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Componente para gráfico de rosca simplificado
  const MinimalDonutChart = ({ data }: { data: any[] }) => {
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Cores para os segmentos
    const colors = [
      "#1e40af", // Azul escuro
      "#3b82f6", // Azul médio
      "#60a5fa", // Azul claro
    ]

    const darkColors = [
      "#f97316", // Laranja escuro
      "#fb923c", // Laranja médio
      "#fdba74", // Laranja claro
    ]

    return (
      <div className="h-64 flex flex-col items-center justify-center">
        {/* Gráfico de rosca */}
        <div className="relative w-48 h-48 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((segment, i) => {
              // Calcular ângulos
              let cumulativePercentage = 0
              for (let j = 0; j < i; j++) {
                cumulativePercentage += data[j].percentage
              }

              const startAngle = (cumulativePercentage / 100) * 360
              const endAngle = ((cumulativePercentage + segment.percentage) / 100) * 360

              // Calcular pontos do arco
              const radius = hoveredSegment === i ? 38 : 35
              const startX = 50 + radius * Math.cos((startAngle * Math.PI) / 180)
              const startY = 50 + radius * Math.sin((startAngle * Math.PI) / 180)
              const endX = 50 + radius * Math.cos((endAngle * Math.PI) / 180)
              const endY = 50 + radius * Math.sin((endAngle * Math.PI) / 180)

              const largeArcFlag = segment.percentage > 50 ? 1 : 0
              const path = `M 50 50 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`

              return (
                <g key={i}>
                  {/* Segmento para modo claro */}
                  <path
                    d={path}
                    fill={colors[i % colors.length]}
                    className="cursor-pointer transition-all duration-300 dark:hidden"
                    style={{
                      filter: hoveredSegment === i ? "brightness(1.1)" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment(i)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />

                  {/* Segmento para modo escuro */}
                  <path
                    d={path}
                    fill={darkColors[i % darkColors.length]}
                    className="cursor-pointer transition-all duration-300 hidden dark:block"
                    style={{
                      filter: hoveredSegment === i ? "brightness(1.1)" : "none",
                    }}
                    onMouseEnter={() => setHoveredSegment(i)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                </g>
              )
            })}

            {/* Círculo central */}
            <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-900" />
          </svg>

          {/* Texto central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-navy-900 dark:text-orange-100">
                {hoveredSegment !== null ? `${data[hoveredSegment].percentage.toFixed(1)}%` : "100%"}
              </div>
              <div className="text-xs text-navy-500 dark:text-orange-400">
                {hoveredSegment !== null ? data[hoveredSegment].name : "Total"}
              </div>
            </div>
          </div>
        </div>

        {/* Legenda interativa */}
        <div className="w-full space-y-2">
          {data.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between text-sm p-2 rounded-md transition-all duration-200 cursor-pointer ${
                hoveredSegment === i ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: document.documentElement.classList.contains("dark")
                      ? darkColors[i % darkColors.length]
                      : colors[i % colors.length],
                  }}
                ></div>
                <span className="text-navy-600 dark:text-orange-400">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-navy-900 dark:text-orange-100">{formatCurrency(item.value)}</span>
                <span className="text-xs text-navy-500 dark:text-orange-400 font-medium">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-navy-200/50 dark:border-orange-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-semibold text-navy-900 dark:text-orange-100">Dashboard Executivo</h1>
          <p className="text-sm text-navy-500 dark:text-orange-400">Visão estratégica dos indicadores financeiros</p>
        </div>
        <div className="flex-1 flex justify-center">
          <DateFilter
            selectedPeriod={dateFilter.selectedPeriod}
            onPeriodChange={dateFilter.setSelectedPeriod}
            customStartDate={dateFilter.customStartDate}
            customEndDate={dateFilter.customEndDate}
            onCustomStartDateChange={dateFilter.setCustomStartDate}
            onCustomEndDateChange={dateFilter.setCustomEndDate}
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black transition-all duration-200 hover:scale-105 hover:shadow-lg shadow-sm border border-blue-700 dark:border-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-black border-navy-200 dark:border-orange-700">
              <DialogHeader>
                <DialogTitle className="text-navy-900 dark:text-orange-100">Adicionar Item Rápido</DialogTitle>
                <DialogDescription className="text-navy-500 dark:text-orange-400">
                  Adicione rapidamente uma receita ou despesa.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleQuickAdd} className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-navy-700 dark:text-orange-300">
                    Tipo
                  </Label>
                  <Select
                    value={quickAddData.type}
                    onValueChange={(value) => setQuickAddData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-navy-200 dark:border-orange-700">
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="custo-fixo">Custo Fixo</SelectItem>
                      <SelectItem value="custo-variavel">Custo Variável</SelectItem>
                      <SelectItem value="salarios">Salários</SelectItem>
                      <SelectItem value="prolabore">Pró-labore</SelectItem>
                      <SelectItem value="impostos">Impostos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description" className="text-navy-700 dark:text-orange-300">
                    Descrição
                  </Label>
                  <Input
                    id="description"
                    value={quickAddData.description}
                    onChange={(e) => setQuickAddData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição do item"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="value" className="text-navy-700 dark:text-orange-300">
                    Valor (R$)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={quickAddData.value}
                    onChange={(e) => setQuickAddData((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="0,00"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-navy-700 dark:text-orange-300">
                    Data
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={quickAddData.date}
                    onChange={(e) => setQuickAddData((prev) => ({ ...prev, date: e.target.value }))}
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="recurring"
                    type="checkbox"
                    checked={quickAddData.recurring || false}
                    onChange={(e) => setQuickAddData((prev) => ({ ...prev, recurring: e.target.checked }))}
                    className="rounded border-navy-300 dark:border-orange-600"
                  />
                  <Label htmlFor="recurring" className="text-navy-700 dark:text-orange-300">
                    Receita recorrente
                  </Label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
                >
                  Adicionar
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-navy-100 dark:hover:bg-orange-900/20 transition-all duration-200 hover:scale-110"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900 min-h-screen">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(cardDetails).map(([key, card]) => (
            <div
              key={key}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-navy-200/50 dark:border-orange-800/50 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-navy-300 dark:hover:border-orange-600"
              onClick={() => setSelectedCard(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-navy-600 dark:text-orange-400">{card.title}</h3>
                {formatGrowth(card.growth)}
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-navy-900 dark:text-orange-100">{card.value}</div>
                <div className="text-xs text-navy-500 dark:text-orange-400">vs {card.previousValue}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Linha - Receita */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-navy-200/50 dark:border-orange-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-orange-100">Evolução da Receita</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-700 dark:bg-orange-400 rounded-full"></div>
                <span className="text-sm text-navy-600 dark:text-orange-400">Receita Mensal</span>
              </div>
            </div>
            <MinimalLineChart data={chartData.monthlyRevenue} />
          </div>

          {/* Gráfico de Barras - Receita vs Despesas */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-navy-200/50 dark:border-orange-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-orange-100">Receita vs Despesas</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 dark:bg-orange-400 rounded-full"></div>
                  <span className="text-sm text-navy-600 dark:text-orange-400">Receita</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                  <span className="text-sm text-navy-600 dark:text-orange-400">Despesas</span>
                </div>
              </div>
            </div>
            <MinimalBarChart data={chartData.monthlyRevenue} />
          </div>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Rosca - Distribuição por Categoria */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-navy-200/50 dark:border-orange-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-orange-100">Distribuição por Categoria</h3>
            </div>
            <MinimalDonutChart data={chartData.categoryDistribution} formatCurrency={formatCurrency} />
          </div>

          {/* Performance da Equipe */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-navy-200/50 dark:border-orange-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-orange-100">Performance da Equipe</h3>
            </div>
            <div className="space-y-4">
              {chartData.teamPerformance.map((team, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-700 dark:bg-orange-400 rounded-full"></div>
                      <span className="text-sm font-medium text-navy-900 dark:text-orange-100">{team.name}</span>
                      <span className="text-xs text-navy-500 dark:text-orange-400">({team.members} membros)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-navy-900 dark:text-orange-100">
                        {formatCurrency(team.revenue)}
                      </div>
                      <div className="text-xs text-navy-500 dark:text-orange-400">
                        {team.productivity}% produtividade
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-700 dark:bg-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${team.productivity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalhes do card */}
      {selectedCard && (
        <CardDetailModal
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          cardData={cardDetails[selectedCard as keyof typeof cardDetails]}
        />
      )}

      {/* Tooltip */}
      <Tooltip />
    </SidebarInset>
  )
}

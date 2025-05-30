"use client"
import { X, TrendingUp, TrendingDown, Calendar, Target, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface CardDetailModalProps {
  isOpen: boolean
  onClose: () => void
  cardData: {
    title: string
    value: string
    growth: number
    previousValue: string
    description: string
    target?: number
    current?: number
    trend: "up" | "down" | "stable"
    details: {
      period: string
      breakdown: Array<{ label: string; value: string; percentage?: number }>
      insights: string[]
      actions: string[]
    }
  }
}

export function CardDetailModal({ isOpen, onClose, cardData }: CardDetailModalProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
      default:
        return <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-emerald-600 dark:text-emerald-400"
      case "down":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const handleExportData = () => {
    // Criar dados CSV para exportação
    const csvData = [
      ["Métrica", "Valor", "Crescimento", "Meta"],
      [cardData.title, cardData.value, `${cardData.growth}%`, cardData.target?.toString() || "N/A"],
      ["", "", "", ""],
      ["Detalhamento", "", "", ""],
      ...cardData.details.breakdown.map((item) => [item.label, item.value, `${item.percentage || 0}%`, ""]),
      ["", "", "", ""],
      ["Insights", "", "", ""],
      ...cardData.details.insights.map((insight, index) => [`Insight ${index + 1}`, insight, "", ""]),
      ["", "", "", ""],
      ["Ações Recomendadas", "", "", ""],
      ...cardData.details.actions.map((action, index) => [`Ação ${index + 1}`, action, "", ""]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${cardData.title.toLowerCase().replace(/\s+/g, "-")}-dados.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleViewFullReport = () => {
    // Navegar para a página de relatórios com filtro específico
    window.location.href = "/relatorios"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {cardData.title}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cardData.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Valor Principal */}
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{cardData.value}</div>
            <div className={`flex items-center justify-center gap-2 ${getTrendColor(cardData.trend)}`}>
              {getTrendIcon(cardData.trend)}
              <span className="text-sm font-medium">
                {cardData.growth >= 0 ? "+" : ""}
                {cardData.growth.toFixed(1)}% vs período anterior
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Anterior: {cardData.previousValue}</div>
          </div>

          {/* Meta (se existir) */}
          {cardData.target && cardData.current && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso da Meta</span>
                <Badge variant="outline" className="text-xs">
                  {((cardData.current / cardData.target) * 100).toFixed(0)}%
                </Badge>
              </div>
              <Progress value={(cardData.current / cardData.target) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Atual: {cardData.current.toLocaleString()}</span>
                <span>Meta: {cardData.target.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Detalhamento - {cardData.details.period}
            </h4>
            <div className="space-y-2">
              {cardData.details.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.value}</div>
                    {item.percentage && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}%</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Gráfico Simulado */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Tendência (Últimos 6 meses)</h4>
            <div className="h-20 flex items-end justify-between gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {[65, 72, 68, 85, 92, 100].map((height, index) => (
                <div
                  key={index}
                  className="bg-gray-600 dark:bg-gray-400 rounded-t transition-all duration-300 hover:bg-gray-700 dark:hover:bg-gray-300 flex-1"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Insights
            </h4>
            <div className="space-y-2">
              {cardData.details.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-blue-800 dark:text-blue-300">{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ações Recomendadas */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ações Recomendadas
            </h4>
            <div className="space-y-2">
              {cardData.details.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-amber-800 dark:text-amber-300">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              onClick={handleViewFullReport}
              className="flex-1 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900"
            >
              Ver Relatório Completo
            </Button>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-600"
            >
              Exportar Dados
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

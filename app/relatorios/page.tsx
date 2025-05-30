"use client"

import { useState, useEffect } from "react"
import { FileText, Download, Filter, TrendingUp, BarChart3, Calendar, FileSpreadsheet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
}

interface ReportConfig {
  type: string
  period: string
  format: string
  includeCharts: boolean
  includeDetails: boolean
}

export default function RelatoriosPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [selectedReport, setSelectedReport] = useState("financeiro")
  const [selectedPeriod, setSelectedPeriod] = useState("mensal")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: "financeiro",
    period: "mensal",
    format: "pdf",
    includeCharts: true,
    includeDetails: true,
  })
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      setFinancialData(JSON.parse(savedData))
    }
  }, [])

  const reports = [
    {
      id: "financeiro",
      title: "Relatório Financeiro Completo",
      description: "Análise detalhada de receitas, custos e lucratividade",
      icon: BarChart3,
      color: "bg-blue-600",
    },
    {
      id: "dre",
      title: "DRE Gerencial",
      description: "Demonstrativo do Resultado do Exercício",
      icon: FileText,
      color: "bg-green-600",
    },
    {
      id: "fluxo-caixa",
      title: "Fluxo de Caixa",
      description: "Movimentação financeira detalhada",
      icon: TrendingUp,
      color: "bg-purple-600",
    },
    {
      id: "comparativo",
      title: "Relatório Comparativo",
      description: "Comparação entre períodos",
      icon: Calendar,
      color: "bg-orange-600",
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const calculateMetrics = () => {
    const receita = financialData
      .filter((item) => item.category === "receita")
      .reduce((sum, item) => sum + item.value, 0)

    const despesas = financialData
      .filter((item) => item.category !== "receita")
      .reduce((sum, item) => sum + item.value, 0)

    const lucro = receita - despesas
    const margem = receita > 0 ? (lucro / receita) * 100 : 0

    return { receita, despesas, lucro, margem }
  }

  const generatePDFReport = (reportType: string) => {
    const metrics = calculateMetrics()
    const currentDate = new Date().toLocaleDateString("pt-BR")

    // Criar conteúdo HTML para o PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório ${reportType}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .report-title { font-size: 18px; color: #666; }
          .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
          .metric-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .metric-label { font-size: 14px; color: #666; margin-top: 5px; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .table th { background-color: #f5f5f5; font-weight: bold; }
          .positive { color: #16a34a; }
          .negative { color: #dc2626; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Five Performance Digital</div>
          <div class="report-title">Relatório ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} - ${currentDate}</div>
        </div>

        <div class="metrics">
          <div class="metric-card">
            <div class="metric-value positive">${formatCurrency(metrics.receita)}</div>
            <div class="metric-label">Receita Total</div>
          </div>
          <div class="metric-card">
            <div class="metric-value negative">${formatCurrency(metrics.despesas)}</div>
            <div class="metric-label">Despesas Totais</div>
          </div>
          <div class="metric-card">
            <div class="metric-value ${metrics.lucro >= 0 ? "positive" : "negative"}">${formatCurrency(metrics.lucro)}</div>
            <div class="metric-label">Lucro Líquido</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${metrics.margem.toFixed(1)}%</div>
            <div class="metric-label">Margem Líquida</div>
          </div>
        </div>

        <h3>Detalhamento por Categoria</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Valor Total</th>
              <th>% do Total</th>
            </tr>
          </thead>
          <tbody>
            ${["receita", "custo-fixo", "custo-variavel", "salarios", "prolabore", "impostos"]
              .map((category) => {
                const items = financialData.filter((item) => item.category === category)
                const total = items.reduce((sum, item) => sum + item.value, 0)
                const percentage = metrics.receita > 0 ? (total / metrics.receita) * 100 : 0
                const categoryLabel = {
                  receita: "Receita",
                  "custo-fixo": "Custos Fixos",
                  "custo-variavel": "Custos Variáveis",
                  salarios: "Salários",
                  prolabore: "Pró-labore",
                  impostos: "Impostos",
                }[category]

                return `
                  <tr>
                    <td>${categoryLabel}</td>
                    <td>${items.length}</td>
                    <td class="${category === "receita" ? "positive" : "negative"}">${formatCurrency(total)}</td>
                    <td>${percentage.toFixed(1)}%</td>
                  </tr>
                `
              })
              .join("")}
          </tbody>
        </table>

        ${
          reportConfig.includeDetails
            ? `
        <h3>Detalhamento de Itens</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            ${financialData
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => {
                const categoryLabel = {
                  receita: "Receita",
                  "custo-fixo": "Custos Fixos",
                  "custo-variavel": "Custos Variáveis",
                  salarios: "Salários",
                  prolabore: "Pró-labore",
                  impostos: "Impostos",
                }[item.category]

                return `
                  <tr>
                    <td>${new Date(item.date).toLocaleDateString("pt-BR")}</td>
                    <td>${item.description}</td>
                    <td>${categoryLabel}</td>
                    <td class="${item.category === "receita" ? "positive" : "negative"}">${formatCurrency(item.value)}</td>
                  </tr>
                `
              })
              .join("")}
          </tbody>
        </table>
        `
            : ""
        }

        <div class="footer">
          <p>Relatório gerado automaticamente pelo Sistema Five Performance em ${currentDate}</p>
          <p>Este documento contém informações confidenciais da empresa</p>
        </div>
      </body>
      </html>
    `

    // Criar e baixar o arquivo HTML (que pode ser salvo como PDF)
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `relatorio-${reportType}-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Abrir em nova janela para impressão/salvar como PDF
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  const generateExcelReport = (reportType: string) => {
    const metrics = calculateMetrics()
    const currentDate = new Date().toLocaleDateString("pt-BR")

    // Criar dados CSV
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += `Relatório ${reportType} - Five Performance Digital\n`
    csvContent += `Data: ${currentDate}\n\n`

    // Métricas principais
    csvContent += "RESUMO EXECUTIVO\n"
    csvContent += "Métrica,Valor\n"
    csvContent += `Receita Total,${metrics.receita}\n`
    csvContent += `Despesas Totais,${metrics.despesas}\n`
    csvContent += `Lucro Líquido,${metrics.lucro}\n`
    csvContent += `Margem Líquida,${metrics.margem.toFixed(1)}%\n\n`

    // Detalhamento por categoria
    csvContent += "DETALHAMENTO POR CATEGORIA\n"
    csvContent += "Categoria,Quantidade,Valor Total,Percentual\n"
    ;["receita", "custo-fixo", "custo-variavel", "salarios", "prolabore", "impostos"].forEach((category) => {
      const items = financialData.filter((item) => item.category === category)
      const total = items.reduce((sum, item) => sum + item.value, 0)
      const percentage = metrics.receita > 0 ? (total / metrics.receita) * 100 : 0
      const categoryLabel = {
        receita: "Receita",
        "custo-fixo": "Custos Fixos",
        "custo-variavel": "Custos Variáveis",
        salarios: "Salários",
        prolabore: "Pró-labore",
        impostos: "Impostos",
      }[category]

      csvContent += `${categoryLabel},${items.length},${total},${percentage.toFixed(1)}%\n`
    })

    if (reportConfig.includeDetails) {
      csvContent += "\nDETALHAMENTO DE ITENS\n"
      csvContent += "Data,Descrição,Categoria,Valor\n"

      financialData
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach((item) => {
          const categoryLabel = {
            receita: "Receita",
            "custo-fixo": "Custos Fixos",
            "custo-variavel": "Custos Variáveis",
            salarios: "Salários",
            prolabore: "Pró-labore",
            impostos: "Impostos",
          }[item.category]

          csvContent += `${new Date(item.date).toLocaleDateString("pt-BR")},"${item.description}",${categoryLabel},${item.value}\n`
        })
    }

    // Baixar arquivo CSV
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `relatorio-${reportType}-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateReport = async (reportId: string, format = "pdf") => {
    setIsGenerating(true)

    try {
      // Simular tempo de processamento
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (format === "pdf") {
        generatePDFReport(reportId)
      } else if (format === "excel") {
        generateExcelReport(reportId)
      }

      // Adicionar ao histórico
      const newReport = {
        name: `${reports.find((r) => r.id === reportId)?.title} ${new Date().toLocaleDateString("pt-BR")}`,
        type: reports.find((r) => r.id === reportId)?.title || reportId,
        date: new Date().toISOString().split("T")[0],
        status: "Concluído",
        size: "2.3 MB",
        format: format.toUpperCase(),
      }

      const existingReports = JSON.parse(localStorage.getItem("generatedReports") || "[]")
      existingReports.unshift(newReport)
      localStorage.setItem("generatedReports", JSON.stringify(existingReports.slice(0, 10)))
    } catch (error) {
      console.error("Erro ao gerar relatório:", error)
      alert("Erro ao gerar relatório. Tente novamente.")
    } finally {
      setIsGenerating(false)
    }
  }

  const [recentReports, setRecentReports] = useState([])

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("generatedReports") || "[]")
    setRecentReports(savedReports)
  }, [isGenerating])

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Gere relatórios detalhados e análises</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600">
                <Filter className="w-4 h-4 mr-2" />
                Configurar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">Configurar Relatório</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Personalize as opções do seu relatório
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Formato</Label>
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value) => setReportConfig((prev) => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel/CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeCharts"
                    checked={reportConfig.includeCharts}
                    onChange={(e) => setReportConfig((prev) => ({ ...prev, includeCharts: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="includeCharts" className="text-gray-700 dark:text-gray-300">
                    Incluir gráficos
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeDetails"
                    checked={reportConfig.includeDetails}
                    onChange={(e) => setReportConfig((prev) => ({ ...prev, includeDetails: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="includeDetails" className="text-gray-700 dark:text-gray-300">
                    Incluir detalhamento completo
                  </Label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
        {/* Tipos de Relatórios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <Card
              key={report.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center mb-3`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-base text-gray-900 dark:text-white">{report.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                  {report.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => generateReport(report.id, "pdf")}
                    disabled={isGenerating}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isGenerating ? "Gerando..." : "PDF"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => generateReport(report.id, "excel")}
                    disabled={isGenerating}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Relatórios Recentes */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Relatórios Recentes</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">Últimos relatórios gerados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhum relatório gerado ainda</p>
                  <p className="text-sm text-gray-400">
                    Clique em um dos tipos acima para gerar seu primeiro relatório
                  </p>
                </div>
              ) : (
                recentReports.map((report: any, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{report.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {report.type} • {report.size} • {report.format}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                      >
                        {report.status}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.date).toLocaleDateString("pt-BR")}
                      </span>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resumo Executivo */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Resumo Executivo - {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Principais indicadores do período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(() => {
                const metrics = calculateMetrics()
                return (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(metrics.receita)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receita Total</div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8% vs mês anterior</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(metrics.lucro)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lucro Líquido</div>
                      <div className="text-xs text-red-600 dark:text-red-400 mt-1">-40% vs mês anterior</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {metrics.margem.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Margem Líquida</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Meta: 25%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {financialData.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Itens Cadastrados</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Total no sistema</div>
                    </div>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

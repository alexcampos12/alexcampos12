"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Download, Plus, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateFilter } from "@/components/date-filter"
import { useDateFilter } from "@/hooks/use-date-filter"

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
}

interface DREData {
  receita: number
  custoVariavel: number
  lucroLiquido: number
  margemBruta: number
  salarios: number
  prolabore: number
  custoFixo: number
  despesasOperacionais: number
  ebitda: number
  margemEbitda: number
  impostos: number
  lucroLiquidoFinal: number
  margemLiquida: number
}

export default function DREPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  })

  const {
    selectedPeriod,
    setSelectedPeriod,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    getPeriodLabel,
    filterDataByDateRange,
    filterDataByPreviousPeriod,
  } = useDateFilter("month")

  // Dados de exemplo para demonstração
  const generateSampleData = (): FinancialData[] => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return [
      // Dados do mês atual
      {
        id: "1",
        category: "receita",
        description: "Receita de Serviços",
        value: 150000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-15`,
      },
      {
        id: "2",
        category: "receita",
        description: "Receita de Consultoria",
        value: 45000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-20`,
      },
      {
        id: "3",
        category: "custo-variavel",
        description: "Custos de Produção",
        value: 35000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-10`,
      },
      {
        id: "4",
        category: "custo-fixo",
        description: "Aluguel",
        value: 8000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`,
      },
      {
        id: "5",
        category: "custo-fixo",
        description: "Internet e Telefone",
        value: 1200,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-05`,
      },
      {
        id: "6",
        category: "salarios",
        description: "Salários da Equipe",
        value: 45000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-25`,
      },
      {
        id: "7",
        category: "prolabore",
        description: "Pró-labore Sócios",
        value: 20000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-25`,
      },
      {
        id: "8",
        category: "impostos",
        description: "Impostos Federais",
        value: 12000,
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-30`,
      },

      // Dados do mês anterior
      {
        id: "9",
        category: "receita",
        description: "Receita de Serviços",
        value: 135000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-15`,
      },
      {
        id: "10",
        category: "receita",
        description: "Receita de Consultoria",
        value: 40000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-20`,
      },
      {
        id: "11",
        category: "custo-variavel",
        description: "Custos de Produção",
        value: 32000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-10`,
      },
      {
        id: "12",
        category: "custo-fixo",
        description: "Aluguel",
        value: 8000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-05`,
      },
      {
        id: "13",
        category: "salarios",
        description: "Salários da Equipe",
        value: 42000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-25`,
      },
      {
        id: "14",
        category: "prolabore",
        description: "Pró-labore Sócios",
        value: 18000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-25`,
      },
      {
        id: "15",
        category: "impostos",
        description: "Impostos Federais",
        value: 11000,
        date: `${currentYear}-${String(currentMonth).padStart(2, "0")}-30`,
      },
    ]
  }

  const calculateDREData = (data: FinancialData[]): DREData => {
    const receita = data.filter((item) => item.category === "receita").reduce((sum, item) => sum + item.value, 0)
    const custoVariavel = data
      .filter((item) => item.category === "custo-variavel")
      .reduce((sum, item) => sum + item.value, 0)
    const lucroLiquido = receita - custoVariavel
    const margemBruta = receita > 0 ? (lucroLiquido / receita) * 100 : 0

    const salarios = data.filter((item) => item.category === "salarios").reduce((sum, item) => sum + item.value, 0)
    const prolabore = data.filter((item) => item.category === "prolabore").reduce((sum, item) => sum + item.value, 0)
    const custoFixo = data.filter((item) => item.category === "custo-fixo").reduce((sum, item) => sum + item.value, 0)

    const despesasOperacionais = salarios + prolabore + custoFixo
    const ebitda = lucroLiquido - despesasOperacionais
    const margemEbitda = receita > 0 ? (ebitda / receita) * 100 : 0

    const impostos = data.filter((item) => item.category === "impostos").reduce((sum, item) => sum + item.value, 0)
    const lucroLiquidoFinal = ebitda - impostos
    const margemLiquida = receita > 0 ? (lucroLiquidoFinal / receita) * 100 : 0

    return {
      receita,
      custoVariavel,
      lucroLiquido,
      margemBruta,
      salarios,
      prolabore,
      custoFixo,
      despesasOperacionais,
      ebitda,
      margemEbitda,
      impostos,
      lucroLiquidoFinal,
      margemLiquida,
    }
  }

  // Carrega dados iniciais apenas uma vez
  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      const parsed = JSON.parse(savedData)
      if (parsed.length === 0) {
        const sampleData = generateSampleData()
        setFinancialData(sampleData)
        localStorage.setItem("financialData", JSON.stringify(sampleData))
      } else {
        setFinancialData(parsed)
      }
    } else {
      const sampleData = generateSampleData()
      setFinancialData(sampleData)
      localStorage.setItem("financialData", JSON.stringify(sampleData))
    }
  }, [])

  // Calcula dados filtrados usando useMemo para evitar recálculos desnecessários
  const filteredData = useMemo(() => {
    return filterDataByDateRange(financialData)
  }, [financialData, filterDataByDateRange])

  const previousPeriodData = useMemo(() => {
    const previousFiltered = filterDataByPreviousPeriod(financialData)
    return calculateDREData(previousFiltered)
  }, [financialData, filterDataByPreviousPeriod])

  const currentData = useMemo(() => calculateDREData(filteredData), [filteredData])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getVariation = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const renderVariation = (current: number, previous: number) => {
    if (!previousPeriodData) return null
    const variation = getVariation(current, previous)
    const isPositive = variation >= 0

    return (
      <div className={`flex items-center text-xs ${isPositive ? "text-gray-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {isPositive ? "+" : ""}
        {variation.toFixed(1)}%
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: FinancialData = {
      id: Date.now().toString(),
      category: formData.category as FinancialData["category"],
      description: formData.description,
      value: Number.parseFloat(formData.value),
      date: formData.date,
    }

    const newData = [...financialData, newItem]
    setFinancialData(newData)
    localStorage.setItem("financialData", JSON.stringify(newData))

    setFormData({
      category: "",
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsAddDialogOpen(false)
  }

  const exportToPDF = () => {
    const content = `
DRE - Five Performance Digital
Período: ${getPeriodLabel()}

RECEITA BRUTA: ${formatCurrency(currentData.receita)}
(-) Custos Variáveis: ${formatCurrency(currentData.custoVariavel)}
LUCRO BRUTO: ${formatCurrency(currentData.lucroLiquido)} (${formatPercentage(currentData.margemBruta)})

DESPESAS OPERACIONAIS:
(-) Salários: ${formatCurrency(currentData.salarios)}
(-) Pró-labore: ${formatCurrency(currentData.prolabore)}
(-) Custos Fixos: ${formatCurrency(currentData.custoFixo)}
Total: ${formatCurrency(currentData.despesasOperacionais)}

EBITDA: ${formatCurrency(currentData.ebitda)} (${formatPercentage(currentData.margemEbitda)})
(-) Impostos: ${formatCurrency(currentData.impostos)}
LUCRO LÍQUIDO: ${formatCurrency(currentData.lucroLiquidoFinal)} (${formatPercentage(currentData.margemLiquida)})
    `

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `DRE-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-black dark:border-gray-800 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-orange-100">DRE</h1>
          <p className="text-sm text-gray-500 dark:text-orange-400">Demonstrativo do Resultado do Exercício</p>
        </div>
        <div className="flex items-center gap-3">
          <DateFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCustomStartDateChange={setCustomStartDate}
            onCustomEndDateChange={setCustomEndDate}
          />

          <Button variant="outline" size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>

          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </header>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-orange-100">Adicionar Item ao DRE</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="dark:text-orange-100">
                  Categoria
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="custo-variavel">Custos Variáveis</SelectItem>
                    <SelectItem value="custo-fixo">Custos Fixos</SelectItem>
                    <SelectItem value="salarios">Salários</SelectItem>
                    <SelectItem value="prolabore">Pró-labore</SelectItem>
                    <SelectItem value="impostos">Impostos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do item"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex-1 bg-gray-50 dark:bg-black">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header com período */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-orange-100">Five Performance Digital</h2>
            <p className="text-gray-600 dark:text-orange-400">Demonstrativo do Resultado do Exercício</p>
            <p className="text-lg font-medium text-gray-800 dark:text-orange-100 mt-2">{getPeriodLabel()}</p>
            <p className="text-sm text-gray-500 dark:text-orange-400 mt-1">
              {filteredData.length} lançamentos no período
            </p>
          </div>

          {filteredData.length === 0 ? (
            <Card className="max-w-md mx-auto dark:bg-gray-900 dark:border-gray-800">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-gray-400 dark:text-orange-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-orange-100 mb-2">Nenhum dado encontrado</h3>
                <p className="text-gray-500 dark:text-orange-400 mb-4">
                  Não há lançamentos para o período selecionado. Tente outro período ou adicione novos dados.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Lançamento
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Gráfico de Margens - Altura uniforme */}
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 dark:text-orange-100">
                    <BarChart3 className="w-5 h-5" />
                    Indicadores de Margem
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-32">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col justify-between">
                      <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">
                        {formatPercentage(currentData.margemBruta)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-orange-400">Margem Bruta</div>
                      {previousPeriodData && renderVariation(currentData.margemBruta, previousPeriodData.margemBruta)}
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col justify-between">
                      <div className="text-2xl font-bold text-gray-900 dark:text-orange-100">
                        {formatPercentage(currentData.margemEbitda)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-orange-400">Margem EBITDA</div>
                      {previousPeriodData && renderVariation(currentData.margemEbitda, previousPeriodData.margemEbitda)}
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col justify-between">
                      <div
                        className={`text-2xl font-bold ${currentData.margemLiquida < 0 ? "text-red-600" : "text-gray-900 dark:text-orange-100"}`}
                      >
                        {formatPercentage(currentData.margemLiquida)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-orange-400">Margem Líquida</div>
                      {previousPeriodData &&
                        renderVariation(currentData.margemLiquida, previousPeriodData.margemLiquida)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DRE Principal */}
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Receita Bruta */}
                    <div className="flex justify-between items-center py-4 border-b-2 border-gray-900 dark:border-gray-700">
                      <span className="font-bold text-lg dark:text-orange-100">RECEITA BRUTA</span>
                      <div className="text-right">
                        <span className="font-bold text-lg dark:text-orange-100">
                          {formatCurrency(currentData.receita)}
                        </span>
                        {previousPeriodData && (
                          <div className="text-right">
                            {renderVariation(currentData.receita, previousPeriodData.receita)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custos Variáveis */}
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">(-) Custos Variáveis</span>
                      <div className="text-right">
                        <span className={`font-medium ${currentData.custoVariavel > 0 ? "text-red-600" : ""}`}>
                          {currentData.custoVariavel > 0 ? `(${formatCurrency(currentData.custoVariavel)})` : "-"}
                        </span>
                        {previousPeriodData && (
                          <div className="text-right">
                            {renderVariation(currentData.custoVariavel, previousPeriodData.custoVariavel)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lucro Bruto */}
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 rounded">
                      <span className="font-bold dark:text-orange-100">LUCRO BRUTO</span>
                      <div className="text-right">
                        <div className={`font-bold ${currentData.lucroLiquido < 0 ? "text-red-600" : ""}`}>
                          {formatCurrency(currentData.lucroLiquido)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-orange-400">
                          {formatPercentage(currentData.margemBruta)}
                        </div>
                        {previousPeriodData &&
                          renderVariation(currentData.lucroLiquido, previousPeriodData.lucroLiquido)}
                      </div>
                    </div>

                    {/* Despesas Operacionais */}
                    <div className="space-y-4">
                      <div className="font-bold text-gray-900 dark:text-orange-100">DESPESAS OPERACIONAIS</div>
                      <div className="ml-6 space-y-3">
                        <div className="flex justify-between py-1">
                          <span>(-) Salários e Encargos</span>
                          <span className={`${currentData.salarios > 0 ? "text-red-600" : ""}`}>
                            {currentData.salarios > 0 ? `(${formatCurrency(currentData.salarios)})` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>(-) Pró-labore</span>
                          <span className={`${currentData.prolabore > 0 ? "text-red-600" : ""}`}>
                            {currentData.prolabore > 0 ? `(${formatCurrency(currentData.prolabore)})` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span>(-) Custos Fixos</span>
                          <span className={`${currentData.custoFixo > 0 ? "text-red-600" : ""}`}>
                            {currentData.custoFixo > 0 ? `(${formatCurrency(currentData.custoFixo)})` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium border-t pt-3">
                          <span>Total Despesas Operacionais</span>
                          <div className="text-right">
                            <span className={`${currentData.despesasOperacionais > 0 ? "text-red-600" : ""}`}>
                              {currentData.despesasOperacionais > 0
                                ? `(${formatCurrency(currentData.despesasOperacionais)})`
                                : "-"}
                            </span>
                            {previousPeriodData &&
                              renderVariation(
                                currentData.despesasOperacionais,
                                previousPeriodData.despesasOperacionais,
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EBITDA */}
                    <div className="flex justify-between items-center py-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 rounded">
                      <span className="font-bold dark:text-orange-100">EBITDA</span>
                      <div className="text-right">
                        <div className={`font-bold ${currentData.ebitda < 0 ? "text-red-600" : ""}`}>
                          {formatCurrency(currentData.ebitda)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-orange-400">
                          {formatPercentage(currentData.margemEbitda)}
                        </div>
                        {previousPeriodData && renderVariation(currentData.ebitda, previousPeriodData.ebitda)}
                      </div>
                    </div>

                    {/* Impostos */}
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">(-) Impostos e Taxas</span>
                      <div className="text-right">
                        <span className={`font-medium ${currentData.impostos > 0 ? "text-red-600" : ""}`}>
                          {currentData.impostos > 0 ? `(${formatCurrency(currentData.impostos)})` : "-"}
                        </span>
                        {previousPeriodData && renderVariation(currentData.impostos, previousPeriodData.impostos)}
                      </div>
                    </div>

                    {/* Lucro Líquido Final */}
                    <div className="flex justify-between items-center py-4 border-b-2 border-gray-900 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 rounded">
                      <span className="font-bold text-xl dark:text-orange-100">LUCRO LÍQUIDO</span>
                      <div className="text-right">
                        <div className={`font-bold text-xl ${currentData.lucroLiquidoFinal < 0 ? "text-red-600" : ""}`}>
                          {formatCurrency(currentData.lucroLiquidoFinal)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-orange-400">
                          {formatPercentage(currentData.margemLiquida)}
                        </div>
                        {previousPeriodData &&
                          renderVariation(currentData.lucroLiquidoFinal, previousPeriodData.lucroLiquidoFinal)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumo de Itens - Grid simétrico */}
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="dark:text-orange-100">Resumo de Itens no Período</CardTitle>
                  <CardDescription className="dark:text-orange-400">
                    Total de {filteredData.length} lançamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {["receita", "custo-variavel", "custo-fixo", "salarios", "prolabore", "impostos"].map(
                      (category) => {
                        const items = filteredData.filter((item) => item.category === category)
                        const total = items.reduce((sum, item) => sum + item.value, 0)
                        const categoryLabel = {
                          receita: "Receitas",
                          "custo-variavel": "Custos Variáveis",
                          "custo-fixo": "Custos Fixos",
                          salarios: "Salários",
                          prolabore: "Pró-labore",
                          impostos: "Impostos",
                        }[category]

                        return (
                          <div
                            key={category}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg h-24 flex flex-col justify-between"
                          >
                            <div className="font-medium text-gray-900 dark:text-orange-100">{categoryLabel}</div>
                            <div className="flex items-end justify-between">
                              <div
                                className={`text-lg font-bold ${category !== "receita" && total > 0 ? "text-red-600" : ""}`}
                              >
                                {formatCurrency(total)}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-orange-400">{items.length} itens</div>
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </SidebarInset>
  )
}

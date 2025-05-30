"use client"

import { useState, useEffect } from "react"
import { FileText, Filter, X, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
  recurring?: boolean
}

interface FilterState {
  category: string
  startDate: string
  endDate: string
  minValue: string
  maxValue: string
}

export default function FinanceiroPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [filteredData, setFilteredData] = useState<FinancialData[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    startDate: "",
    endDate: "",
    minValue: "",
    maxValue: "",
  })

  // Carregar dados
  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      setFinancialData(JSON.parse(savedData))
    }
  }, [])

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...financialData]

    if (filters.category !== "all") {
      filtered = filtered.filter((item) => item.category === filters.category)
    }

    if (filters.startDate) {
      filtered = filtered.filter((item) => item.date >= filters.startDate)
    }

    if (filters.endDate) {
      filtered = filtered.filter((item) => item.date <= filters.endDate)
    }

    if (filters.minValue) {
      const minVal = Number.parseFloat(filters.minValue)
      if (!isNaN(minVal)) {
        filtered = filtered.filter((item) => item.value >= minVal)
      }
    }

    if (filters.maxValue) {
      const maxVal = Number.parseFloat(filters.maxValue)
      if (!isNaN(maxVal)) {
        filtered = filtered.filter((item) => item.value <= maxVal)
      }
    }

    setFilteredData(filtered)
  }, [financialData, filters])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleDeleteItem = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este item?")) {
      const newData = financialData.filter((item) => item.id !== id)
      setFinancialData(newData)
      localStorage.setItem("financialData", JSON.stringify(newData))
    }
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      startDate: "",
      endDate: "",
      minValue: "",
      maxValue: "",
    })
  }

  const hasActiveFilters =
    filters.category !== "all" || filters.startDate || filters.endDate || filters.minValue || filters.maxValue

  const getCategoryLabel = (category: string) => {
    const labels = {
      receita: "Receita",
      "custo-fixo": "Custo Fixo",
      "custo-variavel": "Custo Variável",
      salarios: "Salários",
      prolabore: "Pró-labore",
      impostos: "Impostos",
    }
    return labels[category as keyof typeof labels] || category
  }

  // Calcular resumo por categoria
  const categoryResume = ["receita", "custo-fixo", "custo-variavel", "salarios", "prolabore", "impostos"].map(
    (category) => {
      const items = filteredData.filter((item) => item.category === category)
      const total = items.reduce((sum, item) => sum + item.value, 0)
      return {
        category,
        label: getCategoryLabel(category),
        total,
        count: items.length,
        isReceita: category === "receita",
      }
    },
  )

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Gestão detalhada de itens financeiros</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Botão Filtros */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 ${hasActiveFilters ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600" : ""}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-4 w-4 p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Filtros</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Limpar
                    </Button>
                  )}
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300">Categoria</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800">
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="custo-fixo">Custo Fixo</SelectItem>
                      <SelectItem value="custo-variavel">Custo Variável</SelectItem>
                      <SelectItem value="salarios">Salários</SelectItem>
                      <SelectItem value="prolabore">Pró-labore</SelectItem>
                      <SelectItem value="impostos">Impostos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Data Início</Label>
                    <Input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Data Fim</Label>
                    <Input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Valor Mín.</Label>
                    <Input
                      type="number"
                      placeholder="0,00"
                      value={filters.minValue}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minValue: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300">Valor Máx.</Label>
                    <Input
                      type="number"
                      placeholder="999999"
                      value={filters.maxValue}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxValue: e.target.value }))}
                      className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
        {/* Status dos Filtros */}
        {hasActiveFilters && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Filtros ativos: {filteredData.length} de {financialData.length} itens
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Lista de Itens Financeiros */}
          <div className="xl:col-span-2">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Itens Financeiros
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  {filteredData.length} de {financialData.length} itens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredData.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">
                        {hasActiveFilters
                          ? "Nenhum item encontrado com os filtros aplicados"
                          : "Nenhum item cadastrado"}
                      </p>
                    </div>
                  ) : (
                    filteredData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.description}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(item.category)}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(item.date).toLocaleDateString("pt-BR")}
                            </span>
                            {item.recurring && (
                              <Badge variant="secondary" className="text-xs">
                                Recorrente
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`font-medium text-sm ${item.category === "receita" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                          >
                            {item.category === "receita" ? "+" : "-"}
                            {formatCurrency(item.value)}
                          </span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo por Categoria */}
          <div className="xl:col-span-1">
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Resumo por Categoria</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">Distribuição dos valores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryResume.map((category) => (
                    <div key={category.category} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">{category.label}</h4>
                      <div className="flex items-end justify-between">
                        <div
                          className={`text-lg font-bold ${category.isReceita ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {formatCurrency(category.total)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {category.count} {category.count === 1 ? "item" : "itens"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

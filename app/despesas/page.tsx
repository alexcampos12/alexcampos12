"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts"

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
}

export default function DespesasPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FinancialData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      "custo-fixo": "Custos Fixos",
      "custo-variavel": "Custos Variáveis",
      salarios: "Salários",
      prolabore: "Pró-labore",
      impostos: "Impostos",
    }
    return labels[category as keyof typeof labels] || category
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "custo-fixo": "bg-blue-50 text-blue-700 hover:bg-blue-100",
      "custo-variavel": "bg-purple-50 text-purple-700 hover:bg-purple-100",
      salarios: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      prolabore: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      impostos: "bg-red-50 text-red-700 hover:bg-red-100",
    }
    return colors[category as keyof typeof colors] || "bg-gray-50 text-gray-700 hover:bg-gray-100"
  }

  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      setFinancialData(JSON.parse(savedData))
    }
  }, [])

  const despesaCategories = ["custo-fixo", "custo-variavel", "salarios", "prolabore", "impostos"]

  const filteredDespesas = financialData
    .filter((item) => despesaCategories.includes(item.category))
    .filter((item) => selectedCategory === "all" || item.category === selectedCategory)
    .filter((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalDespesas = filteredDespesas.reduce((sum, item) => sum + item.value, 0)

  // Calcular distribuição por categoria
  const despesasByCategory = despesaCategories
    .map((category) => {
      const categoryItems = filteredDespesas.filter((item) => item.category === category)
      const total = categoryItems.reduce((sum, item) => sum + item.value, 0)
      const percentage = totalDespesas > 0 ? (total / totalDespesas) * 100 : 0

      return {
        name: getCategoryLabel(category),
        value: total,
        percentage: percentage.toFixed(1),
        count: categoryItems.length,
        category,
      }
    })
    .filter((item) => item.value > 0)

  // Cores para os gráficos
  const COLORS = {
    "custo-fixo": "#3b82f6",
    "custo-variavel": "#8b5cf6",
    salarios: "#10b981",
    prolabore: "#f59e0b",
    impostos: "#ef4444",
  }

  const saveData = (newData: FinancialData[]) => {
    setFinancialData(newData)
    localStorage.setItem("financialData", JSON.stringify(newData))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: FinancialData = {
      id: editingItem?.id || Date.now().toString(),
      category: formData.category as FinancialData["category"],
      description: formData.description,
      value: Number.parseFloat(formData.value),
      date: formData.date,
    }

    let newData: FinancialData[]
    if (editingItem) {
      newData = financialData.map((item) => (item.id === editingItem.id ? newItem : item))
    } else {
      newData = [...financialData, newItem]
    }

    saveData(newData)
    setFormData({ category: "", description: "", value: "", date: new Date().toISOString().split("T")[0] })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (item: FinancialData) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      description: item.description,
      value: item.value.toString(),
      date: item.date,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
      const newData = financialData.filter((item) => item.id !== id)
      saveData(newData)
    }
  }

  const openAddDialog = () => {
    setEditingItem(null)
    setFormData({
      category: "",
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0],
    })
    setIsDialogOpen(true)
  }

  return (
    <SidebarInset>
      {/* Header Minimalista */}
      <header className="flex h-16 items-center gap-4 border-b bg-white dark:bg-black dark:border-gray-800 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-orange-100">Despesas</h1>
          <p className="text-sm text-gray-500 dark:text-orange-400">Gerencie todos os custos e despesas</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-orange-400">Total</div>
            <div className="text-lg font-semibold text-red-600 dark:text-orange-400">
              {formatCurrency(totalDespesas)}
            </div>
          </div>
          <Button
            onClick={openAddDialog}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </header>

      {/* Modal Minimalista */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-orange-100">
              {editingItem ? "Editar Despesa" : "Nova Despesa"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custo-fixo">Custos Fixos</SelectItem>
                    <SelectItem value="custo-variavel">Custos Variáveis</SelectItem>
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
                  placeholder="Ex: Aluguel do escritório"
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white"
              >
                {editingItem ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6 bg-gray-50 dark:bg-black">
        {/* Search and Filter Bar Minimalista */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar despesas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="custo-fixo">Custos Fixos</SelectItem>
              <SelectItem value="custo-variavel">Custos Variáveis</SelectItem>
              <SelectItem value="salarios">Salários</SelectItem>
              <SelectItem value="prolabore">Pró-labore</SelectItem>
              <SelectItem value="impostos">Impostos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Card Minimalista */}
        <Card className="border-blue-100 dark:border-gray-800 dark:bg-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700 dark:text-orange-100">Resumo de Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-orange-400">
                  {formatCurrency(totalDespesas)}
                </div>
                <div className="text-sm text-gray-500 dark:text-orange-400 mt-1">
                  {filteredDespesas.length} despesas cadastradas
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-blue-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza - Distribuição por Categoria */}
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700 dark:text-orange-100">
                Distribuição por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {despesasByCategory.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={despesasByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {despesasByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.category as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value), "Valor"]}
                        labelFormatter={(label) => `Categoria: ${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">Nenhum dado para exibir</div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Comparação por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-700">Comparação por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {despesasByCategory.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={despesasByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} fontSize={12} />
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value), "Valor"]}
                        labelFormatter={(label) => `Categoria: ${label}`}
                      />
                      <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">Nenhum dado para exibir</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cards de Indicadores por Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {despesasByCategory.map((category) => (
            <Card key={category.category} className="border-blue-100 dark:border-gray-800 dark:bg-gray-900">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-orange-100">{category.name}</h4>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[category.category as keyof typeof COLORS] }}
                  ></div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
                    {formatCurrency(category.value)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-orange-400">{category.percentage}% do total</div>
                  <div className="text-xs text-gray-400 dark:text-orange-400">{category.count} itens</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Despesas Lista Minimalista */}
        {filteredDespesas.length === 0 ? (
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-orange-100 mb-2">
                Nenhuma despesa encontrada
              </h3>
              <p className="text-gray-500 dark:text-orange-400 mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "Tente ajustar seus filtros"
                  : "Comece adicionando sua primeira despesa"}
              </p>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Despesa
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDespesas.map((item) => (
              <Card
                key={item.id}
                className="hover:border-blue-200 dark:hover:border-orange-500 transition-colors dark:bg-gray-900 dark:border-gray-800"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`${getCategoryColor(item.category)} border-0 dark:bg-orange-500/20 dark:text-orange-400`}
                        >
                          {getCategoryLabel(item.category)}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-orange-100">{item.description}</h3>
                      <div className="text-sm text-gray-500 dark:text-orange-400 mt-1">
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 dark:bg-orange-500/20 dark:text-orange-400 dark:hover:bg-orange-500/30">
                        {formatCurrency(item.value)}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-500/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-orange-400 dark:hover:text-red-400 dark:hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}

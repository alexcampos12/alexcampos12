"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Calculator, Search, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
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
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
}

export default function CustosFixosPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FinancialData | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      setFinancialData(JSON.parse(savedData))
    }
  }, [])

  const custosFixos = financialData
    .filter((item) => item.category === "custo-fixo")
    .filter((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  const totalCustosFixos = custosFixos.reduce((sum, item) => sum + item.value, 0)

  const saveData = (newData: FinancialData[]) => {
    setFinancialData(newData)
    localStorage.setItem("financialData", JSON.stringify(newData))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem: FinancialData = {
      id: editingItem?.id || Date.now().toString(),
      category: "custo-fixo",
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
    setFormData({ description: "", value: "", date: new Date().toISOString().split("T")[0] })
    setEditingItem(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (item: FinancialData) => {
    setEditingItem(item)
    setFormData({
      description: item.description,
      value: item.value.toString(),
      date: item.date,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este custo fixo?")) {
      const newData = financialData.filter((item) => item.id !== id)
      saveData(newData)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 transition-colors duration-200">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Custos Fixos</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie todos os custos fixos mensais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              onClick={() => {
                setEditingItem(null)
                setFormData({
                  description: "",
                  value: "",
                  date: new Date().toISOString().split("T")[0],
                })
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Custo Fixo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">
                {editingItem ? "Editar Custo Fixo" : "Novo Custo Fixo"}
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                {editingItem ? "Edite as informações do custo fixo." : "Adicione um novo custo fixo."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                  Descrição
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Aluguel do escritório"
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value" className="text-gray-700 dark:text-gray-300">
                  Valor (R$)
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="0,00"
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-gray-700 dark:text-gray-300">
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-200"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all duration-200 hover:scale-105"
              >
                {editingItem ? "Atualizar" : "Adicionar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Resumo e Filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Total Custos Fixos
                </CardTitle>
                <Calculator className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {formatCurrency(totalCustosFixos)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {custosFixos.length} {custosFixos.length === 1 ? "custo cadastrado" : "custos cadastrados"}
              </p>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar custos fixos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-200"
                />
              </div>
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Custos Fixos */}
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Custos Fixos Cadastrados
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Lista completa de todos os custos fixos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {custosFixos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">Nenhum custo fixo encontrado</p>
                <p className="text-sm text-gray-400">
                  {searchTerm ? "Tente ajustar sua busca" : "Clique em 'Novo Custo Fixo' para começar"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {custosFixos.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.description}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="text-base px-3 py-1 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      >
                        {formatCurrency(item.value)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEdit(item)}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

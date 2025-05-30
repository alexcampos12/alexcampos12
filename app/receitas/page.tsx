"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Repeat, Calendar, Settings, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

interface ServiceProduct {
  id: string
  name: string
  category: "servico" | "infoproduto"
  defaultPrice?: number
  isActive: boolean
}

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
  contractType: "recorrente" | "pontual"
  contractDuration?: number
  monthlyValue?: number
  contractStart?: string
  contractEnd?: string
  serviceId?: string
  serviceCategory?: "servico" | "infoproduto"
}

export default function ReceitasPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [servicesProducts, setServicesProducts] = useState<ServiceProduct[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FinancialData | null>(null)
  const [editingService, setEditingService] = useState<ServiceProduct | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("receitas")

  const [formData, setFormData] = useState({
    description: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
    contractType: "pontual" as "recorrente" | "pontual",
    contractDuration: "",
    monthlyValue: "",
    contractStart: "",
    contractEnd: "",
    serviceId: "",
    customService: "",
  })

  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    category: "servico" as "servico" | "infoproduto",
    defaultPrice: "",
  })

  // Serviços e produtos predefinidos
  const defaultServicesProducts: ServiceProduct[] = [
    // Serviços
    { id: "1", name: "Gestão de Tráfego Pago", category: "servico", defaultPrice: 2500, isActive: true },
    { id: "2", name: "Implementação de CRM", category: "servico", defaultPrice: 3500, isActive: true },
    { id: "3", name: "Empresas 5.0", category: "servico", defaultPrice: 5000, isActive: true },
    { id: "4", name: "Criação de Landing Page", category: "servico", defaultPrice: 1500, isActive: true },
    { id: "5", name: "Inteligência Artificial", category: "servico", defaultPrice: 4000, isActive: true },
    { id: "6", name: "Automações", category: "servico", defaultPrice: 2000, isActive: true },
    { id: "7", name: "SEO", category: "servico", defaultPrice: 1800, isActive: true },
    { id: "8", name: "Criação de Sites", category: "servico", defaultPrice: 2200, isActive: true },
    { id: "9", name: "Consultoria", category: "servico", defaultPrice: 800, isActive: true },
    { id: "10", name: "Mentoria em Grupo", category: "servico", defaultPrice: 300, isActive: true },
    { id: "11", name: "Mentoria Individual", category: "servico", defaultPrice: 600, isActive: true },

    // Infoprodutos
    { id: "12", name: "FiveSend", category: "infoproduto", defaultPrice: 497, isActive: true },
    { id: "13", name: "Comunidade CRM Automatizado", category: "infoproduto", defaultPrice: 97, isActive: true },
    { id: "14", name: "CRM Automatizado Pro", category: "infoproduto", defaultPrice: 297, isActive: true },
    { id: "15", name: "Evento Presencial", category: "infoproduto", defaultPrice: 1200, isActive: true },
    { id: "16", name: "Conecta CRM", category: "infoproduto", defaultPrice: 197, isActive: true },
  ]

  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      setFinancialData(JSON.parse(savedData))
    }

    const savedServices = localStorage.getItem("servicesProducts")
    if (savedServices) {
      setServicesProducts(JSON.parse(savedServices))
    } else {
      setServicesProducts(defaultServicesProducts)
      localStorage.setItem("servicesProducts", JSON.stringify(defaultServicesProducts))
    }
  }, [])

  const receitas = financialData
    .filter((item) => item.category === "receita")
    .filter((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()))

  // Separar por tipo de contrato
  const receitasRecorrentes = receitas.filter((item) => item.contractType === "recorrente")
  const receitasPontuais = receitas.filter((item) => item.contractType === "pontual")

  // Separar por categoria de serviço
  const receitasServicos = receitas.filter((item) => item.serviceCategory === "servico")
  const receitasInfoprodutos = receitas.filter((item) => item.serviceCategory === "infoproduto")

  // Calcular métricas
  const mrr = receitasRecorrentes.reduce((sum, item) => sum + (item.monthlyValue || 0), 0)
  const arr = mrr * 12
  const totalPontuais = receitasPontuais.reduce((sum, item) => sum + item.value, 0)
  const totalServicos = receitasServicos.reduce((sum, item) => sum + item.value, 0)
  const totalInfoprodutos = receitasInfoprodutos.reduce((sum, item) => sum + item.value, 0)
  const totalReceitas = receitas.reduce((sum, item) => sum + item.value, 0)

  // Calcular distribuição por tipo de contrato
  const receitasByType = [
    {
      name: "Receitas Recorrentes",
      value: receitasRecorrentes.reduce((sum, item) => sum + item.value, 0),
      count: receitasRecorrentes.length,
      type: "recorrente",
    },
    {
      name: "Receitas Pontuais",
      value: receitasPontuais.reduce((sum, item) => sum + item.value, 0),
      count: receitasPontuais.length,
      type: "pontual",
    },
  ].filter((item) => item.value > 0)

  // Calcular distribuição por categoria de serviço
  const receitasByService = [
    {
      name: "Serviços",
      value: receitasServicos.reduce((sum, item) => sum + item.value, 0),
      count: receitasServicos.length,
      category: "servico",
    },
    {
      name: "Infoprodutos",
      value: receitasInfoprodutos.reduce((sum, item) => sum + item.value, 0),
      count: receitasInfoprodutos.length,
      category: "infoproduto",
    },
  ].filter((item) => item.value > 0)

  // Top 5 serviços/produtos por receita
  const topServices = servicesProducts
    .map((service) => {
      const serviceReceitas = receitas.filter((item) => item.serviceId === service.id)
      const total = serviceReceitas.reduce((sum, item) => sum + item.value, 0)
      return {
        name: service.name,
        value: total,
        count: serviceReceitas.length,
        category: service.category,
      }
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  // Cores padronizadas - apenas azul/laranja
  const COLORS = {
    recorrente: "#1e40af", // blue-800
    pontual: "#3b82f6", // blue-500
    servico: "#1e40af", // blue-800
    infoproduto: "#3b82f6", // blue-500
  }

  const saveData = (newData: FinancialData[]) => {
    setFinancialData(newData)
    localStorage.setItem("financialData", JSON.stringify(newData))
  }

  const saveServices = (newServices: ServiceProduct[]) => {
    setServicesProducts(newServices)
    localStorage.setItem("servicesProducts", JSON.stringify(newServices))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let totalValue = Number.parseFloat(formData.value)
    let monthlyValue = 0
    let description = formData.description

    // Se selecionou um serviço predefinido
    if (formData.serviceId) {
      const selectedService = servicesProducts.find((s) => s.id === formData.serviceId)
      if (selectedService) {
        description = selectedService.name
        if (!formData.value && selectedService.defaultPrice) {
          totalValue = selectedService.defaultPrice
        }
      }
    } else if (formData.customService) {
      description = formData.customService
    }

    if (formData.contractType === "recorrente" && formData.contractDuration) {
      monthlyValue = Number.parseFloat(formData.monthlyValue || "0")
      totalValue = monthlyValue * Number.parseInt(formData.contractDuration)
    }

    const selectedService = servicesProducts.find((s) => s.id === formData.serviceId)

    const newItem: FinancialData = {
      id: editingItem?.id || Date.now().toString(),
      category: "receita",
      description,
      value: totalValue,
      date: formData.date,
      contractType: formData.contractType,
      contractDuration: formData.contractDuration ? Number.parseInt(formData.contractDuration) : undefined,
      monthlyValue: formData.contractType === "recorrente" ? monthlyValue : undefined,
      contractStart: formData.contractStart || undefined,
      contractEnd: formData.contractEnd || undefined,
      serviceId: formData.serviceId || undefined,
      serviceCategory: selectedService?.category,
    }

    let newData: FinancialData[]
    if (editingItem) {
      newData = financialData.map((item) => (item.id === editingItem.id ? newItem : item))
    } else {
      newData = [...financialData, newItem]
    }

    saveData(newData)
    resetForm()
    setIsDialogOpen(false)
  }

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newService: ServiceProduct = {
      id: editingService?.id || Date.now().toString(),
      name: serviceFormData.name,
      category: serviceFormData.category,
      defaultPrice: serviceFormData.defaultPrice ? Number.parseFloat(serviceFormData.defaultPrice) : undefined,
      isActive: true,
    }

    let newServices: ServiceProduct[]
    if (editingService) {
      newServices = servicesProducts.map((service) => (service.id === editingService.id ? newService : service))
    } else {
      newServices = [...servicesProducts, newService]
    }

    saveServices(newServices)
    setServiceFormData({ name: "", category: "servico", defaultPrice: "" })
    setEditingService(null)
    setIsServiceDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0],
      contractType: "pontual",
      contractDuration: "",
      monthlyValue: "",
      contractStart: "",
      contractEnd: "",
      serviceId: "",
      customService: "",
    })
    setEditingItem(null)
  }

  const handleEdit = (item: FinancialData) => {
    setEditingItem(item)
    setFormData({
      description: item.description,
      value: item.contractType === "pontual" ? item.value.toString() : (item.monthlyValue || 0).toString(),
      date: item.date,
      contractType: item.contractType,
      contractDuration: item.contractDuration?.toString() || "",
      monthlyValue: item.monthlyValue?.toString() || "",
      contractStart: item.contractStart || "",
      contractEnd: item.contractEnd || "",
      serviceId: item.serviceId || "",
      customService: item.serviceId ? "" : item.description,
    })
    setIsDialogOpen(true)
  }

  const handleEditService = (service: ServiceProduct) => {
    setEditingService(service)
    setServiceFormData({
      name: service.name,
      category: service.category,
      defaultPrice: service.defaultPrice?.toString() || "",
    })
    setIsServiceDialogOpen(true)
  }

  const handleDeleteService = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço/produto?")) {
      const newServices = servicesProducts.filter((service) => service.id !== id)
      saveServices(newServices)
    }
  }

  const toggleServiceStatus = (id: string) => {
    const newServices = servicesProducts.map((service) =>
      service.id === id ? { ...service, isActive: !service.isActive } : service,
    )
    saveServices(newServices)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta receita?")) {
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

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openAddServiceDialog = () => {
    setServiceFormData({ name: "", category: "servico", defaultPrice: "" })
    setEditingService(null)
    setIsServiceDialogOpen(true)
  }

  const activeServices = servicesProducts.filter((s) => s.isActive)

  return (
    <SidebarInset>
      {/* Header */}
      <header className="flex h-16 items-center gap-4 border-b border-navy-200/50 dark:border-orange-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-navy-900 dark:text-orange-100">Receitas</h1>
          <p className="text-sm text-navy-500 dark:text-orange-400">Gerencie receitas de serviços e infoprodutos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-navy-500 dark:text-orange-400">MRR</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-orange-400">{formatCurrency(mrr)}</div>
          </div>
          <Button
            onClick={openAddDialog}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Receita
          </Button>
        </div>
      </header>

      {/* Modais */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white dark:bg-black border-navy-200 dark:border-orange-700">
          <DialogHeader>
            <DialogTitle className="text-navy-900 dark:text-orange-100">
              {editingItem ? "Editar Receita" : "Nova Receita"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {/* Seleção de Serviço/Produto */}
              <div className="space-y-2">
                <Label className="text-navy-700 dark:text-orange-300">Serviço/Produto</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          serviceId: value,
                          customService: "",
                          value: value
                            ? servicesProducts.find((s) => s.id === value)?.defaultPrice?.toString() || ""
                            : prev.value,
                        }))
                      }}
                    >
                      <SelectTrigger className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100">
                        <SelectValue placeholder="Selecionar serviço/produto" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-navy-200 dark:border-orange-700">
                        <SelectItem value="none">Personalizado</SelectItem>
                        {activeServices
                          .sort((a, b) => a.category.localeCompare(b.category))
                          .map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex items-center gap-2">
                                {service.category === "infoproduto" ? (
                                  <Package className="w-3 h-3" />
                                ) : (
                                  <Settings className="w-3 h-3" />
                                )}
                                {service.name}
                                {service.defaultPrice && (
                                  <span className="text-xs text-gray-500">
                                    ({formatCurrency(service.defaultPrice)})
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {!formData.serviceId && (
                    <Input
                      placeholder="Nome personalizado"
                      value={formData.customService}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customService: e.target.value }))}
                      required={!formData.serviceId}
                      className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractType" className="text-navy-700 dark:text-orange-300">
                  Tipo de Contrato
                </Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value: "recorrente" | "pontual") =>
                    setFormData((prev) => ({ ...prev, contractType: value }))
                  }
                >
                  <SelectTrigger className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-navy-200 dark:border-orange-700">
                    <SelectItem value="pontual">Pontual</SelectItem>
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.contractType === "recorrente" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyValue" className="text-navy-700 dark:text-orange-300">
                        Valor Mensal (R$)
                      </Label>
                      <Input
                        id="monthlyValue"
                        type="number"
                        step="0.01"
                        value={formData.monthlyValue}
                        onChange={(e) => setFormData((prev) => ({ ...prev, monthlyValue: e.target.value }))}
                        placeholder="0,00"
                        required
                        className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractDuration" className="text-navy-700 dark:text-orange-300">
                        Duração (meses)
                      </Label>
                      <Input
                        id="contractDuration"
                        type="number"
                        value={formData.contractDuration}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contractDuration: e.target.value }))}
                        placeholder="12"
                        required
                        className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contractStart" className="text-navy-700 dark:text-orange-300">
                        Início do Contrato
                      </Label>
                      <Input
                        id="contractStart"
                        type="date"
                        value={formData.contractStart}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contractStart: e.target.value }))}
                        className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractEnd" className="text-navy-700 dark:text-orange-300">
                        Fim do Contrato
                      </Label>
                      <Input
                        id="contractEnd"
                        type="date"
                        value={formData.contractEnd}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contractEnd: e.target.value }))}
                        className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                      />
                    </div>
                  </div>
                  {formData.monthlyValue && formData.contractDuration && (
                    <div className="p-3 bg-blue-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-sm text-blue-700 dark:text-orange-300">
                        <strong>Valor Total do Contrato:</strong>{" "}
                        {formatCurrency(
                          Number.parseFloat(formData.monthlyValue) * Number.parseInt(formData.contractDuration),
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-navy-700 dark:text-orange-300">
                    Valor Total (R$)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                    placeholder="0,00"
                    required
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="date" className="text-navy-700 dark:text-orange-300">
                  Data
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
              >
                {editingItem ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Serviços/Produtos */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border-navy-200 dark:border-orange-700">
          <DialogHeader>
            <DialogTitle className="text-navy-900 dark:text-orange-100">
              {editingService ? "Editar" : "Novo"} Serviço/Produto
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-navy-700 dark:text-orange-300">
                  Nome
                </Label>
                <Input
                  id="serviceName"
                  value={serviceFormData.name}
                  onChange={(e) => setServiceFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do serviço/produto"
                  required
                  className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceCategory" className="text-navy-700 dark:text-orange-300">
                  Categoria
                </Label>
                <Select
                  value={serviceFormData.category}
                  onValueChange={(value: "servico" | "infoproduto") =>
                    setServiceFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-navy-200 dark:border-orange-700">
                    <SelectItem value="servico">Serviço</SelectItem>
                    <SelectItem value="infoproduto">Infoproduto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servicePrice" className="text-navy-700 dark:text-orange-300">
                  Preço Padrão (R$) - Opcional
                </Label>
                <Input
                  id="servicePrice"
                  type="number"
                  step="0.01"
                  value={serviceFormData.defaultPrice}
                  onChange={(e) => setServiceFormData((prev) => ({ ...prev, defaultPrice: e.target.value }))}
                  placeholder="0,00"
                  className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
              >
                {editingService ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="servicos">Gerenciar Serviços/Produtos</TabsTrigger>
          </TabsList>

          <TabsContent value="receitas" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar receitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Stats Cards - Cores padronizadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-navy-500 dark:text-orange-400">MRR</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-orange-400">{formatCurrency(mrr)}</div>
                    </div>
                    <Repeat className="w-8 h-8 text-blue-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-navy-500 dark:text-orange-400">ARR</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-orange-400">{formatCurrency(arr)}</div>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-navy-500 dark:text-orange-400">Serviços</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
                        {formatCurrency(totalServicos)}
                      </div>
                    </div>
                    <Settings className="w-8 h-8 text-blue-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-navy-500 dark:text-orange-400">Infoprodutos</div>
                      <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
                        {formatCurrency(totalInfoprodutos)}
                      </div>
                    </div>
                    <Package className="w-8 h-8 text-blue-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-navy-500 dark:text-orange-400">Total</div>
                      <div className="text-xl font-bold text-navy-900 dark:text-orange-100">
                        {formatCurrency(totalReceitas)}
                      </div>
                    </div>
                    <div className="text-sm text-navy-500 dark:text-orange-400">{receitas.length} receitas</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos de Análise */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza - Receitas Recorrentes vs Pontuais */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-navy-900 dark:text-orange-100">
                    Receitas: Recorrentes vs Pontuais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {receitasByType.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={receitasByType}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${((value / totalReceitas) * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {receitasByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS]} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: number) => [formatCurrency(value), "Valor"]}
                            labelFormatter={(label) => `Tipo: ${label}`}
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

              {/* Gráfico de Pizza - Serviços vs Infoprodutos */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-navy-900 dark:text-orange-100">
                    Receitas: Serviços vs Infoprodutos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {receitasByService.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={receitasByService}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${((value / totalReceitas) * 100).toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {receitasByService.map((entry, index) => (
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
            </div>

            {/* Top 5 Serviços/Produtos */}
            {topServices.length > 0 && (
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-navy-900 dark:text-orange-100">
                    Top 5 Serviços/Produtos por Receita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topServices} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} fontSize={12} />
                        <RechartsTooltip
                          formatter={(value: number) => [formatCurrency(value), "Receita Total"]}
                          labelFormatter={(label) => `Serviço: ${label}`}
                        />
                        <Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cards de Indicadores Detalhados - Cores padronizadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card Receitas Recorrentes */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-navy-600 dark:text-orange-400">Receitas Recorrentes</h4>
                    <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-orange-400"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
                      {formatCurrency(receitasRecorrentes.reduce((sum, item) => sum + item.value, 0))}
                    </div>
                    <div className="text-sm text-navy-500 dark:text-orange-400">
                      {totalReceitas > 0
                        ? (
                            (receitasRecorrentes.reduce((sum, item) => sum + item.value, 0) / totalReceitas) *
                            100
                          ).toFixed(1)
                        : 0}
                      % do total
                    </div>
                    <div className="text-xs text-navy-400 dark:text-orange-400">
                      {receitasRecorrentes.length} contratos
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Receitas Pontuais */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-navy-600 dark:text-orange-400">Receitas Pontuais</h4>
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-orange-500"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
                      {formatCurrency(totalPontuais)}
                    </div>
                    <div className="text-sm text-navy-500 dark:text-orange-400">
                      {totalReceitas > 0 ? ((totalPontuais / totalReceitas) * 100).toFixed(1) : 0}% do total
                    </div>
                    <div className="text-xs text-navy-400 dark:text-orange-400">{receitasPontuais.length} vendas</div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Ticket Médio */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-navy-600 dark:text-orange-400">Ticket Médio</h4>
                    <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-orange-400"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-blue-600 dark:text-orange-400">
                      {receitas.length > 0 ? formatCurrency(totalReceitas / receitas.length) : formatCurrency(0)}
                    </div>
                    <div className="text-sm text-navy-500 dark:text-orange-400">Por transação</div>
                    <div className="text-xs text-navy-400 dark:text-orange-400">{receitas.length} transações</div>
                  </div>
                </CardContent>
              </Card>

              {/* Card Crescimento MRR */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-navy-600 dark:text-orange-400">Potencial ARR</h4>
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-orange-500"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-blue-600 dark:text-orange-400">{formatCurrency(arr)}</div>
                    <div className="text-sm text-navy-500 dark:text-orange-400">Baseado no MRR atual</div>
                    <div className="text-xs text-navy-400 dark:text-orange-400">Projeção anual</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Receitas */}
            {receitas.length === 0 ? (
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-blue-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-medium text-navy-900 dark:text-orange-100 mb-2">
                    Nenhuma receita encontrada
                  </h3>
                  <p className="text-navy-500 dark:text-orange-400 mb-4">
                    {searchTerm ? "Tente ajustar sua busca" : "Comece adicionando sua primeira receita"}
                  </p>
                  <Button
                    onClick={openAddDialog}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Receita
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {receitas.map((item) => (
                  <Card
                    key={item.id}
                    className="hover:border-blue-300 dark:hover:border-orange-600 transition-colors border-navy-200/50 dark:border-orange-800/50"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-navy-900 dark:text-orange-100">{item.description}</h3>
                            <div className="flex gap-1">
                              <Badge
                                variant="outline"
                                className={
                                  item.contractType === "recorrente"
                                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-600"
                                    : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-600"
                                }
                              >
                                {item.contractType === "recorrente" ? (
                                  <>
                                    <Repeat className="w-3 h-3 mr-1" />
                                    Recorrente
                                  </>
                                ) : (
                                  "Pontual"
                                )}
                              </Badge>
                              {item.serviceCategory && (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-600"
                                >
                                  {item.serviceCategory === "infoproduto" ? (
                                    <>
                                      <Package className="w-3 h-3 mr-1" />
                                      Infoproduto
                                    </>
                                  ) : (
                                    <>
                                      <Settings className="w-3 h-3 mr-1" />
                                      Serviço
                                    </>
                                  )}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-navy-500 dark:text-orange-400">
                            {new Date(item.date).toLocaleDateString("pt-BR")}
                            {item.contractType === "recorrente" && item.contractDuration && (
                              <span className="ml-2">• {item.contractDuration} meses</span>
                            )}
                          </div>
                          {item.contractType === "recorrente" && item.monthlyValue && (
                            <div className="text-sm text-blue-600 dark:text-orange-400 mt-1">
                              {formatCurrency(item.monthlyValue)}/mês
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-navy-900 dark:text-orange-100">
                              {formatCurrency(item.value)}
                            </div>
                            {item.contractType === "recorrente" && (
                              <div className="text-xs text-navy-500 dark:text-orange-400">Total do contrato</div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                              className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-orange-400 hover:bg-blue-50 dark:hover:bg-orange-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
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
          </TabsContent>

          <TabsContent value="servicos" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-navy-900 dark:text-orange-100">Serviços e Produtos</h2>
                <p className="text-sm text-navy-500 dark:text-orange-400">
                  Gerencie sua lista de serviços e infoprodutos
                </p>
              </div>
              <Button
                onClick={openAddServiceDialog}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço/Produto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Serviços */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-orange-100">
                    <Settings className="w-5 h-5" />
                    Serviços ({servicesProducts.filter((s) => s.category === "servico").length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servicesProducts
                    .filter((s) => s.category === "servico")
                    .map((service) => (
                      <div
                        key={service.id}
                        className={`p-3 border rounded-lg ${service.isActive ? "border-navy-200 dark:border-orange-700" : "border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4
                              className={`font-medium ${service.isActive ? "text-navy-900 dark:text-orange-100" : "text-gray-500"}`}
                            >
                              {service.name}
                            </h4>
                            {service.defaultPrice && (
                              <div className="text-sm text-navy-500 dark:text-orange-400">
                                {formatCurrency(service.defaultPrice)}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleServiceStatus(service.id)}
                              className={`h-8 w-8 ${service.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                            >
                              {service.isActive ? "✓" : "○"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditService(service)}
                              className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-orange-400 hover:bg-blue-50 dark:hover:bg-orange-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteService(service.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* Infoprodutos */}
              <Card className="border-navy-200/50 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-navy-900 dark:text-orange-100">
                    <Package className="w-5 h-5" />
                    Infoprodutos ({servicesProducts.filter((s) => s.category === "infoproduto").length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servicesProducts
                    .filter((s) => s.category === "infoproduto")
                    .map((product) => (
                      <div
                        key={product.id}
                        className={`p-3 border rounded-lg ${product.isActive ? "border-navy-200 dark:border-orange-700" : "border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4
                              className={`font-medium ${product.isActive ? "text-navy-900 dark:text-orange-100" : "text-gray-500"}`}
                            >
                              {product.name}
                            </h4>
                            {product.defaultPrice && (
                              <div className="text-sm text-navy-500 dark:text-orange-400">
                                {formatCurrency(product.defaultPrice)}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleServiceStatus(product.id)}
                              className={`h-8 w-8 ${product.isActive ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                            >
                              {product.isActive ? "✓" : "○"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditService(product)}
                              className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-orange-400 hover:bg-blue-50 dark:hover:bg-orange-900/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteService(product.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

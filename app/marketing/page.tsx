"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Target, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Campaign {
  id: string
  name: string
  type: "google-ads" | "facebook-ads" | "linkedin-ads" | "seo" | "email" | "outros"
  budget: number
  spent: number
  leads: number
  conversions: number
  startDate: string
  status: "ativa" | "pausada" | "finalizada"
}

interface MarketingMetrics {
  cac: number
  ltv: number
  roas: number
  conversionRate: number
  leadsCost: number
  customerRetention: number
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [metrics, setMetrics] = useState<MarketingMetrics>({
    cac: 1200,
    ltv: 8500,
    roas: 4.2,
    conversionRate: 3.8,
    leadsCost: 85,
    customerRetention: 87,
  })

  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)
  const [isMetricsDialogOpen, setIsMetricsDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    type: "",
    budget: "",
    spent: "",
    leads: "",
    conversions: "",
    startDate: new Date().toISOString().split("T")[0],
    status: "ativa",
  })

  const [metricsFormData, setMetricsFormData] = useState({
    cac: "",
    ltv: "",
    roas: "",
    conversionRate: "",
    leadsCost: "",
    customerRetention: "",
  })

  useEffect(() => {
    // Carregar campanhas
    const savedCampaigns = localStorage.getItem("marketingCampaigns")
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    } else {
      const initialCampaigns: Campaign[] = [
        {
          id: "1",
          name: "Google Ads - Performance",
          type: "google-ads",
          budget: 15000,
          spent: 12800,
          leads: 156,
          conversions: 12,
          startDate: "2024-05-01",
          status: "ativa",
        },
        {
          id: "2",
          name: "Facebook Ads - Awareness",
          type: "facebook-ads",
          budget: 8000,
          spent: 7200,
          leads: 89,
          conversions: 7,
          startDate: "2024-05-01",
          status: "ativa",
        },
        {
          id: "3",
          name: "LinkedIn Ads - B2B",
          type: "linkedin-ads",
          budget: 5000,
          spent: 4500,
          leads: 34,
          conversions: 8,
          startDate: "2024-05-01",
          status: "ativa",
        },
      ]
      setCampaigns(initialCampaigns)
      localStorage.setItem("marketingCampaigns", JSON.stringify(initialCampaigns))
    }

    // Carregar métricas
    const savedMetrics = localStorage.getItem("marketingMetrics")
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics))
    }
  }, [])

  const filteredCampaigns = campaigns
    .filter((campaign) => selectedType === "all" || campaign.type === selectedType)
    .filter((campaign) => campaign.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const activeCampaigns = campaigns.filter((c) => c.status === "ativa")
  const totalBudget = activeCampaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = activeCampaigns.reduce((sum, c) => sum + c.spent, 0)
  const totalLeads = activeCampaigns.reduce((sum, c) => sum + c.leads, 0)
  const totalConversions = activeCampaigns.reduce((sum, c) => sum + c.conversions, 0)

  // Calcular métricas automaticamente
  const calculatedROAS = totalSpent > 0 ? (totalConversions * metrics.ltv) / totalSpent : 0
  const calculatedCAC = totalConversions > 0 ? totalSpent / totalConversions : 0
  const calculatedConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0
  const calculatedLeadCost = totalLeads > 0 ? totalSpent / totalLeads : 0

  const saveCampaigns = (newData: Campaign[]) => {
    setCampaigns(newData)
    localStorage.setItem("marketingCampaigns", JSON.stringify(newData))
  }

  const saveMetrics = (newData: MarketingMetrics) => {
    setMetrics(newData)
    localStorage.setItem("marketingMetrics", JSON.stringify(newData))
  }

  const handleCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newCampaign: Campaign = {
      id: editingCampaign?.id || Date.now().toString(),
      name: campaignFormData.name,
      type: campaignFormData.type as Campaign["type"],
      budget: Number.parseFloat(campaignFormData.budget),
      spent: Number.parseFloat(campaignFormData.spent),
      leads: Number.parseInt(campaignFormData.leads),
      conversions: Number.parseInt(campaignFormData.conversions),
      startDate: campaignFormData.startDate,
      status: campaignFormData.status as Campaign["status"],
    }

    let newData: Campaign[]
    if (editingCampaign) {
      newData = campaigns.map((campaign) => (campaign.id === editingCampaign.id ? newCampaign : campaign))
    } else {
      newData = [...campaigns, newCampaign]
    }

    saveCampaigns(newData)
    setCampaignFormData({
      name: "",
      type: "",
      budget: "",
      spent: "",
      leads: "",
      conversions: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "ativa",
    })
    setEditingCampaign(null)
    setIsCampaignDialogOpen(false)
  }

  const handleMetricsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMetrics: MarketingMetrics = {
      cac: Number.parseFloat(metricsFormData.cac) || metrics.cac,
      ltv: Number.parseFloat(metricsFormData.ltv) || metrics.ltv,
      roas: Number.parseFloat(metricsFormData.roas) || metrics.roas,
      conversionRate: Number.parseFloat(metricsFormData.conversionRate) || metrics.conversionRate,
      leadsCost: Number.parseFloat(metricsFormData.leadsCost) || metrics.leadsCost,
      customerRetention: Number.parseFloat(metricsFormData.customerRetention) || metrics.customerRetention,
    }

    saveMetrics(newMetrics)
    setIsMetricsDialogOpen(false)
  }

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setCampaignFormData({
      name: campaign.name,
      type: campaign.type,
      budget: campaign.budget.toString(),
      spent: campaign.spent.toString(),
      leads: campaign.leads.toString(),
      conversions: campaign.conversions.toString(),
      startDate: campaign.startDate,
      status: campaign.status,
    })
    setIsCampaignDialogOpen(true)
  }

  const handleDeleteCampaign = (id: string) => {
    const campaign = campaigns.find((c) => c.id === id)
    if (campaign && confirm(`Tem certeza que deseja excluir a campanha "${campaign.name}"?`)) {
      const newData = campaigns.filter((c) => c.id !== id)
      saveCampaigns(newData)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      "google-ads": "Google Ads",
      "facebook-ads": "Facebook Ads",
      "linkedin-ads": "LinkedIn Ads",
      seo: "SEO",
      email: "Email Marketing",
      outros: "Outros",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "google-ads": "bg-blue-50 text-blue-700 hover:bg-blue-100",
      "facebook-ads": "bg-purple-50 text-purple-700 hover:bg-purple-100",
      "linkedin-ads": "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
      seo: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
      email: "bg-amber-50 text-amber-700 hover:bg-amber-100",
      outros: "bg-gray-50 text-gray-700 hover:bg-gray-100",
    }
    return colors[type as keyof typeof colors] || "bg-gray-50 text-gray-700 hover:bg-gray-100"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa":
        return "bg-green-50 text-green-700 hover:bg-green-100"
      case "pausada":
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
      case "finalizada":
        return "bg-gray-50 text-gray-700 hover:bg-gray-100"
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-100"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativa":
        return "Ativa"
      case "pausada":
        return "Pausada"
      case "finalizada":
        return "Finalizada"
      default:
        return status
    }
  }

  const openCampaignDialog = () => {
    setEditingCampaign(null)
    setCampaignFormData({
      name: "",
      type: "",
      budget: "",
      spent: "",
      leads: "",
      conversions: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "ativa",
    })
    setIsCampaignDialogOpen(true)
  }

  const openMetricsDialog = () => {
    setMetricsFormData({
      cac: metrics.cac.toString(),
      ltv: metrics.ltv.toString(),
      roas: metrics.roas.toString(),
      conversionRate: metrics.conversionRate.toString(),
      leadsCost: metrics.leadsCost.toString(),
      customerRetention: metrics.customerRetention.toString(),
    })
    setIsMetricsDialogOpen(true)
  }

  return (
    <SidebarInset>
      {/* Header Padronizado */}
      <header className="flex h-16 items-center gap-4 border-b border-navy-200/50 dark:border-orange-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-navy-900 dark:text-orange-100">Marketing</h1>
          <p className="text-sm text-navy-500 dark:text-orange-400">Métricas e campanhas de marketing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-navy-500 dark:text-orange-400">Gasto Total</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-orange-400">{formatCurrency(totalSpent)}</div>
          </div>
          <Button
            onClick={openMetricsDialog}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20 dark:hover:border-orange-500"
          >
            <Edit className="w-4 h-4 mr-2" />
            Métricas
          </Button>
          <Button
            onClick={openCampaignDialog}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>
      </header>

      {/* Campaign Modal */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border-navy-200 dark:border-orange-700">
          <DialogHeader>
            <DialogTitle className="text-navy-900 dark:text-orange-100">
              {editingCampaign ? "Editar Campanha" : "Nova Campanha"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCampaignSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-navy-700 dark:text-orange-300">
                  Nome da Campanha
                </Label>
                <Input
                  id="name"
                  value={campaignFormData.name}
                  onChange={(e) => setCampaignFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Google Ads - Performance"
                  required
                  className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-navy-700 dark:text-orange-300">
                    Tipo
                  </Label>
                  <Select
                    value={campaignFormData.type}
                    onValueChange={(value) => setCampaignFormData((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-navy-200 dark:border-orange-700">
                      <SelectItem value="google-ads">Google Ads</SelectItem>
                      <SelectItem value="facebook-ads">Facebook Ads</SelectItem>
                      <SelectItem value="linkedin-ads">LinkedIn Ads</SelectItem>
                      <SelectItem value="seo">SEO</SelectItem>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-navy-700 dark:text-orange-300">
                    Status
                  </Label>
                  <Select
                    value={campaignFormData.status}
                    onValueChange={(value) => setCampaignFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-navy-200 dark:border-orange-700">
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="pausada">Pausada</SelectItem>
                      <SelectItem value="finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-navy-700 dark:text-orange-300">
                    Orçamento (R$)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    value={campaignFormData.budget}
                    onChange={(e) => setCampaignFormData((prev) => ({ ...prev, budget: e.target.value }))}
                    placeholder="0,00"
                    required
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spent" className="text-navy-700 dark:text-orange-300">
                    Gasto (R$)
                  </Label>
                  <Input
                    id="spent"
                    type="number"
                    step="0.01"
                    value={campaignFormData.spent}
                    onChange={(e) => setCampaignFormData((prev) => ({ ...prev, spent: e.target.value }))}
                    placeholder="0,00"
                    required
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leads" className="text-navy-700 dark:text-orange-300">
                    Leads
                  </Label>
                  <Input
                    id="leads"
                    type="number"
                    value={campaignFormData.leads}
                    onChange={(e) => setCampaignFormData((prev) => ({ ...prev, leads: e.target.value }))}
                    placeholder="0"
                    required
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversions" className="text-navy-700 dark:text-orange-300">
                    Conversões
                  </Label>
                  <Input
                    id="conversions"
                    type="number"
                    value={campaignFormData.conversions}
                    onChange={(e) => setCampaignFormData((prev) => ({ ...prev, conversions: e.target.value }))}
                    placeholder="0"
                    required
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-navy-700 dark:text-orange-300">
                  Data de Início
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={campaignFormData.startDate}
                  onChange={(e) => setCampaignFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  required
                  className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
              >
                {editingCampaign ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Metrics Modal */}
      <Dialog open={isMetricsDialogOpen} onOpenChange={setIsMetricsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-black border-navy-200 dark:border-orange-700">
          <DialogHeader>
            <DialogTitle className="text-navy-900 dark:text-orange-100">Editar Métricas de Marketing</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleMetricsSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cac" className="text-navy-700 dark:text-orange-300">
                    CAC (R$)
                  </Label>
                  <Input
                    id="cac"
                    type="number"
                    step="0.01"
                    value={metricsFormData.cac}
                    onChange={(e) => setMetricsFormData((prev) => ({ ...prev, cac: e.target.value }))}
                    placeholder="1200.00"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ltv" className="text-navy-700 dark:text-orange-300">
                    LTV (R$)
                  </Label>
                  <Input
                    id="ltv"
                    type="number"
                    step="0.01"
                    value={metricsFormData.ltv}
                    onChange={(e) => setMetricsFormData((prev) => ({ ...prev, ltv: e.target.value }))}
                    placeholder="8500.00"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roas" className="text-navy-700 dark:text-orange-300">
                    ROAS
                  </Label>
                  <Input
                    id="roas"
                    type="number"
                    step="0.1"
                    value={metricsFormData.roas}
                    onChange={(e) => setMetricsFormData((prev) => ({ ...prev, roas: e.target.value }))}
                    placeholder="4.2"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversionRate" className="text-navy-700 dark:text-orange-300">
                    Taxa de Conversão (%)
                  </Label>
                  <Input
                    id="conversionRate"
                    type="number"
                    step="0.1"
                    value={metricsFormData.conversionRate}
                    onChange={(e) => setMetricsFormData((prev) => ({ ...prev, conversionRate: e.target.value }))}
                    placeholder="3.8"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leadsCost" className="text-navy-700 dark:text-orange-300">
                    Custo por Lead (R$)
                  </Label>
                  <Input
                    id="leadsCost"
                    type="number"
                    step="0.01"
                    value={metricsFormData.leadsCost}
                    onChange={(e) => setMetricsFormData((prev) => ({ ...prev, leadsCost: e.target.value }))}
                    placeholder="85.00"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerRetention" className="text-navy-700 dark:text-orange-300">
                    Retenção (%)
                  </Label>
                  <Input
                    id="customerRetention"
                    type="number"
                    step="0.1"
                    value={metricsFormData.customerRetention}
                    onChange={(e) => setMetricsFormData((prev) => ({ ...prev, customerRetention: e.target.value }))}
                    placeholder="87.0"
                    className="border-navy-300 dark:border-orange-600 dark:bg-gray-800 dark:text-orange-100"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsMetricsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black border border-blue-700 dark:border-orange-600"
              >
                Atualizar Métricas
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-navy-200/50 dark:border-orange-800/50 bg-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-navy-500 dark:text-orange-400 mb-1">CAC</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">
                    {formatCurrency(calculatedCAC || metrics.cac)}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy-200/50 dark:border-orange-800/50 bg-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-navy-500 dark:text-orange-400 mb-1">ROAS</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">
                    {(calculatedROAS || metrics.roas).toFixed(1)}x
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy-200/50 dark:border-orange-800/50 bg-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-navy-500 dark:text-orange-400 mb-1">Taxa Conversão</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">
                    {(calculatedConversionRate || metrics.conversionRate).toFixed(1)}%
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-navy-200/50 dark:border-orange-800/50 bg-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-navy-500 dark:text-orange-400 mb-1">Custo por Lead</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">
                    {formatCurrency(calculatedLeadCost || metrics.leadsCost)}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="google-ads">Google Ads</SelectItem>
              <SelectItem value="facebook-ads">Facebook Ads</SelectItem>
              <SelectItem value="linkedin-ads">LinkedIn Ads</SelectItem>
              <SelectItem value="seo">SEO</SelectItem>
              <SelectItem value="email">Email Marketing</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campanhas Lista */}
        {filteredCampaigns.length === 0 ? (
          <Card className="border-navy-200/50 dark:border-orange-800/50 bg-white dark:bg-gray-900">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-blue-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-medium text-navy-900 dark:text-orange-100 mb-2">
                Nenhuma campanha encontrada
              </h3>
              <p className="text-navy-500 dark:text-orange-400 mb-4">
                {searchTerm || selectedType !== "all"
                  ? "Tente ajustar seus filtros"
                  : "Comece adicionando sua primeira campanha"}
              </p>
              <Button
                onClick={openCampaignDialog}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white dark:text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Campanha
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredCampaigns.map((campaign) => {
              const roas = campaign.spent > 0 ? (campaign.conversions * metrics.ltv) / campaign.spent : 0
              const conversionRate = campaign.leads > 0 ? (campaign.conversions / campaign.leads) * 100 : 0
              const utilizacao = campaign.budget > 0 ? (campaign.spent / campaign.budget) * 100 : 0

              return (
                <Card
                  key={campaign.id}
                  className="hover:border-blue-300 dark:hover:border-orange-600 transition-colors border-navy-200/50 dark:border-orange-800/50 bg-white dark:bg-gray-900"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-navy-900 dark:text-orange-100">{campaign.name}</h3>
                          <Badge className={`${getTypeColor(campaign.type)} border-0`}>
                            {getTypeLabel(campaign.type)}
                          </Badge>
                          <Badge className={`${getStatusColor(campaign.status)} border-0`}>
                            {getStatusLabel(campaign.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-navy-500 dark:text-orange-400">
                          Desde {new Date(campaign.startDate).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCampaign(campaign)}
                          className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-orange-400 hover:bg-blue-50 dark:hover:bg-orange-900/20"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <span className="text-navy-500 dark:text-orange-400">Orçamento</span>
                        <div className="font-medium text-navy-900 dark:text-orange-100">
                          {formatCurrency(campaign.budget)}
                        </div>
                      </div>
                      <div>
                        <span className="text-navy-500 dark:text-orange-400">Gasto</span>
                        <div className="font-medium text-navy-900 dark:text-orange-100">
                          {formatCurrency(campaign.spent)}
                        </div>
                      </div>
                      <div>
                        <span className="text-navy-500 dark:text-orange-400">Leads</span>
                        <div className="font-medium text-navy-900 dark:text-orange-100">{campaign.leads}</div>
                      </div>
                      <div>
                        <span className="text-navy-500 dark:text-orange-400">Conversões</span>
                        <div className="font-medium text-navy-900 dark:text-orange-100">{campaign.conversions}</div>
                      </div>
                      <div>
                        <span className="text-navy-500 dark:text-orange-400">ROAS</span>
                        <div className="font-medium text-navy-900 dark:text-orange-100">{roas.toFixed(1)}x</div>
                      </div>
                      <div>
                        <span className="text-navy-500 dark:text-orange-400">Taxa Conv.</span>
                        <div className="font-medium text-navy-900 dark:text-orange-100">
                          {conversionRate.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-navy-500 dark:text-orange-400 mb-1">
                        <span>Utilização do orçamento</span>
                        <span>{utilizacao.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-orange-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(utilizacao, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </SidebarInset>
  )
}

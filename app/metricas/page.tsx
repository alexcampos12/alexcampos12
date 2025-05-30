"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Target, TrendingUp, DollarSign, Users, Calculator, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

interface FinancialData {
  id: string
  category: "receita" | "custo-fixo" | "custo-variavel" | "salarios" | "prolabore" | "impostos"
  description: string
  value: number
  date: string
}

interface MetricData {
  cac: number
  ltv: number
  ticketMedio: number
  churnRate: number
  tempoVidaCliente: number
}

export default function MetricasPage() {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [metrics, setMetrics] = useState<MetricData>({
    cac: 250,
    ltv: 3500,
    ticketMedio: 2500,
    churnRate: 5,
    tempoVidaCliente: 24,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    cac: "",
    ltv: "",
    ticketMedio: "",
    churnRate: "",
    tempoVidaCliente: "",
  })

  useEffect(() => {
    const savedData = localStorage.getItem("financialData")
    if (savedData) {
      setFinancialData(JSON.parse(savedData))
    }

    const savedMetrics = localStorage.getItem("metrics")
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics))
    }
  }, [])

  // Cálculos automáticos
  const receita = financialData.filter((item) => item.category === "receita").reduce((sum, item) => sum + item.value, 0)
  const custoVariavel = financialData
    .filter((item) => item.category === "custo-variavel")
    .reduce((sum, item) => sum + item.value, 0)

  const margemContribuicao = receita > 0 ? ((receita - custoVariavel) / receita) * 100 : 0
  const ltvcac = metrics.ltv / metrics.cac
  const paybackCAC = metrics.cac / (metrics.ticketMedio * (margemContribuicao / 100))
  const clientesAtivos = receita > 0 ? Math.round(receita / metrics.ticketMedio) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMetrics: MetricData = {
      cac: Number.parseFloat(formData.cac) || metrics.cac,
      ltv: Number.parseFloat(formData.ltv) || metrics.ltv,
      ticketMedio: Number.parseFloat(formData.ticketMedio) || metrics.ticketMedio,
      churnRate: Number.parseFloat(formData.churnRate) || metrics.churnRate,
      tempoVidaCliente: Number.parseFloat(formData.tempoVidaCliente) || metrics.tempoVidaCliente,
    }

    setMetrics(newMetrics)
    localStorage.setItem("metrics", JSON.stringify(newMetrics))
    setIsDialogOpen(false)
  }

  const openEditDialog = () => {
    setFormData({
      cac: metrics.cac.toString(),
      ltv: metrics.ltv.toString(),
      ticketMedio: metrics.ticketMedio.toString(),
      churnRate: metrics.churnRate.toString(),
      tempoVidaCliente: metrics.tempoVidaCliente.toString(),
    })
    setIsDialogOpen(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusColor = (metric: string, value: number) => {
    switch (metric) {
      case "ltvcac":
        return value >= 3 ? "text-green-600" : value >= 2 ? "text-yellow-600" : "text-red-600"
      case "payback":
        return value <= 12 ? "text-green-600" : value <= 18 ? "text-yellow-600" : "text-red-600"
      case "churn":
        return value <= 5 ? "text-green-600" : value <= 10 ? "text-yellow-600" : "text-red-600"
      case "margem":
        return value >= 70 ? "text-green-600" : value >= 50 ? "text-yellow-600" : "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-lg font-semibold">Métricas de Negócio</h1>
          <p className="text-sm text-muted-foreground">Indicadores estratégicos e KPIs</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openEditDialog}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Métricas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Métricas</DialogTitle>
              <DialogDescription>Atualize os valores das principais métricas de negócio.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cac">CAC - Customer Acquisition Cost (R$)</Label>
                <Input
                  id="cac"
                  type="number"
                  step="0.01"
                  value={formData.cac}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cac: e.target.value }))}
                  placeholder="250.00"
                />
              </div>
              <div>
                <Label htmlFor="ltv">LTV - Lifetime Value (R$)</Label>
                <Input
                  id="ltv"
                  type="number"
                  step="0.01"
                  value={formData.ltv}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ltv: e.target.value }))}
                  placeholder="3500.00"
                />
              </div>
              <div>
                <Label htmlFor="ticketMedio">Ticket Médio (R$)</Label>
                <Input
                  id="ticketMedio"
                  type="number"
                  step="0.01"
                  value={formData.ticketMedio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ticketMedio: e.target.value }))}
                  placeholder="2500.00"
                />
              </div>
              <div>
                <Label htmlFor="churnRate">Taxa de Churn (%)</Label>
                <Input
                  id="churnRate"
                  type="number"
                  step="0.1"
                  value={formData.churnRate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, churnRate: e.target.value }))}
                  placeholder="5.0"
                />
              </div>
              <div>
                <Label htmlFor="tempoVidaCliente">Tempo de Vida do Cliente (meses)</Label>
                <Input
                  id="tempoVidaCliente"
                  type="number"
                  value={formData.tempoVidaCliente}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tempoVidaCliente: e.target.value }))}
                  placeholder="24"
                />
              </div>
              <Button type="submit" className="w-full">
                Atualizar Métricas
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CAC</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(metrics.cac)}</div>
              <p className="text-xs text-muted-foreground">Customer Acquisition Cost</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.ltv)}</div>
              <p className="text-xs text-muted-foreground">Lifetime Value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LTV/CAC</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor("ltvcac", ltvcac)}`}>{ltvcac.toFixed(1)}x</div>
              <p className="text-xs text-muted-foreground">Meta: ≥ 3x</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(metrics.ticketMedio)}</div>
              <p className="text-xs text-muted-foreground">Valor médio por cliente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payback CAC</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor("payback", paybackCAC)}`}>
                {paybackCAC.toFixed(1)} meses
              </div>
              <p className="text-xs text-muted-foreground">Meta: ≤ 12 meses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Churn</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor("churn", metrics.churnRate)}`}>
                {metrics.churnRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Meta: ≤ 5%</p>
            </CardContent>
          </Card>
        </div>

        {/* Análises Detalhadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Rentabilidade</CardTitle>
              <CardDescription>Indicadores de saúde financeira</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Margem de Contribuição</span>
                <Badge
                  variant={
                    margemContribuicao >= 70 ? "default" : margemContribuicao >= 50 ? "secondary" : "destructive"
                  }
                >
                  {margemContribuicao.toFixed(1)}%
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Relação LTV/CAC</span>
                <Badge variant={ltvcac >= 3 ? "default" : ltvcac >= 2 ? "secondary" : "destructive"}>
                  {ltvcac.toFixed(1)}x
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Payback do CAC</span>
                <Badge variant={paybackCAC <= 12 ? "default" : paybackCAC <= 18 ? "secondary" : "destructive"}>
                  {paybackCAC.toFixed(1)} meses
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métricas Operacionais</CardTitle>
              <CardDescription>Indicadores de operação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Clientes Ativos</span>
                <span className="text-lg font-bold">{clientesAtivos}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tempo de Vida do Cliente</span>
                <span className="text-lg font-bold">{metrics.tempoVidaCliente} meses</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Receita por Cliente</span>
                <span className="text-lg font-bold">{formatCurrency(receita / Math.max(clientesAtivos, 1))}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recomendações */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendações Estratégicas</CardTitle>
            <CardDescription>Baseado nos indicadores atuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ltvcac < 3 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Atenção:</strong> LTV/CAC abaixo de 3x. Considere otimizar aquisição ou aumentar retenção.
                  </p>
                </div>
              )}

              {paybackCAC > 12 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Crítico:</strong> Payback do CAC muito alto. Revise estratégia de aquisição.
                  </p>
                </div>
              )}

              {metrics.churnRate > 5 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Alerta:</strong> Taxa de churn elevada. Foque em retenção de clientes.
                  </p>
                </div>
              )}

              {margemContribuicao < 50 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Urgente:</strong> Margem de contribuição baixa. Revise precificação e custos variáveis.
                  </p>
                </div>
              )}

              {ltvcac >= 3 && paybackCAC <= 12 && metrics.churnRate <= 5 && margemContribuicao >= 70 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Excelente:</strong> Todos os indicadores estão saudáveis. Continue monitorando e otimizando.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

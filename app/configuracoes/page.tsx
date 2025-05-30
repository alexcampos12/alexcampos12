"use client"

import type React from "react"

import { useState } from "react"
import { Save, User, Bell, Shield, Palette, Database, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"

export default function ConfiguracoesPage() {
  const { theme, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    companyName: "Five Performance Digital",
    email: "admin@fiveperformance.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    currency: "BRL",
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    notifications: {
      email: true,
      push: true,
      reports: true,
      alerts: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
    },
    backup: {
      autoBackup: true,
      frequency: "daily",
      retention: "30",
    },
  })

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    alert("Configurações salvas com sucesso!")
  }

  const handleExportData = () => {
    const data = {
      financialData: localStorage.getItem("financialData"),
      employees: localStorage.getItem("employees"),
      settings: localStorage.getItem("appSettings"),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "five-performance-backup.json"
    a.click()
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (data.financialData) localStorage.setItem("financialData", data.financialData)
          if (data.employees) localStorage.setItem("employees", data.employees)
          if (data.settings) localStorage.setItem("appSettings", data.settings)
          alert("Dados importados com sucesso!")
          window.location.reload()
        } catch (error) {
          alert("Erro ao importar dados. Verifique o arquivo.")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie as configurações do sistema</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </Button>
      </header>

      <div className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
        {/* Informações da Empresa */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Informações da Empresa
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Dados básicos da organização
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300">
                  Nome da Empresa
                </Label>
                <Input
                  id="companyName"
                  value={settings.companyName}
                  onChange={(e) => setSettings((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email Principal
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                  Endereço
                </Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferências do Sistema */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preferências do Sistema
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Configurações de aparência e localização
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">
                  Moeda
                </Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">
                  Idioma
                </Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    <SelectItem value="pt-BR">Português (BR)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español (ES)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone" className="text-gray-700 dark:text-gray-300">
                  Fuso Horário
                </Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Tema Escuro</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Alternar entre tema claro e escuro</div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Notificações</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Configure como receber alertas e notificações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Notificações por Email</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receber notificações via email</div>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Notificações Push</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Receber notificações no navegador</div>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Relatórios Automáticos</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Envio automático de relatórios</div>
                </div>
                <Switch
                  checked={settings.notifications.reports}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, reports: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Alertas de Sistema</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Alertas importantes do sistema</div>
                </div>
                <Switch
                  checked={settings.notifications.alerts}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, alerts: checked },
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Segurança</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Configurações de segurança e acesso
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Autenticação de Dois Fatores</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Adicionar camada extra de segurança</div>
              </div>
              <Switch
                checked={settings.security.twoFactor}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: { ...prev.security, twoFactor: checked },
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionTimeout" className="text-gray-700 dark:text-gray-300">
                  Timeout da Sessão (minutos)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: e.target.value },
                    }))
                  }
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="passwordExpiry" className="text-gray-700 dark:text-gray-300">
                  Expiração da Senha (dias)
                </Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      security: { ...prev.security, passwordExpiry: e.target.value },
                    }))
                  }
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backup e Dados */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Backup e Dados</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Gerenciamento de backup e exportação de dados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Backup Automático</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Backup automático dos dados</div>
              </div>
              <Switch
                checked={settings.backup.autoBackup}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    backup: { ...prev.backup, autoBackup: checked },
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency" className="text-gray-700 dark:text-gray-300">
                  Frequência do Backup
                </Label>
                <Select
                  value={settings.backup.frequency}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      backup: { ...prev.backup, frequency: value },
                    }))
                  }
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="retention" className="text-gray-700 dark:text-gray-300">
                  Retenção (dias)
                </Label>
                <Input
                  id="retention"
                  type="number"
                  value={settings.backup.retention}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      backup: { ...prev.backup, retention: e.target.value },
                    }))
                  }
                  className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
              <div>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
                <Button
                  onClick={() => document.getElementById("import-file")?.click()}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Dados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}

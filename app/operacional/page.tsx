"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"

// Tipos
type ProjectStatus = "em-andamento" | "concluido" | "planejamento" | "atrasado"
type TeamMember = { id: string; name: string; role: string; efficiency: number; projects: number; hours: number }

interface Project {
  id: string
  name: string
  client: string
  status: ProjectStatus
  progress: number
  deadline: string
  team: string[]
  budget: number
  spent: number
  description?: string
}

export default function OperacionalPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-05")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "todos">("todos")
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    client: "",
    status: "planejamento",
    progress: 0,
    deadline: "",
    team: [],
    budget: 0,
    spent: 0,
    description: "",
  })

  // Estado para projetos
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website E-commerce Cliente A",
      client: "Cliente A",
      status: "em-andamento",
      progress: 75,
      deadline: "2024-06-15",
      team: ["João", "Maria", "Pedro"],
      budget: 45000,
      spent: 33750,
      description: "Desenvolvimento de plataforma e-commerce completa com integração de pagamentos e logística.",
    },
    {
      id: "2",
      name: "App Mobile Cliente B",
      client: "Cliente B",
      status: "em-andamento",
      progress: 45,
      deadline: "2024-07-20",
      team: ["Ana", "Carlos"],
      budget: 65000,
      spent: 29250,
      description: "Aplicativo mobile para iOS e Android com funcionalidades de geolocalização e notificações.",
    },
    {
      id: "3",
      name: "Campanha Digital Cliente C",
      client: "Cliente C",
      status: "concluido",
      progress: 100,
      deadline: "2024-05-30",
      team: ["Lucia", "Roberto"],
      budget: 25000,
      spent: 24500,
      description: "Campanha de marketing digital com foco em conversão e aquisição de novos clientes.",
    },
    {
      id: "4",
      name: "Sistema CRM Cliente D",
      client: "Cliente D",
      status: "planejamento",
      progress: 15,
      deadline: "2024-08-10",
      team: ["João", "Ana", "Carlos"],
      budget: 85000,
      spent: 12750,
      description: "Implementação de sistema CRM personalizado com integração aos sistemas existentes.",
    },
  ])

  // Estado para membros da equipe
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "João Silva", role: "Desenvolvedor", efficiency: 92, projects: 4, hours: 160 },
    { id: "2", name: "Maria Santos", role: "Designer", efficiency: 88, projects: 3, hours: 145 },
    { id: "3", name: "Pedro Costa", role: "Marketing", efficiency: 85, projects: 5, hours: 155 },
    { id: "4", name: "Ana Oliveira", role: "Desenvolvedora", efficiency: 90, projects: 3, hours: 150 },
    { id: "5", name: "Carlos Lima", role: "Analista", efficiency: 87, projects: 4, hours: 148 },
  ])

  // Métricas operacionais
  const operationalMetrics = {
    projectsActive: projects.filter((p) => p.status === "em-andamento").length,
    projectsCompleted: projects.filter((p) => p.status === "concluido").length,
    clientSatisfaction: 94,
    teamProductivity: 87,
    averageDeliveryTime: 12,
    billableHours: 1240,
    utilization: 78,
    qualityScore: 92,
  }

  // Funções auxiliares
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "concluido":
        return "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
      case "em-andamento":
        return "border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-400"
      case "planejamento":
        return "border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-400"
      case "atrasado":
        return "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400"
      default:
        return "border-gray-200 text-gray-700 dark:border-gray-600 dark:text-gray-400"
    }
  }

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case "concluido":
        return "Concluído"
      case "em-andamento":
        return "Em Andamento"
      case "planejamento":
        return "Planejamento"
      case "atrasado":
        return "Atrasado"
      default:
        return status
    }
  }

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case "concluido":
        return <CheckCircle className="w-4 h-4" />
      case "em-andamento":
        return <Clock className="w-4 h-4" />
      case "planejamento":
        return <Calendar className="w-4 h-4" />
      case "atrasado":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Funções CRUD
  const handleAddProject = () => {
    if (!newProject.name || !newProject.client || !newProject.deadline) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    const projectToAdd: Project = {
      id: `${projects.length + 1}`,
      name: newProject.name || "",
      client: newProject.client || "",
      status: (newProject.status as ProjectStatus) || "planejamento",
      progress: newProject.progress || 0,
      deadline: newProject.deadline || "",
      team: newProject.team || [],
      budget: newProject.budget || 0,
      spent: newProject.spent || 0,
      description: newProject.description || "",
    }

    setProjects([...projects, projectToAdd])
    setIsAddProjectOpen(false)
    setNewProject({
      name: "",
      client: "",
      status: "planejamento",
      progress: 0,
      deadline: "",
      team: [],
      budget: 0,
      spent: 0,
      description: "",
    })

    toast({
      title: "Projeto adicionado",
      description: "O projeto foi adicionado com sucesso.",
    })
  }

  const handleEditProject = () => {
    if (!currentProject) return

    const updatedProjects = projects.map((project) => (project.id === currentProject.id ? currentProject : project))

    setProjects(updatedProjects)
    setIsEditProjectOpen(false)
    setCurrentProject(null)

    toast({
      title: "Projeto atualizado",
      description: "As alterações foram salvas com sucesso.",
    })
  }

  const handleDeleteProject = () => {
    if (!currentProject) return

    const updatedProjects = projects.filter((project) => project.id !== currentProject.id)
    setProjects(updatedProjects)
    setIsDeleteConfirmOpen(false)
    setCurrentProject(null)

    toast({
      title: "Projeto excluído",
      description: "O projeto foi excluído com sucesso.",
    })
  }

  const openEditModal = (project: Project) => {
    setCurrentProject({ ...project })
    setIsEditProjectOpen(true)
  }

  const openDeleteConfirm = (project: Project) => {
    setCurrentProject(project)
    setIsDeleteConfirmOpen(true)
  }

  // Filtrar projetos
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "todos" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Operacional</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gestão de projetos e performance da equipe</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectItem value="2024-05">Maio 2024</SelectItem>
              <SelectItem value="2024-04">Abril 2024</SelectItem>
              <SelectItem value="2024-03">Março 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400">
            Exportar Relatório
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
        {/* Métricas Operacionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Projetos Ativos
                </CardTitle>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {operationalMetrics.projectsActive}
              </div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                +3 vs anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Satisfação Cliente
                </CardTitle>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {operationalMetrics.clientSatisfaction}%
              </div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2% vs anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Produtividade
                </CardTitle>
                <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {operationalMetrics.teamProductivity}%
              </div>
              <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% vs anterior
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Tempo Médio Entrega
                </CardTitle>
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {operationalMetrics.averageDeliveryTime} dias
              </div>
              <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                <TrendingDown className="w-3 h-3 mr-1" />
                -2 dias vs anterior
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projetos em Andamento - Com Funcionalidades CRUD */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Projetos</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Status e progresso dos projetos ativos
              </CardDescription>
            </div>
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Projeto</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo projeto. Campos com * são obrigatórios.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Projeto *</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="Nome do projeto"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client">Cliente *</Label>
                      <Input
                        id="client"
                        value={newProject.client}
                        onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                        placeholder="Nome do cliente"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newProject.status as string}
                        onValueChange={(value) => setNewProject({ ...newProject, status: value as ProjectStatus })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planejamento">Planejamento</SelectItem>
                          <SelectItem value="em-andamento">Em Andamento</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Prazo *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Orçamento (R$)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newProject.budget || ""}
                        onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="progress">Progresso (%)</Label>
                      <Input
                        id="progress"
                        type="number"
                        min="0"
                        max="100"
                        value={newProject.progress || ""}
                        onChange={(e) => setNewProject({ ...newProject, progress: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team">Equipe (separar nomes por vírgula)</Label>
                    <Input
                      id="team"
                      value={newProject.team?.join(", ")}
                      onChange={(e) =>
                        setNewProject({ ...newProject, team: e.target.value.split(",").map((item) => item.trim()) })
                      }
                      placeholder="João, Maria, Pedro"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newProject.description || ""}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Descreva o projeto..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddProject}>Adicionar Projeto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar projetos..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | "todos")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="em-andamento">Em Andamento</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Projetos */}
            <div className="space-y-4">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum projeto encontrado.</p>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                        <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(project.status)}
                            {getStatusLabel(project.status)}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(project.deadline).toLocaleDateString("pt-BR")}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditModal(project)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDeleteConfirm(project)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Cliente:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{project.client}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Orçamento:</span>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(project.budget)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Gasto:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{formatCurrency(project.spent)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Equipe:</span>
                        <div className="font-medium text-gray-900 dark:text-white">{project.team.join(", ")}</div>
                      </div>
                    </div>

                    {project.description && (
                      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">{project.description}</div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                        <span className="text-gray-900 dark:text-white">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {filteredProjects.length} de {projects.length} projetos
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Próximo
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Performance da Equipe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance da Equipe
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Eficiência e produtividade individual
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Membro
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{member.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.efficiency}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{member.hours}h</div>
                      </div>
                    </div>
                    <Progress value={member.efficiency} className="h-2" />
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-gray-500 dark:text-gray-400">{member.projects} projetos ativos</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Métricas Adicionais</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Outros indicadores operacionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {operationalMetrics.billableHours}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Horas Faturáveis</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {operationalMetrics.utilization}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Utilização</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Qualidade Entrega</span>
                  <span className="text-sm text-gray-900 dark:text-white">{operationalMetrics.qualityScore}%</span>
                </div>
                <Progress value={operationalMetrics.qualityScore} className="h-2" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Projetos Concluídos</span>
                  <span className="text-sm text-gray-900 dark:text-white">{operationalMetrics.projectsCompleted}</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>• Taxa de Retrabalho: 3%</p>
                  <p>• Projetos no Prazo: 89%</p>
                  <p>• Margem Média Projetos: 32%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
            <DialogDescription>Atualize os detalhes do projeto. Campos com * são obrigatórios.</DialogDescription>
          </DialogHeader>
          {currentProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Projeto *</Label>
                  <Input
                    id="edit-name"
                    value={currentProject.name}
                    onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-client">Cliente *</Label>
                  <Input
                    id="edit-client"
                    value={currentProject.client}
                    onChange={(e) => setCurrentProject({ ...currentProject, client: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentProject.status}
                    onValueChange={(value) => setCurrentProject({ ...currentProject, status: value as ProjectStatus })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planejamento">Planejamento</SelectItem>
                      <SelectItem value="em-andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluido">Concluído</SelectItem>
                      <SelectItem value="atrasado">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Prazo *</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={currentProject.deadline}
                    onChange={(e) => setCurrentProject({ ...currentProject, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-budget">Orçamento (R$)</Label>
                  <Input
                    id="edit-budget"
                    type="number"
                    value={currentProject.budget}
                    onChange={(e) => setCurrentProject({ ...currentProject, budget: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-progress">Progresso (%)</Label>
                  <Input
                    id="edit-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={currentProject.progress}
                    onChange={(e) => setCurrentProject({ ...currentProject, progress: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-team">Equipe (separar nomes por vírgula)</Label>
                <Input
                  id="edit-team"
                  value={currentProject.team.join(", ")}
                  onChange={(e) =>
                    setCurrentProject({ ...currentProject, team: e.target.value.split(",").map((item) => item.trim()) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={currentProject.description || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProjectOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditProject}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o projeto "{currentProject?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Excluir Projeto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}

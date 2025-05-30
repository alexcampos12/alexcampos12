"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Users, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Employee {
  id: string
  name: string
  position: string
  department: string
  salary: number
  startDate: string
  status: "ativo" | "inativo" | "ferias"
  email: string
}

interface Department {
  id: string
  name: string
  description: string
  managerId: string
}

export default function RecursosHumanosPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    position: "",
    department: "",
    salary: "",
    startDate: new Date().toISOString().split("T")[0],
    status: "ativo",
    email: "",
  })

  const [departmentFormData, setDepartmentFormData] = useState({
    name: "",
    description: "",
    managerId: "",
  })

  useEffect(() => {
    // Carregar colaboradores
    const savedEmployees = localStorage.getItem("employees")
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    } else {
      const initialEmployees: Employee[] = [
        {
          id: "1",
          name: "João Silva",
          position: "Desenvolvedor Senior",
          department: "Tecnologia",
          salary: 8500,
          startDate: "2023-01-15",
          status: "ativo",
          email: "joao@fiveperformance.com",
        },
        {
          id: "2",
          name: "Maria Santos",
          position: "Designer UX/UI",
          department: "Design",
          salary: 6500,
          startDate: "2023-03-20",
          status: "ativo",
          email: "maria@fiveperformance.com",
        },
        {
          id: "3",
          name: "Pedro Costa",
          position: "Analista de Marketing",
          department: "Marketing",
          salary: 5500,
          startDate: "2023-06-10",
          status: "ferias",
          email: "pedro@fiveperformance.com",
        },
      ]
      setEmployees(initialEmployees)
      localStorage.setItem("employees", JSON.stringify(initialEmployees))
    }

    // Carregar departamentos
    const savedDepartments = localStorage.getItem("departments")
    if (savedDepartments) {
      setDepartments(JSON.parse(savedDepartments))
    } else {
      const initialDepartments: Department[] = [
        { id: "1", name: "Tecnologia", description: "Desenvolvimento e infraestrutura", managerId: "1" },
        { id: "2", name: "Design", description: "UX/UI e design gráfico", managerId: "2" },
        { id: "3", name: "Marketing", description: "Marketing digital e comunicação", managerId: "3" },
        { id: "4", name: "Comercial", description: "Vendas e relacionamento com clientes", managerId: "" },
        { id: "5", name: "Administrativo", description: "Recursos humanos e financeiro", managerId: "" },
      ]
      setDepartments(initialDepartments)
      localStorage.setItem("departments", JSON.stringify(initialDepartments))
    }
  }, [])

  const filteredEmployees = employees
    .filter((employee) => selectedDepartment === "all" || employee.department === selectedDepartment)
    .filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalSalaries = employees.filter((emp) => emp.status === "ativo").reduce((sum, emp) => sum + emp.salary, 0)
  const activeEmployees = employees.filter((emp) => emp.status === "ativo").length

  const getDepartmentStats = () => {
    return departments.map((dept) => {
      const deptEmployees = employees.filter((emp) => emp.department === dept.name && emp.status === "ativo")
      const totalSalary = deptEmployees.reduce((sum, emp) => sum + emp.salary, 0)
      const manager = employees.find((emp) => emp.id === dept.managerId)
      return {
        department: dept.name,
        count: deptEmployees.length,
        totalSalary,
        managerName: manager?.name || "Sem gerente",
      }
    })
  }

  const getManagerName = (managerId: string) => {
    const manager = employees.find((emp) => emp.id === managerId)
    return manager?.name || "Sem gerente"
  }

  const isManager = (employeeId: string) => {
    return departments.some((dept) => dept.managerId === employeeId)
  }

  const saveEmployees = (newData: Employee[]) => {
    setEmployees(newData)
    localStorage.setItem("employees", JSON.stringify(newData))
  }

  const saveDepartments = (newData: Department[]) => {
    setDepartments(newData)
    localStorage.setItem("departments", JSON.stringify(newData))
  }

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEmployee: Employee = {
      id: editingEmployee?.id || Date.now().toString(),
      name: employeeFormData.name,
      position: employeeFormData.position,
      department: employeeFormData.department,
      salary: Number.parseFloat(employeeFormData.salary),
      startDate: employeeFormData.startDate,
      status: employeeFormData.status as Employee["status"],
      email: employeeFormData.email,
    }

    let newData: Employee[]
    if (editingEmployee) {
      newData = employees.map((emp) => (emp.id === editingEmployee.id ? newEmployee : emp))
    } else {
      newData = [...employees, newEmployee]
    }

    saveEmployees(newData)
    setEmployeeFormData({
      name: "",
      position: "",
      department: "",
      salary: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "ativo",
      email: "",
    })
    setEditingEmployee(null)
    setIsEmployeeDialogOpen(false)
  }

  const handleDepartmentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDepartment: Department = {
      id: editingDepartment?.id || Date.now().toString(),
      name: departmentFormData.name,
      description: departmentFormData.description,
      managerId: departmentFormData.managerId === "none" ? "" : departmentFormData.managerId,
    }

    let newData: Department[]
    if (editingDepartment) {
      newData = departments.map((dept) => (dept.id === editingDepartment.id ? newDepartment : dept))
    } else {
      newData = [...departments, newDepartment]
    }

    saveDepartments(newData)
    setDepartmentFormData({
      name: "",
      description: "",
      managerId: "",
    })
    setEditingDepartment(null)
    setIsDepartmentDialogOpen(false)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setEmployeeFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      salary: employee.salary.toString(),
      startDate: employee.startDate,
      status: employee.status,
      email: employee.email,
    })
    setIsEmployeeDialogOpen(true)
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setDepartmentFormData({
      name: department.name,
      description: department.description,
      managerId: department.managerId || "none",
    })
    setIsDepartmentDialogOpen(true)
  }

  const handleDeleteEmployee = (id: string) => {
    const employee = employees.find((emp) => emp.id === id)
    if (!employee) return

    // Verificar se é gerente de algum departamento
    const managedDepartments = departments.filter((dept) => dept.managerId === id)
    if (managedDepartments.length > 0) {
      const deptNames = managedDepartments.map((dept) => dept.name).join(", ")
      alert(
        `Não é possível excluir ${employee.name} pois é gerente do(s) departamento(s): ${deptNames}. Primeiro remova ou altere a gerência.`,
      )
      return
    }

    if (confirm(`Tem certeza que deseja excluir ${employee.name}?`)) {
      const newData = employees.filter((emp) => emp.id !== id)
      saveEmployees(newData)
    }
  }

  const handleDeleteDepartment = (id: string) => {
    const departmentToDelete = departments.find((dept) => dept.id === id)
    if (!departmentToDelete) return

    // Verificar se há colaboradores neste departamento
    const employeesInDept = employees.filter((emp) => emp.department === departmentToDelete.name)
    if (employeesInDept.length > 0) {
      alert(
        `Não é possível excluir o departamento "${departmentToDelete.name}" pois há ${employeesInDept.length} colaborador(es) vinculado(s) a ele.`,
      )
      return
    }

    if (confirm(`Tem certeza que deseja excluir o departamento "${departmentToDelete.name}"?`)) {
      const newData = departments.filter((dept) => dept.id !== id)
      saveDepartments(newData)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-blue-50 text-blue-700 hover:bg-blue-100"
      case "ferias":
        return "bg-orange-50 text-orange-700 hover:bg-orange-100"
      case "inativo":
        return "bg-gray-50 text-gray-700 hover:bg-gray-100"
      default:
        return "bg-gray-50 text-gray-700 hover:bg-gray-100"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo"
      case "ferias":
        return "Férias"
      case "inativo":
        return "Inativo"
      default:
        return status
    }
  }

  const openEmployeeDialog = () => {
    setEditingEmployee(null)
    setEmployeeFormData({
      name: "",
      position: "",
      department: "",
      salary: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "ativo",
      email: "",
    })
    setIsEmployeeDialogOpen(true)
  }

  const openDepartmentDialog = () => {
    setEditingDepartment(null)
    setDepartmentFormData({
      name: "",
      description: "",
      managerId: "",
    })
    setIsDepartmentDialogOpen(true)
  }

  return (
    <SidebarInset>
      {/* Header Minimalista */}
      <header className="flex h-16 items-center gap-4 border-b bg-white dark:bg-black dark:border-gray-800 px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-orange-100">Recursos Humanos</h1>
          <p className="text-sm text-gray-500 dark:text-orange-400">Gestão de colaboradores e departamentos</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-orange-400">Folha Total</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-orange-400">
              {formatCurrency(totalSalaries)}
            </div>
          </div>
          <Button
            onClick={openDepartmentDialog}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-950 dark:hover:border-orange-500"
          >
            Departamento
          </Button>
          <Button
            onClick={openEmployeeDialog}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Colaborador
          </Button>
        </div>
      </header>

      {/* Employee Modal */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-orange-100">
              {editingEmployee ? "Editar Colaborador" : "Novo Colaborador"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEmployeeSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="dark:text-orange-400">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={employeeFormData.name}
                    onChange={(e) => setEmployeeFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="João Silva"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="dark:text-orange-400">
                    Cargo
                  </Label>
                  <Input
                    id="position"
                    value={employeeFormData.position}
                    onChange={(e) => setEmployeeFormData((prev) => ({ ...prev, position: e.target.value }))}
                    placeholder="Desenvolvedor Senior"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department" className="dark:text-orange-400">
                    Departamento
                  </Label>
                  <Select
                    value={employeeFormData.department}
                    onValueChange={(value) => setEmployeeFormData((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="dark:text-orange-400">
                    Status
                  </Label>
                  <Select
                    value={employeeFormData.status}
                    onValueChange={(value) => setEmployeeFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="ferias">Férias</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-orange-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={employeeFormData.email}
                  onChange={(e) => setEmployeeFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="email@fiveperformance.com"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="dark:text-orange-400">
                    Salário (R$)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    value={employeeFormData.salary}
                    onChange={(e) => setEmployeeFormData((prev) => ({ ...prev, salary: e.target.value }))}
                    placeholder="0,00"
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="dark:text-orange-400">
                    Data de Admissão
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={employeeFormData.startDate}
                    onChange={(e) => setEmployeeFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                {editingEmployee ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Department Modal */}
      <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-900 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="dark:text-orange-100">
              {editingDepartment ? "Editar Departamento" : "Novo Departamento"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleDepartmentSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="deptName" className="dark:text-orange-400">
                  Nome do Departamento
                </Label>
                <Input
                  id="deptName"
                  value={departmentFormData.name}
                  onChange={(e) => setDepartmentFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Tecnologia"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deptDescription" className="dark:text-orange-400">
                  Descrição
                </Label>
                <Input
                  id="deptDescription"
                  value={departmentFormData.description}
                  onChange={(e) => setDepartmentFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Desenvolvimento e infraestrutura"
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deptManager" className="dark:text-orange-400">
                  Gerente
                </Label>
                <Select
                  value={departmentFormData.managerId}
                  onValueChange={(value) => setDepartmentFormData((prev) => ({ ...prev, managerId: value }))}
                >
                  <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
                    <SelectValue placeholder="Selecione um gerente" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
                    <SelectItem value="none">Nenhum gerente</SelectItem>
                    {employees
                      .filter((emp) => emp.status === "ativo")
                      .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name} - {emp.position}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                {editingDepartment ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6 bg-gray-50 dark:bg-black">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-100 dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-orange-400 mb-1">
                    Colaboradores Ativos
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">{activeEmployees}</div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-950 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-orange-400 mb-1">Folha de Pagamento</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">
                    {formatCurrency(totalSalaries)}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-950 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 dark:border-gray-800 dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-500 dark:text-orange-400 mb-1">Ticket Médio</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-orange-400">
                    {formatCurrency(activeEmployees > 0 ? totalSalaries / activeEmployees : 0)}
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-orange-950 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar colaboradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 dark:bg-gray-900 dark:border-gray-800 dark:text-orange-100"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
              <SelectValue placeholder="Todos os departamentos" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700 dark:text-orange-100">
              <SelectItem value="all">Todos os departamentos</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs para Colaboradores e Departamentos */}
        <Tabs defaultValue="employees" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="employees">Colaboradores</TabsTrigger>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
          </TabsList>

          {/* Colaboradores Tab */}
          <TabsContent value="employees">
            {filteredEmployees.length === 0 ? (
              <Card className="dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-orange-100 mb-2">
                    Nenhum colaborador encontrado
                  </h3>
                  <p className="text-gray-500 dark:text-orange-400 mb-4">
                    {searchTerm || selectedDepartment !== "all"
                      ? "Tente ajustar seus filtros"
                      : "Comece adicionando seu primeiro colaborador"}
                  </p>
                  <Button
                    onClick={openEmployeeDialog}
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Colaborador
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredEmployees.map((employee) => (
                  <Card
                    key={employee.id}
                    className="hover:border-blue-200 dark:hover:border-orange-600 transition-colors dark:bg-gray-900 dark:border-gray-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-orange-100">{employee.name}</h3>
                            {isManager(employee.id) && (
                              <Crown className="w-4 h-4 text-yellow-500 dark:text-orange-400" />
                            )}
                            <Badge className={`${getStatusColor(employee.status)} border-0`}>
                              {getStatusLabel(employee.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-orange-300 mb-1">
                            {employee.position} • {employee.department}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-orange-400">{employee.email}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium text-gray-900 dark:text-orange-100">
                              {formatCurrency(employee.salary)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-orange-400">
                              Desde {new Date(employee.startDate).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditEmployee(employee)}
                              className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-orange-950"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950"
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

          {/* Departamentos Tab */}
          <TabsContent value="departments">
            <div className="space-y-3">
              {departments.map((dept) => {
                const deptStats = getDepartmentStats().find((stat) => stat.department === dept.name)
                const manager = employees.find((emp) => emp.id === dept.managerId)
                return (
                  <Card
                    key={dept.id}
                    className="hover:border-blue-200 dark:hover:border-orange-600 transition-colors dark:bg-gray-900 dark:border-gray-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-orange-100 mb-1">{dept.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-orange-300 mb-2">{dept.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-orange-400">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{deptStats?.count || 0}</span>
                            </div>
                            <div>{formatCurrency(deptStats?.totalSalary || 0)}</div>
                            <div className="flex items-center gap-1">
                              <Crown className="w-4 h-4 text-yellow-500 dark:text-orange-400" />
                              <span>{manager ? manager.name : "Sem gerente"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDepartment(dept)}
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-orange-400 dark:hover:bg-orange-950"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDepartment(dept.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {departments.length === 0 && (
                <Card className="dark:bg-gray-900 dark:border-gray-800">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-orange-100 mb-2">
                      Nenhum departamento encontrado
                    </h3>
                    <p className="text-gray-500 dark:text-orange-400 mb-4">
                      Comece adicionando seu primeiro departamento
                    </p>
                    <Button
                      onClick={openDepartmentDialog}
                      className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-orange-600 dark:hover:bg-orange-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Primeiro Departamento
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  )
}

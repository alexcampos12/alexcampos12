import {
  Home,
  DollarSign,
  TrendingDown,
  Calculator,
  Users,
  Target,
  BarChart3,
  FileBarChart,
  Briefcase,
  FileText,
  Settings,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Receitas",
    url: "/receitas",
    icon: DollarSign,
  },
  {
    title: "Despesas",
    url: "/despesas",
    icon: TrendingDown,
  },
  {
    title: "Custos Fixos",
    url: "/custos-fixos",
    icon: Calculator,
  },
  {
    title: "Recursos Humanos",
    url: "/recursos-humanos",
    icon: Users,
  },
  {
    title: "Marketing",
    url: "/marketing",
    icon: Target,
  },
  {
    title: "Métricas",
    url: "/metricas",
    icon: BarChart3,
  },
  {
    title: "DRE Completo",
    url: "/dre",
    icon: FileBarChart,
  },
  {
    title: "Operacional",
    url: "/operacional",
    icon: Briefcase,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen py-8 px-4">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.title} className="mb-2">
              <a href={item.url} className="flex items-center py-2 px-4 rounded hover:bg-gray-200">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

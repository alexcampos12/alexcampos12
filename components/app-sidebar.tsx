"use client"

import {
  DollarSign,
  TrendingDown,
  Users,
  Target,
  Home,
  FileText,
  Briefcase,
  FileBarChart,
  Settings,
  Moon,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

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

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700">
      <div className="h-full bg-white dark:bg-gray-900 transition-colors duration-200">
        <SidebarHeader className="border-b border-gray-100 dark:border-gray-800 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Five Performance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sistema Financeiro</p>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 data-[active=true]:bg-gray-900 dark:data-[active=true]:bg-gray-100 data-[active=true]:text-white dark:data-[active=true]:text-gray-900 data-[active=true]:font-medium rounded-lg px-3 py-2.5 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400 dark:text-gray-500">© 2024 Five Performance</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}

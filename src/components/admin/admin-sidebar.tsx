"use client";
import {
  Home,
  Layers,
  FileText,
  MessageSquareQuote,
  Settings,
  Files,
  LayoutPanelTop,
  Inbox,
  Image as ImageIcon,
  LogOut,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
const workspaceItems = [
  { name: "Visão Geral", href: "/admin", icon: Home },
  { name: "Página Inicial", href: "/admin/home", icon: Layers },
  { name: "Projetos", href: "/admin/projects", icon: FileText },
  { name: "Páginas", href: "/admin/pages", icon: Files },
];

const engagementItems = [
  { name: "Formulários", href: "/admin/forms", icon: LayoutPanelTop },
  { name: "Submissões", href: "/admin/submissions", icon: Inbox },
  { name: "Mídia", href: "/admin/media", icon: ImageIcon },
];

const systemItems = [
  { name: "Chat com IA", href: "/admin/ai", icon: MessageSquareQuote },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso");
      router.push("/admin/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <Sidebar className="border-r border-zinc-100 bg-white">
      <SidebarContent className="bg-white px-2 no-scrollbar">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-8 sm:py-12">
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="font-display font-medium text-2xl leading-none">J</span>
          </div>
          <div className="flex flex-col">
            <span className="font-ui font-medium text-sm tracking-tight text-zinc-900">{isLoading ? "Carregando..." : (user?.name || "Usuário")}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold font-ui">{user?.role === "admin" ? "Admin CMS" : "Usuário"}</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold tracking-[0.2em] text-zinc-300 uppercase mb-4 px-6 font-ui">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {workspaceItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-11 px-5 rounded-xl transition-all duration-300 ${isActive
                        ? "bg-primary text-white"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      render={
                        <Link href={item.href} className="flex items-center gap-4 w-full">
                          <item.icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2 : 1.5} />
                          <span className="font-ui text-[12px] font-medium tracking-wide">{item.name}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-[0.2em] text-zinc-300 uppercase mb-4 px-6 font-ui">
            Engajamento
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {engagementItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-11 px-5 rounded-xl transition-all duration-300 ${isActive
                        ? "bg-primary text-white "
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      render={
                        <Link href={item.href} className="flex items-center gap-4 w-full">
                          <item.icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2 : 1.5} />
                          <span className="font-ui text-[12px] font-medium tracking-wide">{item.name}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6 pb-20">
          <SidebarGroupLabel className="text-[10px] font-bold tracking-[0.2em] text-zinc-300 uppercase mb-4 px-6 font-ui">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2">
              {systemItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      className={`h-11 px-5 rounded-xl transition-all duration-300 ${isActive
                        ? "bg-primary text-white"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      render={
                        <Link href={item.href} className="flex items-center gap-4 w-full">
                          <item.icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2 : 1.5} />
                          <span className="font-ui text-[12px] font-medium tracking-wide">{item.name}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom User Profile Section */}
      <div className="bg-background absolute w-full bottom-0 left-0 p-8 py-4 border-t border-zinc-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-full bg-zinc-900 text-white border border-zinc-800 shadow-sm">
              <span className="font-bold text-[10px] tracking-widest font-ui">
                {user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "JV"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-900 w-full whitespace-normal">{user?.name || "Usuário"}</span>
              <span className="text-[9px] text-zinc-400 capitalize">{user?.role === "admin" ? "Administrador" : (user?.role || "Admin")}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all"
            title="Sair"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </Sidebar>
  );
}

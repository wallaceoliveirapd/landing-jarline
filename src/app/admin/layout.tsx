"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { AuthProvider } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function AuthCheck({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const sessionId = sessionStorage.getItem("sessionId");
      
      if (!sessionId && pathname !== "/admin/login") {
        router.push("/admin/login");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <AuthCheck>
          <TooltipProvider>
            <SidebarProvider className="font-sans antialiased text-zinc-900">
              <CustomCursor />
              <AdminSidebar />
              <SidebarInset className="bg-white flex flex-col h-screen relative">
                <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between px-4 sm:px-6 bg-white/90 backdrop-blur-md z-30 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-primary text-white">
                      <span className="font-display font-medium text-lg leading-none">J</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 font-ui hidden sm:block">
                      Jarline Vieira
                    </span>
                  </div>
                  <SidebarTrigger className="size-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all" />
                </header>
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
                    <main className="w-full pb-24 sm:pb-32">
                      {children}
                    </main>
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </AuthCheck>
      )}
    </AuthProvider>
  );
}

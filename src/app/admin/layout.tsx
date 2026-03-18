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
              <SidebarInset className="bg-white flex flex-col min-h-screen relative overflow-x-hidden">
                <header className="flex h-16 shrink-0 items-center px-8 sm:px-12 gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-30 transition-all border-b border-transparent data-[scroll=true]:border-zinc-100">
                  <SidebarTrigger className="size-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all" />
                  <div className="h-4 w-px bg-zinc-100 mx-2" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 font-ui hidden sm:block">
                    Jarline Vieira Dashboard
                  </span>
                </header>
                <div className="flex-1 w-full max-w-[1400px] mx-auto px-8 sm:px-12">
                  <main className="w-full h-full pb-32">
                    {children}
                  </main>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </AuthCheck>
      )}
    </AuthProvider>
  );
}

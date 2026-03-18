"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check session storage for session ID
    const sessionId = sessionStorage.getItem("sessionId");
    
    if (!sessionId && pathname !== "/admin/login") {
      setIsAuthenticated(false);
      router.push("/admin/login");
    } else if (sessionId) {
      // Verify session with backend
      fetch(`/api/auth/verify?sessionId=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.valid) {
            sessionStorage.removeItem("sessionId");
            setIsAuthenticated(false);
            router.push("/admin/login");
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          // On error, allow access if session exists
          setIsAuthenticated(true);
        });
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  // Don't show loading - redirect immediately or show content
  if (isAuthenticated === null) {
    return null;
  }

  return <>{children}</>;
}
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { cn } from "@/lib/utils"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      expand={true}
      richColors={false}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#18181b",
          "--normal-border": "#e4e4e7",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: cn(
            "font-ui rounded-xl shadow-lg shadow-black/10 border-0 border-l-[4px] px-5 py-4 bg-white",
            "data-[type=success]:border-l-primary",
            "data-[type=error]:border-l-red-500",
            "data-[type=info]:border-l-blue-500",
            "data-[type=warning]:border-l-amber-500",
            "data-[type=loading]:border-l-zinc-400"
          ),
          title: "font-semibold text-sm text-zinc-900",
          description: "text-xs text-zinc-500 mt-0.5",
          actionButton: "font-medium text-xs uppercase tracking-widest rounded-lg px-3 py-1.5",
          cancelButton: "font-medium text-xs uppercase tracking-widest rounded-lg px-3 py-1.5",
          closeButton: "text-zinc-400 hover:text-zinc-600",
          loading: "text-zinc-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

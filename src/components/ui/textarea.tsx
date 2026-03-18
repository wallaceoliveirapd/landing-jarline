import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-4 text-base transition-all outline-none placeholder:text-zinc-400 focus-visible:bg-white focus-visible:border-primary/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

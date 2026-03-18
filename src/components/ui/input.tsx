import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, id, ...props }: React.ComponentProps<"input">) {
  const generatedId = React.useId()
  const inputId = id || generatedId
  
  return (
    <InputPrimitive
      id={inputId}
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-1 text-base transition-all outline-none placeholder:text-zinc-400 focus-visible:bg-white focus-visible:border-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }

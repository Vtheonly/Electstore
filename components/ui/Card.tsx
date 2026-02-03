import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-white text-card-foreground shadow-premium transition-all duration-300 hover:shadow-premium-hover",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }

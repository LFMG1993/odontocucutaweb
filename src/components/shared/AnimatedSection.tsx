import type { ReactNode } from "react"
import { cn } from "@/utils/cn"
import { useInView } from "@/hooks/useInView"

export function AnimatedSection({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className={cn("animate-fade-in", inView && "is-visible", className)}
    >
      {children}
    </div>
  )
}

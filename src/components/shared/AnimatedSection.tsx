import type { ReactNode } from "react"
import { cn } from "@/utils/cn"
import { useInView } from "@/hooks/useInView"

export function AnimatedSection({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      id={id}
      className={cn("animate-fade-in", inView && "is-visible", className)}
    >
      {children}
    </div>
  )
}

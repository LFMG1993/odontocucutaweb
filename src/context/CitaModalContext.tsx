import { createContext, useContext, useState, type ReactNode } from "react"
import { ValoracionModal } from "@/components/shared/ValoracionModal"

interface CitaModalContextValue {
  openCitaModal: () => void
}

const CitaModalContext = createContext<CitaModalContextValue>({
  openCitaModal: () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useCitaModal = () => useContext(CitaModalContext)

export function CitaModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <CitaModalContext.Provider value={{ openCitaModal: () => setOpen(true) }}>
      {children}
      <ValoracionModal open={open} onClose={() => setOpen(false)} />
    </CitaModalContext.Provider>
  )
}

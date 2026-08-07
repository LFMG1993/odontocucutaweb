import { useEffect, useRef, useState } from "react"
import { sedesConfig } from "@/data/siteConfig"
import { waLink } from "@/utils/contact"
import { Icon } from "@/utils/icons"

export function WhatsAppChatButton() {
  const [open, setOpen] = useState(false)
  const [typing, setTyping] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => setTyping(false), 900)
    return () => clearTimeout(t)
  }, [open])

  const toggle = () => {
    setOpen((v) => {
      const next = !v
      if (next) setTyping(true)
      return next
    })
  }

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [open])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          className="w-[320px] max-w-[calc(100vw-2.5rem)] rounded-2xl overflow-hidden bg-white shadow-2xl border border-slate-200"
        >
          {/* Header del chat */}
          <div className="flex items-center gap-3 bg-[#075E54] text-white px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
              <Icon name="whatsapp" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">OdontoCúcuta</p>
              <p className="text-xs text-emerald-100">En línea</p>
            </div>
          </div>

          {/* Mensaje del bot */}
          <div className="bg-[#ECE5DD] p-4 space-y-3">
            <div className="relative bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm text-sm text-slate-700">
              {typing ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.3s]" />
                </span>
              ) : (
                <>¡Hola! 👋 ¿Con cuál de nuestras sedes deseas comunicarte?</>
              )}
            </div>

            {!typing && (
              <div className="grid grid-cols-2 gap-2">
                {sedesConfig.map((sede) => (
                  <a
                    key={sede.id}
                    href={waLink(
                      sede.celular,
                      `Hola! Me gustaría comunicarme con la sede ${sede.nombre} de OdontoCúcuta.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#1fbb5b] text-white text-sm font-semibold text-center px-3 py-2.5 rounded-xl transition-colors"
                  >
                    {sede.nombreCorto}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label="Abrir chat de WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1fbb5b] text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
      >
        <Icon name="whatsapp" className="w-7 h-7" />
      </button>
    </div>
  )
}

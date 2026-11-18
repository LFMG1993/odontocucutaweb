import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronUp } from 'lucide-react'

interface DoctorPortalFooterProps {
  className?: string
}

export const DoctorPortalFooter: React.FC<DoctorPortalFooterProps> = ({ className = '' }) => (
  <footer
    role="contentinfo"
    className={`mt-10 w-full -mx-4 -mb-4 border-t border-slate-200/80 bg-white/70 backdrop-blur-sm sm:-mx-6 sm:-mb-6 ${className}`}
  >
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-6">
      <div className="flex min-w-0 flex-col items-center gap-1 text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs lg:items-start lg:text-left">
        <p className="text-balance">
          © {new Date().getFullYear()} Odontocúcuta S.A. Todos los derechos reservados.
        </p>
        <p>
          Creado y Desarrollado por{' '}
          <a
            href="https://molink.com.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-700 underline decoration-blue-200 underline-offset-2 transition-colors hover:text-blue-900 hover:decoration-blue-600"
          >
            Molink Tecnologia
          </a>
        </p>
      </div>

      <nav
        aria-label="Enlaces legales"
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-500 sm:gap-x-6 sm:text-xs lg:shrink-0"
      >
        <Link to="/contacto" className="whitespace-nowrap transition-colors hover:text-blue-700">
          Términos y Condiciones
        </Link>
        <Link to="/contacto" className="whitespace-nowrap transition-colors hover:text-blue-700">
          Política de Privacidad
        </Link>
      </nav>

      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-colors hover:bg-blue-600 hover:text-white"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </footer>
)

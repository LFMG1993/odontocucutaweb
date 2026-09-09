import { Link, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import { Button } from "@/components/shared"
import { Icon, type IconName } from "@/utils/icons"
import { useState, useEffect, type ReactNode } from "react"
import { useCitaModal } from "@/context/CitaModalContext"
import { servicios, afiliaciones } from "@/data/siteData"
import { sedesConfig } from "@/data/siteConfig"

interface NavItem {
  label: string
  href?: string
  items?: { label: string; href: string; detail?: string }[]
}

const navLinks: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Especialidades",
    items: servicios.map((s) => ({ label: s.titulo, href: `/servicios/${s.slug}` })),
  },
  {
    label: "Planes de Afiliación",
    items: afiliaciones.map((a) => ({ label: a.nombre, href: "/contacto" })),
  },
  {
    label: "Sedes",
    items: sedesConfig.map((s) => ({ label: s.nombreCorto, href: "/contacto" })),
  },
  {
    label: "Servicios",
    items: [
      { label: "Convenios", href: "/contacto"},
      { label: "Blog", href: "/blog" },
      { label: "Preguntas Frecuentes", href: "/faq" },
    ],
  },
]

const contactInfo: { icon: IconName; text: string; href: string }[] = [
  { icon: "phone", text: "+57 318 144 1442", href: "tel:+573181441442" },
  { icon: "mapPin", text: "Av. 3E # 13A-07 Caobos, Cúcuta", href: "/contacto" },
  { icon: "mail", text: "info@odontocucuta.com", href: "mailto:info@odontocucuta.com" },
]

function DropdownMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {open && (
        <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "relative z-50 flex items-center gap-1 text-sm font-medium transition-colors",
          open ? "text-primary" : "text-text-muted hover:text-primary"
        )}
      >
        {item.label}
        <Icon name="chevronDown" className={cn("w-4 h-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <div
        className={cn(
          "absolute left-0 top-full pt-3 z-50 transition-opacity duration-200",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"
        )}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden py-2 w-72 max-h-96 overflow-y-auto">
          {item.items?.map((sub) => (
            <Link
              key={sub.label}
              to={sub.href}
              onClick={close}
              className="block px-5 py-3 transition-colors hover:bg-primary/5"
            >
              <span className="block text-sm font-medium text-text hover:text-primary">{sub.label}</span>
              {sub.detail && (
                <span className="block text-xs text-text-muted mt-0.5 line-clamp-2">{sub.detail}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { openCitaModal } = useCitaModal()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const renderNav = (): ReactNode => {
    return navLinks.map((link) =>
      link.items ? (
        <DropdownMenu key={link.label} item={link} />
      ) : (
        <Link
          key={link.href}
          to={link.href ?? "/"}
          className={cn(
            "text-sm font-medium transition-colors",
            location.pathname === link.href ? "text-primary" : "text-text-muted hover:text-primary"
          )}
        >
          {link.label}
        </Link>
      )
    )
  }

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", (isScrolled || isOpen) ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent")}>
      {/* Barra superior con datos de contacto, separada del menú principal */}
      <div className={cn("hidden lg:block transition-all duration-300 overflow-hidden", isScrolled ? "max-h-0" : "max-h-12")}>
        <div>
          <div className="container-main flex items-center justify-between gap-6 py-2">
            <div className="flex items-center gap-6 text-xs text-white/90">
              {contactInfo.map((item) => (
                <a key={item.text} href={item.href} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Icon name={item.icon} className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/90">
              <Icon name="clock" className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Lun - Vie: 7:00 AM - 7:00 PM · Sáb: 8:00 AM - 2:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-main">
        <div className={cn("flex h-20 items-center justify-between gap-4", !isScrolled && "lg:pt-1")}>
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Odontocúcuta Inicio">
            <Icon name="odontocucuta" className="h-20 w-auto transition-transform hover:scale-[1.02]" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {renderNav()}
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <a href="tel:+573181441442" className="hidden lg:flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors">
              <Icon name="phone" className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="font-medium">318 144 1442</span>
            </a>
            <Button size="md" className="rounded-full px-6" onClick={openCitaModal}>
              Pide tu Cita
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-text hover:text-primary rounded-lg focus:outline-hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <Icon name="x" className="w-6 h-6" /> : <Icon name="menu" className="w-6 h-6" />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={cn(
            "md:hidden transition-all duration-300",
            isOpen
              ? "max-h-[calc(100dvh-4rem)] overflow-y-auto opacity-100 pb-6 border-t border-border"
              : "max-h-0 overflow-hidden opacity-0"
          )}
        >
          <nav className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) =>
              link.items ? (
                <details key={link.label} className="group">
                  <summary className="flex items-center justify-between px-2 py-3 text-base font-medium rounded-lg cursor-pointer text-text-muted hover:bg-surface hover:text-text list-none">
                    {link.label}
                    <Icon name="chevronDown" className="w-4 h-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="pl-4 flex flex-col gap-1 pb-2">
                    {link.items.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="px-2 py-2 text-sm font-medium rounded-lg text-text-muted hover:bg-surface hover:text-text"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={link.href}
                  to={link.href ?? "/"}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-2 py-3 text-base font-medium rounded-lg transition-colors",
                    location.pathname === link.href ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {contactInfo.map((item) => (
                <a key={item.text} href={item.href} className="flex items-center gap-3 px-2 py-2 text-text-muted hover:text-primary transition-colors">
                  <Icon name={item.icon} className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">{item.text}</span>
                </a>
              ))}
              <Button className="w-full mt-2 rounded-full" onClick={openCitaModal}>
                Pide tu Cita
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

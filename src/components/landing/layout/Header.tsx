import { Link, useLocation } from "react-router-dom"
import { cn } from "@/utils/cn"
import { Button } from "@/components/shared/Button"
import { Menu, X, Phone, MapPin, Mail } from "lucide-react"
import { useState, useEffect } from "react"

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
]

const contactInfo = [
  { icon: Phone, text: "+57 318 144 1442", href: "tel:+573181441442" },
  { icon: MapPin, text: "Av. 3E # 13A-07 Caobos, Cúcuta", href: "/contacto" },
  { icon: Mail, text: "info@odontocucuta.com", href: "mailto:info@odontocucuta.com" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => setIsOpen(false), [location])

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", (isScrolled || isOpen) ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent")}>
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" aria-label="Odontocúcuta Inicio">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-transform hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-xl text-text hidden sm:block">Odontocúcuta</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all",
                  location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href))
                    ? "text-primary after:w-full"
                    : "text-text-muted hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+573181441442" className="hidden lg:flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="font-medium">318 144 1442</span>
            </a>
            <Button size="md" asChild>
              <Link to="/cita">Pide tu Cita</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-text hover:text-primary rounded-lg focus:outline-hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div id="mobile-menu" className={cn("md:hidden overflow-hidden transition-all duration-300", isOpen ? "max-h-120 opacity-100 pb-6" : "max-h-0 opacity-0")}>
          <nav className="flex flex-col gap-2 pt-4 border-t border-border">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-2 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === link.href ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-surface hover:text-text"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              {contactInfo.map((item) => (
                <a key={item.text} href={item.href} className="flex items-center gap-3 px-2 py-2 text-text-muted hover:text-primary transition-colors">
                  <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span className="text-sm">{item.text}</span>
                </a>
              ))}
              <Button className="w-full mt-2" asChild>
                <Link to="/cita">Pide tu Cita</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
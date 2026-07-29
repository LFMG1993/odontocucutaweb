import { Link, useLocation } from "react-router-dom"
import { MapPin, Phone, Mail, ChevronUp } from "lucide-react"
import { cn } from "@/utils/cn"

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
)

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

const footerLinks = {
  nosotros: [
    { label: "Quiénes Somos", href: "/nosotros" },
    { label: "Misión y Visión", href: "/nosotros#mision-vision" },
    { label: "Nuestro Equipo", href: "/nosotros#equipo" },
    { label: "Certificaciones", href: "/nosotros#certificaciones" },
    { label: "Responsabilidad Social", href: "/nosotros#rse" },
  ],
  servicios: [
    { label: "Odontología General", href: "/servicios/odontologia-general" },
    { label: "Ortodoncia", href: "/servicios/ortodoncia" },
    { label: "Implantología", href: "/servicios/implantologia" },
    { label: "Cirugía Maxilofacial", href: "/servicios/cirugia-maxilofacial" },
    { label: "Endodoncia", href: "/servicios/endodoncia" },
    { label: "Odontopediatría", href: "/servicios/odontopediatria" },
    { label: "Periodoncia", href: "/servicios/periodoncia" },
    { label: "Rehabilitación Oral", href: "/servicios/rehabilitacion-oral" },
    { label: "Estomatología", href: "/servicios/estomatologia" },
  ],
  pacientes: [
    { label: "Afíliate", href: "/contacto" },
    { label: "Convenios", href: "/contacto#convenios" },
    { label: "Formas de Pago", href: "/cita" },
    { label: "Cuidados Postoperatorios", href: "/blog" },
    { label: "Cuidado Bucodental", href: "/blog" },
  ],
  contacto: [
    { label: "Pide tu Cita", href: "/cita" },
    { label: "Contacto", href: "/contacto" },
    { label: "Blog", href: "/blog" },
  ],
}

const socialLinks = [
  { icon: FacebookIcon, href: "https://facebook.com/Odontocucucuta", label: "Facebook" },
  { icon: InstagramIcon, href: "https://instagram.com/odontocucuta", label: "Instagram" },
  { icon: TwitterIcon, href: "https://twitter.com/odontocucuta1", label: "Twitter" },
  { icon: YoutubeIcon, href: "https://youtube.com/@odontocucuta", label: "YouTube" },
]

export function Footer() {
  const location = useLocation()

  return (
    <footer className="bg-text text-white relative overflow-hidden" role="contentinfo">
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-accent/20" aria-hidden="true" />
      <div className="container-main relative py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2" aria-label="Odontocúcuta Inicio">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <span className="font-heading font-bold text-2xl">Odontocúcuta</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Clínica odontológica líder en Cúcuta con más de 25 años de experiencia.
              Brindamos atención integral, tecnología de vanguardia y un equipo humano comprometido con tu salud bucal.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300",
                    "hover:bg-primary hover:text-white hover:scale-110"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white/80" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Servicios */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-5 text-white">Servicios</h3>
            <nav aria-label="Enlaces de servicios">
              <ul className="space-y-3">
                {footerLinks.servicios.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn(
                        "text-text-muted hover:text-primary transition-colors text-sm",
                        location.pathname === link.href && "text-primary font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Nosotros */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-5 text-white">Nosotros</h3>
            <nav aria-label="Enlaces sobre nosotros">
              <ul className="space-y-3">
                {footerLinks.nosotros.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn(
                        "text-text-muted hover:text-primary transition-colors text-sm",
                        location.pathname === link.href && "text-primary font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4: Pacientes */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-5 text-white">Pacientes</h3>
            <nav aria-label="Enlaces de pacientes">
              <ul className="space-y-3 mb-6">
                {footerLinks.pacientes.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn(
                        "text-text-muted hover:text-primary transition-colors text-sm",
                        location.pathname === link.href && "text-primary font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <h3 className="font-heading text-base font-semibold mb-4 text-white">Otros</h3>
            <nav aria-label="Otros enlaces">
              <ul className="space-y-3">
                {footerLinks.contacto.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={cn(
                        "text-text-muted hover:text-primary transition-colors text-sm",
                        location.pathname === link.href && "text-primary font-medium"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 5: Sedes y Contacto */}
          <div>
            <h3 className="font-heading text-base font-semibold mb-5 text-white">Sedes y Contacto</h3>
            <address className="not-italic space-y-5 text-sm text-text-muted">
              <div className="space-y-2">
                <p className="font-medium text-white">Sede Principal Caobos</p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span>Av. 3E # 13A-07 Caobos, Cúcuta</span>
                </p>
                <a href="tel:+576075955068" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span>PBX: 607 595 5068</span>
                </a>
                <a href="https://wa.me/573181441442" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="w-4 h-4 text-green-500 shrink-0" aria-hidden="true" />
                  <span>WhatsApp: 318 144 1442</span>
                </a>
                <a href="mailto:info@odontocucuta.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span>info@odontocucuta.com</span>
                </a>
              </div>
              
              <div className="pt-4 border-t border-white/10 text-xs">
                <p className="text-white font-medium mb-2">Otras Sedes:</p>
                <p className="mb-2">Sedes Libertad, Atalaya y Pamplona.</p>
                <Link to="/contacto" className="text-primary hover:text-white font-semibold transition-colors inline-block">
                  Ver direcciones y horarios →
                </Link>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} Odontocúcuta S.A. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
            <Link to="/contacto" className="hover:text-primary transition-colors">Términos y Condiciones</Link>
            <Link to="/contacto" className="hover:text-primary transition-colors">Política de Privacidad</Link>
          </div>
          <button
            className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-white hover:bg-primary transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Volver arriba"
          >
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
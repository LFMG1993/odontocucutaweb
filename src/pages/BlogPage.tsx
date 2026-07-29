import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowRight, Calendar, Clock, Tag, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { blogPosts } from "@/data/siteData"
import { cn } from "@/utils/cn"
import { useState, useMemo } from "react"

const categorias = ["Todas", "Prevención", "Cirugía", "Bioseguridad", "Estética", "Implantología", "Ortodoncia", "Odontopediatría"]

export function BlogPage() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas")
  const [paginaActual, setPaginaActual] = useState(1)
  const [busqueda, setBusqueda] = useState("")
  const postsPorPagina = 6

  const postsFiltrados = useMemo(() => {
    return blogPosts.filter(post => {
      const coincideCategoria = categoriaActiva === "Todas" || post.categoria === categoriaActiva
      const coincideBusqueda = busqueda === "" || 
        post.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        post.extracto.toLowerCase().includes(busqueda.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(busqueda.toLowerCase()))
      return coincideCategoria && coincideBusqueda
    })
  }, [categoriaActiva, busqueda])

  const totalPaginas = Math.ceil(postsFiltrados.length / postsPorPagina)
  const postsPagina = postsFiltrados.slice((paginaActual - 1) * postsPorPagina, paginaActual * postsPorPagina)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-surface to-primary/5 py-16 lg:py-24">
        <div className="container-main text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Blog Odontológico
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Artículos basados en evidencia, consejos de especialistas y novedades en salud bucal. 
            Escrito por nuestro equipo médico para ti.
          </p>
        </div>
      </section>

      {/* Filtros y Búsqueda */}
      <section className="py-6 bg-white border-b border-border sticky top-16 z-40">
        <div className="container-main">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar artículos..."
                value={busqueda}
                onChange={e => { setBusqueda(e.target.value); setPaginaActual(1) }}
                className="w-100% px-4 py-3 pl-10 rounded-lg border border-border focus:ring-primary focus:border-primary transition-colors"
                aria-label="Buscar en el blog"
              />
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
              {categorias.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoriaActiva(cat); setPaginaActual(1) }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    categoriaActiva === cat 
                      ? "bg-primary text-white shadow-sm" 
                      : "bg-surface text-text-muted hover:bg-border"
                  )}
                  aria-pressed={categoriaActiva === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Artículos */}
      <section className="section-padding">
        <div className="container-main">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-text-muted">
              {postsFiltrados.length} {postsFiltrados.length === 1 ? "artículo" : "artículos"} 
              {categoriaActiva !== "Todas" && <span className="text-primary"> en "{categoriaActiva}"</span>}
              {busqueda && <span className="text-primary"> para "{busqueda}"</span>}
            </p>
          </div>

          {postsPagina.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-border mb-4" aria-hidden="true" />
              <h3 className="font-heading text-xl font-semibold mb-2">No se encontraron artículos</h3>
              <p className="text-text-muted">Intenta con otros términos o elimina los filtros.</p>
              <Button variant="outline" onClick={() => { setBusqueda(""); setCategoriaActiva("Todas") }} className="mt-4">
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsPagina.map((post) => (
                  <article key={post.slug} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform" aria-hidden="true">
                            <Eye className="w-8 h-8 text-white/80" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{post.categoria}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                          <time dateTime={post.fecha}>
                            <Calendar className="w-3 h-3" aria-hidden="true" />
                            {new Date(post.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                          </time>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" aria-hidden="true" />
                            {post.tiempoLectura}
                          </span>
                        </div>
                        <h2 className="font-heading text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.titulo}
                        </h2>
                        <p className="text-text-muted text-sm mb-4 line-clamp-3">{post.extracto}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Tag className="w-4 h-4 text-primary" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-text">{post.autor}</span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                            Leer más <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginación del blog">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                    disabled={paginaActual === 1}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    let pageNum: number
                    if (totalPaginas <= 5) pageNum = i + 1
                    else if (paginaActual <= 3) pageNum = i + 1
                    else if (paginaActual >= totalPaginas - 2) pageNum = totalPaginas - 4 + i
                    else pageNum = paginaActual - 2 + i
                    return (
                      <Button
                        key={pageNum}
                        variant={paginaActual === pageNum ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setPaginaActual(pageNum)}
                        aria-label={`Página ${pageNum}`}
                        aria-current={paginaActual === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaActual === totalPaginas}
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-main text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Suscríbete a nuestro newsletter</h2>
          <p className="text-primary-100 mb-6">Recibe artículos de salud bucal, consejos de especialistas y promociones exclusivas cada mes.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              aria-label="Email para newsletter"
              required
            />
            <Button type="submit" size="lg" variant="secondary">
              Suscribirse
            </Button>
          </form>
          <p className="text-primary-200 text-xs mt-3">No spam. Solo contenido de valor. Cancela cuando quieras.</p>
        </div>
      </section>
    </div>
  )
}
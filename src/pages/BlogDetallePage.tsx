import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { ArrowLeft, Calendar, Clock, Eye, Tag, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useParams } from "react-router-dom"
import { blogPosts } from "@/data/siteData"

export function BlogDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find(p => p.slug === slug)
  const currentIndex = blogPosts.findIndex(p => p.slug === slug)
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-surface to-primary/5">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Artículo no encontrado</h1>
          <Button asChild><Link to="/blog">Volver al Blog</Link></Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => 
    new Date(dateStr).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })

  return (
    <article className="min-h-screen">
      {/* Hero del Artículo */}
      <header className="relative bg-gradient-to-br from-background via-surface to-primary/5 py-16 lg:py-24">
        <div className="container-main">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Volver al Blog
          </Link>
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{post.categoria}</span>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
              {post.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" aria-hidden="true" />
                <span>{post.autor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <time dateTime={post.fecha}>{formatDate(post.fecha)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{post.tiempoLectura}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>Lectura {post.tiempoLectura}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Imagen destacada */}
      <div className="container-main -mt-12 mb-12">
        <div className="relative aspect-[16/9] max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Eye className="w-10 h-10 text-white/80" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Artículo principal */}
            <div className="lg:col-span-3 space-y-8">
              <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-text prose-p:text-text-muted prose-p:leading-relaxed">
                {post.contenido.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="whitespace-pre-line">{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-border">
                <span className="text-sm font-medium text-text-muted">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog?search=${tag}`} className="px-3 py-1 rounded-full bg-surface text-sm text-text-muted hover:bg-border hover:text-primary transition-colors">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <span className="text-sm font-medium text-text-muted">Compartir:</span>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors" aria-label="Compartir en Facebook">
                    <svg className="w-5 h-5 text-text" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors" aria-label="Compartir en Twitter">
                    <svg className="w-5 h-5 text-text" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors" aria-label="Compartir en WhatsApp">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.369-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m2.83 2.167c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.369-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-border transition-colors" aria-label="Compartir por email">
                    <svg className="w-5 h-5 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Autor */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Tag className="w-8 h-8 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-text">{post.autor}</p>
                      <p className="text-sm text-text-muted">Especialista Odontocúcuta</p>
                    </div>
                  </div>
                </div>

                {/* Artículos relacionados */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold mb-4">Más artículos</h3>
                  <div className="space-y-4">
                    {blogPosts.filter(p => p.slug !== slug && p.categoria === post.categoria).slice(0, 4).map((related) => (
                      <Link key={related.slug} to={`/blog/${related.slug}`} className="flex gap-3 p-3 rounded-xl hover:bg-surface transition-colors group">
                        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Eye className="w-6 h-6 text-primary/50" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text group-hover:text-primary transition-colors line-clamp-2">{related.titulo}</p>
                          <p className="text-xs text-text-muted">{formatDate(related.fecha)} · {related.tiempoLectura}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter */}
                <div className="bg-primary text-white rounded-2xl p-6">
                  <h3 className="font-heading text-lg font-semibold mb-2">Suscríbete</h3>
                  <p className="text-primary-100 text-sm mb-4">Recibe nuestros artículos en tu email.</p>
                  <form className="flex flex-col gap-2" onSubmit={e => e.preventDefault()}>
                    <input type="email" placeholder="Tu email" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-white/50" />
                    <Button type="submit" variant="secondary" size="sm">Suscribirse</Button>
                  </form>
                </div>
              </div>
            </aside>
          </div>

          {/* Navegación entre artículos */}
          <nav className="mt-12 pt-8 border-t border-border" aria-label="Navegación entre artículos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost && (
                <Link to={`/blog/${prevPost.slug}`} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow group">
                  <ChevronLeft className="w-6 h-6 text-primary group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-text-muted">Artículo anterior</p>
                    <p className="font-medium text-text line-clamp-1">{prevPost.titulo}</p>
                  </div>
                </Link>
              )}
              {nextPost && (
                <Link to={`/blog/${nextPost.slug}`} className="flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow group col-start-2">
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Artículo siguiente</p>
                    <p className="font-medium text-text line-clamp-1">{nextPost.titulo}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              )}
            </div>
          </nav>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-white">
        <div className="container-main text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-4">¿Te gustó este artículo?</h2>
          <p className="text-primary-100 mb-6 max-w-xl mx-auto">Comparte con quien lo necesite y suscríbete para recibir más contenido de salud bucal basado en evidencia.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/blog">Ver Todo el Blog <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" /></Link>
            </Button>
            <Button size="lg" variant="ghost" className="w-full sm:w-auto border-white/30 hover:bg-white/10" asChild>
              <Link to="/cita">Agendar Cita</Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  )
}
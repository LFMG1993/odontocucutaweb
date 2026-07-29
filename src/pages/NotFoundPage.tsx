import { Link } from "react-router-dom"
import { Button } from "@/components/shared"
import { AlertTriangle, RefreshCw } from "lucide-react"

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-surface to-primary/5">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-primary" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl font-bold mb-4">Página no encontrada</h1>
        <p className="text-text-muted text-lg mb-8">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild><Link to="/">Volver al Inicio <RefreshCw className="w-4 h-4 ml-2" aria-hidden="true" /></Link></Button>
          <Button variant="outline" asChild><Link to="/servicios">Explorar Servicios</Link></Button>
        </div>
      </div>
    </div>
  )
}
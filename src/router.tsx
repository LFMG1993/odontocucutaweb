import { Navigate, useLocation, type RouteObject } from "react-router-dom"
import { MainLayout } from "@/components/landing/layout/MainLayout"
import { HomePage } from "@/pages/HomePage"
import { NosotrosPage } from "@/pages/NosotrosPage"
import { ServiciosPage } from "@/pages/ServiciosPage"
import { CitaPage } from "@/pages/CitaPage"
import { BlogPage } from "@/pages/BlogPage"
import { ContactoPage } from "@/pages/ContactoPage"
import { ServicioDetallePage } from "@/pages/ServicioDetallePage"
import { BlogDetallePage } from "@/pages/BlogDetallePage"
import { SoportePage } from "@/pages/SoportePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import LandingPage2 from "@/pages/Landing2"

// Portal Profesionales
import {
  DoctorLayout,
  ProtectedDoctorRoute,
} from "@/components/profesionales"
import {
  DoctorLoginPage,
  DoctorForgotPasswordPage,
  DoctorHomePage,
  DoctorLiquidacionesPage,
  DoctorPagosPage,
  DoctorAcuerdosPage,
  DoctorArchivosPage,
  DoctorPerfilPage,
} from "@/pages/profesionales"

// eslint-disable-next-line react-refresh/only-export-components
function LegacyRedirect({ to }: { to: string }) {
  const location = useLocation()
  return (
    <Navigate
      to={{ pathname: to, search: location.search, hash: location.hash }}
      state={location.state}
      replace
    />
  )
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "landing2", element: <LandingPage2 /> },
      { path: "nosotros", element: <NosotrosPage /> },
      { path: "servicios", element: <ServiciosPage /> },
      { path: "servicios/:slug", element: <ServicioDetallePage /> },
      { path: "cita", element: <CitaPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "blog/:slug", element: <BlogDetallePage /> },
      { path: "contacto", element: <ContactoPage /> },
      { path: "soporte", element: <SoportePage /> },
    ],
  },

  // Acceso unificado (profesionales y, a futuro, pacientes)
  {
    path: "/login",
    element: <DoctorLoginPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/recuperar-password",
    element: <DoctorForgotPasswordPage />,
    errorElement: <NotFoundPage />,
  },

  // Rutas legacy para marcadores y PWAs instaladas previamente
  {
    path: "/profesionales/login",
    element: <LegacyRedirect to="/login" />,
  },
  {
    path: "/profesionales/recuperar-password",
    element: <LegacyRedirect to="/recuperar-password" />,
  },

  {
    path: "/profesionales",
    element: (
      <ProtectedDoctorRoute>
        <DoctorLayout />
      </ProtectedDoctorRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DoctorHomePage /> },
      { path: "liquidaciones", element: <DoctorLiquidacionesPage /> },
      { path: "pagos", element: <DoctorPagosPage /> },
      { path: "acuerdos", element: <DoctorAcuerdosPage /> },
      { path: "archivos", element: <DoctorArchivosPage /> },
      { path: "perfil", element: <DoctorPerfilPage /> },
    ],
  },
]

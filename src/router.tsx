import type { RouteObject } from "react-router-dom"
import { Navigate } from "react-router-dom"
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
  DoctorHomePage,
  DoctorLiquidacionesPage,
  DoctorPagosPage,
  DoctorPerfilPage,
} from "@/pages/profesionales"

export const routes: RouteObject[] = [
  // Rutas Públicas de la Clínica Odontológica
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
  // Portal de Profesionales OdontoSync
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
      { path: "perfil", element: <DoctorPerfilPage /> },
      // Ruta antigua de acuerdos: se conserva solo como redirección
      { path: "acuerdos", element: <Navigate to="/profesionales" replace /> },
    ],
  },
  {
    path: "/profesionales/login",
    element: <DoctorLoginPage />,
    errorElement: <NotFoundPage />,
  },
]

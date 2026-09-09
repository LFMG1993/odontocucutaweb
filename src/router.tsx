import type { RouteObject } from "react-router-dom"
import { MainLayout } from "@/components/landing/layout/MainLayout"
import { HomePage } from "@/pages/HomePage"
import { NosotrosPage } from "@/pages/NosotrosPage"
import { ServiciosPage } from "@/pages/ServiciosPage"
import { CitaPage } from "@/pages/CitaPage"
import { BlogPage } from "@/pages/BlogPage"
import { ContactoPage } from "@/pages/ContactoPage"
import { ServicioDetallePage } from "@/pages/ServicioDetallePage"
import { BlogDetallePage } from "@/pages/BlogDetallePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import LandingPage2 from "@/pages/Landing2"

// Portal Profesionales
import {
  DoctorLayout,
  ProtectedDoctorRoute,
} from "@/components/profesionales"
import {
  DoctorLoginPage,
  DoctorDashboardPage,
  DoctorPagosPage,
  DoctorAcuerdosPage,
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
      { index: true, element: <DoctorDashboardPage /> },
      { path: "pagos", element: <DoctorPagosPage /> },
      { path: "acuerdos", element: <DoctorAcuerdosPage /> },
      { path: "perfil", element: <DoctorPerfilPage /> },
    ],
  },
  {
    path: "/profesionales/login",
    element: <DoctorLoginPage />,
    errorElement: <NotFoundPage />,
  },
]

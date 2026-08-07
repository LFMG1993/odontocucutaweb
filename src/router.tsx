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
    ],
  },
]

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { routes } from "./router"
import { CitaModalProvider } from "./context/CitaModalContext"
import { ToastProvider, ConfirmProvider } from "./components/ui"

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <ConfirmProvider>
          <CitaModalProvider>
            <RouterProvider router={router} />
          </CitaModalProvider>
        </ConfirmProvider>
      </ToastProvider>
    </HelmetProvider>
  )
}

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { routes } from "./router"
import { CitaModalProvider } from "./context/CitaModalContext"
import { WhatsAppChatButton } from "./components/shared"

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <HelmetProvider>
      <CitaModalProvider>
        <RouterProvider router={router} />
        <WhatsAppChatButton />
      </CitaModalProvider>
    </HelmetProvider>
  )
}

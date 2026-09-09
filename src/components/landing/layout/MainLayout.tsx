import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Header } from "@/components/landing/layout/Header"
import { Footer } from "@/components/landing/layout/Footer"
import { WhatsAppChatButton } from "@/components/shared"

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppChatButton />
    </div>
  )
}

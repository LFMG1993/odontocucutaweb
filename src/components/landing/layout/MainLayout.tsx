import { Outlet } from "react-router-dom"
import { Header } from "@/components/landing/layout/Header"
import { Footer } from "@/components/landing/layout/Footer"

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
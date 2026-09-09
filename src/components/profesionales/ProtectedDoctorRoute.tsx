import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useDoctorAuthStore } from '@/store/profesionales'
import { ChangePasswordModal } from './ChangePasswordModal'

export const ProtectedDoctorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isInitialized, mustChangePassword, checkAuth } =
    useDoctorAuthStore()
  const location = useLocation()

  useEffect(() => {
    if (!isInitialized) {
      checkAuth()
    }
  }, [isInitialized, checkAuth])

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-sm animate-pulse">
          Validando credenciales de profesional...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/profesionales/login" state={{ from: location }} replace />
  }

  return (
    <>
      {mustChangePassword && <ChangePasswordModal isMandatory />}
      {children}
    </>
  )
}

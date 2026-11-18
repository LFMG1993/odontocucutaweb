import React from 'react'
import { Check, X } from 'lucide-react'
import { getPasswordRequirements } from '@/utils/password'

interface PasswordRequirementsProps {
  password: string
  className?: string
}

/**
 * Lista de requisitos de contraseña evaluados en tiempo real.
 */
export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, className = '' }) => {
  const requirements = getPasswordRequirements(password)

  return (
    <ul className={`space-y-1 ${className}`} aria-label="Requisitos de contraseña">
      {requirements.map((requirement) => (
        <li
          key={requirement.id}
          className={`flex items-center gap-1.5 text-[11px] transition-colors ${
            requirement.valid ? 'text-emerald-600' : 'text-slate-400'
          }`}
        >
          {requirement.valid ? (
            <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
          ) : (
            <X className="w-3 h-3 shrink-0" aria-hidden="true" />
          )}
          <span>{requirement.label}</span>
        </li>
      ))}
    </ul>
  )
}

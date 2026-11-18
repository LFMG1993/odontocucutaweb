/**
 * Reglas de contraseña exigidas por el backend OdontoSync:
 * 8+ caracteres, mayúscula, minúscula, número y carácter especial.
 */
export interface PasswordRequirement {
  id: string
  label: string
  valid: boolean
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: 'length',
      label: 'Mínimo 8 caracteres',
      valid: password.length >= 8,
    },
    {
      id: 'upper',
      label: 'Al menos una letra mayúscula',
      valid: /[A-ZÁÉÍÓÚÜÑ]/.test(password),
    },
    {
      id: 'lower',
      label: 'Al menos una letra minúscula',
      valid: /[a-záéíóúüñ]/.test(password),
    },
    {
      id: 'number',
      label: 'Al menos un número',
      valid: /\d/.test(password),
    },
    {
      id: 'special',
      label: 'Al menos un carácter especial (!@#$%...)',
      valid: /[^A-Za-z0-9\s]/.test(password),
    },
  ]
}

export function isStrongPassword(password: string): boolean {
  return getPasswordRequirements(password).every((requirement) => requirement.valid)
}

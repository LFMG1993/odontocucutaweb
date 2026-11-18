import React, { useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface CodeInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  autoFocus?: boolean
  id?: string
  label?: string
  /** Cantidad de dígitos del código. Por defecto 6. */
  length?: number
}

/**
 * Campo de código OTP con 6 casillas independientes.
 *
 * Soporta:
 * - Escritura dígito a dígito con avance automático.
 * - Pegado (Ctrl/Cmd+V) desde cualquier casilla, distribuyendo los dígitos.
 * - Autocompletado de códigos recibidos por SMS/correo (`autocomplete="one-time-code"`).
 * - Navegación con flechas, Backspace/Delete, Home/End.
 */
export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  disabled = false,
  autoFocus = false,
  id = 'codigo-verificacion',
  label = 'Código de verificación',
  length = 6,
}) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const digits = Array.from({ length }, (_, index) => value[index] ?? '')

  const enfocar = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1))
    const input = inputsRef.current[clamped]
    if (!input) return
    input.focus()
    input.select()
  }

  const emitir = (nuevo: string) => {
    onChange(nuevo.replace(/\D/g, '').slice(0, length))
  }

  const escribir = (index: number, texto: string) => {
    const limpio = texto.replace(/\D/g, '')
    if (!limpio) {
      borrarDigito(index)
      return
    }

    // Los dígitos siempre ocupan casillas contiguas desde la primera: si se
    // escribe en una casilla posterior a la última llena, se escribe al final.
    const destino = Math.min(index, value.length)

    if (limpio.length > 1) {
      // Pegado o autocompletado: si el texto ya tiene el largo del código se
      // reemplaza todo; si es un fragmento, se inserta desde la casilla actual
      // conservando los dígitos que vienen después.
      const inicio = limpio.length >= length ? 0 : destino
      const resto = inicio === 0 && limpio.length >= length ? '' : value.slice(inicio + limpio.length)
      emitir(value.slice(0, inicio) + limpio + resto)
      enfocar(Math.min(inicio + limpio.length, length - 1))
      return
    }

    if (destino >= value.length) {
      emitir(value + limpio)
    } else {
      emitir(value.slice(0, destino) + limpio + value.slice(destino + 1))
    }
    enfocar(destino + 1)
  }

  const borrarDigito = (index: number) => {
    emitir(value.slice(0, index) + value.slice(index + 1))
    enfocar(index)
  }

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    escribir(index, event.target.value)
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    // Escritura directa de un dígito (teclados físicos): evita que el
    // navegador lo concatene al dígito existente.
    if (/^\d$/.test(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault()
      escribir(index, event.key)
      return
    }

    switch (event.key) {
      case 'Backspace':
        event.preventDefault()
        if (digits[index]) {
          borrarDigito(index)
        } else if (index > 0) {
          emitir(value.slice(0, index - 1) + value.slice(index))
          enfocar(index - 1)
        }
        break
      case 'Delete':
        event.preventDefault()
        borrarDigito(index)
        break
      case 'ArrowLeft':
        event.preventDefault()
        enfocar(index - 1)
        break
      case 'ArrowRight':
        event.preventDefault()
        enfocar(index + 1)
        break
      case 'Home':
        event.preventDefault()
        enfocar(0)
        break
      case 'End':
        event.preventDefault()
        enfocar(length - 1)
        break
      default:
        break
    }
  }

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const texto = event.clipboardData.getData('text')
    if (texto) escribir(index, texto)
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
    // Selecciona el dígito para que escribir/pegar lo reemplace.
    inputsRef.current[index]?.select()
  }

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-700 mb-1.5">
        {label}
      </label>

      <div
        className="flex items-center gap-1.5 sm:gap-2"
        role="group"
        aria-label={label}
        onPaste={(event) => {
          const texto = event.clipboardData.getData('text')
          if (texto.replace(/\D/g, '')) {
            event.preventDefault()
            escribir(0, texto)
          }
        }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element
            }}
            id={index === 0 ? id : undefined}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            name={index === 0 ? 'one-time-code' : undefined}
            pattern="[0-9]*"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={digit}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            aria-label={`Dígito ${index + 1} de ${length}`}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={(event) => handlePaste(index, event)}
            onFocus={() => handleFocus(index)}
            onBlur={() => setFocusedIndex((actual) => (actual === index ? null : actual))}
            className={cn(
              'flex-1 min-w-0 h-14 text-center text-xl font-mono font-bold rounded-xl border text-slate-900 transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-500',
              'disabled:opacity-60 disabled:cursor-not-allowed',
              focusedIndex === index
                ? 'border-blue-500 bg-white ring-2 ring-blue-600/25'
                : digit
                  ? 'border-slate-300 bg-slate-50/80'
                  : 'border-slate-200 bg-slate-50/60'
            )}
          />
        ))}
      </div>
    </div>
  )
}

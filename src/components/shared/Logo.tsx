import type { SVGProps } from "react"

interface LogoProps extends SVGProps<SVGSVGElement> {
  /** Mostrar u ocultar el eslogan "Asistencia Odontológica Completa". */
  showSlogan?: boolean
}

/**
 * Logo de OdontoCúcuta S.A. (vector).
 * Reproduce el SVG original con las curvas rojas, el texto "ODONTO Cúcuta"
 * en azul oscuro (#1e3a8a) y el eslogan.
 *
 * Al ser vectorial, escala sin perder resolución: ajusta el tamaño con
 * `className="h-10 w-auto"` (proporcional al viewBox 530x210).
 */
export function Logo({ showSlogan = true, className = "h-10 w-auto", ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 530 210"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="OdontoCúcuta S.A."
      className={className}
      {...props}
    >
      {/* Elementos gráficos: curvas rojas y puntos */}
      <g stroke="#dc2626" strokeWidth={4} fillRule="evenodd">
        <path d="M 55 100 C 55 65, 90 30, 160 30" fill="none" transform="translate(-10, -15)" />
        <circle cx="45" cy="85" r="6" fill="#dc2626" transform="translate(-10, -15)" />
        <path d="M 475 110 C 475 145, 440 180, 370 180" fill="none" transform="translate(10, 15)" />
        <circle cx="485" cy="125" r="6" fill="#dc2626" transform="translate(10, 15)" />
      </g>

      {/* Texto */}
      <g textAnchor="middle" transform="translate(265, 125)">
        <text
          x="-85"
          y="0"
          fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
          fontWeight={900}
          fontSize={58}
          fill="#1e3a8a"
        >
          ODONTO
        </text>
        <text
          x="90"
          y="0"
          fontFamily="Arial, 'Helvetica Neue', sans-serif"
          fontWeight={400}
          fontSize={58}
          fill="#1e3a8a"
        >
          Cúcuta
        </text>
        {showSlogan && (
          <text
            x="0"
            y="35"
            fontFamily="Arial, 'Helvetica Neue', sans-serif"
            fontWeight={300}
            fontSize={18}
            letterSpacing={0.5}
            fill="#1e3a8a"
          >
            Asistencia Odontológica Completa
          </text>
        )}
      </g>
    </svg>
  )
}

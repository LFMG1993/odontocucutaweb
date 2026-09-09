import type { SVGProps } from "react"
import OdontocucutaLogoSvg from "@/assets/icons/odontocucuta.svg?react"
import WhatsAppLogoSvg from "@/assets/icons/whatsapp.svg?react"
import {
  Shield,
  Zap,
  Headphones,
  Truck,
  Users,
  Award,
  GraduationCap,
  MapPin,
  Smile,
  AlignCenterHorizontal,
  Bone,
  Microscope,
  Baby,
  Puzzle,
  HeartPulse,
  Brain,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Star,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Clock,
} from "lucide-react"

// Iconos personalizados
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return <WhatsAppLogoSvg {...props} />
}

function OdontocucutaIcon(props: SVGProps<SVGSVGElement>) {
  return <OdontocucutaLogoSvg {...props} />
}

export const icons = {
  // personalizados
  whatsapp: WhatsAppIcon,
  odontocucuta: OdontocucutaIcon,
  // lucide-react
  shield: Shield,
  zap: Zap,
  headphones: Headphones,
  truck: Truck,
  users: Users,
  award: Award,
  graduationCap: GraduationCap,
  mapPin: MapPin,
  smile: Smile,
  alignCenterHorizontal: AlignCenterHorizontal,
  bone: Bone,
  microscope: Microscope,
  baby: Baby,
  puzzle: Puzzle,
  heartPulse: HeartPulse,
  brain: Brain,
  arrowRight: ArrowRight,
  checkCircle: CheckCircle,
  sparkles: Sparkles,
  star: Star,
  menu: Menu,
  x: X,
  phone: Phone,
  mail: Mail,
  chevronDown: ChevronDown,
  clock: Clock,
} as const

export type IconName = keyof typeof icons

export type IconProps = { name: IconName } & SVGProps<SVGSVGElement>

/**
 * Componente genérico para renderizar cualquier icono del registro por nombre.
 */
export function Icon({ name, ...props }: IconProps) {
  const Component = icons[name]
  return <Component {...props} />
}

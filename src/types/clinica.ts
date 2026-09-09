export interface Servicio {
  slug: string
  titulo: string
  descripcionCorta: string
  descripcionLarga: string
  imagen: string
  icono: string
  caracteristicas: string[]
  beneficios: string[]
  duracion?: string
  precioDesde?: string
}

export interface EquipoMedico {
  id: string
  nombre: string
  especialidad: string
  foto: string
  bio: string
  formacion: string[]
  experiencia: string
  redes?: {
    linkedin?: string
    instagram?: string
  }
}

export interface BlogPost {
  slug: string
  titulo: string
  extracto: string
  contenido: string
  imagen: string
  autor: string
  fecha: string
  categoria: string
  tags: string[]
  tiempoLectura: string
}

export interface Sede {
  id: string
  nombre: string
  direccion: string
  telefono: string
  celular: string
  email: string
  horario: string
  mapaUrl: string
  imagen: string
}

export interface Convenio {
  id: string
  nombre: string
  logo: string
  descripcion: string
  url?: string
}

export interface Afiliacion {
  id: string
  nombre: string
  nivel: "oro" | "plata" | "bronce"
  precioMensual: string
  descripcion: string
  beneficios: string[]
  destacado?: boolean
}

export interface Testimonio {
  id: string
  nombre: string
  tratamiento: string
  texto: string
  foto: string
  rating: number
  fecha: string
}

export interface Estadistica {
  label: string
  valor: string | number
  icono: string
}

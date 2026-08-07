export interface SedeConfig {
  id: string
  nombre: string
  nombreCorto: string
  direccion: string
  telefono: string
  celular: string
  horarioTexto: string
  mapaEmbed: string
  horarios: {
    diaInicial: string
    diaFinal: string
    bloques: { abre: string; cierra: string }[]
  }[]
}

export const siteConfig = {
  name: "OdontoCúcuta S.A.",
  slogan: "Asistencia Odontológica Completa",
  anioInicio: 1992,
  siteUrl: "https://odontocucuta.com",
  defaultOgImage: "https://odontocucuta.com/images/og-image.jpg",
  email: "contacto@odontocucuta.com",
  // Sede principal Caobos (vigente según datos de la clínica)
  telephone: "573181441442",
  whatsappNumber: "573181441442",
  priceRange: "$$",
  geo: {
    latitude: 7.8808249,
    longitude: -72.4996414,
  },
  address: {
    streetAddress: "Avenida 3E # 13A-07, Barrio Caobos",
    addressLocality: "Cúcuta",
    addressRegion: "Norte de Santander",
    postalCode: "540001",
    addressCountry: "CO",
  },
  areaServed: [
    { "@type": "City", "name": "Cúcuta" },
    { "@type": "City", "name": "Villa del Rosario" },
    { "@type": "City", "name": "Los Patios" },
    { "@type": "State", "name": "Norte de Santander" },
    { "@type": "Country", "name": "Colombia" },
  ],
  sameAs: [
    "https://facebook.com/Odontocucuta",
    "https://instagram.com/odontocucuta",
    "https://twitter.com/odontocucuta1",
  ],
  services: [
    "Odontología General",
    "Cirugía Maxilofacial",
    "Implantología",
    "Odontopediatría",
    "Estomatología",
    "Ortodoncia General",
    "Periodoncia",
    "Rehabilitación Oral",
    "Endodoncia",
    "Bichectomía",
    "Odontología Láser",
  ],
  serviceType: [
    "Odontología General en Cúcuta",
    "Ortodoncia en Cúcuta",
    "Implantología en Cúcuta",
    "Endodoncia en Cúcuta",
    "Cirugía Maxilofacial en Cúcuta",
    "Odontopediatría en Cúcuta",
    "Rehabilitación Oral en Cúcuta",
    "Periodoncia en Cúcuta",
    "Estomatología en Cúcuta",
    "Bichectomía en Cúcuta",
    "Odontología Láser en Cúcuta",
  ],
}

export const sedesConfig: SedeConfig[] = [
  {
    id: "caobos",
    nombre: "Los Caobos",
    nombreCorto: "Los Caobos",
    direccion: "Avenida 3E # 13A-07, Barrio Caobos, Cúcuta",
    telefono: "6075955068",
    celular: "3181441442",
    horarioTexto: "Lun a Vie: 7:30 AM - 12:00 PM y 2:00 PM - 6:30 PM · Sáb: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM",
    mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.146208343513!2d-72.49964142512684!3d7.880824905305141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e513a201c107f9f%3A0xe543e2646c243ee7!2sCl%C3%ADnica%20Odontoc%C3%BAcuta!5e0!3m2!1ses-419!2sco!4v1786060000000!5m2!1ses-419!2sco",
    horarios: [
      {
        diaInicial: "Monday",
        diaFinal: "Friday",
        bloques: [
          { abre: "07:30", cierra: "12:00" },
          { abre: "14:00", cierra: "18:30" },
        ],
      },
      {
        diaInicial: "Saturday",
        diaFinal: "Saturday",
        bloques: [
          { abre: "08:00", cierra: "12:00" },
          { abre: "14:00", cierra: "18:00" },
        ],
      },
    ],
  },
  {
    id: "atalaya",
    nombre: "Sede Atalaya",
    nombreCorto: "Atalaya",
    direccion: "Manzana 5 Lote 19, Atalaya Primera Etapa, Cúcuta",
    telefono: "6075010370",
    celular: "3164682016",
    horarioTexto: "Lun a Vie: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM · Sáb: 8:30 AM - 12:00 PM",
    mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15808.287265977926!2d-72.540000!3d7.890000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e51390000000000%3A0x0000000000000000!2sAtalaya%20Cucuta!5e0!3m2!1ses-419!2sco!4v1786060000001!5m2!1ses-419!2sco",
    horarios: [
      {
        diaInicial: "Monday",
        diaFinal: "Friday",
        bloques: [
          { abre: "08:00", cierra: "12:00" },
          { abre: "14:00", cierra: "18:00" },
        ],
      },
      {
        diaInicial: "Saturday",
        diaFinal: "Saturday",
        bloques: [{ abre: "08:30", cierra: "12:00" }],
      },
    ],
  },
  {
    id: "libertad",
    nombre: "Sede La Libertad",
    nombreCorto: "La Libertad",
    direccion: "Avenida Principal # 15A-08, Cúcuta",
    telefono: "6075010331",
    celular: "3164714020",
    horarioTexto: "Lun a Vie: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM · Sáb: 8:30 AM - 12:00 PM",
    mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15808.5!2d-72.48!3d7.87!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e513b!2sLa%20Libertad%20Cucuta!5e0!3m2!1ses-419!2sco!4v1786060000002!5m2!1ses-419!2sco",
    horarios: [
      {
        diaInicial: "Monday",
        diaFinal: "Friday",
        bloques: [
          { abre: "08:00", cierra: "12:00" },
          { abre: "14:00", cierra: "18:00" },
        ],
      },
      {
        diaInicial: "Saturday",
        diaFinal: "Saturday",
        bloques: [{ abre: "08:30", cierra: "12:00" }],
      },
    ],
  },
  {
    id: "pamplona",
    nombre: "Sede Pamplona",
    nombreCorto: "Pamplona",
    direccion: "Avenida Santander, Condominio Almeyda, Torre B, Pamplona",
    telefono: "6075683773",
    celular: "3125216991",
    horarioTexto: "Lun a Vie: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM · Sáb: 8:30 AM - 12:00 PM",
    mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.5582319202865!2d-72.65171!3d7.37359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e51e18000000000%3A0x0000000000000000!2sPamplona%20Norte%20de%20Santander!5e0!3m2!1ses-419!2sco!4v1786060000003!5m2!1ses-419!2sco",
    horarios: [
      {
        diaInicial: "Monday",
        diaFinal: "Friday",
        bloques: [
          { abre: "08:00", cierra: "12:00" },
          { abre: "14:00", cierra: "18:00" },
        ],
      },
      {
        diaInicial: "Saturday",
        diaFinal: "Saturday",
        bloques: [{ abre: "08:30", cierra: "12:00" }],
      },
    ],
  },
]

export const siteKeywords =
  "clínica odontológica Cúcuta, OdontoCúcuta, odontólogo en Cúcuta, dentista Cúcuta, ortodoncia Cúcuta, implantes dentales Cúcuta, endodoncia Cúcuta, cirugía maxilofacial, odontopediatría, rehabilitación oral, periodoncia, estomatología, bichectomía, odontología láser, clínica dental Norte de Santander, sedes OdontoCúcuta"

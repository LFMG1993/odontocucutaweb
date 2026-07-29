import type { Servicio, EquipoMedico, BlogPost, Sede, Convenio, Testimonio, Estadistica } from "@/types"

export const servicios: Servicio[] = [
  {
    slug: "odontologia-general",
    titulo: "Odontología General",
    descripcionCorta: "Restauración dental, prevención y mantenimiento de la salud bucal integral.",
    descripcionLarga: `La odontología general es la base de la salud bucal. En Odontocúcuta nos especializamos en la prevención, diagnóstico y tratamiento de las enfermedades dentales más comunes. Nuestro equipo de odontólogos generales realiza desde limpiezas profesionales y fluorizaciones hasta restauraciones estéticas con resinas compuestas de última generación, coronas, puentes y prótesis removibles.

Contamos con tecnología de vanguardia como radiografía digital, cámaras intraorales y sistemas de aislamiento absoluto para garantizar tratamientos precisos, cómodos y duraderos. Nuestro enfoque preventivo busca detectar problemas a tiempo y evitar tratamientos más complejos y costosos.`,
    imagen: "/images/servicios/odontologia-general.jpg",
    icono: "Tooth",
    caracteristicas: [
      "Limpiezas profesionales y profilaxis",
      "Restauraciones estéticas (resinas, incrustaciones)",
      "Tratamiento de caries y lesiones cervicales",
      "Coronas y puentes fijos",
      "Prótesis removibles completas y parciales",
      "Sellantes de fosas y fisuras",
      "Aplicación de flúor y barniz fluorado",
      "Educación en higiene oral personalizada",
    ],
    beneficios: [
      "Prevención de enfermedades periodontales",
      "Detección temprana de patologías",
      "Tratamientos mínimamente invasivos",
      "Resultados estéticos naturales",
      "Mejora de la función masticatoria",
    ],
    duracion: "30-60 min por sesión",
    precioDesde: "$80.000 COP",
  },
  {
    slug: "cirugia-maxilofacial",
    titulo: "Cirugía Maxilofacial",
    descripcionCorta: "Procedimientos quirúrgicos especializados en cavidad bucal y territorio cráneofacial.",
    descripcionLarga: `La cirugía maxilofacial aborda patologías complejas de la cavidad oral, maxilares, mandíbula y estructuras faciales. Nuestros cirujanos maxilofaciales certificados realizan desde exodoncias complejas (cordales incluidos, dientes supernumerarios) hasta cirugía ortognática, reconstrucción ósea, implantes cigomáticos y tratamiento de traumatismos faciales.

Contamos con quirófano propio equipado con monitorización completa, piezocirugía ultrasónica para osteotomías precisas, y sedación consciente endovenosa supervisada por anestesiólogo para máxima seguridad y confort del paciente.`,
    imagen: "/images/servicios/cirugia-maxilofacial.jpg",
    icono: "Scalpel",
    caracteristicas: [
      "Exodoncias complejas e incluidos (cordales)",
      "Cirugía ortognática (corrección maxilar)",
      "Injertos óseos y regeneración tisular",
      "Implantes cigomáticos y pterigoideos",
      "Tratamiento de quistes y tumores maxilares",
      "Traumatología facial y fracturas maxilofaciales",
      "Cirugía preprotésica y regularización alveolar",
      "Frenectomías y cirugía de tejidos blandos",
    ],
    beneficios: [
      "Equipo quirúrgico certificado y experimentado",
      "Tecnología piezocirugía de precisión",
      "Sedación consciente supervisada",
      "Recuperación más rápida y menos dolor",
      "Resultados funcionales y estéticos",
    ],
    duracion: "60-180 min según procedimiento",
    precioDesde: "$350.000 COP",
  },
  {
    slug: "ortodoncia",
    titulo: "Ortodoncia General",
    descripcionCorta: "Corrección de malposiciones dentales y maxilares para estética y función.",
    descripcionLarga: `La ortodoncia no solo alinea dientes, corrige la mordida, mejora la función masticatoria, la fonación y la estética facial. En Odontocúcuta ofrecemos tratamientos para niños, adolescentes y adultos con las técnicas más avanzadas: brackets autoligables (Damon), brackets estéticos de zafiro, alineadores invisibles (Invisalign, Spark) y ortodoncia lingual.

Nuestro ortodoncista certificado realiza diagnóstico 3D con escáner intraoral iTero, CBCT y cefalometría digital para planificación precisa. Tratamos apiñamientos, diastemas, mordida abierta, cruzada, profunda, prognatismo y retrognatia.`,
    imagen: "/images/servicios/ortodoncia.jpg",
    icono: "Smile",
    caracteristicas: [
      "Brackets metálicos autoligables (Damon System)",
      "Brackets estéticos de zafiro/cristal",
      "Alineadores invisibles (Invisalign, Spark)",
      "Ortodoncia lingual (Incognito)",
      "Ortodoncia interceptiva en niños",
      "Expansión maxilar y ortopedia funcional",
      "Retención fija y removible post-tratamiento",
      "Seguimiento digital con DentalMonitoring",
    ],
    beneficios: [
      "Mejora estética de la sonrisa y perfil facial",
      "Corrección de problemas funcionales (mordida)",
      "Facilita higiene oral y previene caries/periodontitis",
      "Reduce desgaste dental anómalo",
      "Opciones discretas para adultos profesionales",
    ],
    duracion: "12-30 meses según complejidad",
    precioDesde: "$2.500.000 COP",
  },
  {
    slug: "implantologia",
    titulo: "Implantología",
    descripcionCorta: "Rehabilitación con implantes dentales de última generación para recuperar función y estética.",
    descripcionLarga: `Los implantes dentales son la solución gold standard para reemplazar dientes perdidos. En Odontocúcuta realizamos cirugía guiada por navegación 3D (X-Guide, Navident) para máxima precisión, mínima invasividad y resultados predecibles. Trabajamos con sistemas de implantes premium (Straumann, Nobel Biocare, Zimmer Biomet) con superficies SLActive/TiUnite para osteointegración acelerada.

Ofrecemos desde implante unitario hasta rehabilitaciones completas All-on-4/All-on-6, carga inmediata, elevación de seno maxilar (técnica crestal y lateral), injertos óseos en bloque, regeneración guiada (GBR) y tejido conectivo.`,
    imagen: "/images/servicios/implantologia.jpg",
    icono: "Bone",
    caracteristicas: [
      "Implante unitario con corona atornillada",
      "Puentes sobre implantes (múltiples dientes)",
      "All-on-4 / All-on-6 (arcada completa fija)",
      "Carga inmediata (dientes fijos en 24-48h)",
      "Elevación de seno maxilar (cresta/lateral)",
      "Regeneración ósea guiada (GBR) y PRF",
      "Injertos de tejido conectivo (estética gingival)",
      "Mantenimiento y higiene periimplantaria",
    ],
    beneficios: [
      "Función masticatoria igual a diente natural",
      "Preservación ósea y prevención de reabsorción",
      "Estética superior, sin ganchos ni paladar",
      "Durabilidad 20+ años con cuidado adecuado",
      "Mejora calidad de vida y autoestima",
    ],
    duracion: "3-6 meses (convencional) / 24-48h (carga inmediata)",
    precioDesde: "$3.200.000 COP",
  },
  {
    slug: "endodoncia",
    titulo: "Endodoncia",
    descripcionCorta: "Tratamiento de conductos radiculares con microscopio operatorio para salvar dientes comprometidos.",
    descripcionLarga: `La endodoncia (tratamiento de conductos) salva dientes con pulpa inflamada o necrótica por caries profunda, traumatismos o fracturas. Nuestros endodoncistas usan microscopio operatorio (hasta 25x), localizadores apicales electrónicos, sistemas rotatorios de níquel-titanio, irrigación activada por ultrasonido y láser para desinfección 3D del sistema de conductos.

Realizamos retratamientos endodónticos, cirugía apical (apicectomía), tratamiento de reabsorciones, perforaciones y dientes con anatomía compleja (conductos calcificados, curvaturas severas, conductos accesorios).`,
    imagen: "/images/servicios/endodoncia.jpg",
    icono: "Microscope",
    caracteristicas: [
      "Tratamiento de conductos en una o varias sesiones",
      "Endodoncia microscópica de alta precisión",
      "Retratamientos endodónticos (re-endodoncia)",
      "Cirugía apical (apicectomía, retroobturación)",
      "Tratamiento de perforaciones y reabsorciones",
      "Blanqueamiento interno (dientes no vitales)",
      "Restauración post-endodoncia (perno, corona)",
      "Manejo de urgencias endodónticas (dolor agudo)",
    ],
    beneficios: [
      "Conservación del diente natural",
      "Eliminación del dolor e infección",
      "Tecnología microscópica para mayor éxito",
      "Tratamiento indoloro con anestesia efectiva",
      "Alternativa más económica que implante + corona",
    ],
    duracion: "60-120 min por sesión",
    precioDesde: "$450.000 COP",
  },
  {
    slug: "odontopediatria",
    titulo: "Odontopediatría",
    descripcionCorta: "Atención especializada para niños de 3 a 14 años en ambiente lúdico y sin miedo.",
    descripcionLarga: `La odontopediatría establece las bases de una salud bucal para toda la vida. Nuestros odontopediatras certificados manejan técnicas de conducta (Tell-Show-Do, modelado, refuerzo positivo), sedación consciente con óxido nitroso y anestesia general en quirófano para casos complejos.

Nuestro espacio infantil está diseñado para que los niños se sientan seguros y entretenidos. Educamos a padres en higiene, alimentación, hábitos (chupete, biberón, succión digital) y prevención temprana. Programa "Primer Diente, Primera Visita" antes del año de edad.`,
    imagen: "/images/servicios/odontopediatria.jpg",
    icono: "Baby",
    caracteristicas: [
      "Primera visita y control de erupción (0-3 años)",
      "Sellantes de fosas y fisuras preventivos",
      "Aplicación tópica de flúor y barniz fluorado",
      "Restauraciones estéticas en dientes temporales",
      "Pulpotomías y pulpectomías (endodoncia infantil)",
      "Mantenedores de espacio fijos y removibles",
      "Ortodoncia interceptiva y ortopedia funcional",
      "Manejo de traumatismos dentales agudos",
      "Sedación con óxido nitroso (gas de la risa)",
      "Tratamiento bajo anestesia general (quirófano)",
    ],
    beneficios: [
      "Experiencia positiva sin miedo al dentista",
      "Prevención temprana de caries y maloclusiones",
      "Detección oportuna de alteraciones de crecimiento",
      "Educación a padres para hábitos saludables",
      "Ambiente adaptado y equipo especializado",
    ],
    duracion: "30-45 min por cita",
    precioDesde: "$70.000 COP",
  },
  {
    slug: "rehabilitacion-oral",
    titulo: "Rehabilitación Oral",
    descripcionCorta: "Devolvemos función, estética y armonía oral con prótesis fijas, removibles y sobre implantes.",
    descripcionLarga: `La rehabilitación oral integra múltiples especialidades para restaurar bocas muy deterioradas. Nuestros prostodoncistas diseñan sonrisas con Digital Smile Design (DSD), mock-up guiado y cerámicas de alta estética (E.max, zirconia multicapa, feldespática). Trabajamos con laboratorio digital propio (CAD/CAM, fresado 5 ejes, impresión 3D) para precisión milimétrica.

Rehabilitamos desde una corona unitaria hasta arcadas completas: coronas, veneers, incrustaciones, puentes, prótesis híbridas (Toronto), sobredentaduras sobre locators/barras, y prótesis totales con estética natural (dientes BIOFORM, encía caracterizada).`,
    imagen: "/images/servicios/rehabilitacion-oral.jpg",
    icono: "Puzzle",
    caracteristicas: [
      "Carillas de porcelana (veneers) y lentes de contacto",
      "Coronas y puentes en zirconia / E.max / metal-cerámica",
      "Incrustaciones inlay/onlay/overlay cerámicas",
      "Prótesis fijas sobre implantes (unitarias, puentes, All-on-X)",
      "Prótesis híbridas (Toronto Bridge) atornilladas",
      "Sobredentaduras sobre locators / barra Ackerman",
      "Prótesis totales removibles (BPS, BIOFUNCIONAL)",
      "Rehabilitación neuromuscular (DTR, desprogramación)",
      "Digital Smile Design (DSD) y mock-up estético",
    ],
    beneficios: [
      "Recuperación total de función masticatoria",
      "Estética armónica y natural (DSD)",
      "Precisión digital CAD/CAM (margen < 50µm)",
      "Materiales biocompatibles y duraderos",
      "Mejora fonación y soporte facial",
    ],
    duracion: "2-8 citas según complejidad",
    precioDesde: "$600.000 COP",
  },
  {
    slug: "periodoncia",
    titulo: "Periodoncia",
    descripcionCorta: "Tratamiento de encías y tejidos de soporte: gingivitis, periodontitis, recesiones y cirugía plástica.",
    descripcionLarga: `La periodoncia trata las enfermedades que afectan encía, ligamento periodontal y hueso alveolar. La periodontitis es la principal causa de pérdida dental en adultos y está vinculada a enfermedades sistémicas (diabetes, cardiovasculares, parto prematuro). Nuestros periodoncistas realizan desde raspado y alisado radicular (curetaje) hasta cirugía regenerativa con Emdogain, PRF, membranas de colágeno y injertos óseos.

Tratamos recesiones gingivales con técnicas de túnel e injerto de tejido conectivo, alargamiento coronario estético y funcional, gingivectomía láser, y mantenimiento periodontal de por vida (SPT).`,
    imagen: "/images/servicios/periodoncia.jpg",
    icono: "HeartPulse",
    caracteristicas: [
      "Raspado y alisado radicular (curetaje) ultrasonico",
      "Cirugía periodontal (colgajo, regenerativa, resectiva)",
      "Regeneración tisular guiada (Emdogain, PRF, membranas)",
      "Injertos de tejido conectivo (recesiones)",
      "Alargamiento coronario estético y funcional",
      "Gingivectomía / gingivoplastia con láser diodo",
      "Tratamiento periimplantitis (descontaminación láser)",
      "Mantenimiento periodontal de soporte (SPT)",
      "Periodoncia estética (diseño de sonrisa gingival)",
    ],
    beneficios: [
      "Detención de la pérdida ósea y dental",
      "Mejora estética de la línea gingival",
      "Reducción de movilidad dental",
      "Control de halitosis de origen periodontal",
      "Impacto positivo en salud sistémica",
    ],
    duracion: "45-90 min por cuadrante/sesión",
    precioDesde: "$180.000 COP",
  },
  {
    slug: "estomatologia",
    titulo: "Estomatología",
    descripcionCorta: "Diagnóstico y manejo de patologías de mucosa oral, ATM, dolor orofacial y medicina oral.",
    descripcionLarga: `La estomatología / medicina oral aborda patologías de la mucosa bucal, glándulas salivales, trastornos de la articulación temporomandibular (ATM), dolor orofacial crónico, bruxismo, apnea del sueño y manifestaciones orales de enfermedades sistémicas. Nuestro estomatólogo realiza biopsias, exfoliativas, pruebas de alergia a materiales dentales y manejo multidisciplinario.

Tratamos liquen plan oral, candidiasis recurrente, síndrome de boca ardiente, neuralgias trigémino, disfunción temporomandibular (DTM), cefaleas tensionales, y screening de cáncer oral con VELscope.`,
    imagen: "/images/servicios/estomatologia.jpg",
    icono: "Brain",
    caracteristicas: [
      "Diagnóstico de lesiones de mucosa oral (biopsia)",
      "Trastornos de ATM / DTM (ferulas, fisioterapia, toxina botulínica)",
      "Dolor orofacial crónico y neuralgias",
      "Bruxismo y apretamiento (férulas de descarga, Botox)",
      "Apnea obstructiva del sueño (dispositivos de avance mandibular)",
      "Patología de glándulas salivales (sialolitiasis, xerostomía)",
      "Manifestaciones orales de enfermedades sistémicas",
      "Screening cáncer oral (VELscope, toluidina)",
      "Alergia a materiales dentales (test de parche)",
    ],
    beneficios: [
      "Detección temprana de patologías graves",
      "Alivio del dolor crónico orofacial",
      "Mejora calidad de vida y sueño",
      "Manejo conservador no quirúrgico",
      "Coordinación con médica general/Especialistas",
    ],
    duracion: "45-60 min consulta inicial",
    precioDesde: "$150.000 COP",
  },
]

export const equipoMedico: EquipoMedico[] = [
  {
    id: "1",
    nombre: "Dr. Carlos Andrés Ramírez",
    especialidad: "Cirugía Maxilofacial / Implantología",
    foto: "/images/equipo/dr-ramirez.jpg",
    bio: "Cirujano maxilofacial con 15+ años de experiencia. Especialista en cirugía ortognática, implantes cigomáticos y regeneración ósea avanzada. Profesor universitario y conferencista internacional.",
    formacion: [
      "Especialista en Cirugía Maxilofacial - Universidad Nacional de Colombia",
      "Fellowship en Implantología Avanzada - Universidad de Barcelona",
      "Máster en Cirugía Ortognática - Hospital Universitario La Paz, Madrid",
    ],
    experiencia: "15+ años",
    redes: { linkedin: "https://linkedin.com/in/dramirez", instagram: "https://instagram.com/dr.ramirez.cmf" },
  },
  {
    id: "2",
    nombre: "Dra. María Fernanda Gómez",
    especialidad: "Ortodoncia / Ortopedia Maxilar",
    foto: "/images/equipo/dra-gomez.jpg",
    bio: "Ortodoncista certificada en Damon System, Invisalign Diamond Provider y Spark Aligners. Experta en ortodoncia interceptiva, alineadores invisibles y cirugía ortognática combinada.",
    formacion: [
      "Especialista en Ortodoncia - Universidad El Bosque",
      "Certificación Invisalign Diamond / Spark Aligners",
      "Diplomado en Ortopedia Funcional de los Maxilares - U. de Chile",
    ],
    experiencia: "12+ años",
    redes: { linkedin: "https://linkedin.com/in/drafgomez", instagram: "https://instagram.com/dra.fergomez.orto" },
  },
  {
    id: "3",
    nombre: "Dr. Jorge Enrique López",
    especialidad: "Endodoncia / Microscopía Operatoria",
    foto: "/images/equipo/dr-lopez.jpg",
    bio: "Endodoncista exclusivo con microscopio operatorio. Especialista en retratamientos complejos, cirugía apical y manejo de traumatismos dentales. Miembro activo de la AAE y FEDE.",
    formacion: [
      "Especialista en Endodoncia - Universidad de Antioquia",
      "Fellowship en Microscopía Operatoria - Universidad de Pennsylvania",
      "Diplomado en Traumatología Dental - Universidad Complutense Madrid",
    ],
    experiencia: "10+ años",
    redes: { linkedin: "https://linkedin.com/in/drjelopez" },
  },
  {
    id: "4",
    nombre: "Dra. Patricia Lucía Herrera",
    especialidad: "Odontopediatría / Sedación",
    foto: "/images/equipo/dra-herrera.jpg",
    bio: "Odontopediatra certificada en manejo de conducta, sedación con óxido nitroso y tratamiento bajo anestesia general. Creadora del programa 'Sonrisa Sin Miedo' para niños ansiosos.",
    formacion: [
      "Especialista en Odontopediatría - Universidad Nacional de Colombia",
      "Certificación en Sedación Consciente - Sociedad Colombiana de Anestesiología",
      "Máster en Odontología para Pacientes con Necesidades Especiales - U. Barcelona",
    ],
    experiencia: "11+ años",
    redes: { instagram: "https://instagram.com/dra.patricia.odtopedia" },
  },
  {
    id: "5",
    nombre: "Dr. Andrés Felipe Martínez",
    especialidad: "Rehabilitación Oral / Prostodoncia / DSD",
    foto: "/images/equipo/dr-martinez.jpg",
    bio: "Prostodoncista experto en rehabilitaciones complejas, Digital Smile Design (DSD), cerámicas de alta estética y prótesis sobre implantes All-on-X. Director de laboratorio digital propio.",
    formacion: [
      "Especialista en Rehabilitación Oral - Universidad Javeriana",
      "Máster en Prostodoncia Estética - New York University (NYU)",
      "Certificación Digital Smile Design (DSD) - Christian Coachman",
    ],
    experiencia: "13+ años",
    redes: { linkedin: "https://linkedin.com/in/drafmartinez", instagram: "https://instagram.com/dr.andres.rehab" },
  },
  {
    id: "6",
    nombre: "Dra. Carolina Vargas",
    especialidad: "Periodoncia / Cirugía Plástica Periodontal",
    foto: "/images/equipo/dra-vargas.jpg",
    bio: "Periodoncista enfocada en cirugía plástica periodontal, recesiones gingivales, regeneración tisular y estética gingival. Investigadora en terapias regenerativas con PRF y factores de crecimiento.",
    formacion: [
      "Especialista en Periodoncia - Universidad El Bosque",
      "Fellowship en Cirugía Plástica Periodontal - Universidad de Michigan",
      "Diplomado en Medicina Periodontal - Universidad de Buenos Aires",
    ],
    experiencia: "9+ años",
    redes: { linkedin: "https://linkedin.com/in/dracvargas" },
  },
  {
    id: "7",
    nombre: "Dr. Ricardo Alejandro Peña",
    especialidad: "Estomatología / Medicina Oral / ATM",
    foto: "/images/equipo/dr-pena.jpg",
    bio: "Estomatólogo especialista en dolor orofacial, trastornos de ATM, medicina oral y patología de mucosa. Experto en dispositivos de avance mandibular para apnea del sueño.",
    formacion: [
      "Especialista en Estomatología - Universidad Nacional de Colombia",
      "Máster en Dolor Orofacial y DTM - Universidad Complutense Madrid",
      "Certificación en Medicina del Sueño Dental - AADSM (EE.UU.)",
    ],
    experiencia: "8+ años",
    redes: { linkedin: "https://linkedin.com/in/drrapeña" },
  },
  {
    id: "8",
    nombre: "Dra. Laura Sofía Montoya",
    especialidad: "Odontología General / Estética / Prevención",
    foto: "/images/equipo/dra-montoya.jpg",
    bio: "Odontóloga general con enfoque en odontología mínimamente invasiva, estética adhesiva, blanqueamiento y prevención. Coordinadora del programa de mantenimiento y salud bucal familiar.",
    formacion: [
      "Odontóloga - Universidad de La Sabana",
      "Diplomado en Odontología Estética Adhesiva - U. Internacional de Catalunya",
      "Certificación en Blanqueamiento Profesional - Opalescence / Philips Zoom",
    ],
    experiencia: "7+ años",
    redes: { instagram: "https://instagram.com/dra.laura.estetica" },
  },
]

export const blogPosts: BlogPost[] = [
  {
    slug: "barniz-fluor-fluoruro",
    titulo: "¿Qué es el barniz de flúor o fluoruro?",
    extracto: "El barniz de flúor es un tratamiento preventivo de alta concentración que fortalece el esmalte y previene caries en niños y adultos de riesgo.",
    contenido: `El barniz de flúor es una suspensión de fluoruro de sodio al 5% (22,600 ppm de flúor) en una base de colofonia que se adhiere al esmalte dental liberando flúor de forma sostenida durante horas.

**Indicaciones principales:**
- Niños con alto riesgo de caries (ICDAS ≥ 3)
- Pacientes con ortodoncia fija (prevención manchas blancas)
- Hipersensibilidad dentinaria cervical
- Pacientes con xerostomía o radioterapia de cabeza/cuello
- Lesiones de mancha blanca incipientes (remineralización)

**Protocolo de aplicación:**
1. Aislamiento relativo (rodillos de algodón, succión)
2. Secado suave con aire (no desecar)
3. Aplicación capa fina con pincel/dispensador
4. Instrucciones post: no cepillar 4-6h, dieta blanda, no flúor oral ese día

**Evidencia científica:** Revisiones Cochrane y guías ADA/APD recomiendan aplicación cada 3-6 meses en alto riesgo. Reducción de caries 30-50% en dentición temporal y 20-30% en permanente.

**Contraindicaciones:** Alergia a colofonia, ulceraciones orales agudas, niños < 6 meses.`,
    imagen: "/images/blog/barniz-fluor.jpg",
    autor: "Dra. Laura Montoya",
    fecha: "2024-02-15",
    categoria: "Prevención",
    tags: ["flúor", "prevención", "niños", "caries", "odontopediatría"],
    tiempoLectura: "5 min",
  },
  {
    slug: "importancia-exodoncia-cordales",
    titulo: "La importancia de la exodoncia de cordales",
    extracto: "Los terceros molares incluidos o mal posicionados pueden causar pericoronaritis, caries en segundos molares, quistes y apiñamiento dentario.",
    contenido: `A los 18-25 años erupcionan los terceros molares (cordales o muelas del juicio). En el 85% de casos hay espacio insuficiente, causando inclusiones parciales o totales.

**Complicaciones frecuentes:**
- Pericoronaritis recurrente (inflamación/infección del capuchón gingival)
- Caries distal del segundo molar (difícil acceso higiene)
- Resorción radicular del segundo molar por presión
- Quistes dentígeros / queratoquistes odontogénicos
- Apiñamiento anterior tardío (teoría de presión mesial)
- Dolor referido ATM, cefaleas, neuralgias

**Cuándo extraer:**
- Inclusión mesioangular/horizontal (alto riesgo)
- Episodios repetidos de pericoronaritis
- Caries/no restaurabilidad del 2do molar
- Tratamiento ortodóncico (planificación)
- Prótesis fija/removible en zona

**Técnica moderna:** Piezocirugía + PRF (fibrina rica en plaquetas) para osteotomía selectiva, menor edema, dolor post-operatorio reducido 60% vs fresa convencional. Sedación consciente endovenosa para máximo confort.`,
    imagen: "/images/blog/exodoncia-cordales.jpg",
    autor: "Dr. Carlos Ramírez",
    fecha: "2024-01-20",
    categoria: "Cirugía",
    tags: ["cordales", "terceros molares", "cirugía", "exodoncia", "piezocirugía"],
    tiempoLectura: "7 min",
  },
  {
    slug: "prevencion-infecciones-odontologia",
    titulo: "Prevención de infecciones en odontología",
    extracto: "Protocolos de bioseguridad, esterilización, barreras y vigilancia epidemiológica para práctica dental segura post-COVID.",
    contenido: `La odontología genera aerosoles de alto riesgo. La prevención de infecciones cruzadas es pilar de la práctica ética y legal.

**Jerarquía de controles (OMS/CDC):**
1. **Eliminación**: Teleodontología para triaje, diferir electivos en brotes
2. **Sustitución**: Instrumental desechable vs reutilizable
3. **Controles de ingeniería**: Aspiración alto volumen (HVE), extracción local, presión negativa, UV-C, filtros HEPA
4. **Controles administrativos**: Cuestionario salud, temperatura, aforo, circuitos "limpio/sucio"
5. **EPP**: Bata impermeable, doble guante, gorro, gafas/pantalla, FFP2/KN95 + respirador elastomérico para AGP

**Esterilización y trazabilidad:**
- Autoclave clase B (vacío fraccionado) - ciclos 134°C/3.5 min
- Indicadores químicos (clase 1, 4, 5, 6) en cada paquete
- Test Bowie-Dick diario + esporas biológicas semanales (Geobacillus stearothermophilus)
- Trazabilidad: etiqueta lote/fecha/operador/esterilizador en cada paquete
- Almacenamiento estéril: zona limpia, temperatura/humedad controlada, vida útil 30-60 días

**Superficies y agua:**
- Desinfección superficies clínicas: amonio cuaternario/peróxido H2O2 (tiempo contacto 1-3 min)
- Líneas de unidad dental: tratamiento continuo (peróxido 0.1% / cloro 200 ppm) + purga 2 min entre pacientes + shock mensual
- Agua < 200 UFC/mL (CDC) / < 100 UFC/mL (UE)

**Vigilancia:** Registro de incidentes (punzocortantes, exposición fluidos), PEP VIH/HBV/HCV, vacunación personal (HBV obligatoria, refuerzo anti-HBs >10 mUI/mL).`,
    imagen: "/images/blog/bioseguridad.jpg",
    autor: "Dr. Ricardo Peña",
    fecha: "2023-11-10",
    categoria: "Bioseguridad",
    tags: ["bioseguridad", "esterilización", "COVID-19", "aerosoles", "EPP", "autoclave"],
    tiempoLectura: "8 min",
  },
  {
    slug: "carillas-porcelana-vs-resina",
    titulo: "Carillas de porcelana vs resina compuesta: ¿Cuál elegir?",
    extracto: "Comparativa de durabilidad, estética, costo, indicaciones y mantenimiento para tomar la mejor decisión en tu diseño de sonrisa.",
    contenido: `**Carillas de Porcelana (E.max / Feldespática / Zirconia multicapa)**
- Vida útil: 15-20+ años
- Estética: Translucidez, fluorescencia, caracterización natural insuperable
- Resistencia: 350-400 MPa (E.max) / 900+ MPa (Zirconia)
- Resistencia a manchas: Excelente (superficie vitrificada)
- Preparación: 0.3-0.7 mm (mínima con DSD/mock-up)
- Costo: $$$$ (alta inversión inicial)
- Reparabilidad: Difícil (fractura = reemplazo)
- Número de citas: 3-4 (DSD, preparación, provisional, cementado)

**Carillas de Resina Compuesta (Directas / Inyectadas / Stratificadas)**
- Vida útil: 5-7 años (pulido anual requerido)
- Estética: Muy buena en manos expertas (técnica estratificada), menor profundidad óptica
- Resistencia: 120-180 MPa (nanohíbridas/nano-orísticas)
- Resistencia a manchas: Moderada (porosidad matriz resinosa)
- Preparación: 0-0.3 mm (aditiva, más conservadora)
- Costo: $$ (40-60% porcelana)
- Reparabilidad: Fácil (reparación adhesiva en consulta)
- Número de citas: 1-2 (directas) / 2-3 (inyectadas con molde)

**Indicaciones ideales:**
| Situación | Recomendación |
|-----------|---------------|
| Cambio color severo (tetraciclinas, fluorosis) | Porcelana (opacidad controlable) |
| Diastemas múltiples / forma | Porcelana o Resina inyectada (Bioclear) |
| Fracturas incisales / desgaste leve | Resina estratificada (conservadora) |
| Paciente joven (< 20 años) | Resina (reversible, pulpa grande) |
| Bruxismo severo no controlado | Ninguna (tratar causa primero) |
| Presupuesto limitado | Resina (planificar upgrade futuro) |

**Mantenimiento:** Control 6 meses, pulido profesional, férula de descarga nocturna, evitar hábitos parafuncionales (morder uñas, hielo, abrir envases).`,
    imagen: "/images/blog/carillas-comparativa.jpg",
    autor: "Dr. Andrés Martínez",
    fecha: "2024-03-05",
    categoria: "Estética",
    tags: ["carillas", "porcelana", "resina", "diseño sonrisa", "estética dental", "DSD"],
    tiempoLectura: "6 min",
  },
  {
    slug: "implantes-carga-inmediata",
    titulo: "Implantes de carga inmediata: Dientes fijos en 24 horas",
    extracto: "La técnica All-on-4/All-on-6 permite rehabilitar arcadas completas con implantes y prótesis fija provisional el mismo día de la cirugía.",
    contenido: `**¿Qué es la carga inmediata?**
Colocación de implantes y prótesis fija atornillada provisional en ≤ 48h post-cirugía. Requiere estabilidad primaria ≥ 35 Ncm (torque de inserción) y soporte óseo adecuado.

**All-on-4 / All-on-6 (Nobel Biocare / Straumann / MegaGen):**
- 4-6 implantes por arcada (2 rectos anterior + 2-4 inclinados 30-45° posterior)
- Evita injertos óseos en maxilares atróficos (seno maxilar, nervio dentario)
- Prótesis híbrida (Toronto Bridge) atornillada: resina PMMA + barra Ti/CoCr o zirconia monolítica
- Conversión a definitiva a 4-6 meses (zirconia / cerámica)

**Candidatos ideales:**
- Edéntulos totales o dentición terminal (pocas piezas no restaurables)
- Calidad ósea tipo I-III (Misch)
- Compromiso higiene y controles (riesgo periimplantitis)
- No fumadores o cesación ≥ 2 meses
- Expectativas realistas (prótesis provisional ≠ definitiva)

**Ventajas vs convencional:**
- Tiempo total: 1 día vs 6-12 meses
- Función masticatoria inmediata (dieta blanda 6-8 sem)
- Evita prótesis removible transitoria (impacto psicológico)
- Menor morbilidad (menos cirugías, menos injertos)
- Costo total comparable (menos procedimientos accesorios)

**Riesgos y complicaciones:**
- Fallo implante por micromovimiento (> 150 µm)
- Fractura prótesis provisional (resina PMMA)
- Periimplantitis por higiene deficiente
- Necesidad de rebases / ajustes oclusales frecuentes

**Protocolo digital:** CBCT + escáner intraoral → planificación 3D (coDiagnostiX / DTX Studio) → guía quirúrgica impresa 3D → cirugía guiada flapless → escaneo post-operatorio → diseño CAD/CAM prótesis → fresado/impresión 3D → entrega misma tarde.`,
    imagen: "/images/blog/all-on-4.jpg",
    autor: "Dr. Carlos Ramírez",
    fecha: "2024-04-12",
    categoria: "Implantología",
    tags: ["implantes", "carga inmediata", "All-on-4", "All-on-6", "rehabilitación total", "cirugía guiada"],
    tiempoLectura: "9 min",
  },
]

export const sedes: Sede[] = [
  {
    id: "caobos",
    nombre: "Sede Principal Caobos",
    direccion: "Avenida 3E # 13A-07, Barrio Caobos",
    telefono: "+57 607 595 5068",
    celular: "+57 318 144 1442",
    email: "caobos@odontocucuta.com",
    horario: "Lun-Vie: 7:00 AM - 7:00 PM | Sáb: 8:00 AM - 2:00 PM",
    mapaUrl: "https://goo.gl/maps/caobos-odontocucuta",
    imagen: "/images/sedes/sede-caobos.jpg",
  },
  {
    id: "libertad",
    nombre: "Sede Libertad",
    direccion: "Calle 10 # 5-45, Centro",
    telefono: "+57 607 501 0331",
    celular: "+57 316 471 4020",
    email: "libertad@odontocucuta.com",
    horario: "Lun-Vie: 7:30 AM - 6:00 PM | Sáb: 8:00 AM - 1:00 PM",
    mapaUrl: "https://goo.gl/maps/libertad-odontocucuta",
    imagen: "/images/sedes/sede-libertad.jpg",
  },
  {
    id: "atalaya",
    nombre: "Sede Atalaya",
    direccion: "Avenida 4 # 18-30, Atalaya",
    telefono: "+57 607 501 0370",
    celular: "+57 316 468 2016",
    email: "atalaya@odontocucuta.com",
    horario: "Lun-Vie: 7:30 AM - 6:00 PM | Sáb: 8:00 AM - 1:00 PM",
    mapaUrl: "https://goo.gl/maps/atalaya-odontocucuta",
    imagen: "/images/sedes/sede-atalaya.jpg",
  },
  {
    id: "pamplona",
    nombre: "Sede Pamplona",
    direccion: "Carrera 6 # 7-25, Centro Histórico",
    telefono: "",
    celular: "+57 312 521 6991",
    email: "pamplona@odontocucuta.com",
    horario: "Lun-Vie: 8:00 AM - 5:00 PM | Sáb: 8:00 AM - 12:00 PM",
    mapaUrl: "https://goo.gl/maps/pamplona-odontocucuta",
    imagen: "/images/sedes/sede-pamplona.jpg",
  },
]

export const convenios: Convenio[] = [
  { id: "1", nombre: "Nueva EPS", logo: "/images/convenios/nueva-eps.svg", descripcion: "Cobertura en plan de beneficios en salud (PBS) y planes complementarios." },
  { id: "2", nombre: "Salud Total EPS", logo: "/images/convenios/salud-total.svg", descripcion: "Atención odontológica integral para afiliados y beneficiarios." },
  { id: "3", nombre: "Sanitas EPS", logo: "/images/convenios/sanitas.svg", descripcion: "Servicios de odontología general, ortodoncia y cirugía según plan." },
  { id: "4", nombre: "Sura EPS", logo: "/images/convenios/sura.svg", descripcion: "Red de prestadores odontológicos con cobertura nacional." },
  { id: "5", nombre: "Comfenalco", logo: "/images/convenios/comfenalco.svg", descripcion: "Caja de compensación familiar con planes odontológicos familiares." },
  { id: "6", nombre: "Comfamiliar", logo: "/images/convenios/comfamiliar.svg", descripcion: "Subsidio familiar aplicable a tratamientos odontológicos." },
  { id: "7", nombre: "Colpatria / Scotiabank", logo: "/images/convenios/colpatria.svg", descripcion: "Crédito de libre inversión para tratamientos odontológicos." },
  { id: "8", nombre: "Banco de Bogotá", logo: "/images/convenios/banco-bogota.svg", descripcion: "Financiación preferencial para procedimientos estéticos y de alta complejidad." },
  { id: "9", nombre: "Tu Crédito / Credifinanciera", logo: "/images/convenios/tu-credito.svg", descripcion: "Crédito rápido sin codeudor para tratamientos dentales." },
  { id: "10", nombre: "Addi / Kueski Pay", logo: "/images/convenios/addi.svg", descripcion: "Compra ahora, paga después (BNPL) en 3-12 cuotas sin interés." },
]

export const testimonios: Testimonio[] = [
  {
    id: "1",
    nombre: "María Fernanda G.",
    tratamiento: "Ortodoncia Invisalign + Blanqueamiento",
    texto: "Llegué con miedo al dentista y apiñamiento severo. El equipo me explicó todo con paciencia. Hoy sonrío sin taparme la boca. El proceso Invisalign fue discreto y cómodo. ¡Gracias Dra. Gómez y equipo!",
    foto: "/images/testimonios/maria-fernanda.jpg",
    rating: 5,
    fecha: "2024-03-15",
  },
  {
    id: "2",
    nombre: "Carlos Alberto R.",
    tratamiento: "All-on-4 (Arcada superior completa)",
    texto: "Tenía prótesis removible hace 10 años y no podía comer bien. La cirugía All-on-4 fue indolora con sedación. Al día siguiente tenía dientes fijos provisionales. A los 6 meses me pusieron la zirconia definitiva. Cambió mi vida.",
    foto: "/images/testimonios/carlos-alberto.jpg",
    rating: 5,
    fecha: "2024-01-22",
  },
  {
    id: "3",
    nombre: "Ana Lucía P. (madre de Santiago, 6 años)",
    tratamiento: "Odontopediatría + Sellantes + Flúor",
    texto: "Mi hijo tenía pánico al dentista. La Dra. Herrera usó 'gas de la risa' y en 20 minutos le hizo sellantes y flúor sin que llorara. Ahora pide ir al dentista. El programa 'Sonrisa Sin Miedo' funciona de verdad.",
    foto: "/images/testimonios/ana-lucia.jpg",
    rating: 5,
    fecha: "2024-04-10",
  },
  {
    id: "4",
    nombre: "Roberto J. V.",
    tratamiento: "Implante unitario + Corona zirconia",
    texto: "Perdí un molar por fractura. El Dr. Ramírez me puso implante Straumann con carga inmediata (corona provisional a las 48h). A los 3 meses corona de zirconia definitiva. Ni se nota que no es mi diente natural.",
    foto: "/images/testimonios/roberto.jpg",
    rating: 5,
    fecha: "2023-11-05",
  },
  {
    id: "5",
    nombre: "Patricia M.",
    tratamiento: "Carillas E.max (10 piezas superiores)",
    texto: "Quería mejorar mi sonrisa sin tallar mucho diente. El Dr. Martínez hizo Digital Smile Design, me mostró el mock-up y aprobamos. Carillas E.max ultrafinas (0.3mm). Resultado natural, nadie dice 'se ve hecho', dicen 'qué linda sonrisa'.",
    foto: "/images/testimonios/patricia.jpg",
    rating: 5,
    fecha: "2024-02-28",
  },
  {
    id: "6",
    nombre: "Jorge L.",
    tratamiento: "Periodoncia regenerativa + Implantes",
    texto: "Tenía periodontitis avanzada, movilidad y pérdida ósea. La Dra. Vargas me hizo cirugía regenerativa con Emdogain + PRF + injerto. Salvó 8 dientes que otros querían extraer. Luego implantes en zonas perdidas. Equipo de primera.",
    foto: "/images/testimonios/jorge.jpg",
    rating: 5,
    fecha: "2023-09-18",
  },
]

export const estadisticas: Estadistica[] = [
  { label: "Pacientes atendidos", valor: "45,000+", icono: "Users" },
  { label: "Años de experiencia", valor: "25+", icono: "Award" },
  { label: "Especialistas certificados", valor: "12", icono: "GraduationCap" },
  { label: "Sedes en Norte de Santander", valor: "4", icono: "MapPin" },
  { label: "Implantes colocados", valor: "3,200+", icono: "Bone" },
  { label: "Sonrisas diseñadas (DSD)", valor: "1,800+", icono: "Smile" },
  { label: "Casos de ortodoncia", valor: "2,500+", icono: "AlignCenterHorizontal" },
  { label: "Cirugías maxilofaciales", valor: "850+", icono: "Scalpel" },
]
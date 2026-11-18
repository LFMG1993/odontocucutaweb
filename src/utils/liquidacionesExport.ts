import type { CellObject, Row, Sheet, SheetData } from 'write-excel-file/universal'
import type { ProcedimientoLiquidado } from '@/types/profesionales'
import { formatCurrency, formatDateShort, formatSede } from '@/utils/formatters'

export interface LiquidacionExportParams {
  periodo: { desde: string; hasta: string }
  procedimientos: ProcedimientoLiquidado[]
  profesional?: string | null
  sedeFiltro?: string | null
  busqueda?: string | null
}

interface ResumenExport {
  totalLiquidar: number
  totalProcedimientos: number
  pacientesUnicos: number
  desglosePorSede: Array<{ sede: string; total: number }>
}

const NAVY = '#1e3a8a'
const SLATE_BORDER = '#cbd5e1'
const CURRENCY_FORMAT = '"$"#,##0'

function toNumber(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function buildResumen(procedimientos: ProcedimientoLiquidado[]): ResumenExport {
  const pacientes = new Set<string>()
  const porSede = new Map<string, number>()

  let totalLiquidar = 0

  for (const procedimiento of procedimientos) {
    totalLiquidar += toNumber(procedimiento.pago_profesional)

    const documento = (procedimiento.paciente_documento || '').trim()
    if (documento) pacientes.add(documento)

    const sede = procedimiento.sede || 'Sin sede'
    porSede.set(sede, (porSede.get(sede) ?? 0) + toNumber(procedimiento.pago_profesional))
  }

  return {
    totalLiquidar,
    totalProcedimientos: procedimientos.length,
    pacientesUnicos: pacientes.size,
    desglosePorSede: Array.from(porSede.entries())
      .map(([sede, total]) => ({ sede, total }))
      .sort((a, b) => b.total - a.total),
  }
}

function parseFecha(value: string | null | undefined): Date | null {
  if (!value) return null
  const clean = value.split(' ')[0].split('T')[0]
  const [year, month, day] = clean.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? null : date
}

function buildFileName(params: LiquidacionExportParams, extension: 'xlsx' | 'pdf'): string {
  const desde = params.periodo.desde || 'inicio'
  const hasta = params.periodo.hasta || 'fin'
  return `liquidacion_${desde}_a_${hasta}.${extension}`
}

function buildPeriodoLabel(params: LiquidacionExportParams): string {
  return `${formatDateShort(params.periodo.desde)} — ${formatDateShort(params.periodo.hasta)}`
}

function buildSedeLabel(params: LiquidacionExportParams): string {
  if (!params.sedeFiltro || params.sedeFiltro === 'todas') return 'Todas las sedes'
  return formatSede(params.sedeFiltro)
}

function buildBusquedaLabel(params: LiquidacionExportParams): string {
  const busqueda = (params.busqueda || '').trim()
  if (!busqueda) return 'Sin filtro'
  return busqueda.length > 55 ? `${busqueda.slice(0, 55)}…` : busqueda
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/**
 * Muestra el PDF con el visor del navegador (o del teléfono) en una pestaña
 * nueva, para que el usuario decida si lo descarga. Si la pestaña fue bloqueada
 * por el navegador, cae al comportamiento anterior (descarga directa).
 */
function abrirPdfEnVisor(blob: Blob, fileName: string, visor: Window | null): void {
  if (!visor || visor.closed) {
    downloadBlob(blob, fileName)
    return
  }

  const url = URL.createObjectURL(blob)
  try {
    visor.location.href = url
    // El visor puede necesitar la URL un buen rato para permitir la descarga.
    window.setTimeout(() => URL.revokeObjectURL(url), 30 * 60 * 1000)
  } catch {
    URL.revokeObjectURL(url)
    visor.close()
    downloadBlob(blob, fileName)
  }
}

/**
 * Porcentaje realmente pagado al profesional sobre la base de cálculo.
 * El backend envía `porcentaje_pagado_paciente` como un valor fijo, así que lo
 * recalculamos comparando la base con el pago profesional.
 */
function calcularPorcentajePagado(procedimiento: ProcedimientoLiquidado): number | null {
  const base = toNumber(procedimiento.base_calculo)
  if (base <= 0) return null
  return (toNumber(procedimiento.pago_profesional) / base) * 100
}

function formatPorcentajePagado(porcentaje: number | null): string {
  if (porcentaje === null) return '—'
  return `${porcentaje.toLocaleString('es-CO', { maximumFractionDigits: 1 })}%`
}

function formatFechaTabla(value: string | null | undefined): string {
  const fecha = parseFecha(value)
  if (!fecha) return '-'
  const day = String(fecha.getDate()).padStart(2, '0')
  const month = String(fecha.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${fecha.getFullYear()}`
}

/* ------------------------------------------------------------------ */
/* Excel                                                               */
/* ------------------------------------------------------------------ */

const headerCell = (value: string): CellObject => ({
  value,
  type: String,
  fontWeight: 'bold',
  textColor: '#ffffff',
  backgroundColor: NAVY,
  align: 'center',
  alignVertical: 'center',
  wrap: true,
  borderColor: SLATE_BORDER,
  borderStyle: 'thin',
})

const labelCell = (value: string): CellObject => ({
  value,
  type: String,
  fontWeight: 'bold',
  textColor: '#334155',
})

const valueCell = (value: string): CellObject => ({
  value,
  type: String,
  wrap: true,
})

const currencyCell = (value: number, bold = false): CellObject => ({
  value,
  type: Number,
  format: CURRENCY_FORMAT,
  align: 'right',
  fontWeight: bold ? 'bold' : undefined,
})

const numberCell = (value: number, bold = false): CellObject => ({
  value,
  type: Number,
  format: '0',
  align: 'right',
  fontWeight: bold ? 'bold' : undefined,
})

const textCell = (value: string, align: 'left' | 'center' | 'right' = 'left'): CellObject => ({
  value,
  type: String,
  align,
  alignVertical: 'center',
  wrap: true,
  borderColor: SLATE_BORDER,
  borderStyle: 'thin',
})

const moneyTextCell = (value: number): CellObject => ({
  value,
  type: Number,
  format: CURRENCY_FORMAT,
  align: 'right',
  alignVertical: 'center',
  borderColor: SLATE_BORDER,
  borderStyle: 'thin',
})

const totalLabelCell = (value: string): CellObject => ({
  value,
  type: String,
  fontWeight: 'bold',
  textColor: '#0f172a',
  backgroundColor: '#e2e8f0',
  align: 'center',
  alignVertical: 'center',
  borderColor: SLATE_BORDER,
  borderStyle: 'thin',
})

const totalMoneyCell = (value: number): CellObject => ({
  value,
  type: Number,
  format: CURRENCY_FORMAT,
  align: 'right',
  alignVertical: 'center',
  fontWeight: 'bold',
  textColor: '#0f172a',
  backgroundColor: '#e2e8f0',
  borderColor: SLATE_BORDER,
  borderStyle: 'thin',
})

const percentCell = (porcentaje: number | null): CellObject =>
  porcentaje === null
    ? textCell('—', 'center')
    : {
        value: Math.round(porcentaje * 10) / 10,
        type: Number,
        format: '0.#"%"',
        align: 'center',
        alignVertical: 'center',
        borderColor: SLATE_BORDER,
        borderStyle: 'thin',
      }

/**
 * Expande una fila con celdas combinadas: write-excel-file exige que las celdas
 * "tapadas" por un `columnSpan` se declaren explícitamente como `null`.
 */
function filaConSpans(...cells: CellObject[]): Row {
  const fila: Row = []
  for (const cell of cells) {
    fila.push(cell)
    for (let i = 1; i < (cell.columnSpan ?? 1); i += 1) fila.push(null)
  }
  return fila
}

function buildLiquidacionSheet(
  params: LiquidacionExportParams,
  resumen: ResumenExport
): Sheet<Blob> {
  const COLUMNAS = 12
  const rows: SheetData = []

  // Encabezado
  rows.push(
    filaConSpans({
      value: 'Liquidación de procedimientos',
      type: String,
      fontWeight: 'bold',
      fontSize: 16,
      textColor: NAVY,
      columnSpan: COLUMNAS,
    })
  )
  rows.push([])

  const metaFila = (label: string, value: CellObject) => {
    rows.push(
      filaConSpans({ ...labelCell(label), columnSpan: 3 }, { ...value, columnSpan: 2 })
    )
  }

  metaFila('Profesional', valueCell(params.profesional || '—'))
  metaFila('Periodo', valueCell(buildPeriodoLabel(params)))
  metaFila('Sede', valueCell(buildSedeLabel(params)))
  metaFila('Búsqueda', valueCell(params.busqueda || 'Sin filtro'))
  metaFila('Generado', { value: new Date(), type: Date, format: 'dd/mm/yyyy hh:mm' })

  // Resumen
  rows.push([])
  rows.push(
    filaConSpans({
      value: 'Resumen',
      type: String,
      fontWeight: 'bold',
      fontSize: 12,
      textColor: NAVY,
      columnSpan: COLUMNAS,
    })
  )

  const resumenFila = (label: string, value: CellObject) => {
    rows.push(
      filaConSpans({ ...labelCell(label), columnSpan: 3 }, { ...value, columnSpan: 2 })
    )
  }

  resumenFila('Total a liquidar', currencyCell(resumen.totalLiquidar, true))
  resumenFila('Procedimientos', numberCell(resumen.totalProcedimientos))
  resumenFila('Pacientes únicos', numberCell(resumen.pacientesUnicos))

  if (resumen.desglosePorSede.length > 0) {
    rows.push([])
    rows.push(
      filaConSpans(
        { ...headerCell('Sede'), columnSpan: 3 },
        { ...headerCell('Total a liquidar'), columnSpan: 2 }
      )
    )
    for (const item of resumen.desglosePorSede) {
      rows.push(
        filaConSpans(
          { ...textCell(formatSede(item.sede)), columnSpan: 3 },
          { ...moneyTextCell(item.total), columnSpan: 2 }
        )
      )
    }
  }

  // Listado de procedimientos, en la misma hoja debajo del resumen
  rows.push([])
  rows.push([])

  const headers = [
    'Fecha',
    'Paciente',
    'Documento',
    'Prestación',
    'CUPS',
    'Sede',
    'Convenio',
    'Tratamiento',
    'Monto pagado',
    'Base cálculo',
    '% pagado',
    'Pago profesional',
  ]

  rows.push(headers.map(headerCell))

  for (const procedimiento of params.procedimientos) {
    const fecha = parseFecha(procedimiento.fecha_realizacion)
    rows.push([
      fecha
        ? { value: fecha, type: Date, format: 'dd/mm/yyyy', align: 'center' }
        : textCell(formatDateShort(procedimiento.fecha_realizacion), 'center'),
      textCell(procedimiento.paciente_nombre || ''),
      textCell(procedimiento.paciente_documento || '', 'center'),
      textCell(procedimiento.nombre_prestacion || ''),
      textCell(procedimiento.codigo_cups || '', 'center'),
      textCell(formatSede(procedimiento.sede)),
      textCell(procedimiento.convenio_tratamiento || procedimiento.paciente_convenio || ''),
      textCell(procedimiento.nombre_tratamiento || ''),
      moneyTextCell(toNumber(procedimiento.monto_pagado_procedimiento)),
      moneyTextCell(toNumber(procedimiento.base_calculo)),
      percentCell(calcularPorcentajePagado(procedimiento)),
      moneyTextCell(toNumber(procedimiento.pago_profesional)),
    ])
  }

  rows.push([
    totalLabelCell('TOTAL'),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalLabelCell(''),
    totalMoneyCell(resumen.totalLiquidar),
  ])

  return {
    sheet: 'Liquidación',
    data: rows,
    showGridLines: false,
    columns: [
      { width: 12 },
      { width: 30 },
      { width: 15 },
      { width: 38 },
      { width: 11 },
      { width: 14 },
      { width: 22 },
      { width: 24 },
      { width: 15 },
      { width: 15 },
      { width: 13 },
      { width: 17 },
    ],
  }
}

export async function exportLiquidacionesExcel(params: LiquidacionExportParams): Promise<void> {
  const resumen = buildResumen(params.procedimientos)
  const { default: writeXlsxFile } = await import('write-excel-file/universal')

  const blob = await writeXlsxFile([buildLiquidacionSheet(params, resumen)]).toBlob()

  downloadBlob(blob, buildFileName(params, 'xlsx'))
}

/* ------------------------------------------------------------------ */
/* PDF                                                                 */
/* ------------------------------------------------------------------ */

async function generarPdfBlob(params: LiquidacionExportParams): Promise<Blob> {
  const resumen = buildResumen(params.procedimientos)
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(30, 58, 138)
  doc.text('Liquidación de procedimientos', margin, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(71, 85, 105)
  if (params.profesional) {
    doc.text(params.profesional, margin, 21)
  }

  doc.setFontSize(8)
  doc.text(`Periodo: ${buildPeriodoLabel(params)}`, margin, 27)
  doc.text(`Sede: ${buildSedeLabel(params)}`, margin + 70, 27)
  doc.text(`Búsqueda: ${buildBusquedaLabel(params)}`, margin + 125, 27)

  doc.setTextColor(148, 163, 184)
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}`,
    pageWidth - margin,
    15,
    { align: 'right' }
  )

  autoTable(doc, {
    startY: 31,
    head: [['Total a liquidar', 'Procedimientos', 'Pacientes únicos']],
    body: [
      [
        formatCurrency(resumen.totalLiquidar),
        String(resumen.totalProcedimientos),
        String(resumen.pacientesUnicos),
      ],
    ],
    theme: 'grid',
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, halign: 'center', cellPadding: 2.2 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontStyle: 'bold', textColor: [15, 23, 42] },
  })

  const afterSummary = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable
    ?.finalY
  let cursorY = (afterSummary ?? 31) + 6

  if (resumen.desglosePorSede.length > 0) {
    doc.setFontSize(7.5)
    doc.setTextColor(71, 85, 105)
    const desglose = resumen.desglosePorSede
      .map((item) => `${formatSede(item.sede)}: ${formatCurrency(item.total)}`)
      .join('   ·   ')
    const lineas = doc.splitTextToSize(
      `Desglose por sede — ${desglose}`,
      pageWidth - margin * 2
    ) as string[]
    doc.text(lineas, margin, cursorY)
    cursorY += lineas.length * 3.2 + 2
  }

  const head = [
    [
      'Fecha',
      'Paciente',
      'Documento',
      'Prestación',
      'CUPS',
      'Sede',
      'Convenio',
      'Monto pagado',
      'Base cálculo',
      '% pag.',
      'Pago profesional',
    ],
  ]

  const body = params.procedimientos.map((procedimiento) => [
    formatFechaTabla(procedimiento.fecha_realizacion),
    procedimiento.paciente_nombre || '',
    procedimiento.paciente_documento || '',
    procedimiento.nombre_prestacion || '',
    procedimiento.codigo_cups || '',
    formatSede(procedimiento.sede),
    procedimiento.convenio_tratamiento || procedimiento.paciente_convenio || '',
    formatCurrency(procedimiento.monto_pagado_procedimiento),
    formatCurrency(procedimiento.base_calculo),
    formatPorcentajePagado(calcularPorcentajePagado(procedimiento)),
    formatCurrency(procedimiento.pago_profesional),
  ])

  autoTable(doc, {
    startY: cursorY,
    head,
    body,
    theme: 'striped',
    margin: { left: margin, right: margin, bottom: 14 },
    styles: { fontSize: 6.8, cellPadding: 1.5, overflow: 'linebreak', valign: 'middle' },
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontSize: 7,
      halign: 'center',
      valign: 'middle',
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 22, halign: 'center' },
      // La prestación absorbe el ancho restante de la página
      4: { cellWidth: 14, halign: 'center' },
      5: { cellWidth: 18 },
      6: { cellWidth: 24 },
      7: { cellWidth: 21, halign: 'right' },
      8: { cellWidth: 21, halign: 'right' },
      9: { cellWidth: 14, halign: 'center' },
      10: { cellWidth: 22, halign: 'right' },
    },
    foot: [
      [
        'TOTAL',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        formatCurrency(resumen.totalLiquidar),
      ],
    ],
    footStyles: {
      fillColor: [226, 232, 240],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'right',
    },
  })

  const totalPaginas = doc.getNumberOfPages()
  for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
    doc.setPage(pagina)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184)
    doc.text(`Página ${pagina} de ${totalPaginas}`, pageWidth - margin, pageHeight - 6, {
      align: 'right',
    })
    doc.text('OdontoSync — Portal de Profesionales', margin, pageHeight - 6)
  }

  return doc.output('blob')
}

/**
 * Genera el PDF y lo abre en el visor del navegador/teléfono para que el
 * usuario decida si lo descarga. La pestaña se abre al inicio, dentro del gesto
 * del usuario, porque los bloqueadores de popups no permiten abrirla después de
 * esperar a que se genere el archivo.
 */
export async function exportLiquidacionesPdf(params: LiquidacionExportParams): Promise<void> {
  const fileName = buildFileName(params, 'pdf')
  const visor =
    typeof window !== 'undefined' && typeof window.open === 'function'
      ? window.open('', '_blank')
      : null

  if (visor) {
    try {
      visor.document.title = 'Generando PDF…'
    } catch {
      // Algunos navegadores no exponen el documento de la pestaña recién abierta
    }
  }

  try {
    const blob = await generarPdfBlob(params)
    abrirPdfEnVisor(blob, fileName, visor)
  } catch (error) {
    visor?.close()
    throw error
  }
}

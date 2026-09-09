export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '' || isNaN(Number(amount))) {
    return '$ 0'
  }
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric)
}

export function formatDateShort(dateString: unknown): string {
  if (!dateString) return '-'
  if (typeof dateString !== 'string') {
    if (dateString instanceof Date && !isNaN(dateString.getTime())) {
      return dateString.toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    }
    return String(dateString)
  }
  try {
    const cleanStr = dateString.split(' ')[0]
    if (!cleanStr) return dateString
    const [year, month, day] = cleanStr.split('-')
    if (!year || !month || !day) return dateString

    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return String(dateString)
  }
}

export function formatDateTime(dateTimeString: unknown): string {
  if (!dateTimeString) return '-'
  if (typeof dateTimeString !== 'string') return String(dateTimeString)
  try {
    const [datePart, timePart] = dateTimeString.split(' ')
    if (!datePart) return dateTimeString

    const [year, month, day] = datePart.split('-')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (isNaN(date.getTime())) return dateTimeString

    let timeStr = ''
    if (timePart) {
      const [hours, minutes] = timePart.split(':')
      const h = Number(hours)
      if (!isNaN(h)) {
        const period = h >= 12 ? 'p.m.' : 'a.m.'
        const formattedH = h % 12 || 12
        timeStr = `, ${formattedH}:${minutes || '00'} ${period}`
      }
    }

    const formattedDate = date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
    })

    return `${formattedDate}${timeStr}`
  } catch {
    return String(dateTimeString)
  }
}

const digits = (value: string) => value.replace(/\D/g, "")

export function waLink(phone: string, text: string): string {
  return `https://wa.me/57${digits(phone)}?text=${encodeURIComponent(text)}`
}

export function telLink(phone: string): string {
  return `tel:+57${digits(phone)}`
}

const TAG = new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
const TAG_KURZ = new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit' })
const UHR = new Intl.DateTimeFormat('de-CH', { hour: '2-digit', minute: '2-digit' })
const WOCHENTAG = new Intl.DateTimeFormat('de-CH', { weekday: 'short' })

export const datum = (d: string) => TAG.format(new Date(d))
export const datumKurz = (d: string) => TAG_KURZ.format(new Date(d))
export const uhrzeit = (t: string) => UHR.format(new Date(t))
export const wochentag = (d: string) => WOCHENTAG.format(new Date(d))

/** Stunden als "3 h 25" — auf dem Feld liest sich das schneller als 3.42. */
export function stunden(h: number): string {
  if (!isFinite(h) || h < 0) return '–'
  const ganze = Math.floor(h)
  const min = Math.round((h - ganze) * 60)
  if (min === 60) return `${ganze + 1} h 00`
  return `${ganze} h ${String(min).padStart(2, '0')}`
}

/** Kompakt fuer Tabellen: "3.4 h" */
export const stundenKurz = (h: number) => `${h.toFixed(1).replace('.', '.')} h`

export function geld(betrag: number, waehrung = 'CHF'): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency', currency: waehrung, maximumFractionDigits: 0,
  }).format(betrag)
}

export function flaeche(m2: number): string {
  return `${new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(m2)} m²`
}

export function zahl(n: number, stellen = 1): string {
  return new Intl.NumberFormat('de-CH', { maximumFractionDigits: stellen }).format(n)
}

/** "vor 2 h 10" — fuer laufende Auftraege. */
export function seit(ts: string, jetzt = Date.now()): string {
  const min = Math.max(0, Math.round((jetzt - new Date(ts).getTime()) / 60000))
  if (min < 60) return `${min} min`
  return stunden(min / 60)
}

export const heute = (): string => new Date().toISOString().slice(0, 10)
export const istHeute = (ts: string) => ts.slice(0, 10) === heute()

/** Kalenderwoche nach ISO 8601 — der Satz heisst im Betrieb nach seiner Woche. */
export function kalenderwoche(d: Date | string): number {
  const q = typeof d === 'string' ? new Date(d) : d
  const t = new Date(Date.UTC(q.getFullYear(), q.getMonth(), q.getDate()))
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7))
  const jahresanfang = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  return Math.ceil(((t.getTime() - jahresanfang.getTime()) / 86400000 + 1) / 7)
}

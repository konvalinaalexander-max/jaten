/** Kleine Nachschlagehilfen, damit die Oberflaeche nicht ueberall sucht. */
import type { Auftrag, Daten, Id, Satz } from './typen.ts'

export const feld = (d: Daten, id: Id) => d.felder.find(f => f.id === id)
export const schiff = (d: Daten, id: Id) => d.schiffe.find(s => s.id === id)
export const kultur = (d: Daten, id: Id) => d.kulturen.find(k => k.id === id)
export const satz = (d: Daten, id: Id) => d.saetze.find(s => s.id === id)
export const arbeitsart = (d: Daten, id: Id) => d.arbeitsarten.find(a => a.id === id)
export const person = (d: Daten, id: Id) => d.personen.find(p => p.id === id)

/** „Kopfsalat KW14" — wie der Betrieb den Satz nennt. */
export function satzName(d: Daten, s: Satz | undefined): string {
  if (!s) return 'Unbekannt'
  return `${kultur(d, s.kulturId)?.name ?? '?'} ${s.bezeichnung}`
}

/** „Hausfeld · Schiff 1" bzw. „Hausfeld · Schiff 1 + 1 weiteres" */
export function schiffName(d: Daten, id: Id): string {
  const s = schiff(d, id)
  if (!s) return '?'
  return `${feld(d, s.feldId)?.name ?? '?'} · ${s.name}`
}

export function ortText(d: Daten, a: Auftrag): string {
  if (a.schiffIds.length === 0) return '—'
  const erstes = schiffName(d, a.schiffIds[0])
  return a.schiffIds.length > 1 ? `${erstes} +${a.schiffIds.length - 1}` : erstes
}

/** Schiffe eines Feldes, nach Namen. */
export function schiffeVon(d: Daten, feldId: Id) {
  return d.schiffe.filter(s => s.feldId === feldId)
}

export function teilnahmenVon(d: Daten, auftragId: Id) {
  return d.teilnahmen.filter(t => t.auftragId === auftragId)
}

export function machtMit(d: Daten, auftragId: Id, personId: Id | null): boolean {
  if (!personId) return false
  return d.teilnahmen.some(t => t.auftragId === auftragId && t.personId === personId && !t.endeTs)
}

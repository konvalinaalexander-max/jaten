/**
 * Der Speicher. In der Demo liegt alles im Browser; die Oberflaeche spricht
 * nur ueber die Funktionen hier mit den Daten. Wenn spaeter Supabase
 * dazukommt, wird diese Datei ausgetauscht und sonst nichts.
 */
import { useSyncExternalStore } from 'react'
import { demoDaten } from './demo.ts'
import type { Arbeitsart, Daten, Id, Satz } from './typen.ts'
import { heute } from './format.ts'

const SCHLUESSEL = 'feldstunden.daten.v1'
const hoerer = new Set<() => void>()

function laden(): Daten {
  try {
    const roh = localStorage.getItem(SCHLUESSEL)
    if (roh) return JSON.parse(roh) as Daten
  } catch { /* privater Modus, geloeschte Daten — dann eben frisch */ }
  return demoDaten()
}

let daten: Daten = laden()

function melden() {
  try { localStorage.setItem(SCHLUESSEL, JSON.stringify(daten)) } catch { /* egal */ }
  for (const h of hoerer) h()
}

export function aendern(fn: (d: Daten) => void) {
  const kopie: Daten = JSON.parse(JSON.stringify(daten))
  fn(kopie)
  daten = kopie
  melden()
}

export function zuruecksetzen() {
  daten = demoDaten()
  melden()
}

function abonnieren(fn: () => void) {
  hoerer.add(fn)
  return () => { hoerer.delete(fn) }
}

export function useDaten(): Daten {
  return useSyncExternalStore(abonnieren, () => daten, () => daten)
}

let zaehler = 0
const neueId = (p: string) => `${p}-${Date.now().toString(36)}-${(zaehler++).toString(36)}`

// ——— Aktionen der Feld-Oberflaeche ———

export function satzAnlegen(v: {
  kulturId: Id
  sorte?: string
  bezeichnung: string
  herkunft: 'gesaet' | 'gepflanzt'
  startDatum: string
  schiffId: Id
  anteil: number
}): Id {
  const id = neueId('s')
  aendern(d => {
    const satz: Satz = {
      id,
      kulturId: v.kulturId,
      sorte: v.sorte || undefined,
      bezeichnung: v.bezeichnung,
      herkunft: v.herkunft,
      startDatum: v.startDatum,
      // Angelegt wird heute — alles davor ist nicht erfasst. KONZEPT §7.
      erfassungsbeginn: heute(),
      status: 'laufend',
    }
    d.saetze.push(satz)
    d.belegungen.push({
      id: neueId('b'), satzId: id, schiffId: v.schiffId,
      vonDatum: v.startDatum, anteil: v.anteil,
    })
  })
  return id
}

export function auftragEroeffnen(v: {
  satzId: Id
  arbeitsartId: Id
  schiffIds: Id[]
  personId: Id
  personenErwartet: number
}): Id {
  const id = neueId('auf')
  const jetzt = new Date().toISOString()
  aendern(d => {
    d.auftraege.push({
      id, satzId: v.satzId, arbeitsartId: v.arbeitsartId, schiffIds: v.schiffIds,
      eroeffnetVon: v.personId, startTs: jetzt,
      personenErwartet: v.personenErwartet, status: 'laufend',
    })
    d.teilnahmen.push({
      id: neueId('t'), auftragId: id, personId: v.personId, startTs: jetzt, art: 'eroeffner',
    })
  })
  return id
}

export function beitreten(auftragId: Id, personId: Id) {
  aendern(d => {
    const schon = d.teilnahmen.find(t => t.auftragId === auftragId && t.personId === personId && !t.endeTs)
    if (schon) return
    d.teilnahmen.push({
      id: neueId('t'), auftragId, personId,
      startTs: new Date().toISOString(), art: 'beigetreten',
    })
    // Wer beitritt, obwohl der Eroeffner weniger angemeldet hat, zaehlt trotzdem.
    const a = d.auftraege.find(x => x.id === auftragId)
    if (a) {
      const n = d.teilnahmen.filter(t => t.auftragId === auftragId).length
      if (n > a.personenErwartet) a.personenErwartet = n
    }
  })
}

/** Nur ich bin fertig — der Auftrag laeuft weiter. */
export function teilnahmeBeenden(auftragId: Id, personId: Id) {
  aendern(d => {
    for (const t of d.teilnahmen) {
      if (t.auftragId === auftragId && t.personId === personId && !t.endeTs) {
        t.endeTs = new Date().toISOString()
      }
    }
  })
}

/** Alle sind fertig. Beendet auch die offenen Teilnahmen. */
export function auftragAbschliessen(auftragId: Id, menge?: number) {
  const jetzt = new Date().toISOString()
  aendern(d => {
    const a = d.auftraege.find(x => x.id === auftragId)
    if (!a) return
    a.status = 'fertig'
    a.endeTs = jetzt
    if (menge !== undefined) a.menge = menge
    for (const t of d.teilnahmen) {
      if (t.auftragId === auftragId && !t.endeTs) t.endeTs = jetzt
    }
  })
}

/** Weiter zum naechsten Schiff, ohne neu anzumelden. */
export function schiffAnhaengen(auftragId: Id, schiffId: Id) {
  aendern(d => {
    const a = d.auftraege.find(x => x.id === auftragId)
    if (a && !a.schiffIds.includes(schiffId)) a.schiffIds.push(schiffId)
  })
}

// ——— Aktionen der Buero-Oberflaeche ———

/** Vergessenen Auftrag mit bestaetigter Endzeit nachtragen. */
export function auftragNachtragen(auftragId: Id, endeTs: string) {
  aendern(d => {
    const a = d.auftraege.find(x => x.id === auftragId)
    if (!a) return
    a.status = 'fertig'
    a.endeTs = endeTs
    for (const t of d.teilnahmen) {
      if (t.auftragId === auftragId && (!t.endeTs || t.endeTs > endeTs)) t.endeTs = endeTs
    }
  })
}

export function satzAbschliessen(satzId: Id, datum: string, status: 'geerntet' | 'umgebrochen') {
  aendern(d => {
    const s = d.saetze.find(x => x.id === satzId)
    if (!s) return
    s.status = status
    s.abschlussDatum = datum
    for (const b of d.belegungen) {
      if (b.satzId === satzId && !b.bisDatum) b.bisDatum = datum
    }
  })
}

export function satzWiederOeffnen(satzId: Id) {
  aendern(d => {
    const s = d.saetze.find(x => x.id === satzId)
    if (!s) return
    s.status = 'laufend'
    const datum = s.abschlussDatum
    s.abschlussDatum = undefined
    for (const b of d.belegungen) {
      if (b.satzId === satzId && b.bisDatum === datum) b.bisDatum = undefined
    }
  })
}

export function stundensatzSetzen(wert: number) {
  aendern(d => { d.einstellungen.stundensatz = wert })
}

export function mindestSaetzeSetzen(wert: number) {
  aendern(d => { d.einstellungen.mindestSaetze = wert })
}

export function arbeitsartHinzufuegen(name: string, zeichen: Arbeitsart['zeichen']) {
  aendern(d => {
    d.arbeitsarten.push({
      id: neueId('a'), name, zeichen, erfasstMenge: false, erwarteteDauerH: 4,
    })
  })
}

export function arbeitsartEntfernen(id: Id) {
  aendern(d => {
    if (d.auftraege.some(a => a.arbeitsartId === id)) return
    d.arbeitsarten = d.arbeitsarten.filter(a => a.id !== id)
  })
}

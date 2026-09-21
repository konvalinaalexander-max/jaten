/**
 * Die Rechenlogik. Bewusst rein: bekommt Daten, gibt Zahlen zurueck,
 * kennt weder Speicher noch Oberflaeche — damit sie pruefbar bleibt.
 */
import type { Auftrag, Daten, Id, Satz, Teilnahme } from './typen.ts'

const MS_H = 3600_000

export interface StundenBefund {
  /** Aus echten Teilnahmen mit Start und Ende. */
  gemessen: number
  /**
   * Fuer die Leute, die der Eroeffner angemeldet hat, die aber nie
   * beigetreten sind (kein Handy). Getrennt gehalten, weil weniger belastbar.
   */
  ergaenzt: number
  gesamt: number
  /** Wieviele Personen zaehlen mit. */
  personen: number
  /** Personen, fuer die nur ergaenzt wurde. */
  ohneGeraet: number
}

export const LEER: StundenBefund = {
  gemessen: 0, ergaenzt: 0, gesamt: 0, personen: 0, ohneGeraet: 0,
}

/** Dauer einer Teilnahme in Stunden. Laufende zaehlen bis jetzt. */
export function teilnahmeStunden(t: Teilnahme, jetzt: number): number {
  const ende = t.endeTs ? new Date(t.endeTs).getTime() : jetzt
  return Math.max(0, (ende - new Date(t.startTs).getTime()) / MS_H)
}

/** Dauer des Auftrags selbst — Grundlage fuer die Ergaenzung. */
export function auftragDauer(a: Auftrag, jetzt: number): number {
  const ende = a.endeTs ? new Date(a.endeTs).getTime() : jetzt
  return Math.max(0, (ende - new Date(a.startTs).getTime()) / MS_H)
}

/**
 * Stunden eines Auftrags.
 *
 * Der Eroeffner gibt an, wieviele mitmachen. Wer ein Handy hat, tritt bei und
 * bringt seine echten Zeiten mit. Die Differenz sind die Leute ohne Geraet —
 * sie bekommen die Auftragsdauer angerechnet, sonst faellt ihre Arbeit unter
 * den Tisch und die Kostenrechnung ist zu niedrig, ohne dass es auffaellt.
 */
export function auftragStunden(a: Auftrag, teilnahmen: Teilnahme[], jetzt = Date.now()): StundenBefund {
  const meine = teilnahmen.filter(t => t.auftragId === a.id)
  const gemessen = meine.reduce((s, t) => s + teilnahmeStunden(t, jetzt), 0)
  const ohneGeraet = Math.max(0, a.personenErwartet - meine.length)
  const ergaenzt = ohneGeraet * auftragDauer(a, jetzt)
  return {
    gemessen,
    ergaenzt,
    gesamt: gemessen + ergaenzt,
    personen: Math.max(meine.length, a.personenErwartet),
    ohneGeraet,
  }
}

function summiere(a: StundenBefund, b: StundenBefund): StundenBefund {
  return {
    gemessen: a.gemessen + b.gemessen,
    ergaenzt: a.ergaenzt + b.ergaenzt,
    gesamt: a.gesamt + b.gesamt,
    personen: Math.max(a.personen, b.personen),
    ohneGeraet: a.ohneGeraet + b.ohneGeraet,
  }
}

export function auftraegeDesSatzes(d: Daten, satzId: Id): Auftrag[] {
  return d.auftraege
    .filter(a => a.satzId === satzId)
    .sort((x, y) => x.startTs.localeCompare(y.startTs))
}

export interface SatzBefund {
  stunden: StundenBefund
  /** Stunden je Arbeitsart, absteigend. */
  jeArbeitsart: { arbeitsartId: Id; stunden: number }[]
  anzahlAuftraege: number
  flaecheM2: number
  kosten: number
  /** Stunden je Are (100 m²) — das Mass, in dem der Betrieb denkt. */
  stundenJeAre: number
  /** Erfassung begann nach dem Pflanzen: Zahlen sind unvollstaendig. */
  vollstaendig: boolean
}

/** Belegte Flaeche eines Satzes — Anteil mal Schiffflaeche, ueber alle Belegungen. */
export function satzFlaeche(d: Daten, satzId: Id): number {
  return d.belegungen
    .filter(b => b.satzId === satzId)
    .reduce((s, b) => {
      const schiff = d.schiffe.find(x => x.id === b.schiffId)
      return s + (schiff ? schiff.flaecheM2 * b.anteil : 0)
    }, 0)
}

export function satzBefund(d: Daten, satz: Satz, jetzt = Date.now()): SatzBefund {
  const auftraege = auftraegeDesSatzes(d, satz.id)
  let stunden = LEER
  const proArt = new Map<Id, number>()

  for (const a of auftraege) {
    const b = auftragStunden(a, d.teilnahmen, jetzt)
    stunden = summiere(stunden, b)
    proArt.set(a.arbeitsartId, (proArt.get(a.arbeitsartId) ?? 0) + b.gesamt)
  }

  const flaecheM2 = satzFlaeche(d, satz.id)
  return {
    stunden,
    jeArbeitsart: [...proArt.entries()]
      .map(([arbeitsartId, s]) => ({ arbeitsartId, stunden: s }))
      .sort((x, y) => y.stunden - x.stunden),
    anzahlAuftraege: auftraege.length,
    flaecheM2,
    kosten: stunden.gesamt * d.einstellungen.stundensatz,
    stundenJeAre: flaecheM2 > 0 ? stunden.gesamt / (flaecheM2 / 100) : 0,
    vollstaendig: satz.erfassungsbeginn <= satz.startDatum,
  }
}

/**
 * Mittelwert je Kultur — nur aus vollstaendig erfassten, abgeschlossenen
 * Saetzen, und erst ab einer Mindestzahl. Eine Zahl aus zwei Saetzen sieht
 * genauso aus wie eine aus zwanzig; das ist die gefaehrliche Sorte.
 */
export interface KulturBefund {
  kulturId: Id
  saetze: number
  stundenJeAre: number
  kostenJeAre: number
  belastbar: boolean
}

export function kulturBefund(d: Daten, kulturId: Id, jetzt = Date.now()): KulturBefund {
  const passend = d.saetze.filter(
    s => s.kulturId === kulturId && s.status === 'geerntet' && s.erfassungsbeginn <= s.startDatum,
  )
  const werte = passend.map(s => satzBefund(d, s, jetzt)).filter(b => b.flaecheM2 > 0)
  const mittel = werte.length
    ? werte.reduce((s, b) => s + b.stundenJeAre, 0) / werte.length
    : 0
  return {
    kulturId,
    saetze: werte.length,
    stundenJeAre: mittel,
    kostenJeAre: mittel * d.einstellungen.stundensatz,
    belastbar: werte.length >= d.einstellungen.mindestSaetze,
  }
}

/** Belegungen, die an einem Stichtag gelten. */
export function belegungenAm(d: Daten, datum: string) {
  return d.belegungen.filter(b => b.vonDatum <= datum && (!b.bisDatum || b.bisDatum >= datum))
}

/** Welche Saetze liegen gerade auf diesem Schiff? Meist genau einer. */
export function saetzeAufSchiff(d: Daten, schiffId: Id, datum: string): Satz[] {
  const ids = belegungenAm(d, datum).filter(b => b.schiffId === schiffId).map(b => b.satzId)
  return d.saetze.filter(s => ids.includes(s.id) && s.status === 'laufend')
}

/** Freier Flaechenanteil eines Schiffs — fuer die Frage „passt da noch was hin?". */
export function freierAnteil(d: Daten, schiffId: Id, datum: string): number {
  const belegt = belegungenAm(d, datum)
    .filter(b => b.schiffId === schiffId)
    .reduce((s, b) => s + b.anteil, 0)
  return Math.max(0, 1 - belegt)
}

/**
 * Auftraege, die nachgetragen werden muessen: laeuft laenger als das Doppelte
 * der erwarteten Dauer, oder ist von einem frueheren Tag. Das ersetzt die
 * automatische GPS-Abschaltung — ein Mensch bestaetigt die Endzeit.
 */
export function nachzutragen(d: Daten, jetzt = Date.now()): Auftrag[] {
  const heute = new Date(jetzt).toISOString().slice(0, 10)
  return d.auftraege.filter(a => {
    if (a.status !== 'laufend') return false
    if (a.startTs.slice(0, 10) < heute) return true
    const art = d.arbeitsarten.find(x => x.id === a.arbeitsartId)
    const grenze = (art?.erwarteteDauerH ?? 4) * 2
    return auftragDauer(a, jetzt) > grenze
  })
}

/** Vorschlag fuer die Endzeit eines vergessenen Auftrags. */
export function endeVorschlag(d: Daten, a: Auftrag): string {
  const art = d.arbeitsarten.find(x => x.id === a.arbeitsartId)
  const ende = new Date(new Date(a.startTs).getTime() + (art?.erwarteteDauerH ?? 4) * MS_H)
  return ende.toISOString()
}

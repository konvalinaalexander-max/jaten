/** Fachbegriffe als Typen. Siehe docs/KONZEPT.md §2. */

export type Id = string
/** ISO-Datum ohne Zeit, z.B. "2026-04-08". */
export type Datum = string
/** ISO-Zeitstempel mit Zeit. */
export type Zeit = string

export interface Feld {
  id: Id
  name: string
  code: string
}

/** Beet/Block innerhalb eines Feldes. Traegt KEINE Kultur — siehe Belegung. */
export interface Schiff {
  id: Id
  feldId: Id
  name: string
  flaecheM2: number
}

export interface Kultur {
  id: Id
  name: string
  /** Bezugsgroesse der spaeteren Ernteerfassung. */
  einheit: 'Stueck' | 'kg' | 'Kisten'
}

/** Eine Pflanzung. Der Kostentraeger. */
export interface Satz {
  id: Id
  kulturId: Id
  sorte?: string
  /** Kurzname, z.B. "KW14". */
  bezeichnung: string
  herkunft: 'gesaet' | 'gepflanzt'
  /** Aussaat- bzw. Pflanzdatum. */
  startDatum: Datum
  /** Ab wann die Stunden vollstaendig erfasst sind. Siehe KONZEPT §7. */
  erfassungsbeginn: Datum
  status: 'laufend' | 'geerntet' | 'umgebrochen'
  abschlussDatum?: Datum
  /** Erntemenge — noch nicht erfasst, siehe KONZEPT §6. */
  erntemenge?: number
  notiz?: string
}

/**
 * Welcher Satz lag von wann bis wann auf welchem Schiff.
 * Das Herzstueck: ein Schiff kann nacheinander mehrere Saetze tragen und
 * gleichzeitig geteilt sein (anteil < 1).
 */
export interface Belegung {
  id: Id
  satzId: Id
  schiffId: Id
  vonDatum: Datum
  bisDatum?: Datum
  /** Flaechenanteil des Schiffs, 0 < anteil <= 1. */
  anteil: number
}

export interface Arbeitsart {
  id: Id
  name: string
  /** Schluessel fuer das Symbol in teile/Zeichen.tsx. */
  zeichen: 'hacken' | 'jaeten' | 'saeen' | 'ernten'
  /** Erfasst dieser Arbeitsgang eine Menge? (Ernte — KONZEPT §6) */
  erfasstMenge: boolean
  /** Fuer die Erinnerung „laeuft noch?" — KONZEPT §5. */
  erwarteteDauerH: number
}

export interface Person {
  id: Id
  name: string
  aktiv: boolean
}

export interface Auftrag {
  id: Id
  satzId: Id
  arbeitsartId: Id
  schiffIds: Id[]
  eroeffnetVon: Id
  startTs: Zeit
  endeTs?: Zeit
  /**
   * Wieviele machen mit — vom Eroeffner angegeben. Kontrollgroesse gegen die
   * Beitritte: wer kein Handy hat, taucht sonst nie in den Stunden auf.
   */
  personenErwartet: number
  status: 'laufend' | 'fertig'
  menge?: number
  notiz?: string
}

export interface Teilnahme {
  id: Id
  auftragId: Id
  personId: Id
  startTs: Zeit
  endeTs?: Zeit
  art: 'eroeffner' | 'beigetreten'
}

export interface Einstellungen {
  /** Betrieblicher Vollkostensatz je Stunde. KONZEPT §6. */
  stundensatz: number
  waehrung: string
  /** Ab wievielen vollstaendigen Saetzen ein Kulturmittel gezeigt wird. */
  mindestSaetze: number
}

export interface Daten {
  felder: Feld[]
  schiffe: Schiff[]
  kulturen: Kultur[]
  saetze: Satz[]
  belegungen: Belegung[]
  arbeitsarten: Arbeitsart[]
  personen: Person[]
  auftraege: Auftrag[]
  teilnahmen: Teilnahme[]
  einstellungen: Einstellungen
}

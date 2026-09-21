/**
 * Demodaten. Alles relativ zu heute, damit die Saison immer aktuell aussieht.
 *
 * Zwei Faelle stecken absichtlich drin, weil sie das Datenmodell belegen:
 *  · Hausfeld Schiff 1 trug erst Salat KW10 (abgeerntet), jetzt Salat KW14.
 *    Haenge die Kultur ans Schiff, und die Stunden des ersten Satzes wandern
 *    beim Ueberschreiben zum zweiten.
 *  · Hausfeld Schiff 3 ist geteilt: halb Kohlrabi, halb Randen.
 */
import { kalenderwoche } from './format.ts'
import type {
  Arbeitsart, Auftrag, Belegung, Daten, Feld, Id, Kultur, Person, Satz, Schiff, Teilnahme,
} from './typen.ts'

/** Wiederholbarer Zufall — dieselbe Demo bei jedem Zuruecksetzen. */
function wuerfel(saat: number) {
  let z = saat >>> 0
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0
    return z / 4294967296
  }
}

function tag(offset: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

function ts(offsetTage: number, stunde: number, minute = 0): string {
  const d = new Date()
  d.setHours(stunde, minute, 0, 0)
  d.setDate(d.getDate() + offsetTage)
  return d.toISOString()
}

const FELDER: Feld[] = [
  { id: 'f1', name: 'Hausfeld', code: 'HF' },
  { id: 'f2', name: 'Bachacker', code: 'BA' },
  { id: 'f3', name: 'Oberfeld', code: 'OF' },
  { id: 'f4', name: 'Rietwiese', code: 'RW' },
]

const SCHIFF_PLAN: [Id, number, number[]][] = [
  ['f1', 6, [640, 640, 580, 720, 720, 400]],
  ['f2', 4, [850, 850, 620, 620]],
  ['f3', 5, [480, 480, 480, 900, 900]],
  ['f4', 3, [1100, 1100, 760]],
]

const SCHIFFE: Schiff[] = SCHIFF_PLAN.flatMap(([feldId, n, flaechen]) =>
  Array.from({ length: n }, (_, i) => ({
    id: `${feldId}-s${i + 1}`,
    feldId,
    name: `Schiff ${i + 1}`,
    flaecheM2: flaechen[i],
  })),
)

const KULTUREN: Kultur[] = [
  { id: 'k1', name: 'Kopfsalat', einheit: 'Stueck' },
  { id: 'k2', name: 'Kohlrabi', einheit: 'Stueck' },
  { id: 'k3', name: 'Randen', einheit: 'kg' },
  { id: 'k4', name: 'Fenchel', einheit: 'Stueck' },
  { id: 'k5', name: 'Karotten', einheit: 'kg' },
  { id: 'k6', name: 'Lauch', einheit: 'Stueck' },
  { id: 'k7', name: 'Zucchetti', einheit: 'kg' },
  { id: 'k8', name: 'Nuesslisalat', einheit: 'kg' },
]

/** Die vier Arbeitsarten aus der ersten Runde. Erweiterbar in den Einstellungen. */
const ARBEITSARTEN: Arbeitsart[] = [
  { id: 'a1', name: 'Hacken', zeichen: 'hacken', erfasstMenge: false, erwarteteDauerH: 4 },
  { id: 'a2', name: 'Jäten', zeichen: 'jaeten', erfasstMenge: false, erwarteteDauerH: 5 },
  { id: 'a3', name: 'Säen', zeichen: 'saeen', erfasstMenge: false, erwarteteDauerH: 3 },
  { id: 'a4', name: 'Ernten', zeichen: 'ernten', erfasstMenge: true, erwarteteDauerH: 5 },
]

const NAMEN = [
  'Marek', 'Ana', 'Tomasz', 'Elif', 'Stefan', 'Vera', 'Driton',
  'Fatima', 'Luca', 'Beata', 'Ibrahim', 'Sandra', 'Jonas', 'Rina',
]
const PERSONEN: Person[] = NAMEN.map((name, i) => ({ id: `p${i + 1}`, name, aktiv: true }))

interface SatzPlan {
  id: Id
  kulturId: Id
  sorte?: string
  herkunft: 'gesaet' | 'gepflanzt'
  /** Tage vor heute. */
  start: number
  /** Tage vor heute; fehlt = laeuft noch. */
  abschluss?: number
  status: 'laufend' | 'geerntet' | 'umgebrochen'
  /** Tage vor heute. Spaeter als start = unvollstaendig erfasst. */
  erfassung: number
  belegung: [Id, number][]
  notiz?: string
}

const SATZ_PLAN: SatzPlan[] = [
  // Abgeschlossen — das Archiv. Erst hier wird das Vergleichen interessant.
  {
    id: 's1', kulturId: 'k1', sorte: 'Maugli', herkunft: 'gepflanzt',
    start: 126, abschluss: 68, status: 'geerntet', erfassung: 126,
    belegung: [['f1-s1', 1]],
  },
  {
    id: 's2', kulturId: 'k1', sorte: 'Maugli', herkunft: 'gepflanzt',
    start: 112, abschluss: 54, status: 'geerntet', erfassung: 112,
    belegung: [['f1-s2', 1]],
  },
  {
    id: 's3', kulturId: 'k2', sorte: 'Korist', herkunft: 'gepflanzt',
    start: 119, abschluss: 61, status: 'geerntet', erfassung: 119,
    belegung: [['f1-s4', 1]],
  },
  {
    id: 's4', kulturId: 'k8', herkunft: 'gesaet',
    start: 340, abschluss: 250, status: 'geerntet', erfassung: 300,
    belegung: [['f3-s3', 1]],
    notiz: 'Erfassung erst mitten im Satz begonnen — Stunden unvollständig.',
  },
  {
    id: 's5', kulturId: 'k4', sorte: 'Rondo', herkunft: 'gepflanzt',
    start: 105, abschluss: 40, status: 'geerntet', erfassung: 105,
    belegung: [['f2-s3', 1]],
  },
  {
    id: 's6', kulturId: 'k2', sorte: 'Korist', herkunft: 'gepflanzt',
    start: 98, abschluss: 45, status: 'umgebrochen', erfassung: 98,
    belegung: [['f1-s5', 1]],
    notiz: 'Hitzeschaden, nicht geerntet. Die Stunden sind trotzdem angefallen.',
  },

  // Laufend — das Dashboard.
  {
    id: 's10', kulturId: 'k1', sorte: 'Maugli', herkunft: 'gepflanzt',
    start: 55, status: 'laufend', erfassung: 55,
    belegung: [['f1-s1', 1], ['f1-s2', 1]],
  },
  {
    id: 's11', kulturId: 'k2', sorte: 'Korist', herkunft: 'gepflanzt',
    start: 42, status: 'laufend', erfassung: 42,
    belegung: [['f1-s3', 0.5]],
    notiz: 'Schiff geteilt mit Randen KW16.',
  },
  {
    id: 's12', kulturId: 'k3', sorte: 'Rote Kugel', herkunft: 'gesaet',
    start: 42, status: 'laufend', erfassung: 42,
    belegung: [['f1-s3', 0.5]],
    notiz: 'Schiff geteilt mit Kohlrabi KW16.',
  },
  {
    id: 's13', kulturId: 'k5', sorte: 'Nerac', herkunft: 'gesaet',
    start: 110, status: 'laufend', erfassung: 74,
    belegung: [['f3-s1', 1], ['f3-s2', 1]],
    notiz: 'Stand schon, als die Erfassung begann.',
  },
  {
    id: 's14', kulturId: 'k4', sorte: 'Rondo', herkunft: 'gepflanzt',
    start: 28, status: 'laufend', erfassung: 28,
    belegung: [['f2-s1', 1]],
  },
  {
    id: 's15', kulturId: 'k6', sorte: 'Krypton', herkunft: 'gepflanzt',
    start: 49, status: 'laufend', erfassung: 49,
    belegung: [['f4-s1', 1], ['f4-s2', 1]],
  },
  {
    id: 's16', kulturId: 'k7', sorte: 'Diamant', herkunft: 'gepflanzt',
    start: 21, status: 'laufend', erfassung: 21,
    belegung: [['f2-s2', 1]],
  },
  {
    id: 's17', kulturId: 'k1', sorte: 'Analena', herkunft: 'gepflanzt',
    start: 14, status: 'laufend', erfassung: 14,
    belegung: [['f1-s6', 1], ['f3-s4', 0.4]],
  },
]

export function demoDaten(): Daten {
  const zufall = wuerfel(20260408)
  const saetze: Satz[] = []
  const belegungen: Belegung[] = []
  const auftraege: Auftrag[] = []
  const teilnahmen: Teilnahme[] = []
  let lfd = 0

  const naechsteId = (p: string) => `${p}${++lfd}`

  for (const p of SATZ_PLAN) {
    saetze.push({
      id: p.id,
      kulturId: p.kulturId,
      sorte: p.sorte,
      // Der Satz heisst nach der Woche, in der er gesetzt wurde.
      bezeichnung: `KW${kalenderwoche(tag(-p.start))}`,
      herkunft: p.herkunft,
      startDatum: tag(-p.start),
      erfassungsbeginn: tag(-p.erfassung),
      status: p.status,
      abschlussDatum: p.abschluss !== undefined ? tag(-p.abschluss) : undefined,
      notiz: p.notiz,
    })

    for (const [schiffId, anteil] of p.belegung) {
      belegungen.push({
        id: naechsteId('b'),
        satzId: p.id,
        schiffId,
        vonDatum: tag(-p.start),
        bisDatum: p.abschluss !== undefined ? tag(-p.abschluss) : undefined,
        anteil,
      })
    }

    // Arbeitsgaenge ueber die Standzeit verteilen.
    const bis = p.abschluss ?? 0
    const schiffIds = p.belegung.map(([s]) => s)
    const gaenge: { art: Id; tage: number }[] = []

    // Saeen/Pflanzen am Anfang — nur wenn die Erfassung da schon lief.
    if (p.erfassung >= p.start) gaenge.push({ art: 'a3', tage: p.start })

    for (let t = p.start - 10; t > bis + 2; t -= 13 + Math.floor(zufall() * 6)) {
      if (t > p.erfassung) continue
      gaenge.push({ art: zufall() < 0.62 ? 'a1' : 'a2', tage: t })
    }
    if (p.status === 'geerntet') {
      gaenge.push({ art: 'a4', tage: bis + 2 })
      gaenge.push({ art: 'a4', tage: bis })
    }

    for (const g of gaenge) {
      const beginn = 7 + Math.floor(zufall() * 3)
      const dauer = 1.5 + zufall() * 3.5
      const leute = 2 + Math.floor(zufall() * 4)
      // Nicht alle haben ein Handy: manchmal treten weniger bei, als mitmachen.
      const mitGeraet = zufall() < 0.3 ? Math.max(1, leute - 1 - Math.floor(zufall() * 2)) : leute
      const auftragId = naechsteId('auf')
      const startTs = ts(-g.tage, beginn, Math.floor(zufall() * 4) * 15)
      const endeTs = new Date(new Date(startTs).getTime() + dauer * 3600_000).toISOString()

      auftraege.push({
        id: auftragId,
        satzId: p.id,
        arbeitsartId: g.art,
        schiffIds: schiffIds.slice(0, 1 + Math.floor(zufall() * schiffIds.length)),
        eroeffnetVon: PERSONEN[Math.floor(zufall() * PERSONEN.length)].id,
        startTs,
        endeTs,
        personenErwartet: leute,
        status: 'fertig',
        menge: g.art === 'a4' ? Math.round(200 + zufall() * 900) : undefined,
      })

      const gewaehlt = new Set<string>()
      while (gewaehlt.size < mitGeraet) {
        gewaehlt.add(PERSONEN[Math.floor(zufall() * PERSONEN.length)].id)
      }
      let ersteR = true
      for (const personId of gewaehlt) {
        // Wer frueher geht, hat eine eigene Endzeit — deshalb haengen die
        // Stunden an der Teilnahme und nicht am Auftrag.
        const frueher = !ersteR && zufall() < 0.18 ? 0.4 + zufall() * 0.9 : 0
        teilnahmen.push({
          id: naechsteId('t'),
          auftragId,
          personId,
          startTs,
          endeTs: new Date(new Date(endeTs).getTime() - frueher * 3600_000).toISOString(),
          art: ersteR ? 'eroeffner' : 'beigetreten',
        })
        ersteR = false
      }
    }
  }

  // Ein Auftrag, der gerade jetzt laeuft — damit die Feld-Oberflaeche etwas zeigt.
  const jetztStart = new Date(Date.now() - 95 * 60_000).toISOString()
  auftraege.push({
    id: 'auf-laeuft', satzId: 's10', arbeitsartId: 'a1', schiffIds: ['f1-s1', 'f1-s2'],
    eroeffnetVon: 'p1', startTs: jetztStart, personenErwartet: 4, status: 'laufend',
  })
  for (const [i, personId] of ['p1', 'p4', 'p10'].entries()) {
    teilnahmen.push({
      id: naechsteId('t'), auftragId: 'auf-laeuft', personId,
      startTs: i === 0 ? jetztStart : new Date(Date.now() - (80 - i * 6) * 60_000).toISOString(),
      art: i === 0 ? 'eroeffner' : 'beigetreten',
    })
  }

  const zweiterStart = new Date(Date.now() - 40 * 60_000).toISOString()
  auftraege.push({
    id: 'auf-laeuft2', satzId: 's15', arbeitsartId: 'a2', schiffIds: ['f4-s1'],
    eroeffnetVon: 'p6', startTs: zweiterStart, personenErwartet: 3, status: 'laufend',
  })
  teilnahmen.push({
    id: naechsteId('t'), auftragId: 'auf-laeuft2', personId: 'p6',
    startTs: zweiterStart, art: 'eroeffner',
  })

  // Und einer, den gestern jemand zu schliessen vergessen hat.
  auftraege.push({
    id: 'auf-vergessen', satzId: 's14', arbeitsartId: 'a2', schiffIds: ['f2-s1'],
    eroeffnetVon: 'p3', startTs: ts(-1, 13, 30), personenErwartet: 3, status: 'laufend',
  })
  for (const [i, personId] of ['p3', 'p8', 'p12'].entries()) {
    teilnahmen.push({
      id: naechsteId('t'), auftragId: 'auf-vergessen', personId,
      startTs: ts(-1, 13, 30 + i * 5), art: i === 0 ? 'eroeffner' : 'beigetreten',
    })
  }

  return {
    felder: FELDER,
    schiffe: SCHIFFE,
    kulturen: KULTUREN,
    saetze,
    belegungen,
    arbeitsarten: ARBEITSARTEN,
    personen: PERSONEN,
    auftraege,
    teilnahmen,
    einstellungen: { stundensatz: 32, waehrung: 'CHF', mindestSaetze: 3 },
  }
}

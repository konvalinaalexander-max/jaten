import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  auftragStunden, freierAnteil, kulturBefund, nachzutragen,
  saetzeAufSchiff, satzBefund, satzFlaeche,
} from '../src/lib/rechnen.ts'
import type { Auftrag, Daten, Teilnahme } from '../src/lib/typen.ts'

const T0 = Date.parse('2026-05-04T07:00:00.000Z')
const std = (n: number) => new Date(T0 + n * 3600_000).toISOString()

function grunddaten(): Daten {
  return {
    felder: [{ id: 'f1', name: 'Hausfeld', code: 'HF' }],
    schiffe: [
      { id: 'sch1', feldId: 'f1', name: 'Schiff 1', flaecheM2: 600 },
      { id: 'sch2', feldId: 'f1', name: 'Schiff 2', flaecheM2: 400 },
    ],
    kulturen: [{ id: 'k1', name: 'Kopfsalat', einheit: 'Stueck' }],
    saetze: [],
    belegungen: [],
    arbeitsarten: [
      { id: 'a1', name: 'Hacken', zeichen: 'hacken', erfasstMenge: false, erwarteteDauerH: 4 },
    ],
    personen: [
      { id: 'p1', name: 'Ana', aktiv: true },
      { id: 'p2', name: 'Marek', aktiv: true },
    ],
    auftraege: [],
    teilnahmen: [],
    einstellungen: { stundensatz: 30, waehrung: 'CHF', mindestSaetze: 3 },
  }
}

const auftrag = (v: Partial<Auftrag> = {}): Auftrag => ({
  id: 'auf1', satzId: 's1', arbeitsartId: 'a1', schiffIds: ['sch1'],
  eroeffnetVon: 'p1', startTs: std(0), endeTs: std(4),
  personenErwartet: 2, status: 'fertig', ...v,
})

const teil = (v: Partial<Teilnahme> = {}): Teilnahme => ({
  id: 't1', auftragId: 'auf1', personId: 'p1',
  startTs: std(0), endeTs: std(4), art: 'eroeffner', ...v,
})

test('Stunden sind die Summe der Teilnahmen, nicht Dauer mal Kopfzahl', () => {
  const a = auftrag({ personenErwartet: 2 })
  // Marek geht nach 3 statt 4 Stunden.
  const t = [teil(), teil({ id: 't2', personId: 'p2', endeTs: std(3), art: 'beigetreten' })]
  const b = auftragStunden(a, t, Date.parse(std(5)))
  assert.equal(b.gemessen, 7)
  assert.equal(b.ergaenzt, 0)
  assert.equal(b.gesamt, 7)
})

test('Wer kein Geraet hat, zaehlt ueber die angemeldete Anzahl mit', () => {
  // Drei machen mit, nur einer tritt bei.
  const a = auftrag({ personenErwartet: 3 })
  const b = auftragStunden(a, [teil()], Date.parse(std(5)))
  assert.equal(b.gemessen, 4)
  assert.equal(b.ohneGeraet, 2)
  assert.equal(b.ergaenzt, 8)       // 2 Personen × 4 h Auftragsdauer
  assert.equal(b.gesamt, 12)
  assert.equal(b.personen, 3)
})

test('Mehr Beitritte als angemeldet werden nicht wegergaenzt', () => {
  const a = auftrag({ personenErwartet: 1 })
  const t = [teil(), teil({ id: 't2', personId: 'p2', art: 'beigetreten' })]
  const b = auftragStunden(a, t, Date.parse(std(5)))
  assert.equal(b.ohneGeraet, 0)
  assert.equal(b.gesamt, 8)
})

test('Ein laufender Auftrag zaehlt bis jetzt', () => {
  const a = auftrag({ endeTs: undefined, status: 'laufend', personenErwartet: 1 })
  const b = auftragStunden(a, [teil({ endeTs: undefined })], Date.parse(std(2.5)))
  assert.equal(b.gesamt, 2.5)
})

test('Ein halbes Schiff zaehlt nur zur Haelfte', () => {
  const d = grunddaten()
  d.belegungen = [
    { id: 'b1', satzId: 's1', schiffId: 'sch1', vonDatum: '2026-04-01', anteil: 0.5 },
    { id: 'b2', satzId: 's1', schiffId: 'sch2', vonDatum: '2026-04-01', anteil: 1 },
  ]
  assert.equal(satzFlaeche(d, 's1'), 700)   // 300 + 400
  assert.equal(freierAnteil(d, 'sch1', '2026-05-01'), 0.5)
  assert.equal(freierAnteil(d, 'sch2', '2026-05-01'), 0)
})

test('Ein Schiff traegt nacheinander mehrere Saetze — die Historie bleibt getrennt', () => {
  const d = grunddaten()
  d.saetze = [
    {
      id: 's1', kulturId: 'k1', bezeichnung: 'KW10', herkunft: 'gepflanzt',
      startDatum: '2026-03-02', erfassungsbeginn: '2026-03-02', status: 'geerntet',
      abschlussDatum: '2026-04-20',
    },
    {
      id: 's2', kulturId: 'k1', bezeichnung: 'KW18', herkunft: 'gepflanzt',
      startDatum: '2026-04-25', erfassungsbeginn: '2026-04-25', status: 'laufend',
    },
  ]
  d.belegungen = [
    { id: 'b1', satzId: 's1', schiffId: 'sch1', vonDatum: '2026-03-02', bisDatum: '2026-04-20', anteil: 1 },
    { id: 'b2', satzId: 's2', schiffId: 'sch1', vonDatum: '2026-04-25', anteil: 1 },
  ]

  assert.deepEqual(saetzeAufSchiff(d, 'sch1', '2026-05-10').map(s => s.id), ['s2'])
  // Waehrend der Luecke steht dort nichts.
  assert.deepEqual(saetzeAufSchiff(d, 'sch1', '2026-04-22').map(s => s.id), [])
  // Und der alte Satz behaelt seine Flaeche, obwohl dort jetzt etwas anderes steht.
  assert.equal(satzFlaeche(d, 's1'), 600)
})

test('Ein Satz, dessen Erfassung spaeter begann, gilt als unvollstaendig', () => {
  const d = grunddaten()
  d.saetze = [{
    id: 's1', kulturId: 'k1', bezeichnung: 'KW12', herkunft: 'gesaet',
    startDatum: '2026-03-20', erfassungsbeginn: '2026-05-01', status: 'laufend',
  }]
  d.belegungen = [{ id: 'b1', satzId: 's1', schiffId: 'sch1', vonDatum: '2026-03-20', anteil: 1 }]
  assert.equal(satzBefund(d, d.saetze[0]).vollstaendig, false)
})

test('Der Kulturvergleich laesst unvollstaendige Saetze aussen vor', () => {
  const d = grunddaten()
  d.einstellungen.mindestSaetze = 2
  d.saetze = [
    // vollstaendig, 600 m² = 6 Aren
    {
      id: 's1', kulturId: 'k1', bezeichnung: 'A', herkunft: 'gepflanzt',
      startDatum: '2026-03-01', erfassungsbeginn: '2026-03-01',
      status: 'geerntet', abschlussDatum: '2026-04-01',
    },
    // unvollstaendig — darf nicht mitzaehlen
    {
      id: 's2', kulturId: 'k1', bezeichnung: 'B', herkunft: 'gepflanzt',
      startDatum: '2026-03-01', erfassungsbeginn: '2026-03-20',
      status: 'geerntet', abschlussDatum: '2026-04-01',
    },
  ]
  d.belegungen = [
    { id: 'b1', satzId: 's1', schiffId: 'sch1', vonDatum: '2026-03-01', anteil: 1 },
    { id: 'b2', satzId: 's2', schiffId: 'sch2', vonDatum: '2026-03-01', anteil: 1 },
  ]
  d.auftraege = [auftrag({ id: 'auf1', satzId: 's1', personenErwartet: 3 })]
  d.teilnahmen = [teil({ auftragId: 'auf1' })]

  const b = kulturBefund(d, 'k1', Date.parse(std(5)))
  assert.equal(b.saetze, 1)                 // nur s1
  assert.equal(b.stundenJeAre, 2)           // 12 h auf 6 Aren
  assert.equal(b.belastbar, false)          // ein Satz, verlangt sind zwei
})

test('Was ueber Nacht offen blieb, landet in der Nachtragsliste', () => {
  const d = grunddaten()
  const jetzt = Date.parse('2026-05-04T16:00:00.000Z')
  d.auftraege = [
    // gestern begonnen, nie geschlossen
    auftrag({ id: 'alt', startTs: '2026-05-03T13:00:00.000Z', endeTs: undefined, status: 'laufend' }),
    // heute, laeuft seit 2 h — in Ordnung
    auftrag({ id: 'frisch', startTs: '2026-05-04T14:00:00.000Z', endeTs: undefined, status: 'laufend' }),
    // heute, laeuft seit 12 h bei 4 h erwartet — zu lang
    auftrag({ id: 'lang', startTs: '2026-05-04T04:00:00.000Z', endeTs: undefined, status: 'laufend' }),
    // abgeschlossen
    auftrag({ id: 'fertig' }),
  ]
  assert.deepEqual(nachzutragen(d, jetzt).map(a => a.id), ['alt', 'lang'])
})

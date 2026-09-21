import { useState } from 'react'
import {
  arbeitsartEntfernen, arbeitsartHinzufuegen, mindestSaetzeSetzen,
  stundensatzSetzen, useDaten, zuruecksetzen,
} from '../lib/db.ts'
import { ichSetzen } from '../lib/ich.ts'
import { geld } from '../lib/format.ts'
import { Hinweis } from '../teile/Bausteine.tsx'
import { ZArbeit, ZPlus } from '../teile/Zeichen.tsx'
import type { Arbeitsart } from '../lib/typen.ts'

export default function Einstellungen() {
  const d = useDaten()
  const [satz, setSatz] = useState(String(d.einstellungen.stundensatz))
  const [mindest, setMindest] = useState(String(d.einstellungen.mindestSaetze))
  const [neu, setNeu] = useState('')
  const [zeichen, setZeichen] = useState<Arbeitsart['zeichen']>('hacken')

  return (
    <div className="huelle weit saeule">
      <div>
        <div className="marke-zeile">Betrieb</div>
        <h1>Einstellungen</h1>
      </div>

      <div className="gitter zwei">
        <section className="karte saeule">
          <div className="marke-zeile">Stundensatz</div>
          <label className="beschriftung" htmlFor="stundensatz">
            Vollkosten je Arbeitsstunde, inkl. Lohnnebenkosten
            <input
              id="stundensatz" className="feld-eingabe" type="number" min="0" step="0.5"
              value={satz}
              onChange={e => { setSatz(e.target.value); stundensatzSetzen(Number(e.target.value) || 0) }}
            />
          </label>
          <p className="still">
            Aktuell {geld(d.einstellungen.stundensatz, d.einstellungen.waehrung)} je Stunde.
            Ein Satz für den ganzen Betrieb, keine Einzellöhne — für die Frage
            „was kostet die Kultur" reicht das, und Lohndaten liegen dann nicht
            in der App.
          </p>
        </section>

        <section className="karte saeule">
          <div className="marke-zeile">Vergleich</div>
          <label className="beschriftung" htmlFor="mindest">
            Ab wievielen Sätzen ein Kulturmittel gezeigt wird
            <input
              id="mindest" className="feld-eingabe" type="number" min="1" step="1"
              value={mindest}
              onChange={e => { setMindest(e.target.value); mindestSaetzeSetzen(Number(e.target.value) || 1) }}
            />
          </label>
          <p className="still">
            Darunter zeigt das Archiv bewusst keinen Wert an.
          </p>
        </section>
      </div>

      <section className="tafel">
        <div className="tafel-kopf"><span className="marke-zeile">Arbeitsarten</span></div>
        <div className="liste">
          {d.arbeitsarten.map(a => {
            const benutzt = d.auftraege.some(x => x.arbeitsartId === a.id)
            return (
              <div key={a.id} className="zeile">
                <ZArbeit art={a.zeichen} width="20" height="20" style={{ color: 'var(--akzent)', flex: 'none' }} />
                <span className="wachsen" style={{ fontWeight: 500 }}>{a.name}</span>
                <span className="still zahl">erwartet {a.erwarteteDauerH} h</span>
                {a.erfasstMenge && <span className="chip akzent">erfasst Menge</span>}
                <button
                  className="knopf still klein" disabled={benutzt}
                  title={benutzt ? 'Wird bereits verwendet' : 'Entfernen'}
                  onClick={() => arbeitsartEntfernen(a.id)}
                >
                  Entfernen
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="karte saeule">
        <div className="marke-zeile">Arbeitsart hinzufügen</div>
        <div className="reihe">
          <input
            id="neue-art" className="feld-eingabe" style={{ maxWidth: 240 }}
            placeholder="z. B. Pflanzen" value={neu} onChange={e => setNeu(e.target.value)}
          />
          <div className="filter">
            {(['hacken', 'jaeten', 'saeen', 'ernten'] as const).map(z => (
              <button key={z} type="button" aria-pressed={zeichen === z} onClick={() => setZeichen(z)}>
                <ZArbeit art={z} width="16" height="16" />
              </button>
            ))}
          </div>
          <button
            className="knopf" disabled={!neu.trim()}
            onClick={() => { arbeitsartHinzufuegen(neu.trim(), zeichen); setNeu('') }}
          >
            <ZPlus width="16" height="16" /> Hinzufügen
          </button>
        </div>
        <p className="still">
          Zu fein ist schlimmer als zu grob — jede Zeile mehr ist eine Zeile,
          die auf dem nassen Display falsch getroffen wird.
        </p>
      </section>

      <Hinweis art="merken">
        <strong>Das ist eine Demo.</strong> Alle Daten liegen nur in diesem
        Browser und sind erfunden. Nichts wird irgendwohin gesendet.
      </Hinweis>

      <div className="reihe">
        <button className="knopf warn" onClick={() => { zuruecksetzen(); ichSetzen(null) }}>
          Demodaten zurücksetzen
        </button>
        <button className="knopf still" onClick={() => ichSetzen(null)}>
          Gerät abmelden
        </button>
      </div>
    </div>
  )
}

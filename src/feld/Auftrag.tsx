/**
 * Der laufende Auftrag. Fuer wer schon mitmacht, gibt es hier im Kern genau
 * einen Knopf: Arbeit abschliessen.
 */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  auftragAbschliessen, beitreten, schiffAnhaengen, teilnahmeBeenden, useDaten,
} from '../lib/db.ts'
import { useIch } from '../lib/ich.ts'
import { arbeitsart, machtMit, person, satz, satzName, schiffName } from '../lib/finden.ts'
import { auftragStunden, teilnahmeStunden } from '../lib/rechnen.ts'
import { seit, stunden, uhrzeit } from '../lib/format.ts'
import { Chip, Hinweis } from '../teile/Bausteine.tsx'
import { ZArbeit, ZHaken, ZPlus, ZWeiter, ZZurueck } from '../teile/Zeichen.tsx'

export default function Auftrag() {
  const { id = '' } = useParams()
  const d = useDaten()
  const ich = useIch()
  const navigate = useNavigate()
  const [, tick] = useState(0)
  const [mengeOffen, setMengeOffen] = useState(false)
  const [menge, setMenge] = useState('')
  const [schiffeOffen, setSchiffeOffen] = useState(false)

  // Die Uhr laeuft sichtbar mit — sonst weiss niemand, ob es noch zaehlt.
  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  const a = d.auftraege.find(x => x.id === id)
  if (!a) {
    return (
      <div className="huelle eng saeule">
        <h1>Nicht gefunden</h1>
        <button className="knopf" onClick={() => navigate('/feld')}>Zurück</button>
      </div>
    )
  }

  const art = arbeitsart(d, a.arbeitsartId)
  const s = satz(d, a.satzId)
  const dabei = machtMit(d, a.id, ich)
  const teilnahmen = d.teilnahmen.filter(t => t.auftragId === a.id)
  const offen = teilnahmen.filter(t => !t.endeTs)
  const befund = auftragStunden(a, d.teilnahmen)
  const fertig = a.status === 'fertig'

  // Weitere Schiffe desselben Satzes, die noch nicht am Auftrag haengen.
  const weitere = d.belegungen
    .filter(b => b.satzId === a.satzId && !b.bisDatum && !a.schiffIds.includes(b.schiffId))
    .map(b => b.schiffId)

  function abschliessen() {
    if (art?.erfasstMenge && !mengeOffen) { setMengeOffen(true); return }
    auftragAbschliessen(a!.id, menge ? Number(menge) : undefined)
    navigate('/feld')
  }

  return (
    <>
      <div className="huelle eng saeule">
        <button className="knopf still klein" onClick={() => navigate('/feld')} style={{ alignSelf: 'flex-start' }}>
          <ZZurueck width="18" height="18" /> Übersicht
        </button>

        <div className="karte streifen laeuft saeule">
          <div className="reihe zwischen" style={{ alignItems: 'flex-start' }}>
            <div className="reihe" style={{ gap: 12, flexWrap: 'nowrap' }}>
              {art && <ZArbeit art={art.zeichen} width="34" height="34" style={{ color: 'var(--akzent)', flex: 'none' }} />}
              <div>
                <h1 style={{ fontSize: '1.35rem' }}>{art?.name}</h1>
                <div className="leise">{satzName(d, s)}{s?.sorte ? ` · ${s.sorte}` : ''}</div>
              </div>
            </div>
            {fertig
              ? <Chip>abgeschlossen</Chip>
              : <Chip art="laeuft" punkt="pulst">läuft</Chip>}
          </div>

          <div className="kennzahlen">
            <div className="kennzahl">
              <div className="wert betont">{fertig ? stunden(befund.gesamt / Math.max(1, befund.personen)) : seit(a.startTs)}</div>
              <div className="name">{fertig ? 'Dauer' : `seit ${uhrzeit(a.startTs)}`}</div>
            </div>
            <div className="kennzahl">
              <div className="wert">{befund.personen}</div>
              <div className="name">machen mit</div>
            </div>
            <div className="kennzahl">
              <div className="wert">{stunden(befund.gesamt)}</div>
              <div className="name">Arbeitsstunden</div>
            </div>
          </div>

          <div>
            <div className="marke-zeile">Wo</div>
            <div className="saeule eng" style={{ marginTop: 6 }}>
              {a.schiffIds.map(sid => (
                <div key={sid} className="leise">{schiffName(d, sid)}</div>
              ))}
            </div>
          </div>
        </div>

        <section className="tafel">
          <div className="tafel-kopf">
            <span className="marke-zeile">Dabei</span>
            <span className="still">{offen.length} von {a.personenErwartet} eingetragen</span>
          </div>
          <div className="liste">
            {teilnahmen.map(t => (
              <div key={t.id} className="zeile">
                <span className="wachsen">
                  {person(d, t.personId)?.name}
                  {t.personId === ich && <span className="still"> · du</span>}
                </span>
                <span className="zahl still">
                  {t.endeTs ? `bis ${uhrzeit(t.endeTs)}` : stunden(teilnahmeStunden(t, Date.now()))}
                </span>
              </div>
            ))}
            {befund.ohneGeraet > 0 && (
              <div className="zeile">
                <span className="wachsen leise">
                  {befund.ohneGeraet} ohne Gerät
                  <span className="still"> · über die Anzahl mitgezählt</span>
                </span>
                <span className="zahl still">{stunden(befund.ergaenzt)}</span>
              </div>
            )}
          </div>
        </section>

        {weitere.length > 0 && !fertig && (
          <section className="saeule eng">
            {!schiffeOffen ? (
              <button className="knopf voll" onClick={() => setSchiffeOffen(true)}>
                <ZPlus width="18" height="18" /> Weiter zum nächsten Schiff
              </button>
            ) : (
              <>
                <div className="marke-zeile">Schiff anhängen</div>
                {weitere.map(sid => (
                  <button
                    key={sid} className="wahl"
                    onClick={() => { schiffAnhaengen(a.id, sid); setSchiffeOffen(false) }}
                  >
                    <span className="wahl-haupt wachsen">{schiffName(d, sid)}</span>
                    <ZWeiter className="pfeil" width="18" height="18" />
                  </button>
                ))}
              </>
            )}
          </section>
        )}

        {mengeOffen && (
          <div className="karte saeule eng">
            <label className="beschriftung" htmlFor="menge">
              Wieviel wurde geerntet? <span className="still">(optional)</span>
              <input
                id="menge" className="feld-eingabe" type="number" inputMode="numeric"
                value={menge} onChange={e => setMenge(e.target.value)}
                placeholder={d.kulturen.find(k => k.id === s?.kulturId)?.einheit}
                autoFocus
              />
            </label>
            <Hinweis art="ruhig">
              Ohne Menge lässt sich später nicht ausrechnen, was ein Stück
              gekostet hat — die Stunden allein haben keinen Bezug.
            </Hinweis>
          </div>
        )}
      </div>

      {!fertig && (
        <div className="fussleiste">
          <div className="fussleiste-inhalt">
            {!dabei ? (
              <button className="knopf haupt gross voll" onClick={() => ich && beitreten(a.id, ich)}>
                <ZHaken width="20" height="20" /> Beitreten
              </button>
            ) : (
              <>
                <button className="knopf haupt gross voll" onClick={abschliessen}>
                  {mengeOffen ? 'Abschliessen' : 'Arbeit abschliessen'}
                </button>
                <button
                  className="knopf still voll"
                  onClick={() => { ich && teilnahmeBeenden(a.id, ich); navigate('/feld') }}
                >
                  Nur ich bin fertig — die anderen machen weiter
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

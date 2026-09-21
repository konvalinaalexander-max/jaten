/**
 * Vergessene Auftraege. Das ist die Antwort auf „sie vergessen sich
 * auszuloggen" — ein Mensch bestaetigt die Endzeit, statt dass ein
 * Entfernungsschwellwert stillschweigend kappt.
 */
import { useState } from 'react'
import { auftragNachtragen, useDaten } from '../lib/db.ts'
import { endeVorschlag, nachzutragen } from '../lib/rechnen.ts'
import { arbeitsart, ortText, person, satz, satzName } from '../lib/finden.ts'
import { datum, stunden, uhrzeit, wochentag } from '../lib/format.ts'
import { Hinweis, Leerstelle } from '../teile/Bausteine.tsx'
import { ZArbeit, ZHaken } from '../teile/Zeichen.tsx'

export default function Nachtrag() {
  const d = useDaten()
  const offen = nachzutragen(d)

  return (
    <div className="huelle weit saeule">
      <div>
        <div className="marke-zeile">Aufräumen</div>
        <h1>Nachzutragen</h1>
      </div>

      <Hinweis art="ruhig">
        Aufträge, die über Nacht offen geblieben sind oder deutlich länger
        laufen als üblich. Die vorgeschlagene Endzeit ist die erwartete Dauer
        der Arbeitsart — korrigieren, dann bestätigen.
      </Hinweis>

      {offen.length === 0 ? (
        <div className="tafel"><Leerstelle>Nichts offen. Alles abgeschlossen.</Leerstelle></div>
      ) : (
        <div className="saeule">
          {offen.map(a => <Zeile key={a.id} auftragId={a.id} />)}
        </div>
      )}
    </div>
  )

  function Zeile({ auftragId }: { auftragId: string }) {
    const a = d.auftraege.find(x => x.id === auftragId)!
    const vorschlag = endeVorschlag(d, a)
    const [wert, setWert] = useState(vorschlag.slice(0, 16))
    const art = arbeitsart(d, a.arbeitsartId)
    const namen = d.teilnahmen
      .filter(t => t.auftragId === a.id)
      .map(t => person(d, t.personId)?.name)
      .filter(Boolean)
    const dauer =
      (new Date(wert).getTime() - new Date(a.startTs).getTime()) / 3600_000

    return (
      <div className="karte streifen offen saeule">
        <div className="reihe zwischen">
          <div className="reihe" style={{ gap: 10, flexWrap: 'nowrap' }}>
            {art && <ZArbeit art={art.zeichen} width="24" height="24" style={{ color: 'var(--akzent)', flex: 'none' }} />}
            <div>
              <div className="wahl-haupt">{art?.name} · {satzName(d, satz(d, a.satzId))}</div>
              <div className="wahl-neben">{ortText(d, a)} · {namen.join(', ')}</div>
            </div>
          </div>
          <div className="still zahl">
            {wochentag(a.startTs)} {datum(a.startTs)}, ab {uhrzeit(a.startTs)}
          </div>
        </div>

        <div className="reihe" style={{ gap: 12 }}>
          <label className="beschriftung" htmlFor={`ende-${a.id}`}>
            Arbeitsende
            <input
              id={`ende-${a.id}`} type="datetime-local" className="feld-eingabe"
              value={wert} onChange={e => setWert(e.target.value)}
            />
          </label>
          <div className="beschriftung">
            Ergibt
            <div className="zahl" style={{ fontSize: '1.1rem', paddingTop: 6 }}>
              {dauer > 0 ? stunden(dauer * a.personenErwartet) : '–'}
              <span className="still" style={{ marginLeft: 6 }}>
                ({a.personenErwartet} × {dauer > 0 ? stunden(dauer) : '–'})
              </span>
            </div>
          </div>
          <button
            className="knopf haupt"
            style={{ marginTop: 18 }}
            disabled={!(dauer > 0)}
            onClick={() => auftragNachtragen(a.id, new Date(wert).toISOString())}
          >
            <ZHaken width="17" height="17" /> Bestätigen
          </button>
        </div>
      </div>
    )
  }
}

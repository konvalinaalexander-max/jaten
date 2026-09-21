/**
 * Was steht wo. Filterbar nach Kultur oder Feld — das ist der Bildschirm,
 * der auch ohne jede Kostenrechnung schon nuetzt.
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDaten } from '../lib/db.ts'
import { belegungenAm, nachzutragen, satzBefund } from '../lib/rechnen.ts'
import { kultur, satzName, schiffName } from '../lib/finden.ts'
import { datum, flaeche, geld, heute, stunden, zahl } from '../lib/format.ts'
import { Chip, Kennzahl, Leerstelle } from '../teile/Bausteine.tsx'
import { ZWarnung } from '../teile/Zeichen.tsx'

export default function Dashboard() {
  const d = useDaten()
  const tag = heute()
  const [kulturFilter, setKulturFilter] = useState<string | null>(null)
  const [feldFilter, setFeldFilter] = useState<string | null>(null)

  const laufend = useMemo(
    () => d.saetze.filter(s => s.status === 'laufend'),
    [d.saetze],
  )

  const zeilen = useMemo(() => laufend.map(s => {
    const b = satzBefund(d, s)
    const schiffIds = belegungenAm(d, tag).filter(x => x.satzId === s.id).map(x => x.schiffId)
    const feldIds = [...new Set(schiffIds.map(id => d.schiffe.find(x => x.id === id)?.feldId))]
    return { satz: s, befund: b, schiffIds, feldIds }
  }), [d, laufend, tag])

  const gefiltert = zeilen.filter(z =>
    (!kulturFilter || z.satz.kulturId === kulturFilter) &&
    (!feldFilter || z.feldIds.includes(feldFilter)),
  )

  const gesamtStunden = zeilen.reduce((s, z) => s + z.befund.stunden.gesamt, 0)
  const gesamtFlaeche = zeilen.reduce((s, z) => s + z.befund.flaecheM2, 0)
  const offen = nachzutragen(d)

  const benutzteKulturen = [...new Set(laufend.map(s => s.kulturId))]

  return (
    <div className="huelle weit saeule">
      <div className="reihe zwischen">
        <div>
          <div className="marke-zeile">Saison {new Date().getFullYear()}</div>
          <h1>Was steht wo</h1>
        </div>
      </div>

      <div className="kennzahlen">
        <Kennzahl wert={String(laufend.length)} name="Sätze im Feld" />
        <Kennzahl wert={stunden(gesamtStunden)} name="Arbeitsstunden" betont />
        <Kennzahl wert={flaeche(gesamtFlaeche)} name="in Kultur" />
        <Kennzahl
          wert={geld(gesamtStunden * d.einstellungen.stundensatz, d.einstellungen.waehrung)}
          name="Arbeitskosten"
        />
      </div>

      {offen.length > 0 && (
        <Link to="/buero/nachtrag" className="karte streifen offen" style={{ textDecoration: 'none', display: 'block' }}>
          <div className="reihe" style={{ gap: 10, flexWrap: 'nowrap' }}>
            <ZWarnung width="20" height="20" style={{ color: 'var(--offen)', flex: 'none' }} />
            <div className="wachsen">
              <strong>{offen.length} {offen.length === 1 ? 'Auftrag' : 'Aufträge'} nicht abgeschlossen</strong>
              <div className="leise">Endzeit bestätigen, sonst laufen die Stunden weiter.</div>
            </div>
            <span className="knopf klein">Nachtragen →</span>
          </div>
        </Link>
      )}

      <div className="reihe" style={{ gap: 16, alignItems: 'flex-start' }}>
        <div>
          <div className="marke-zeile" style={{ marginBottom: 6 }}>Kultur</div>
          <div className="filter">
            <button aria-pressed={!kulturFilter} onClick={() => setKulturFilter(null)}>alle</button>
            {benutzteKulturen.map(id => (
              <button key={id} aria-pressed={kulturFilter === id} onClick={() => setKulturFilter(id)}>
                {kultur(d, id)?.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="marke-zeile" style={{ marginBottom: 6 }}>Feld</div>
          <div className="filter">
            <button aria-pressed={!feldFilter} onClick={() => setFeldFilter(null)}>alle</button>
            {d.felder.map(f => (
              <button key={f.id} aria-pressed={feldFilter === f.id} onClick={() => setFeldFilter(f.id)}>
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="tafel">
        <div className="tafel-kopf">
          <span className="marke-zeile">
            {gefiltert.length} {gefiltert.length === 1 ? 'Satz' : 'Sätze'}
          </span>
          <span className="still">Stand {datum(tag)}</span>
        </div>

        {gefiltert.length === 0 ? (
          <Leerstelle>Kein Satz passt zum Filter.</Leerstelle>
        ) : (
          <div className="tabellenhuelle">
            <table className="werte">
              <thead>
                <tr>
                  <th>Satz</th>
                  <th>Wo</th>
                  <th className="rechts">seit</th>
                  <th className="rechts">Fläche</th>
                  <th className="rechts">Stunden</th>
                  <th className="rechts">h / Are</th>
                  <th className="rechts">Kosten</th>
                </tr>
              </thead>
              <tbody>
                {gefiltert
                  .sort((a, b) => b.befund.stunden.gesamt - a.befund.stunden.gesamt)
                  .map(z => (
                    <tr key={z.satz.id}>
                      <td>
                        <Link to={`/buero/satz/${z.satz.id}`} style={{ fontWeight: 600 }}>
                          {satzName(d, z.satz)}
                        </Link>
                        {!z.befund.vollstaendig && (
                          <span style={{ marginLeft: 8 }}><Chip art="offen">unvollständig</Chip></span>
                        )}
                        {z.satz.sorte && <div className="still">{z.satz.sorte}</div>}
                      </td>
                      <td className="leise">
                        {z.schiffIds.slice(0, 2).map(id => schiffName(d, id)).join(', ')}
                        {z.schiffIds.length > 2 && ` +${z.schiffIds.length - 2}`}
                      </td>
                      <td className="rechts zahl leise">{datum(z.satz.startDatum)}</td>
                      <td className="rechts zahl">{flaeche(z.befund.flaecheM2)}</td>
                      <td className="rechts zahl">{stunden(z.befund.stunden.gesamt)}</td>
                      <td className="rechts zahl">{zahl(z.befund.stundenJeAre, 1)}</td>
                      <td className="rechts zahl">
                        {geld(z.befund.kosten, d.einstellungen.waehrung)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="still">
        Stundensatz {geld(d.einstellungen.stundensatz, d.einstellungen.waehrung)} je Stunde —
        änderbar unter Einstellungen. Eine Are sind 100 m².
      </p>
    </div>
  )
}

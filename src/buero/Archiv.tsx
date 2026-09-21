/**
 * Das Archiv — und der Kulturvergleich, wegen dem das Ganze gebaut wird.
 * Der Nutzen kommt verzoegert: im ersten Jahr wird gesammelt, im zweiten
 * entschieden.
 */
import { Link } from 'react-router-dom'
import { useDaten } from '../lib/db.ts'
import { kulturBefund, satzBefund } from '../lib/rechnen.ts'
import { satzName } from '../lib/finden.ts'
import { datum, flaeche, geld, stunden, zahl } from '../lib/format.ts'
import { Chip, Hinweis, Leerstelle } from '../teile/Bausteine.tsx'

export default function Archiv() {
  const d = useDaten()
  const fertig = d.saetze
    .filter(s => s.status !== 'laufend')
    .sort((a, b) => (b.abschlussDatum ?? '').localeCompare(a.abschlussDatum ?? ''))

  const kulturen = [...new Set(fertig.map(s => s.kulturId))]
    .map(id => kulturBefund(d, id))
    .filter(k => k.saetze > 0)
    .sort((a, b) => b.stundenJeAre - a.stundenJeAre)

  return (
    <div className="huelle weit saeule">
      <div>
        <div className="marke-zeile">Abgeschlossen</div>
        <h1>Archiv</h1>
      </div>

      <section className="tafel">
        <div className="tafel-kopf">
          <span className="marke-zeile">Stunden je Are, nach Kultur</span>
          <span className="still">nur vollständig erfasste, abgeschlossene Sätze</span>
        </div>
        {kulturen.length === 0 ? (
          <Leerstelle>Noch kein abgeschlossener Satz.</Leerstelle>
        ) : (
          <div className="tabellenhuelle">
            <table className="werte">
              <thead>
                <tr>
                  <th>Kultur</th>
                  <th className="rechts">Sätze</th>
                  <th className="rechts">h / Are</th>
                  <th className="rechts">Kosten / Are</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {kulturen.map(k => (
                  <tr key={k.kulturId}>
                    <td style={{ fontWeight: 600 }}>
                      {d.kulturen.find(x => x.id === k.kulturId)?.name}
                    </td>
                    <td className="rechts zahl">{k.saetze}</td>
                    <td className="rechts zahl">{k.belastbar ? zahl(k.stundenJeAre, 1) : '–'}</td>
                    <td className="rechts zahl">
                      {k.belastbar ? geld(k.kostenJeAre, d.einstellungen.waehrung) : '–'}
                    </td>
                    <td>
                      {!k.belastbar && (
                        <Chip art="offen">
                          zu wenige Sätze ({k.saetze} von {d.einstellungen.mindestSaetze})
                        </Chip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Hinweis art="ruhig">
        Unter {d.einstellungen.mindestSaetze} Sätzen wird bewusst kein Wert
        ausgewiesen. Ein Mittel aus zwei Sätzen sieht genauso aus wie eines aus
        zwanzig — das ist die gefährliche Sorte Zahl.
      </Hinweis>

      <section className="tafel">
        <div className="tafel-kopf">
          <span className="marke-zeile">{fertig.length} abgeschlossene Sätze</span>
        </div>
        <div className="tabellenhuelle">
          <table className="werte">
            <thead>
              <tr>
                <th>Satz</th>
                <th className="rechts">Standzeit</th>
                <th className="rechts">Fläche</th>
                <th className="rechts">Stunden</th>
                <th className="rechts">h / Are</th>
                <th className="rechts">Kosten</th>
                <th>Ausgang</th>
              </tr>
            </thead>
            <tbody>
              {fertig.map(s => {
                const b = satzBefund(d, s)
                const tage = s.abschlussDatum
                  ? Math.round(
                      (new Date(s.abschlussDatum).getTime() - new Date(s.startDatum).getTime()) / 86400000,
                    )
                  : 0
                return (
                  <tr key={s.id}>
                    <td>
                      <Link to={`/buero/satz/${s.id}`} style={{ fontWeight: 600 }}>
                        {satzName(d, s)}
                      </Link>
                      <div className="still">{datum(s.startDatum)}</div>
                    </td>
                    <td className="rechts zahl">{tage} Tage</td>
                    <td className="rechts zahl">{flaeche(b.flaecheM2)}</td>
                    <td className="rechts zahl">{stunden(b.stunden.gesamt)}</td>
                    <td className="rechts zahl">{zahl(b.stundenJeAre, 1)}</td>
                    <td className="rechts zahl">{geld(b.kosten, d.einstellungen.waehrung)}</td>
                    <td>
                      {s.status === 'umgebrochen'
                        ? <Chip art="offen">umgebrochen</Chip>
                        : b.vollstaendig
                          ? <Chip>geerntet</Chip>
                          : <Chip art="offen">unvollständig</Chip>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

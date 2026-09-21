/**
 * Die Startseite auf dem Feld: alles, was heute gerade laeuft — ueber alle
 * Felder. Wer dazukommt, sieht seine Arbeit in der Liste und tritt bei.
 * Wer etwas Neues beginnt, nimmt den Knopf unten.
 */
import { Link, useNavigate } from 'react-router-dom'
import { useDaten } from '../lib/db.ts'
import { useIch } from '../lib/ich.ts'
import { arbeitsart, machtMit, ortText, person, satz, satzName, teilnahmenVon } from '../lib/finden.ts'
import { seit, uhrzeit, wochentag } from '../lib/format.ts'
import { Chip, Leerstelle } from '../teile/Bausteine.tsx'
import { auftragDauer } from '../lib/rechnen.ts'
import { ZArbeit, ZPlus } from '../teile/Zeichen.tsx'

export default function Start() {
  const d = useDaten()
  const ich = useIch()
  const navigate = useNavigate()

  const laufend = d.auftraege
    .filter(a => a.status === 'laufend')
    .sort((x, y) => y.startTs.localeCompare(x.startTs))

  const meine = laufend.filter(a => machtMit(d, a.id, ich))
  const andere = laufend.filter(a => !machtMit(d, a.id, ich))

  const heute = new Intl.DateTimeFormat('de-CH', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date())

  return (
    <>
      <div className="huelle eng saeule">
        <div>
          <div className="marke-zeile">{heute}</div>
          <h1>Was läuft</h1>
        </div>

        {meine.length > 0 && (
          <section className="saeule eng">
            <div className="marke-zeile">Du machst mit</div>
            {meine.map(a => <AuftragKarte key={a.id} auftragId={a.id} dabei />)}
          </section>
        )}

        <section className="saeule eng">
          <div className="marke-zeile">
            {meine.length > 0 ? 'Läuft ausserdem' : 'Läuft gerade'}
          </div>
          {andere.length === 0 && meine.length === 0 && (
            <div className="karte">
              <Leerstelle>
                Gerade arbeitet niemand.<br />
                <span className="still">Unten eine neue Arbeit beginnen.</span>
              </Leerstelle>
            </div>
          )}
          {andere.map(a => <AuftragKarte key={a.id} auftragId={a.id} />)}
        </section>
      </div>

      <div className="fussleiste">
        <div className="fussleiste-inhalt">
          <button className="knopf haupt gross voll" onClick={() => navigate('/feld/neu')}>
            <ZPlus width="20" height="20" />
            Neue Arbeit beginnen
          </button>
        </div>
      </div>
    </>
  )

  function AuftragKarte({ auftragId, dabei }: { auftragId: string; dabei?: boolean }) {
    const a = d.auftraege.find(x => x.id === auftragId)!
    const art = arbeitsart(d, a.arbeitsartId)
    const s = satz(d, a.satzId)
    const mit = teilnahmenVon(d, a.id).filter(t => !t.endeTs)
    const namen = mit.map(t => person(d, t.personId)?.name).filter(Boolean)

    // Laeuft schon deutlich zu lang oder seit gestern: vermutlich hat jemand
    // vergessen abzuschliessen. Das gehoert hier markiert, nicht nur im Buero —
    // schliessen kann es nur, wer dabei war.
    const vonGestern = a.startTs.slice(0, 10) < new Date().toISOString().slice(0, 10)
    const zuLang = auftragDauer(a, Date.now()) > (art?.erwarteteDauerH ?? 4) * 2
    const liegengeblieben = vonGestern || zuLang

    return (
      <Link
        to={`/feld/auftrag/${a.id}`}
        className={`karte streifen ${liegengeblieben ? 'offen' : 'laeuft'}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div className="reihe zwischen" style={{ alignItems: 'flex-start' }}>
          <div className="reihe wachsen" style={{ gap: 12, flexWrap: 'nowrap' }}>
            {art && (
              <ZArbeit
                art={art.zeichen} width="26" height="26"
                style={{ color: 'var(--akzent)', flex: 'none', marginTop: 2 }}
              />
            )}
            <div className="wachsen">
              <div className="wahl-haupt">{art?.name} · {satzName(d, s)}</div>
              <div className="wahl-neben">{ortText(d, a)}</div>
            </div>
          </div>
          {liegengeblieben
            ? <Chip art="offen">noch offen</Chip>
            : <Chip art="laeuft" punkt="pulst">seit {seit(a.startTs)}</Chip>}
        </div>
        <div className="leise" style={{ marginTop: 10 }}>
          {namen.length > 0 ? namen.join(', ') : 'niemand eingetragen'}
          {a.personenErwartet > mit.length && (
            <span className="still"> · {a.personenErwartet} angemeldet</span>
          )}
        </div>
        {liegengeblieben && (
          <div className="leise" style={{ marginTop: 6 }}>
            Läuft seit {wochentag(a.startTs)} {uhrzeit(a.startTs)} — wurde das
            abgeschlossen?
          </div>
        )}
        {!dabei && (
          <div className="knopf klein" style={{ marginTop: 12 }}>
            {liegengeblieben ? 'Ansehen →' : 'Beitreten →'}
          </div>
        )}
      </Link>
    )
  }
}

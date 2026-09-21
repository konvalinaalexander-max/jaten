/**
 * Die Historie eines Satzes. Jede Zahl oben laesst sich unten nachlesen —
 * wer bewertet wird, soll nachsehen koennen, woran gemessen wird.
 */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { satzAbschliessen, satzWiederOeffnen, useDaten } from '../lib/db.ts'
import { auftraegeDesSatzes, auftragStunden, satzBefund } from '../lib/rechnen.ts'
import { arbeitsart, kultur, ortText, person, satzName, schiffName } from '../lib/finden.ts'
import { datum, flaeche, geld, heute, stunden, uhrzeit, wochentag, zahl } from '../lib/format.ts'
import { Balken, Chip, Hinweis, Kennzahl } from '../teile/Bausteine.tsx'
import { ZArbeit, ZZurueck } from '../teile/Zeichen.tsx'

export default function SatzDetail() {
  const { id = '' } = useParams()
  const d = useDaten()
  const navigate = useNavigate()
  const [abschlussOffen, setAbschlussOffen] = useState(false)
  const [abDatum, setAbDatum] = useState(heute())

  const s = d.saetze.find(x => x.id === id)
  if (!s) {
    return (
      <div className="huelle weit saeule">
        <h1>Satz nicht gefunden</h1>
        <Link to="/buero" className="knopf">Zurück</Link>
      </div>
    )
  }

  const b = satzBefund(d, s)
  const auftraege = auftraegeDesSatzes(d, s.id)
  const hoechste = Math.max(1, ...b.jeArbeitsart.map(x => x.stunden))
  const belegungen = d.belegungen.filter(x => x.satzId === s.id)
  const k = kultur(d, s.kulturId)
  const geerntet = auftraege.reduce((sum, a) => sum + (a.menge ?? 0), 0)

  function abschliessen(status: 'geerntet' | 'umgebrochen') {
    satzAbschliessen(s!.id, abDatum, status)
    setAbschlussOffen(false)
    navigate('/buero/archiv')
  }

  return (
    <div className="huelle weit saeule">
      <button className="knopf still klein" style={{ alignSelf: 'flex-start' }} onClick={() => navigate(-1)}>
        <ZZurueck width="18" height="18" /> Zurück
      </button>

      <div className="reihe zwischen">
        <div>
          <div className="marke-zeile">
            {s.herkunft === 'gesaet' ? 'gesät' : 'gepflanzt'} am {datum(s.startDatum)}
            {s.sorte && ` · ${s.sorte}`}
          </div>
          <h1>{satzName(d, s)}</h1>
        </div>
        <div className="reihe">
          {s.status === 'laufend' && <Chip art="laeuft" punkt>im Feld</Chip>}
          {s.status === 'geerntet' && <Chip>geerntet {s.abschlussDatum && datum(s.abschlussDatum)}</Chip>}
          {s.status === 'umgebrochen' && <Chip art="offen">umgebrochen</Chip>}
        </div>
      </div>

      {!b.vollstaendig && (
        <Hinweis art="merken">
          <strong>Unvollständig erfasst.</strong> Der Satz stand schon seit{' '}
          {datum(s.startDatum)}, erfasst wird erst ab {datum(s.erfassungsbeginn)}.
          Die Stunden davor fehlen, deshalb zählt dieser Satz nicht in den
          Kulturvergleich.
        </Hinweis>
      )}
      {s.notiz && <Hinweis art="ruhig">{s.notiz}</Hinweis>}

      <div className="kennzahlen">
        <Kennzahl wert={stunden(b.stunden.gesamt)} name="Arbeitsstunden" betont />
        <Kennzahl wert={flaeche(b.flaecheM2)} name="Fläche" />
        <Kennzahl wert={zahl(b.stundenJeAre, 1)} name="Stunden je Are" />
        <Kennzahl wert={geld(b.kosten, d.einstellungen.waehrung)} name="Arbeitskosten" />
        <Kennzahl
          wert={geerntet > 0 ? `${zahl(geerntet, 0)}` : '–'}
          name={geerntet > 0 ? `geerntet (${k?.einheit})` : 'keine Menge erfasst'}
        />
      </div>

      {geerntet > 0 && (
        <p className="leise">
          Das sind {geld(b.kosten / geerntet, d.einstellungen.waehrung)} Arbeitskosten
          je {k?.einheit === 'Stueck' ? 'Stück' : k?.einheit}.
        </p>
      )}

      <div className="gitter zwei">
        <section className="karte saeule">
          <div className="marke-zeile">Wo die Zeit hinging</div>
          {b.jeArbeitsart.length === 0 && <p className="leise">Noch keine Arbeit erfasst.</p>}
          {b.jeArbeitsart.map(x => {
            const art = arbeitsart(d, x.arbeitsartId)
            return (
              <Balken
                key={x.arbeitsartId}
                name={art?.name ?? '?'}
                zeichen={art && <ZArbeit art={art.zeichen} width="17" height="17" style={{ color: 'var(--tinte-still)' }} />}
                wert={stunden(x.stunden)}
                neben={`${Math.round((x.stunden / Math.max(1, b.stunden.gesamt)) * 100)} %`}
                anteil={x.stunden / hoechste}
              />
            )
          })}
        </section>

        <section className="karte saeule">
          <div className="marke-zeile">Belegung</div>
          <div className="saeule eng">
            {belegungen.map(x => (
              <div key={x.id} className="reihe zwischen">
                <span>
                  {schiffName(d, x.schiffId)}
                  {x.anteil < 1 && <span className="still"> · {Math.round(x.anteil * 100)} % des Schiffs</span>}
                </span>
                <span className="still zahl">
                  {datum(x.vonDatum)} – {x.bisDatum ? datum(x.bisDatum) : 'offen'}
                </span>
              </div>
            ))}
          </div>
          <div className="marke-zeile" style={{ marginTop: 6 }}>Woraus die Stunden kommen</div>
          <div className="saeule eng">
            <div className="reihe zwischen">
              <span className="leise">gemessen, aus Beitritten</span>
              <span className="zahl">{stunden(b.stunden.gemessen)}</span>
            </div>
            <div className="reihe zwischen">
              <span className="leise">ergänzt, für Leute ohne Gerät</span>
              <span className="zahl">{stunden(b.stunden.ergaenzt)}</span>
            </div>
          </div>
        </section>
      </div>

      <section className="tafel">
        <div className="tafel-kopf">
          <span className="marke-zeile">{auftraege.length} Arbeitsgänge</span>
        </div>
        <div className="tabellenhuelle">
          <table className="werte">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Arbeit</th>
                <th>Wo</th>
                <th className="rechts">Leute</th>
                <th className="rechts">von–bis</th>
                <th className="rechts">Stunden</th>
                <th>Wer</th>
              </tr>
            </thead>
            <tbody>
              {[...auftraege].reverse().map(a => {
                const st = auftragStunden(a, d.teilnahmen)
                const art = arbeitsart(d, a.arbeitsartId)
                const namen = d.teilnahmen
                  .filter(t => t.auftragId === a.id)
                  .map(t => person(d, t.personId)?.name)
                  .filter(Boolean)
                return (
                  <tr key={a.id}>
                    <td className="zahl leise">
                      {wochentag(a.startTs)} {datum(a.startTs)}
                    </td>
                    <td>
                      <span className="reihe" style={{ gap: 6, flexWrap: 'nowrap' }}>
                        {art && <ZArbeit art={art.zeichen} width="16" height="16" style={{ color: 'var(--tinte-still)' }} />}
                        {art?.name}
                      </span>
                    </td>
                    <td className="leise">{ortText(d, a)}</td>
                    <td className="rechts zahl">
                      {st.personen}
                      {st.ohneGeraet > 0 && <span className="still"> ({st.ohneGeraet} erg.)</span>}
                    </td>
                    <td className="rechts zahl leise">
                      {uhrzeit(a.startTs)}–{a.endeTs ? uhrzeit(a.endeTs) : '…'}
                    </td>
                    <td className="rechts zahl">{stunden(st.gesamt)}</td>
                    <td className="leise" style={{ whiteSpace: 'normal', minWidth: 160 }}>
                      {namen.join(', ')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {s.status === 'laufend' ? (
        <section className="karte saeule">
          <div className="marke-zeile">Satz beenden</div>
          {!abschlussOffen ? (
            <>
              <p className="leise">
                Wenn abgeerntet oder umgebrochen wurde. Das Datum lässt sich
                zurückdatieren — meist fällt es erst später auf.
              </p>
              <button className="knopf warn" style={{ alignSelf: 'flex-start' }} onClick={() => setAbschlussOffen(true)}>
                Satz abschliessen
              </button>
            </>
          ) : (
            <>
              <label className="beschriftung" htmlFor="ab-datum" style={{ maxWidth: 240 }}>
                Wann war das?
                <input
                  id="ab-datum" type="date" className="feld-eingabe" value={abDatum}
                  max={heute()} min={s.startDatum} onChange={e => setAbDatum(e.target.value)}
                />
              </label>
              <div className="reihe">
                <button className="knopf haupt" onClick={() => abschliessen('geerntet')}>
                  Vollständig geerntet
                </button>
                <button className="knopf warn" onClick={() => abschliessen('umgebrochen')}>
                  Umgebrochen, nicht geerntet
                </button>
                <button className="knopf still" onClick={() => setAbschlussOffen(false)}>Abbrechen</button>
              </div>
            </>
          )}
        </section>
      ) : (
        <button className="knopf still" style={{ alignSelf: 'flex-start' }} onClick={() => satzWiederOeffnen(s.id)}>
          Doch noch im Feld — wieder öffnen
        </button>
      )}
    </div>
  )
}

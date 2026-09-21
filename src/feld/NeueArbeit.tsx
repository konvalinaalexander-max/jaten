/**
 * Auftrag eroeffnen. Vier Schritte, im Normalfall vier Tipps.
 *
 * Die Reihenfolge ist Absicht: zuerst wo, dann bestaetigt die App aus der
 * Belegung, was dort steht — die Frage nach der Kultur entfaellt damit. Nur
 * wenn sie den Satz nicht kennt, wird gefragt, seit wann er dort steht.
 */
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auftragEroeffnen, satzAnlegen, useDaten } from '../lib/db.ts'
import { useIch } from '../lib/ich.ts'
import { freierAnteil, saetzeAufSchiff } from '../lib/rechnen.ts'
import { feld, satzName, schiffeVon } from '../lib/finden.ts'
import { datum, heute, kalenderwoche } from '../lib/format.ts'
import type { Id, Satz } from '../lib/typen.ts'
import { Hinweis, Schritte } from '../teile/Bausteine.tsx'
import { ZArbeit, ZZurueck } from '../teile/Zeichen.tsx'

type Schritt = 'wo' | 'was' | 'anlegen' | 'arbeit' | 'wieviele'

export default function NeueArbeit() {
  const d = useDaten()
  const ich = useIch()
  const navigate = useNavigate()

  const [schritt, setSchritt] = useState<Schritt>('wo')
  const [schiffId, setSchiffId] = useState<Id | null>(null)
  const [satzId, setSatzId] = useState<Id | null>(null)
  const [arbeitsartId, setArbeitsartId] = useState<Id | null>(null)
  const [anzahl, setAnzahl] = useState(3)

  const tag = heute()
  const hier: Satz[] = useMemo(
    () => (schiffId ? saetzeAufSchiff(d, schiffId, tag) : []),
    [d, schiffId, tag],
  )

  const nummer = { wo: 0, was: 1, anlegen: 1, arbeit: 2, wieviele: 3 }[schritt]

  function zurueck() {
    if (schritt === 'wo') return navigate('/feld')
    if (schritt === 'was') return setSchritt('wo')
    if (schritt === 'anlegen') return setSchritt('was')
    if (schritt === 'arbeit') return setSchritt('was')
    setSchritt('arbeit')
  }

  function schiffGewaehlt(id: Id) {
    setSchiffId(id)
    const gefunden = saetzeAufSchiff(d, id, tag)
    if (gefunden.length === 0) setSchritt('anlegen')
    else setSchritt('was')
  }

  function beginnen() {
    if (!satzId || !arbeitsartId || !schiffId || !ich) return
    const id = auftragEroeffnen({
      satzId, arbeitsartId, schiffIds: [schiffId], personId: ich, personenErwartet: anzahl,
    })
    navigate(`/feld/auftrag/${id}`, { replace: true })
  }

  return (
    <div className="huelle eng saeule">
      <div className="reihe" style={{ gap: 8 }}>
        <button className="knopf still klein" onClick={zurueck} aria-label="Zurück">
          <ZZurueck width="18" height="18" />
        </button>
        <div className="wachsen"><Schritte von={4} bei={nummer} /></div>
      </div>

      {schritt === 'wo' && <Wo />}
      {schritt === 'was' && <Was />}
      {schritt === 'anlegen' && <Anlegen />}
      {schritt === 'arbeit' && <Arbeit />}
      {schritt === 'wieviele' && <Wieviele />}
    </div>
  )

  function Wo() {
    const [suche, setSuche] = useState('')
    const treffer = (name: string) => name.toLowerCase().includes(suche.toLowerCase())

    return (
      <>
        <h1>Wo bist du?</h1>
        <input
          id="schiff-suche"
          className="feld-eingabe"
          placeholder="Feld oder Schiff suchen"
          value={suche}
          onChange={e => setSuche(e.target.value)}
        />
        {d.felder.map(f => {
          const schiffe = schiffeVon(d, f.id).filter(
            s => treffer(f.name) || treffer(s.name) || treffer(f.code),
          )
          if (schiffe.length === 0) return null
          return (
            <section key={f.id} className="saeule eng">
              <div className="marke-zeile">{f.name}</div>
              {schiffe.map(s => {
                const drauf = saetzeAufSchiff(d, s.id, tag)
                return (
                  <button key={s.id} className="wahl" onClick={() => schiffGewaehlt(s.id)}>
                    <div className="wachsen">
                      <div className="wahl-haupt">{s.name}</div>
                      <div className="wahl-neben">
                        {drauf.length === 0
                          ? 'nichts erfasst'
                          : drauf.map(x => satzName(d, x)).join(' + ')}
                        {' · '}{s.flaecheM2} m²
                      </div>
                    </div>
                  </button>
                )
              })}
            </section>
          )
        })}
      </>
    )
  }

  function Was() {
    return (
      <>
        <h1>{hier.length === 1 ? 'Stimmt das?' : 'Woran arbeitest du?'}</h1>
        <p className="leise">
          {schiffId && feld(d, d.schiffe.find(s => s.id === schiffId)!.feldId)?.name}
          {' · '}{d.schiffe.find(s => s.id === schiffId)?.name}
        </p>
        <div className="saeule eng">
          {hier.map(s => (
            <button
              key={s.id}
              className="wahl"
              onClick={() => { setSatzId(s.id); setSchritt('arbeit') }}
            >
              <div className="wachsen">
                <div className="wahl-haupt">{satzName(d, s)}</div>
                <div className="wahl-neben">
                  {s.sorte ? `${s.sorte} · ` : ''}
                  {s.herkunft === 'gesaet' ? 'gesät' : 'gepflanzt'} am {datum(s.startDatum)}
                </div>
              </div>
            </button>
          ))}
          <button className="knopf voll" onClick={() => setSchritt('anlegen')}>
            Nein, hier steht etwas anderes
          </button>
        </div>
      </>
    )
  }

  function Anlegen() {
    const frei = schiffId ? freierAnteil(d, schiffId, tag) : 1
    const [kulturId, setKulturId] = useState<Id>(d.kulturen[0].id)
    const [sorte, setSorte] = useState('')
    const [startDatum, setStartDatum] = useState(tag)
    const [herkunft, setHerkunft] = useState<'gesaet' | 'gepflanzt'>('gepflanzt')
    const [anteil, setAnteil] = useState(frei >= 1 ? 1 : frei)
    const bezeichnung = `KW${kalenderwoche(new Date(startDatum))}`

    function anlegen() {
      if (!schiffId) return
      const id = satzAnlegen({
        kulturId, sorte, bezeichnung, herkunft, startDatum, schiffId, anteil,
      })
      setSatzId(id)
      setSchritt('arbeit')
    }

    return (
      <>
        <h1>Was steht hier?</h1>
        <p className="leise">Einmal erfasst — beim nächsten Mal fragt die App nicht mehr.</p>

        <div className="saeule eng">
          <label className="beschriftung" htmlFor="neu-kultur">
            Kultur
            <select
              id="neu-kultur" className="feld-eingabe" value={kulturId}
              onChange={e => setKulturId(e.target.value)}
            >
              {d.kulturen.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </label>

          <label className="beschriftung" htmlFor="neu-sorte">
            Sorte <span className="still">(wenn bekannt)</span>
            <input
              id="neu-sorte" className="feld-eingabe" value={sorte}
              onChange={e => setSorte(e.target.value)} placeholder="z. B. Maugli"
            />
          </label>

          <div className="beschriftung">
            Gesät oder gepflanzt?
            <div className="filter">
              {(['gesaet', 'gepflanzt'] as const).map(h => (
                <button
                  key={h} type="button" aria-pressed={herkunft === h}
                  onClick={() => setHerkunft(h)}
                >
                  {h === 'gesaet' ? 'gesät' : 'gepflanzt'}
                </button>
              ))}
            </div>
          </div>

          <label className="beschriftung" htmlFor="neu-datum">
            Seit wann steht das da?
            <input
              id="neu-datum" type="date" className="feld-eingabe" value={startDatum}
              max={tag} onChange={e => setStartDatum(e.target.value)}
            />
          </label>

          {frei < 1 && (
            <div className="beschriftung">
              Wieviel vom Schiff?
              <div className="filter">
                {[frei, 0.5, 0.25].filter((v, i, arr) => v <= frei && arr.indexOf(v) === i).map(v => (
                  <button key={v} type="button" aria-pressed={anteil === v} onClick={() => setAnteil(v)}>
                    {Math.round(v * 100)} %
                  </button>
                ))}
              </div>
            </div>
          )}

          {startDatum < tag && (
            <Hinweis art="merken">
              <strong>Der Satz steht schon länger.</strong> Die Stunden davor
              fehlen. Er wird als unvollständig erfasst gekennzeichnet und geht
              nicht in den Kulturvergleich ein.
            </Hinweis>
          )}

          <button className="knopf haupt gross voll" onClick={anlegen}>
            {d.kulturen.find(k => k.id === kulturId)?.name} {bezeichnung} anlegen
          </button>
        </div>
      </>
    )
  }

  function Arbeit() {
    return (
      <>
        <h1>Welche Arbeit?</h1>
        <p className="leise">{satzName(d, d.saetze.find(s => s.id === satzId))}</p>
        <div className="saeule eng">
          {d.arbeitsarten.map(a => (
            <button
              key={a.id}
              className="wahl"
              onClick={() => { setArbeitsartId(a.id); setSchritt('wieviele') }}
            >
              <ZArbeit art={a.zeichen} width="28" height="28" style={{ color: 'var(--akzent)', flex: 'none' }} />
              <span className="wahl-haupt">{a.name}</span>
            </button>
          ))}
        </div>
      </>
    )
  }

  function Wieviele() {
    return (
      <>
        <h1>Wieviele machen mit?</h1>
        <p className="leise">
          Dich mitgezählt. Wer kein Handy hat, tritt nicht bei — über diese Zahl
          zählen seine Stunden trotzdem.
        </p>
        <div className="treppe">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <button key={n} type="button" aria-pressed={anzahl === n} onClick={() => setAnzahl(n)}>
              {n}
            </button>
          ))}
        </div>
        <button className="knopf haupt gross voll" onClick={beginnen} disabled={!ich}>
          Arbeit beginnen
        </button>
      </>
    )
  }
}

/**
 * Erster Bildschirm auf einem neuen Geraet: Namen eintippen.
 *
 * Wer einen Namen tippt, der einem schon erfassten aehnelt, bekommt ihn
 * angeboten — sonst stuenden „Marek" und „Mark" als zwei Personen in der
 * Auswertung, und niemand merkte es.
 */
import { useMemo, useState } from 'react'
import { aehnlicheNamen, namenNormalisieren, personAnlegenOderFinden, personSuchen, useDaten } from '../lib/db.ts'
import { ichSetzen } from '../lib/ich.ts'

export default function Wer() {
  const d = useDaten()
  const [name, setName] = useState('')

  const sauber = namenNormalisieren(name)
  const bekannt = useMemo(() => (sauber ? personSuchen(d, sauber) !== null : false), [d, sauber])
  const aehnlich = useMemo(() => aehnlicheNamen(d, sauber), [d, sauber])

  function weiter(gewaehlt = sauber) {
    const id = personAnlegenOderFinden(gewaehlt)
    if (id) ichSetzen(id)
  }

  return (
    <div className="huelle eng saeule">
      <div className="seitenkopf">
        <span className="marke-zeile">Feld</span>
        <h1>Wie heisst du?</h1>
      </div>
      <p className="leise" style={{ marginTop: -8 }}>
        Einmal eintippen. Das Gerät merkt es sich — du musst das nicht jeden
        Tag wieder machen.
      </p>

      <form
        className="saeule eng"
        onSubmit={e => { e.preventDefault(); if (sauber) weiter() }}
      >
        <input
          id="mein-name"
          className="feld-eingabe gross"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Dein Name"
          autoComplete="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="go"
        />

        {aehnlich.length > 0 && (
          <div className="saeule eng" style={{ gap: 7, paddingTop: 4 }}>
            <span className="still">Meintest du …</span>
            <div className="vorschlaege">
              {aehnlich.map(n => (
                <button key={n} type="button" onClick={() => weiter(n)}>{n}</button>
              ))}
            </div>
          </div>
        )}

        <button className="knopf haupt gross voll" type="submit" disabled={!sauber} style={{ marginTop: 6 }}>
          {sauber
            ? bekannt ? `Weiter als ${sauber}` : `Als ${sauber} anmelden`
            : 'Weiter'}
        </button>
      </form>

      <p className="still">
        Kein Passwort, kein Konto. Der Name bleibt auf diesem Gerät und wird
        nur an die Arbeiten gehängt, bei denen du mitmachst.
      </p>
    </div>
  )
}

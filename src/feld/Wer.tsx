/** Erster Bildschirm auf einem neuen Geraet: Namen antippen. */
import { useDaten } from '../lib/db.ts'
import { ichSetzen } from '../lib/ich.ts'
import { ZPerson } from '../teile/Zeichen.tsx'

export default function Wer() {
  const d = useDaten()
  return (
    <div className="huelle eng saeule">
      <div>
        <div className="marke-zeile">Feld</div>
        <h1>Wer bist du?</h1>
        <p className="leise" style={{ marginTop: 6 }}>
          Einmal antippen. Das Gerät merkt es sich.
        </p>
      </div>
      <div className="saeule eng">
        {d.personen.filter(p => p.aktiv).map(p => (
          <button key={p.id} className="wahl" onClick={() => ichSetzen(p.id)}>
            <ZPerson style={{ color: 'var(--tinte-still)', flex: 'none' }} />
            <span className="wahl-haupt">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

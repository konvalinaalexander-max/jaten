import type { ReactNode } from 'react'
import { ZWarnung } from './Zeichen.tsx'

export function Chip({ art = 'ruhe', punkt, children }: {
  art?: 'ruhe' | 'laeuft' | 'offen' | 'akzent'
  punkt?: 'pulst' | true
  children: ReactNode
}) {
  return (
    <span className={`chip ${art}`}>
      {punkt && <span className={`punkt ${punkt === 'pulst' ? 'pulst' : ''}`} />}
      {children}
    </span>
  )
}

export function Kennzahl({ wert, name, betont }: { wert: string; name: string; betont?: boolean }) {
  return (
    <div className="kennzahl">
      <div className={`wert ${betont ? 'betont' : ''}`}>{wert}</div>
      <div className="name">{name}</div>
    </div>
  )
}

export function Hinweis({ art = 'ruhig', children }: {
  art?: 'merken' | 'ruhig'
  children: ReactNode
}) {
  return (
    <div className={`hinweis ${art}`}>
      {art === 'merken' && <ZWarnung width="18" height="18" style={{ flex: 'none', marginTop: 1 }} />}
      <div>{children}</div>
    </div>
  )
}

export function Leerstelle({ children }: { children: ReactNode }) {
  return <div className="leerstelle">{children}</div>
}

export function Schritte({ von, bei }: { von: number; bei: number }) {
  return (
    <div className="schritte" aria-label={`Schritt ${bei + 1} von ${von}`}>
      {Array.from({ length: von }, (_, i) => (
        <span
          key={i}
          className={`schritt-punkt ${i < bei ? 'erledigt' : i === bei ? 'aktiv' : ''}`}
        />
      ))}
    </div>
  )
}

/** Balken je Arbeitsart. Die laengste Zeile setzt den Massstab. */
export function Balken({ name, zeichen, wert, anteil, neben }: {
  name: string
  zeichen?: ReactNode
  wert: string
  anteil: number
  neben?: string
}) {
  return (
    <div className="balken-zeile">
      <div className="balken-kopf">
        <span className="balken-name">{zeichen}{name}</span>
        <span className="zahl" style={{ fontSize: '.86rem' }}>
          {wert}
          {neben && <span className="still" style={{ marginLeft: 6 }}>{neben}</span>}
        </span>
      </div>
      <div className="balken-bahn">
        <div className="balken-fuell" style={{ width: `${Math.max(2, anteil * 100)}%` }} />
      </div>
    </div>
  )
}

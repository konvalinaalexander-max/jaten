/** Strichzeichen, 24×24, in Textfarbe. Auf dem Feld traegt das Bild, nicht das Wort. */
import type { SVGProps } from 'react'
import type { Arbeitsart } from '../lib/typen.ts'

type P = SVGProps<SVGSVGElement>

function Grund({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" {...p}
    >
      {children}
    </svg>
  )
}

/** Hacke: Stiel und Blatt. */
export const ZHacken = (p: P) => (
  <Grund {...p}>
    <path d="M17.5 3.5 8 13" />
    <path d="M4.5 21 8.5 17" />
    <path d="M7 12.5 11.5 17 9 19.5 4.5 15z" />
    <path d="M16 2.5 21.5 8" />
  </Grund>
)

/** Jaeten: Unkraut mit Wurzel, von Hand gezogen. */
export const ZJaeten = (p: P) => (
  <Grund {...p}>
    <path d="M12 14v7" />
    <path d="M12 21c-1.5-1.5-3-1.8-4.5-1.5M12 21c1.5-1.5 3-1.8 4.5-1.5" />
    <path d="M12 14c-3 0-4.5-2-4.5-4.5C10 9.5 12 11 12 14Z" />
    <path d="M12 14c3 0 4.5-2 4.5-4.5C14 9.5 12 11 12 14Z" />
    <path d="M12 12c0-3 1-5 2.5-6.5" />
  </Grund>
)

/** Saeen: Korn faellt in die Rille. */
export const ZSaeen = (p: P) => (
  <Grund {...p}>
    <path d="M3 18.5h18" />
    <path d="M6 18.5c.8-1.4 2.2-2 3.5-2M18 18.5c-.8-1.4-2.2-2-3.5-2" />
    <circle cx="8" cy="5" r="1.4" />
    <circle cx="13" cy="8.5" r="1.4" />
    <circle cx="17.5" cy="4.5" r="1.4" />
    <path d="M8 8v2.5M13 11.5V14M17.5 7.5V10" strokeDasharray="1 2.5" />
  </Grund>
)

/** Ernten: Kiste, gefuellt. */
export const ZErnten = (p: P) => (
  <Grund {...p}>
    <path d="M3 10h18l-1.5 10.5h-15z" />
    <path d="M3 10 5 6h14l2 4" />
    <path d="M9 6v4M15 6v4" />
    <path d="M9.5 14.5h5" />
  </Grund>
)

export const ZFeld = (p: P) => (
  <Grund {...p}>
    <path d="M3 20h18" />
    <path d="M4.5 20V9l7.5-5 7.5 5v11" />
    <path d="M8.5 20v-5.5h7V20" />
  </Grund>
)

export const ZUhr = (p: P) => (
  <Grund {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Grund>
)

export const ZListe = (p: P) => (
  <Grund {...p}>
    <path d="M8 6h12M8 12h12M8 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" />
  </Grund>
)

export const ZArchiv = (p: P) => (
  <Grund {...p}>
    <path d="M3.5 7.5h17v12h-17z" /><path d="M2.5 4.5h19v3h-19z" /><path d="M10 12h4" />
  </Grund>
)

export const ZRegler = (p: P) => (
  <Grund {...p}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" />
  </Grund>
)

export const ZWarnung = (p: P) => (
  <Grund {...p}>
    <path d="M12 3.5 21.5 20h-19z" /><path d="M12 10v4.5M12 17.5h.01" />
  </Grund>
)

export const ZZurueck = (p: P) => (
  <Grund {...p}><path d="M14.5 5.5 8 12l6.5 6.5" /></Grund>
)

export const ZPlus = (p: P) => (
  <Grund {...p}><path d="M12 5v14M5 12h14" /></Grund>
)

export const ZHaken = (p: P) => (
  <Grund {...p}><path d="M4.5 12.5 9.5 17.5 19.5 6.5" /></Grund>
)

export const ZPerson = (p: P) => (
  <Grund {...p}>
    <circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1-3.8 4-5.5 7.5-5.5S18.5 16.2 19.5 20" />
  </Grund>
)

const NACH_ZEICHEN = {
  hacken: ZHacken, jaeten: ZJaeten, saeen: ZSaeen, ernten: ZErnten,
} as const

export function ZArbeit({ art, ...p }: P & { art: Arbeitsart['zeichen'] }) {
  const Z = NACH_ZEICHEN[art] ?? ZHacken
  return <Z {...p} />
}

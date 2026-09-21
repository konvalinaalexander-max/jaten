/**
 * Wer bedient gerade dieses Geraet. Kein Passwort, kein PIN — auf dem Feld
 * ist jede Huerde eine zu viel. Der Name wird angetippt, nicht getippt:
 * Freitext gaebe „Ana", „ana", „Anna" und damit drei Personen in der Auswertung.
 * Liegt nur lokal; es ist keine Anmeldung, nur eine Merkhilfe.
 */
import { useSyncExternalStore } from 'react'
import type { Id } from './typen.ts'

const SCHLUESSEL = 'feldstunden.ich'
const hoerer = new Set<() => void>()

function lesen(): Id | null {
  try { return localStorage.getItem(SCHLUESSEL) } catch { return null }
}

let ich: Id | null = lesen()

export function ichSetzen(id: Id | null) {
  ich = id
  try {
    if (id) localStorage.setItem(SCHLUESSEL, id)
    else localStorage.removeItem(SCHLUESSEL)
  } catch { /* privater Modus */ }
  for (const h of hoerer) h()
}

export function useIch(): Id | null {
  return useSyncExternalStore(
    fn => { hoerer.add(fn); return () => { hoerer.delete(fn) } },
    () => ich,
    () => ich,
  )
}

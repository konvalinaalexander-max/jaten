/** Rendert das Dokument mit Chromium nach PDF. A4, Hintergründe mitgedruckt. */
import pw from '../../node_modules/playwright/index.js'
import path from 'node:path'
import fs from 'node:fs/promises'

const hier = path.dirname(new URL(import.meta.url).pathname)
const quelle = 'file://' + path.join(hier, 'dokument.html')
const ziel = path.join(hier, '../../dist/Feldstunden-Erfassung-am-Feld.pdf')

const browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const seite = await browser.newPage()
const fehler = []
seite.on('pageerror', e => fehler.push(String(e)))
seite.on('console', m => { if (m.type() === 'error') fehler.push(m.text()) })

await seite.goto(quelle, { waitUntil: 'networkidle' })
await seite.evaluate(() => document.fonts.ready)

// Überlaufende Seiten fallen im PDF stillschweigend weg — hier sichtbar machen.
const ueberlauf = await seite.evaluate(() =>
  [...document.querySelectorAll('.seite')]
    .map((s, i) => ({ nr: i + 1, hoehe: s.scrollHeight, soll: s.clientHeight }))
    .filter(x => x.hoehe > x.soll + 1))

await fs.mkdir(path.dirname(ziel), { recursive: true })
await seite.pdf({ path: ziel, format: 'A4', printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 } })
await browser.close()

if (fehler.length) console.error('Seitenfehler:', fehler.slice(0, 3).join(' | '))
if (ueberlauf.length) {
  console.error('Inhalt läuft über:', ueberlauf.map(x => `S${x.nr} ${x.hoehe}>${x.soll}`).join(', '))
  process.exit(1)
}
const { size } = await fs.stat(ziel)
console.log(`${path.basename(ziel)} — ${(size / 1024).toFixed(0)} kB`)

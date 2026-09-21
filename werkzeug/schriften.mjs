/**
 * Holt die Schriftdateien von Google Fonts und legt sie als eine CSS-Datei
 * mit eingebetteten data:-URIs ab. Damit braucht die fertige HTML-Datei kein
 * Netz — sie sieht auf dem Feld ohne Empfang genauso aus wie im Büro.
 */
import fs from 'node:fs/promises'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
const QUELLE =
  'https://fonts.googleapis.com/css2' +
  '?family=Literata:opsz,wght@7..72,600' +
  '&family=IBM+Plex+Sans:wght@400;500;600' +
  '&family=IBM+Plex+Mono:wght@400;500' +
  '&display=swap'

const css = await (await fetch(QUELLE, { headers: { 'User-Agent': UA } })).text()

// Nur die lateinischen Schnitte — der Rest verdoppelt die Datei ohne Nutzen.
const bloecke = css.split('/*').filter(b => /^\s*latin\b/.test(b))
let raus = ''
let anzahl = 0

for (const block of bloecke) {
  const regel = '@font-face' + block.split('@font-face')[1]
  const url = regel.match(/url\((https:[^)]+\.woff2)\)/)?.[1]
  if (!url) continue
  const daten = Buffer.from(await (await fetch(url)).arrayBuffer())
  raus += regel.replace(
    /url\(https:[^)]+\.woff2\)/,
    `url(data:font/woff2;base64,${daten.toString('base64')})`,
  ) + '\n'
  anzahl++
}

await fs.mkdir('src/schrift', { recursive: true })
await fs.writeFile('src/schrift/schriften.css', raus)
console.log(`${anzahl} Schnitte eingebettet, ${(raus.length / 1024).toFixed(0)} kB`)

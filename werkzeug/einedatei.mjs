/**
 * Baut aus dem Vite-Ergebnis eine einzige HTML-Datei: Stil, Schriften und
 * Programm stecken darin. Man kann sie herunterladen, mailen, auf einen Stick
 * legen und mit einem Doppelklick oeffnen — sie braucht weder Server noch Netz.
 *
 * Ersetzt wird ausschliesslich mit Funktionen. Bei String.replace mit einem
 * String werden $-Folgen im Ersatztext ausgewertet: minifiziertes JS steckt
 * voller `$` und Backticks, und `$\`` haette die halbe Datei an die falsche
 * Stelle kopiert, statt den Skript-Verweis zu ersetzen.
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const DIST = 'dist'
const ZIEL = 'dist/feldstunden.html'

let html = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')

const stile = [...html.matchAll(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/g)]
for (const [ganz, datei] of stile) {
  const css = await fs.readFile(path.join(DIST, datei), 'utf8')
  html = html.replace(ganz, () => `<style>\n${css}\n</style>`)
}

const skripte = [...html.matchAll(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/g)]
for (const [ganz, datei] of skripte) {
  const js = await fs.readFile(path.join(DIST, datei), 'utf8')
  // </script> im Programmtext wuerde die Datei an der Stelle zerreissen.
  html = html.replace(ganz, () => `<script type="module">\n${js.replaceAll('</script', '<\\/script')}\n</script>`)
}

html = html.replace(/<link rel="modulepreload"[^>]*>/g, '')

await fs.writeFile(ZIEL, html)
const { size } = await fs.stat(ZIEL)

// Pruefungen: nichts darf mehr nachgeladen werden, weder von aussen noch
// aus dem assets-Ordner, den beim Weitergeben niemand mitschickt.
const klagen = []
if (!stile.length) klagen.push('kein Stylesheet gefunden')
if (!skripte.length) klagen.push('kein Programm gefunden')
for (const m of html.matchAll(/(?:src|href)="((?:https?:|\.?\/?assets\/)[^"]*)"/g)) {
  klagen.push(`verweist noch auf ${m[1]}`)
}
if (klagen.length) {
  console.error('Die Datei ist nicht eigenstaendig:\n  ' + klagen.join('\n  '))
  process.exit(1)
}

console.log(`${ZIEL} — ${(size / 1024).toFixed(0)} kB, eigenständig`)

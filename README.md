# jaten — Feldstunden

Arbeitszeit-Erfassung im Gemüsebau: **Wieviele Arbeitsstunden stecken in
diesem Satz — und was kostet deshalb ein Kopf Salat?**

Zwei Oberflächen aus einem System:

- **Feld** — *Was läuft*: alle Arbeiten des Tages über alle Felder, beitreten
  mit einem Tipp. Neue Arbeit in vier Schritten (wo → was steht hier → welche
  Arbeit → wieviele). Danach gibt es im Kern einen Knopf: *Arbeit abschliessen*.
  Angemeldet wird mit dem eingetippten Namen — kein Passwort, kein Konto.
- **Büro** — *Was steht wo*, filterbar nach Kultur und Feld. Je Satz die
  Historie, die Stunden nach Arbeitsart, Fläche, h/Are und Kosten. Archiv mit
  Kulturvergleich, Nachtragsliste für Vergessenes.

## Stand

**Lauffähige Demo mit erfundenen Daten.** Alles liegt im Browser, nichts geht
nach aussen. Noch keine Datenbank, kein Login, keine Mehrsprachigkeit.

    npm install
    npm run dev          # Oberfläche auf :5173
    npm test             # Rechenlogik, 9 Tests
    npm run build:datei  # eine eigenständige HTML-Datei
    npm run pruefen      # Typen + Tests + Datei

### Zum Weitergeben: eine Datei

`npm run build:datei` legt **`dist/feldstunden.html`** an — 818 kB, Stil,
Schriften und Programm eingebettet. Herunterladen, doppelklicken, läuft. Kein
Server, kein Internet, keine Installation; auf dem Feld ohne Empfang sieht sie
aus wie im Büro. Der Bauschritt bricht ab, wenn noch irgendetwas nachgeladen
würde.

Die Daten liegen im `localStorage` des jeweiligen Geräts — zum Ausprobieren
richtig, für den Betrieb nicht: zwei Handys sehen einander nicht. Dafür käme
`src/lib/db.ts` gegen eine echte Datenbank aus.

## Dokumente

| Datei | Inhalt |
|---|---|
| [`docs/KONZEPT.md`](docs/KONZEPT.md) | Was das Projekt ist, wo die schwierigen Stellen liegen, Datenmodell, Vorgehen |
| [`docs/ENTSCHEIDUNGEN.md`](docs/ENTSCHEIDUNGEN.md) | Was entschieden wurde und warum — inkl. der Abweichungen vom Konzept |
| [`docs/FRAGEN.md`](docs/FRAGEN.md) | Was noch offen ist |

## Die drei Punkte, auf die es ankommt

1. **Die Belegung** (Schiff × Satz × von–bis, mit Flächenanteil) ist der Kern
   des Datenmodells. Die Kultur darf nicht am Schiff hängen, sonst wandert die
   Historie beim Überschreiben zur falschen Kultur. In den Demodaten trug
   Hausfeld Schiff 1 erst einen Salatsatz und trägt jetzt den nächsten — beide
   behalten ihre Stunden. → `docs/KONZEPT.md` §2
2. **Die Stunden kommen aus den Teilnahmen, nicht aus Dauer × Kopfzahl.** Wer
   früher geht, hat eine eigene Endzeit. Und wer kein Handy hat, zählt über die
   angemeldete Anzahl mit — getrennt ausgewiesen, damit eine Schätzung nicht
   aussieht wie eine Messung. → `docs/ENTSCHEIDUNGEN.md`
3. **Die Erntemenge fehlt noch als Nenner.** Bis dahin ist die Bezugsgrösse
   Stunden je Are. → `docs/KONZEPT.md` §6

## Aufbau

    src/lib/      typen · db (Speicher) · rechnen (Logik) · demo · format · finden
    src/feld/     Wer · Start · NeueArbeit · Auftrag
    src/buero/    Dashboard · SatzDetail · Archiv · Nachtrag · Einstellungen
    test/         Tests der Rechenlogik

`src/lib/rechnen.ts` ist bewusst rein — bekommt Daten, gibt Zahlen zurück,
kennt weder Speicher noch Oberfläche. `src/lib/db.ts` ist die einzige Stelle,
die den Speicher kennt; wird daraus Supabase, ändert sich sonst nichts.

React 19 · Vite · TypeScript — derselbe Stack wie
[`Kurbisverlust`](https://github.com/konvalinaalexander-max/Kurbisverlust),
damit später Supabase und Cloudflare gleich dazupassen.

## Verwandte Projekte

- [`j-ten`](https://github.com/konvalinaalexander-max/j-ten) — Vorgänger,
  Leistungsmessung je Person je Linie. Hierarchie Feld → Schiff übernommen,
  Linien und Bonituren nicht: dieses Projekt bucht Stunden auf Kostenträger
  und vergleicht keine Personen.
- [`Kurbisverlust`](https://github.com/konvalinaalexander-max/Kurbisverlust) —
  derselbe Betrieb, Lagerverluste. Liefert Stack und das Muster der zwei
  Oberflächen.

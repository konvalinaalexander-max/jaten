# jaten

Arbeitszeit-Erfassung im Gemüsebau: **Wieviele Arbeitsstunden stecken in
diesem Satz — und was kostet deshalb ein Kopf Salat?**

Zwei Oberflächen aus einem System:

- **Feld** — Auftrag eröffnen (Schiff, Arbeit), beitreten, abschliessen.
  Drei Tipps, offlinefähig.
- **Büro** — Dashboard „was steht wo", Historie je Satz, Stunden nach
  Arbeitsart, Kostenrechnung.

## Stand

**Konzeptphase. Es ist noch nichts programmiert.**

| Dokument | Inhalt |
|---|---|
| [`docs/KONZEPT.md`](docs/KONZEPT.md) | Was das Projekt ist, wo die schwierigen Stellen liegen, Datenmodell-Skizze, Vorgehen |
| [`docs/FRAGEN.md`](docs/FRAGEN.md) | Offene Fragen — die ersten vier blockieren das Datenmodell |

## Die drei Punkte, auf die es ankommt

1. **Die Belegung** (Schiff × Satz × von–bis) ist der Kern des Datenmodells.
   Die Kultur darf nicht am Schiff hängen, sonst geht die Historie verloren,
   sobald dort etwas Neues steht. → Konzept §2
2. **Hintergrund-GPS geht im Browser nicht.** Zuverlässige 10-Minuten-Prüfungen
   bräuchten eine native App. Vorschlag: Stufe 1 ohne Hintergrund-GPS deckt den
   grössten Teil des Nutzens ab. → Konzept §5
3. **Die Erntemenge ist der fehlende Nenner.** Ohne sie bleibt „was kostet ein
   Kopf Salat" unbeantwortet — und nachholen lässt sie sich nicht. → Konzept §6

## Verwandte Projekte

- [`j-ten`](https://github.com/konvalinaalexander-max/j-ten) — Vorgänger,
  Leistungsmessung je Person je Linie. Hierarchie Feld → Schiff und die
  Offline-Idempotenz werden übernommen, Linien und Bonituren nicht.
- [`Kurbisverlust`](https://github.com/konvalinaalexander-max/Kurbisverlust) —
  derselbe Betrieb, Lagerverluste. Liefert den erprobten Stack
  (React + Vite + TypeScript, Supabase, Cloudflare, €0) und das Muster der
  zwei Oberflächen.

# Entscheidungen

Was aus der ersten Fragerunde entschieden wurde, und wo das vom Konzept
abweicht. Jede Entscheidung mit Begründung, damit sie sich später überstimmen
lässt.

---

## GPS fällt weg

**Entschieden:** „Es geht nicht um Überwachung — vielleicht auch ohne GPS. Es
geht uns darum zu wissen, wieviele Stunden eine Kultur braucht."

Damit ist die ganze Stufe 2 aus Konzept §5 vom Tisch, und mit ihr die native
App, das Apple-Developer-Programm und die Akku-Frage. Die Demo hat **keinen
Standortzugriff**, keine Berechtigungsabfrage und keine `standort_pruefung`-
Tabelle.

Das Vergessen bleibt aber ein echtes Problem — „schon oft", auf die Frage, wie
oft das Ausloggen vergessen wird. Dagegen wirken jetzt zwei Dinge:

- **Auf dem Feld:** Ein Auftrag, der von gestern stammt oder mehr als doppelt
  so lang läuft wie für seine Arbeitsart üblich, erscheint in der Liste nicht
  grün, sondern bernstein: *noch offen — läuft seit Freitag 13:30, wurde das
  abgeschlossen?* Wer dabei war, sieht es beim nächsten Griff zum Handy.
- **Im Büro:** Die Seite *Nachtragen* sammelt genau diese Aufträge, schlägt
  eine Endzeit vor (die erwartete Dauer der Arbeitsart) und lässt sie
  korrigieren und bestätigen.

Ein Mensch bestätigt die Endzeit. Ein automatischer Schnitt bei 500 m hätte
stillschweigend falsche Daten erzeugt, sobald jemand kurz zum Anhänger fährt.

## Die Anzahl wird doch abgefragt — und trägt die Stunden der Leute ohne Handy

**Entschieden:** „Am besten wird die Person, die den Auftrag startet, alles
gefragt — oft hat es eine gewissenhafte Person pro Gruppe. Kann auch sein, dass
nicht alle beitreten, deswegen soll auch er gefragt werden: wieviele machen
mit? Vor allem als Kontrolle."

Das Konzept riet davon ab (§3: die Zahl wäre zweimal da). Der Einwand ist
besser: Sie ist nicht dasselbe wie die Zahl der Beitritte, sie ist die
Gegenprobe dazu — und sie löst nebenbei das Problem, das die Kostenrechnung
sonst still verfälscht hätte.

Gerechnet wird deshalb:

```
Stunden = Σ (Ende − Start) je Beitritt              ← gemessen
        + (angemeldet − beigetreten) × Auftragsdauer ← ergänzt
```

Beide Teile werden **getrennt geführt und getrennt angezeigt** — im Auftrag
(*3 ohne Gerät · 12 h 00*) und in der Satz-Historie (*gemessen* gegen
*ergänzt*). Ohne die Ergänzung wären die Stunden systematisch zu niedrig, und
zwar ohne dass es je aufgefallen wäre. Mit ihr, aber vermischt, sähe eine
Schätzung aus wie eine Messung.

Wer beitritt, obwohl der Eröffner weniger angemeldet hat, erhöht die Zahl
automatisch — die Ergänzung rechnet niemanden doppelt.

## Ein Schiff kann geteilt sein

**Entschieden:** ja.

`belegung.anteil` (0 < anteil ≤ 1). Die Fläche eines Satzes ist die Summe über
`anteil × schiff.flaecheM2`. Beim Anlegen eines Satzes fragt die App nur dann
nach dem Anteil, wenn auf dem Schiff schon etwas steht, und bietet nur an, was
noch frei ist.

In den Demodaten liegt auf Hausfeld Schiff 3 halb Kohlrabi, halb Randen.

## Ein Satz kann über mehrere Schiffe gehen

**Entschieden:** ja, und es soll gespeichert werden.

Ein Satz, mehrere Belegungen. Daraus folgt der Knopf **„Weiter zum nächsten
Schiff"** im laufenden Auftrag: beim Hacken macht man Schiff 3 und gleich
Schiff 4 desselben Satzes, ohne sich neu anzumelden.

## Die Erntemenge kommt später

**Entschieden:** „Das kommt später — jetzt erstmal Demo bauen, um Überblick zu
kriegen."

Das Feld ist trotzdem schon da (`auftrag.menge`), und ein Ernte-Auftrag fragt
beim Abschliessen danach. Grund: Nachrüsten kostet nichts, aber eine Saison
ohne Nenner lässt sich nicht nachholen (Konzept §6). Wo keine Menge erfasst
ist, zeigt die Satz-Historie *keine Menge erfasst* statt einer Zahl.

Bis dahin ist die Bezugsgrösse **Stunden je Are** (100 m²) — die kommt aus der
Fläche und ist sofort da.

## Vier Arbeitsarten zum Start

**Entschieden:** erstmal die genannten — Hacken, Jäten, Säen, Ernten.

Sie stehen in den Stammdaten, nicht im Code; unter *Einstellungen* lassen sich
weitere anlegen und ungenutzte entfernen. Was vermutlich bald dazukommt:
**Pflanzen** (Salat wird gepflanzt, nicht gesät — der Satz kennt die
Unterscheidung bereits über `herkunft`).

## Schweiz

**Entschieden.** Währung CHF, Formate `de-CH`.

Mit dem Wegfall des Standortzugriffs entschärft sich Art. 26 ArGV 3 von selbst:
Es gibt kein Überwachungssystem, das zu rechtfertigen wäre. Was bleibt, sind
Arbeitszeiten je Person — die fallen bei jeder Stundenerfassung an.

Dazu die Linie aus Konzept §1, die weiter gilt: **Personenstunden ja,
Personen-Rangliste nein.** Das Büro zeigt Namen in der Auftragshistorie (man
muss nachvollziehen können, woher eine Zahl kommt), aber nirgends eine
Auswertung *je Person*. Wer das will, soll es bewusst dazubauen müssen.

## Kein Login

**Entschieden:** „Vielleicht kennen alle den Link, QR ist auch gut. Und dann
hat es eben alle Arbeiten, die gerade an dem Tag über die verschiedenen Felder
laufen — und sie treten bei."

Das ist die Startseite der Feld-Oberfläche geworden: *Was läuft*, über alle
Felder, mit den eigenen Aufträgen oben. Kein Passwort, kein PIN — beim ersten
Öffnen einmal den Namen antippen, das Gerät merkt ihn sich lokal.

Angetippt, nicht getippt: Freitext gäbe „Ana", „ana", „Anna" und damit drei
Personen in der Auswertung.

## Stundensatz in den Einstellungen

**Entschieden:** dynamisch anpassbar.

Ein betrieblicher Vollkostensatz, kein Einzellohn (Konzept §6). Alle
Kostenangaben rechnen live damit — Stunden sind gespeichert, Kosten nie.
Ändert sich der Satz, ändern sich alle Auswertungen mit, auch rückwirkend.

*Noch offen, falls das nicht reicht:* Lohnstufen (Lehrling / Saisonkraft /
Vorarbeiter) statt eines einzigen Satzes — dann eine Stufe je Person und die
Sätze in den Einstellungen, damit keine Löhne in der App liegen.

## Netz ist gut

**Entschieden.** Die Demo speichert deshalb einfach im Browser, ohne
Warteschlange und Synchronisation.

Konzept §4 bleibt trotzdem gültig, sobald es echt wird: Der Speicher liegt
hinter `src/lib/db.ts` und sonst nirgends. Wird daraus Supabase, kommt die
Offline-Warteschlange an genau dieser einen Stelle dazu — die Oberfläche merkt
nichts davon.

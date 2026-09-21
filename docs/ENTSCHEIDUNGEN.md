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

**Der Name wird eingetippt**, nicht aus einer Liste gewählt — es soll keine
gepflegte Belegschaftsliste brauchen, damit jemand anfangen kann. Das Risiko
dabei ist, dass „Marek" und „Mark" als zwei Personen in der Auswertung stehen
und es niemandem auffällt. Dagegen zwei Dinge:

- Verglichen wird ohne Rücksicht auf Gross- und Kleinschreibung und auf
  doppelte Leerzeichen; „ana" landet bei „Ana".
- Wer etwas tippt, das einem schon erfassten Namen ähnelt, bekommt ihn
  angeboten: *Meintest du … Marek?* Ein Tipp, und die Stunden hängen an der
  richtigen Person.

Die Personenliste wächst also dadurch, dass Leute ihren Namen eintippen — so,
wie es auf dem Betrieb ohnehin läuft.

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

---

# Runde 3 — QR-Code und Satz-Lebenszyklus

Visualisiert in [`Feldstunden-Erfassung-am-Feld.pdf`](../werkzeug/pdf/) —
gebaut mit `node werkzeug/pdf/bauen.mjs`.

## Der QR-Code ersetzt die GPS-Anwesenheitserkennung

**Entschieden:** „Wir können auch viel über QR-Codes arbeiten — beim Ankommen
ans Feld scannen sie einen Code und tragen dort ihre Arbeit ein."

Der Scan liefert die Zuordnung zum Schiff zuverlässiger als jede Ortung — weil
ein Mensch sie erklärt.

> **Korrigiert in Runde 4:** Hier stand zuerst, GPS könne ein Schiff „gar
> nicht“ auflösen. Das beruhte auf einer falschen Zahl (1,5–3 m statt der
> tatsächlichen 20 m Schiffbreite). Die Zuordnung gehört trotzdem in die
> Ansage, aber weil sie dort verlässlicher ist — nicht weil es unmöglich wäre.
> Und der Standort kommt für eine andere Aufgabe zurück: siehe das Nachtragsteil
> in [AUSBAU.md](AUSBAU.md).

**Ein Code je Feld, an der Zufahrt** — nicht je Schiff. Ein Pfosten an der
Einfahrt bleibt stehen; ein Stab im Beet wird vom Vlies verdeckt, umgefahren
oder eingeackert. Vier Felder heissen vier Schilder, achtzig Schiffe hiessen
achtzig. Das Schiff kommt über einen Tipp aus der Belegung.

Mindestens 10 × 10 cm, Fehlerkorrektur Stufe H (bis 30 % der Fläche darf
zerstört sein), Feldname gross darunter. Und immer mit Rückfallweg: Code
kaputt oder Kamera streikt → Feldliste zum Antippen. Der Scan ist die
Abkürzung, nie die einzige Tür.

**Eine Person eröffnet, die anderen scannen denselben Code und treten bei.**
Die Anzahl wird trotzdem gefragt (Runde 2 bleibt gültig): Akku leer, Handy im
Auto, gar kein Gerät — die Differenz zwischen bestätigter Zahl und
eingegangenen Scans sind die Stunden, die sonst ersatzlos fehlen, und zwar
immer in dieselbe Richtung.

**Offen bleibt das Ende.** Ein Scan beweist, dass jemand da war, nicht dass er
geblieben ist. Zweiter Scan beim Gehen oder Knopf in der App — Vorschlag:
beide anbieten, einen davon bewerben, und was fehlt, fängt die Nachtragsliste.

## Ein Satz endet mit der Bodenbearbeitung, nicht mit der Ernte

**Problem:** „Es wird oft an mehreren Tagen geerntet — also ist nicht immer
klar, wann die Kultur wirklich fertig ist."

Richtig, und es gibt keinen Erntetag, an dem jemand sicher weiss, dass es der
letzte war. Deshalb **drei Zustände statt zwei**:

```
wächst  ──erster Erntegang──▶  in Ernte  ──geräumt / Boden bearbeitet──▶  abgeräumt
   └──────────Boden bearbeitet, ohne dass je geerntet wurde──────────▶  umgebrochen
```

- `wächst → in Ernte` passiert **automatisch** beim ersten Ernte-Auftrag.
  Keine Entscheidung nötig.
- `in Ernte` hält einfach an. Das Dashboard zeigt *in Ernte seit 08.09., 5
  Gänge, 1'440 Stück* — das ist die ehrliche Auskunft.
- `in Ernte → abgeräumt` löst die nächste Bodenbearbeitung aus. Ernte ist ein
  Vorgang mit unklarem Schluss; Fräsen ist ein Ereignis, das sich nicht
  rückgängig machen lässt.

**Die Belegung endet am Tag der Bodenbearbeitung**, nicht beim letzten
Erntegang. Die Tage dazwischen gehören dem alten Satz — die Fläche stand
niemandem sonst zur Verfügung. Sonst bekommt der Satz zu wenig Standzeit und
der Folgesatz zu viel.

**Vorgeschlagen, nicht automatisch ausgeführt.** Ein stiller Wechsel auf
falscher Grundlage zerstört Geschichte, und das ist der einzige Schaden in
diesem System, der sich nicht reparieren lässt. Also fragt die App: *Auf
Schiff 3 stand Kopfsalat KW31. Abgeräumt?* Ein Tipp — aber ein menschlicher.

Wenn lange nichts passiert: nach drei Wochen ohne Erntegang **einmal** nachfragen.
Kein automatischer Abschluss.

## Die Erntemenge wird je Gang gezählt

Folgt aus dem Mehrfachschnitt und löst den fehlenden Nenner nebenbei: Niemand
muss sich am Ende eine Schlusszahl merken, die Summe ergibt sich.

Und es zeigt etwas, das eine einzige Endzahl verschluckt hätte — am
Beispielsatz aus dem PDF: der fünfte Gang bringt 60 Stück in 2 Stunden und
kostet damit **1.07 je Stück allein an Ernte**, während ein Kopf im
Durchschnitt insgesamt 1.00 kostet. Ob sich der Gang lohnt, hängt am
Verkaufspreis — aber die Frage stellt sich überhaupt erst, wenn man je Gang
zählt.

Solange ein Satz `in Ernte` ist, sind seine Kosten je Stück **vorläufig** und
müssen so gekennzeichnet werden. Sonst wird mit einer Zahl gerechnet, die sich
noch bewegt.

## Die Zurechnung an der Wende

| Arbeit | gehört zu |
|---|---|
| Räumen — Vlies weg, Strünke raus | dem **alten** Satz |
| Fräsen, Beet machen, düngen | dem **neuen** Satz |
| Boden bearbeitet, kein neuer Satz benannt | Gemeinkosten |

Merksatz: *Aufräumen zahlt der, der Dreck gemacht hat; Vorbereiten zahlt der,
der kommt.*

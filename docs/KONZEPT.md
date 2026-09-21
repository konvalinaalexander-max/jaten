# Arbeitszeit je Satz — Konzept

Stand: 2026-09-21. **Noch nichts programmiert.** Dieses Dokument klärt, was
das Projekt ist, wo die schwierigen Stellen liegen und in welcher Reihenfolge
man es angeht. Alles hier ist ein Vorschlag und darf überstimmt werden.

---

## 1. Was das Projekt eigentlich ist

In einem Satz:

> **Wieviele Arbeitsstunden stecken in diesem Salatsatz — und was kostet
> deshalb ein Kopf Salat?**

Alles andere ist Mittel zum Zweck. Das ist wichtig festzuhalten, weil es zwei
Dinge entscheidet:

**Die Erfassungseinheit ist der Satz, nicht die Person.** Gemessen wird nicht
„wie schnell ist Ahmed", sondern „wieviel Arbeit floss in Satz 14". Personen
kommen nur vor, weil man Stunden zählen muss und Stunden an Menschen hängen.

**Das unterscheidet dieses Projekt von `j-ten`.** Dort ging es um Tempo und
Qualität *je Person je Linie* — ein Leistungsmesssystem, mit allen
Grundsatzfragen, die dort in der README offen stehen (Betriebsvereinbarung,
Akkord, Einzelzustimmungen). Hier fällt das meiste davon weg: ein
Kostenrechnungssystem, das Stunden auf Kostenträger bucht, ist arbeitsrechtlich
ein völlig anderes Tier als ein Leistungsvergleich zwischen Mitarbeitern.

**Das ist kein Nebeneffekt, das ist eine Design-Entscheidung, die man halten
muss.** Die Daten erlauben rein technisch jederzeit die Auswertung „wer war wie
lange dabei". Wenn die Admin-Oberfläche das prominent anbietet, ist es doch ein
Leistungsmesssystem — mit allen Folgen. Vorschlag: Die Auswertung kennt
*Personenstunden*, aber keine *Personen-Rangliste*. Wer das später will, soll
es bewusst dazubauen müssen, nicht versehentlich geschenkt bekommen.

### Was am Ende herauskommen soll

| Frage | Antwort braucht |
|---|---|
| Was steht gerade wo? | Belegung Schiff × Satz, aktuell |
| Wieviel Arbeit steckt in Satz 14? | Summe Teilnahme-Stunden über alle Aufträge |
| Wo ging die Zeit hin? | Stunden aufgeschlüsselt nach Arbeitsart |
| Was kostet die Kultur? | Stunden × Stundensatz **÷ Ertrag** ← siehe §6 |
| Lohnt sich der frühe Satz? | Vergleich abgeschlossener Sätze derselben Kultur |

---

## 2. Die Begriffe — und wo `j-ten` nicht mehr reicht

Übernommen aus `j-ten`:

- **Feld** — die benannte Fläche.
- **Schiff** — Beet/Block innerhalb eines Feldes. Die kleinste Fläche, die man
  in der Praxis benennt und anfährt.

Neu und der eigentliche Dreh- und Angelpunkt:

- **Satz** — eine Pflanzung: Kultur + Sorte + Aussaat-/Pflanzdatum. *Der
  Kostenträger.* „Salat KW14" ist ein Satz, „Salat" ist es nicht.
- **Belegung** — welcher Satz lag von wann bis wann auf welchem Schiff.
- **Auftrag** — ein Arbeitsgang: eine Arbeitsart, an einem Satz, an einem Tag,
  von einer Gruppe.
- **Teilnahme** — eine Person an einem Auftrag, mit eigener Start- und Endzeit.
  *Die einzige Quelle der Stunden.*

### Warum `j-ten`s Schema nicht reicht

Dort hängen `kultur`, `satz` und `pflanzdatum` als Textfelder direkt am Schiff:

```sql
CREATE TABLE schiff (
  id, feld_id, name,
  kultur TEXT NOT NULL,   -- <-- hier
  satz TEXT,              -- <-- und hier
  pflanzdatum TEXT, ...
);
```

Das kann keine Geschichte. Sobald der Salat auf Schiff 3 abgeräumt ist und dort
Fenchel steht, wird das Feld überschrieben — und alle Aufträge, die je an Schiff
3 gebucht wurden, gehören plötzlich dem Fenchel. Genau die Auswertung, die das
Projekt begründet, geht damit kaputt.

**Lösung: Das Schiff verliert die Kultur. Sie zieht in eine eigene Tabelle
`belegung` um** — Schiff × Satz × von–bis. Damit kann:

- ein Schiff nacheinander mehrere Sätze tragen (Nachbau, Fruchtfolge),
- ein Satz über mehrere Schiffe gehen (grosser Satz, drei Schiffe),
- ein Schiff halbiert werden (halb Salat, halb Kohlrabi) — über einen
  Flächenanteil.

Der Auftrag hängt dann **am Satz**, nicht am Schiff. Das Schiff wird nur
mitgeschrieben, weil man wissen will, wo gearbeitet wurde (und für den
Standort-Abgleich).

Das ist die eine Stelle, an der sich ein Fehler später nicht mehr reparieren
lässt. Wenn sonst nichts aus diesem Dokument übrig bleibt: **die Belegung.**

---

## 3. Der Ablauf auf dem Feld

### Auftrag eröffnen

Deine Reihenfolge war: Feld → Schiff → Kultur → Arbeit → Anzahl Arbeiter.
Vorschlag, das umzudrehen, weil die App mehr weiss als sie zugibt:

1. **Wo bist du?** — Liste der Schiffe, das nächstgelegene oben (Standort
   einmalig beim Öffnen, siehe §5). Ein Tipp.
2. **Was steht hier?** — Die App weiss aus der Belegung, welcher Satz auf
   diesem Schiff liegt. Meist genau einer → sie zeigt ihn an, man bestätigt.
   *Die Frage nach der Kultur entfällt damit komplett.*
   - Kennt sie keinen Satz → **jetzt** kommt deine Rückfrage: „Was steht hier?
     Seit wann?" Satz wird angelegt, Belegung gesetzt.
   - Kennt sie einen, es ist aber ein anderer → „Nein, was anderes" → dasselbe,
     und die alte Belegung wird auf heute geschlossen.
3. **Welche Arbeit?** — Liste, grosse Felder, Symbole. Ein Tipp.
4. **Fertig.** Auftrag läuft.

Drei Tipps im Normalfall. **Das ist der Engpass des ganzen Projekts.** Wenn das
Anlegen länger als eine halbe Minute dauert, wird es bei Regen um sieben Uhr
früh nicht gemacht, und dann gibt es keine Daten und keine Auswertung.

Die Zahl der Arbeiter würde ich beim Eröffnen **nicht** abfragen — sie ergibt
sich aus den Beitritten und wäre sonst zweimal da, mit zwei verschiedenen
Werten. Es sei denn, sie dient als Kontrolle („5 erwartet, 3 beigetreten,
jemand hat vergessen").

### Beitreten

Namen antippen → Angaben prüfen → beitreten. Wie von dir beschrieben.

**Aber: nicht jeder hat ein Handy.** Das ist in der Praxis der Normalfall, und
es kippt die Rechnung komplett, wenn drei von fünf Leuten nie in den Daten
auftauchen. Der Eröffner muss Leute **mitnehmen** können: Namensliste, mehrere
antippen, fertig. Deren Teilnahme läuft dann mit dem Auftrag mit und endet, wenn
der Eröffner abschliesst.

→ `teilnahme.beigetreten_wie = 'selbst' | 'mitgenommen'`. Getrennt halten, weil
„selbst beigetreten" belastbarer ist.

**Namen: antippen, nicht tippen.** Freitext gibt „Ahmed", „ahmet", „Achmed" —
drei Personen in der Auswertung. Liste aus den Stammdaten, wie in der Kürbis-App.

### Abschliessen

Ein Knopf. Wie von dir beschrieben. Zwei Fälle mehr, die es braucht:

- **Nur ich bin fertig** vs. **alle sind fertig.** Wer früher geht, beendet
  seine Teilnahme; der Auftrag läuft weiter. Sonst stimmen die Stunden nicht.
- **Wir wechseln das Schiff.** Beim Hacken macht man Schiff 3, dann gleich
  Schiff 4 desselben Satzes. Sich neu anzumelden wäre lästig → „weiter zum
  nächsten Schiff" hängt ein zweites Schiff an denselben Auftrag.

### Und wenn niemand abschliesst

Passiert. Deshalb §5 — aber auch ohne GPS braucht es eine Auffanglösung:
Aufträge, die über Nacht offen bleiben, landen auf der Admin-Oberfläche in
einer Liste „bitte nachtragen", mit einem Vorschlag für die Endzeit. Nicht
still kappen — ein stillschweigend auf 8 Stunden gesetzter Auftrag erzeugt
falsche Zahlen, die niemand je bemerkt.

---

## 4. Offline. Von Anfang an.

Auf dem Feld gibt es oft kein Netz. Wenn der Abschluss-Knopf dann nicht
funktioniert, ist das System tot — einmal erlebt, und die Leute vertrauen ihm
nicht mehr.

Das lässt sich nicht gut nachrüsten, es muss ins Datenmodell:

- Jede Aktion (eröffnen, beitreten, abschliessen) wird **zuerst lokal**
  gespeichert und bekommt eine `klient_id`.
- Der Server nimmt dieselbe `klient_id` nur einmal an (`UNIQUE`) — damit ist
  doppeltes Synchen harmlos.
- Zeitstempel kommen **vom Gerät**, nicht vom Server, sonst verschiebt sich
  alles auf den Zeitpunkt des Synchens. Dafür muss man mit schiefen Uhren leben
  und beides speichern: `start_ts` (Gerät) und `erfasst_ts` (Server).

`j-ten` hatte die `klient_id` schon — gute Grundlage, übernehmen.

---

## 5. GPS — hier wird es unangenehm

Dein Wunsch: alle 10 Minuten prüfen, ob die Leute noch am Feld sind; ab ~500 m
Entfernung gilt die Arbeit als beendet. Motivation ausdrücklich nicht
Überwachung, sondern das vergessene Ausloggen.

### Der technische Befund, der über die Technologiewahl entscheidet

**Eine Web-App kann das nicht.** Das ist die wichtigste Einzelaussage in diesem
Dokument.

Browser-Standortabfragen (`watchPosition`) laufen nur, solange die Seite im
Vordergrund und sichtbar ist. Sobald das Handy in der Tasche steckt und der
Bildschirm aus ist, hört die Ausführung auf — iOS Safari suspendiert die Seite,
Android Chrome drosselt Hintergrund-Tabs bis zum Stillstand. Eine
Hintergrund-Standort-API gibt es im Web nicht. (Periodic Background Sync ist
Chromium-only, erfordert eine installierte PWA, liefert in der Praxis
Intervalle im Stundenbereich und kommt an den Standort gar nicht heran.)

**Zuverlässige 10-Minuten-Prüfungen im Hintergrund brauchen eine native App** —
etwa den bestehenden Web-Code in einer Capacitor-Hülle mit einem
Background-Geolocation-Plugin. Konsequenzen:

| | Android | iOS |
|---|---|---|
| Verteilung | APK direkt aufs Handy, kein Store nötig | nur über App Store oder TestFlight |
| Kosten | €0 | Apple Developer Programm, ~100 €/Jahr |
| Hürde | Installation aus unbekannter Quelle erlauben | App-Review, Hintergrund-Standort muss begründet werden |
| Aufwand | überschaubar | deutlich mehr |

Dazu, unabhängig vom System: Dauerhaftes Hintergrund-GPS zieht Akku. Wer am
Nachmittag ein leeres Handy hat, schaltet die Berechtigung ab — und dann ist
die Automatik weg, ohne dass es jemand merkt.

*Die Browser-Einschränkungen sollte man vor der endgültigen Entscheidung noch
einmal gegen die aktuelle Lage prüfen — sie waren über Jahre stabil, aber es
ist genau die Art Detail, die sich ändert.*

### Vorschlag: zwei Stufen

**Stufe 1 — ohne Hintergrund-GPS, reine Web-App.** Deckt den grössten Teil des
Nutzens ab:

1. **Standort beim Antippen.** Bei Eröffnen, Beitreten und Abschliessen wird
   einmal der Standort geholt. Das fängt den häufigsten Fehler ab — den
   *falsch angelegten* Auftrag („du bist bei Schiff 12, nicht Schiff 3 —
   stimmt das?").
2. **Erinnerung statt Automatik.** Läuft ein Auftrag länger als üblich für
   diese Arbeitsart, kommt eine Benachrichtigung: „Läuft noch?" Web Push
   funktioniert auf Android gut, auf iOS ab 16.4 mit installierter PWA.
3. **Prüfung beim nächsten Blick aufs Handy.** Wer die App das nächste Mal
   öffnet und 3 km weg ist, sieht sofort: „Du bist nicht mehr am Feld. Arbeit
   um 16:40 beenden?" — mit der letzten Zeit, zu der er nachweislich dort war.
4. **Nachtrag am nächsten Morgen.** Offen gebliebene Aufträge auf der
   Admin-Oberfläche, mit Vorschlag, zum Bestätigen.

Punkt 3 und 4 sind der Automatik sogar **überlegen**: Ein Mensch bestätigt die
Endzeit. Ein automatischer Schnitt bei 500 m erzeugt stillschweigend falsche
Daten, wenn jemand nur kurz zum Anhänger fährt, Wasser holt oder das GPS im
Wald springt.

**Stufe 2 — native Hülle**, erst wenn Stufe 1 nachweislich nicht reicht. Dann
weiss man auch, wie oft das Problem wirklich auftritt.

### Was gespeichert wird — und was nicht

Auch wenn die Absicht nicht Überwachung ist: Standortdaten von Arbeitnehmern
sind der heikelste Datentyp, den dieses Projekt anfasst. Die Absicht steht
nirgends in der Datenbank; das Design schon. Deshalb:

**Keine Koordinaten auf den Server.** Der Abgleich „bin ich innerhalb des
Radius?" passiert **auf dem Gerät** — es kennt den Schiff-Mittelpunkt und
seinen eigenen Standort. Zum Server geht nur:

```
standort_pruefung: auftrag_id, ts, am_feld (ja/nein), quelle
```

Kein Lat, kein Lon, keine Spur. Damit ist eine Bewegungsauswertung nicht nur
verboten, sondern **unmöglich** — und das ist ein ganz anderes Argument als ein
Versprechen.

Dazu:

- Standort nur bei **laufendem Auftrag**. Nie davor, nie danach.
- **Sichtbar**, solange geprüft wird. Kein stiller Betrieb.
- Die Prüfungen mit dem Auftrag löschen, wenn er abgerechnet ist.

`j-ten` sah eine `spur`-Tabelle mit Lat/Lon vor, standardmässig deaktiviert.
Ich würde sie hier **ganz weglassen**. Sie wird für nichts gebraucht, was das
Projekt erreichen will.

**Offene Frage: welches Land?** Die Schlagnamen in der Kürbis-App (Illnau,
Uster) deuten auf die Schweiz — dann gilt Art. 26 ArGV 3: Überwachungssysteme
zur Verhaltensüberwachung am Arbeitsplatz sind *untersagt*; sind sie aus anderen
Gründen nötig, müssen sie so gestaltet sein, dass sie die Arbeitnehmer nicht
beeinträchtigen. Das obige Design ist genau darauf zugeschnitten. In AT/DE
sieht es anders, aber nicht lockerer aus. **Das ist keine Frage für mich,
sondern eine für jemanden, der dafür geradestehen kann** — aber die Antwort
kostet nichts, wenn man von Anfang an keine Koordinaten speichert.

---

## 6. Die Kostenrechnung — und der fehlende Nenner

Stunden allein beantworten die Frage nicht. „Satz 14 hat 47 Stunden gekostet"
ist ohne Bezug nichts wert. Es braucht:

```
Arbeitskosten(Satz) = Handstunden × Stundensatz
                    + Σ Maschinenstunden × Maschinensatz

Kosten je m²    = Arbeitskosten ÷ belegte Fläche      ← aus der Belegung
Kosten je Stück = Arbeitskosten ÷ Erntemenge          ← woher?
```

**Die Erntemenge ist der Nenner, und es gibt ihn noch nicht.** Du hast „ernten"
als Arbeitsschritt genannt — dann muss ein Ernte-Auftrag beim Abschliessen
**auch die Menge** erfassen (Kisten, kg, Stück). Sonst gibt es am Ende Stunden
ohne Bezugsgrösse, und „was kostet ein Kopf Salat" bleibt unbeantwortet. Das
ist eine kleine Ergänzung an genau einer Stelle — aber wenn sie fehlt, fehlt
sie für die ganze Saison und lässt sich nicht nachholen.

**Stundensatz: einer für den Betrieb, keine Einzellöhne.** Ein
Vollkosten-Durchschnitt inklusive Lohnnebenkosten reicht für die Frage
vollkommen. Individuelle Löhne in der App hätten einen ganz anderen
Schutzbedarf und brächten für die Kostenfrage fast nichts.

**Maschinen nicht vergessen.** Fräsen, Pflanzmaschine, Hackgerät — eine
Traktorstunde kostet ein Vielfaches einer Handstunde. Wenn nur Handarbeit
erfasst wird, sieht der maschinell bearbeitete Satz künstlich billig aus.
→ Auftrag optional mit Maschine und Maschinenstunden.

---

## 7. Der kalte Start — mitten in der Saison

Du hast es selbst benannt: mitten in einem Satz anzufangen ist komisch.

**Lösung: Jeder Satz bekommt ein `erfassungsbeginn`-Datum.** (Die Kürbis-App hat
dafür eine eigene Migration — dasselbe Problem, dieselbe Antwort.) Und dann die
Ehrlichkeitsregeln, in deinem Stil:

- Ein Satz, dessen Erfassung nach dem Pflanzdatum begann, ist **unvollständig**
  und wird in der Auswertung so gekennzeichnet.
- Unvollständige Sätze gehen **nicht** in einen Kultur-Durchschnitt ein — oder
  nur getrennt ausgewiesen.
- Optional darf man Stunden **nachschätzen** („wir haben vorher ca. 20 h
  gehackt"). Dann aber als *geschätzt* markiert und nie mit gemessenen Stunden
  in eine Zahl vermengt.
- Erst ab einer Mindestzahl vollständiger Sätze zeigt die App überhaupt einen
  Kultur-Wert.

Praktische Folge: Die erste Saison liefert vor allem vollständige Sätze aus der
zweiten Jahreshälfte. Das ist in Ordnung, wenn man es dazuschreibt — und
wertlos, wenn nicht.

---

## 8. Die Admin-Oberfläche

**Dashboard = Belegungskarte.** Alle laufenden Sätze: was steht wo, seit wann,
wieviele Stunden bisher. Filter nach Kultur oder Feld, wie von dir beschrieben.

**Satz aufklappen → die Historie.** Alle Aufträge chronologisch, Stunden je
Arbeitsart, Summe, h/m², Kosten. Jede Zahl aufklappbar bis zu den einzelnen
Aufträgen — so wie es die Kürbis-App macht.

**Unten der rote Knopf: „vollständig geerntet".** Mit Datum, **rückdatierbar** —
du hast den Fall genau beschrieben: man sieht den Satz im Dashboard und weiss,
der wurde letzte Woche geerntet. Schliesst die Belegung, schiebt den Satz ins
Archiv. Zweiter Grund dafür: „umgebrochen / nicht geerntet" — auch das ist ein
Ergebnis, und zwar ein teures.

**Archiv = der eigentliche Wert.** Erst hier steht, wofür das alles gebaut wird:
Salat KW14 gegen Salat KW20 gegen Salat aus dem Vorjahr. Der Nutzen kommt
verzögert — im ersten Jahr sammelt man, im zweiten entscheidet man. Das sollte
man wissen, bevor man anfängt.

**Und die Nachtragsliste:** offene Aufträge, fehlende Erntemengen, Sätze ohne
Belegung. Die langweiligste Seite und die, die das System am Leben hält.

---

## 9. Datenmodell — Skizze

Noch kein SQL, nur die Form. Fett = neu gegenüber `j-ten`.

```
feld          id, name, code, notiz, aktiv
schiff        id, feld_id, name, flaeche_m2, mittelpunkt_lat/lon, radius_m
              -- trägt KEINE Kultur mehr

kultur        id, name
sorte         id, kultur_id, name

satz          id, kultur_id, sorte_id, bezeichnung,
              aussaat_datum, pflanz_datum, herkunft(gesät|gepflanzt|unbekannt),
              erfassungsbeginn,                      -- §7
              status(laufend|geerntet|umgebrochen), abschluss_datum

belegung      id, satz_id, schiff_id, von_datum, bis_datum,
              flaeche_m2, anteil                     -- §2, das Herzstück

arbeitsart    id, name, symbol, erfasst_menge, erwartete_dauer_h
              -- hacken, jäten, säen, pflanzen, ernten, vlies, ... konfigurierbar

person        id, name, kuerzel, aktiv, rolle

auftrag       id, satz_id, arbeitsart_id, eroeffnet_von,
              start_ts, ende_ts, status, notiz, klient_id, erfasst_ts
auftrag_schiff  auftrag_id, schiff_id                -- mehrere möglich, §3

teilnahme     id, auftrag_id, person_id,
              start_ts, ende_ts, pause_s,
              beigetreten_wie(selbst|mitgenommen), klient_id
              -- DIE Stundenquelle

ernte         id, auftrag_id, satz_id, menge, einheit, ts    -- §6, der Nenner
maschine      id, name, kosten_pro_h
auftrag_maschine  auftrag_id, maschine_id, stunden

standort_pruefung  id, auftrag_id, ts, am_feld, quelle       -- §5, KEIN lat/lon
nachtrag      id, satz_id, arbeitsart_id, geschaetzte_stunden, grund   -- §7

einstellung   schluessel, wert      -- stundensatz, radius_m, ...
protokoll     ts, akteur, aktion, detail
```

Was daran leicht übersehen wird:

- **`teilnahme` trägt eigene Zeiten.** Nicht „5 Arbeiter × 2 h" am Auftrag —
  sonst kann niemand früher gehen, ohne die Zahlen zu verfälschen.
- **`auftrag` hängt am Satz, nicht am Schiff.** Das Schiff steht daneben.
- **Belegungen dürfen sich nicht überlappen** (gleiches Schiff, gleicher
  Zeitraum, Anteile > 100 %). Das muss die Datenbank prüfen, nicht die
  Oberfläche.

---

## 10. Technik

**Vorschlag: derselbe Stack wie die Kürbis-App.** React 19 + Vite + TypeScript,
Supabase als Datenbank, Cloudflare Pages als Hosting, €0 auf den Gratis-Stufen.

Gründe: Er ist in genau dieser Situation erprobt — zwei Oberflächen, Arbeiter
ohne Passwort über QR-Zugang, Mehrsprachigkeit, Betriebsleiter-Auswertung. Die
Zugriffstrennung Admin/Arbeiter erledigen Supabase-Policies auf Datenbankebene,
nicht die Oberfläche. Und du kennst ihn bereits, inklusive Einrichtung, Migrationen
und Tests.

**Eigenes Repo, keine Erweiterung der Kürbis-App.** Anderer Gegenstand
(Feldarbeit statt Lagerverluste), anderer Lebenszyklus. Gemeinsame Stammdaten
könnte man später exportieren — hineinbauen würde beide Projekte schwerfällig
machen.

**Was aus `j-ten` übernommen wird:** die Hierarchie Feld → Schiff, die
`klient_id`-Idempotenz, das Protokoll, die deutschen Bezeichner. Was nicht:
Linien und Bonituren (das ist Leistungsmessung, §1), die Kultur am Schiff (§2),
die GPS-Spur (§5).

**Mehrsprachigkeit von Anfang an**, nicht nachgerüstet — `j-ten` nennt es als
offene Grundsatzfrage, die Kürbis-App hat es gelöst. Die Arbeiter-Oberfläche
sollte so weit wie möglich mit Symbolen und Farben auskommen.

---

## 11. Wie man es angeht

Die Reihenfolge ist nicht beliebig — jeder Schritt macht den nächsten billiger.

**1 · Begriffe festnageln. Auf Papier, mit dem Betrieb. Nichts programmieren.**
Welche Arbeitsarten gibt es wirklich? Heisst es bei euch Satz oder anders? Wie
viele Schiffe gibt es? Ein halber Tag, der später Wochen spart.

**2 · Stammdaten aufnehmen.** Felder, Schiffe mit Fläche und ungefährem
Mittelpunkt, Personen, Arbeitsarten. Eine Tabelle genügt. Ohne die ist auch die
schönste App leer.

**3 · Den Ablauf durchspielen, bevor er existiert.** Papierkarten, im Feld, mit
den Leuten, die es benutzen sollen. Wie lange dauert das Eröffnen? Wo stockt
es? Was ist unklar? **Das ist der Schritt, den man überspringen möchte, und der
am meisten spart.** Jede Änderung kostet hier fünf Minuten und später drei Tage.

**4 · Datenmodell schreiben** — Belegung zuerst, mit den Überlappungsprüfungen.

**5 · Die Arbeiter-Oberfläche bauen. Zuerst. Nur sie.** Eröffnen, beitreten,
abschliessen, offline. Ohne sie entstehen keine Daten, und ohne Daten ist die
Admin-Oberfläche eine leere Seite. Umgekehrt kann man gesammelte Daten
jederzeit noch auswerten.

**6 · Echt einsetzen, an einer Kultur, eine Woche.** Nicht an allen. Was dabei
auffällt, findet man anders nicht.

**7 · Admin-Oberfläche** — Dashboard, Satz-Historie, Nachtragsliste.

**8 · Kostenrechnung** — erst wenn genug Stunden da sind, dass die Zahlen nicht
lügen.

**9 · GPS, Stufe 1** (§5) — ganz zum Schluss. Bis dahin weiss man, wie oft das
Ausloggen wirklich vergessen wird, und kann entscheiden, ob es Stufe 2 braucht.

### Was das Projekt scheitern lässt

Nicht die Technik. Drei Dinge:

- **Das Eröffnen dauert zu lang** → wird nicht gemacht → keine Daten.
- **Die Leute ohne Handy fehlen in den Zahlen** → Stunden zu niedrig → die
  Kostenrechnung ist falsch, und niemand sieht es.
- **Der Nutzen kommt erst nach einer Saison** → vorher hält niemand durch, wenn
  nicht klar ist, wofür.

Gegen das dritte hilft, schon in der ersten Saison etwas zurückzugeben, das
sofort nützt: das Dashboard „was steht wo, seit wann" ist auch ohne jede
Kostenrechnung brauchbar — und es ist nebenbei die Belegung, die man ohnehin
braucht.

# Ausbau zum Vollsystem

Was es bedeuten würde, ab nächster Saison die ganze Arbeitszeit laufend zu
erfassen — mit Fahrzeiten, mit App im Hintergrund, mit Belegung jedes Schiffs.

Stand: 2026-09-21. Noch nichts gebaut. Das hier ist das Durchdenken, um das
gebeten wurde, nicht der Bauplan.

---

## 1. Was sich grundsätzlich ändert

Bisher **erklären** die Leute, was sie getan haben: Auftrag eröffnen,
beitreten, abschliessen. Die Stunden entstehen aus Aussagen.

Neu soll die App **beobachten**: Sie läuft den Tag über mit, weiss, wer wo ist,
erkennt Fahrt und Feldarbeit. Die Stunden entstehen aus Messungen.

Das ist nicht dasselbe Projekt etwas grösser. Es ist ein anderes Projekt, und
zwar in drei Richtungen gleichzeitig:

| | bisher | neu |
|---|---|---|
| **Technisch** | Webseite, läuft überall | native App, zwingend — im Browser gibt es keinen Hintergrundstandort |
| **Rechtlich** | keine Standortdaten, also keine Frage | laufende Ortung von Arbeitnehmern: der heikelste Datentyp überhaupt |
| **Sozial** | ein Werkzeug, das die Leute bedienen | ein System, das über sie läuft — und das sie umgehen können |

Die dritte Richtung entscheidet, ob es funktioniert. Die ersten beiden sind
nur Arbeit.

---

## 2. Der eigentliche Gewinn heisst Restzeit

Erst die Frage, ob sich der Aufwand lohnt. Was bekommt man durch laufende
Erfassung, was die Erklär-Variante nicht schon liefert?

Die Erklär-Variante liefert: Stunden je Satz je Arbeitsart. Gut genug für „wie
lange hacken wir Salat".

Die laufende Erfassung liefert zusätzlich drei Dinge:

1. **Keine vergessenen Abschlüsse.** Nett, aber die Nachtragsliste löst das
   auch.
2. **Fahrzeit**, automatisch. Die kriegt man sonst nur durch Tippen, und dafür
   tippt niemand.
3. **Die Restzeit.** Und das ist der eigentliche Grund.

Die Restzeit ist die bezahlte Zeit, die auf keinem Auftrag steht: Rüsten,
Werkstatt, Material holen, Warten, Suchen, Umdisponieren, Besprechung,
Maschine reparieren, das falsche Werkzeug am falschen Feld. Wer nur Aufträge
erfasst, erfährt, wie sich die **erklärte** Zeit verteilt — aber nicht, dass
ein Fünftel des Tages gar nicht darin vorkommt.

> Wenn ihr wissen wollt, wo die Arbeitszeit hingeht, ist die Restzeit
> vermutlich die Antwort. Nicht, ob Hacken 2,4 oder 2,8 Stunden je Are kostet.

**Und hier ein Zwischenweg, der viel billiger ist:** Die Restzeit bekommt man
schon aus *Dienst an / Dienst aus* plus den erklärten Aufträgen. Bezahlte Zeit
minus erklärte Zeit ist die Restzeit — ohne einen einzigen Standort. Das ist
eine Knopfdruck-Funktion, keine native App, und es beantwortet die grösste
Frage sofort.

Was dabei fehlt, ist die **Aufteilung** der Restzeit: Ihr seht, dass 22 % nicht
zugeordnet sind, aber nicht, ob das Fahrt, Rüsten oder Warten war. Dafür
braucht es mehr. Die Frage ist, ob diese Aufteilung den Sprung wert ist — und
das weiss man erst, wenn man die Zahl einmal gesehen hat.

Deshalb steht in §14 die Reihenfolge so, wie sie dort steht.

---

## 3. Was technisch nötig wird

### Die native App ist nicht mehr verhandelbar

Eine Webseite bekommt im Hintergrund keinen Standort — das war schon im
Konzept §5 der Befund und gilt unverändert. Für eine Erfassung, die von 6 bis
20 Uhr mitläuft, führt kein Weg an einer echten App vorbei.

Was das konkret heisst:

**Android** — Hintergrundstandort verlangt einen Vordergrunddienst mit
dauerhafter Benachrichtigung; die Berechtigung dafür wird seit Android 10 in
einem eigenen, zweiten Schritt erteilt („immer erlauben"), und die
Akku-Optimierung muss für die App ausgehängt werden, sonst schläft sie
mittags ein. Verteilung: APK direkt aufs Gerät genügt, kein Store nötig.

**iOS** — verlangt die Berechtigung *Immer* und einen Eintrag, warum die App
Hintergrundstandort braucht. Verteilung nur über Apple: Developer Program
(~100 USD/Jahr), und selbst für den internen Gebrauch läuft es praktisch über
TestFlight, mit Prüfung durch Apple und Builds, die nach 90 Tagen ablaufen.
iOS erinnert die Leute ausserdem von sich aus regelmässig daran, dass die App
im Hintergrund ortet — und bietet ihnen an, das abzuschalten.

**Akku.** Dauerhafte, genaue Ortung leert ein Handy in wenigen Stunden. Das
ist kein Randproblem: Wer um 14 Uhr ein totes Handy hat, fehlt den halben
Nachmittag in den Daten, und niemand merkt es. Was hilft: grobe Genauigkeit
statt feiner, Stichproben im Minutentakt statt laufend, und vor allem
**Bewegungserkennung statt Ortung** — das Betriebssystem sagt „steht / geht /
im Fahrzeug", und das kostet fast nichts. Mehr dazu in §5.

*Diese Plattform-Details ändern sich; vor dem Bauen gegen den aktuellen Stand
prüfen. Die Richtung ist seit Jahren stabil, die Details nicht.*

### Firmenhandys oder private Handys — das ist die teuerste Einzelentscheidung

Bei **privaten** Geräten bittet ihr die Leute, auf ihrem eigenen Telefon eine
App zu installieren, ihr dauerhaft den Standort zu geben, die
Akku-Optimierung abzuschalten und das Gerät den Tag über geladen zu halten.
Das ist eine grosse Bitte. Wer nein sagt, darf deswegen keinen Nachteil haben
— und damit habt ihr ohnehin zwei Wege zu bauen.

Bei **Firmengeräten** fällt das meiste weg: einheitliche Geräte, Android
genügt (keine Apple-Gebühr), Akku ist eure Sache, und die rechtliche Lage ist
deutlich entspannter, weil kein privates Gerät betroffen ist. Ein Satz
einfacher Android-Handys für die Gruppen — nicht für jede Person, sondern für
jede **Gruppe** plus die Vorarbeiter — ist vermutlich die Variante, die das
Projekt überhaupt machbar macht.

Das verschiebt allerdings die Idee aus §6: Wenn nicht jeder ein Gerät trägt,
kann die App auch nicht sehen, wer alles am Feld steht. Dann bleibt es beim
Vorarbeiter, der die Gruppe zusammenstellt — was funktioniert, aber die
GPS-Erkennung überflüssig macht. **Diese beiden Entscheidungen hängen
zusammen und müssen gemeinsam getroffen werden.**

---

## 4. Der Entwurf, der das Rechtliche einfach macht: Zustand statt Ort

Hier liegt der wichtigste Vorschlag in diesem Dokument.

Die naheliegende Bauweise wäre: Jedes Gerät schickt alle paar Minuten seine
Koordinaten an den Server, der Server rechnet aus, wer wo war. Damit liegt
auf dem Server eine **Bewegungsspur jedes Arbeitnehmers über die ganze
Saison**. Alles, was ihr danach über Zweckbindung und Zugriffsrechte sagt, ist
ein Versprechen — die Daten könnten jederzeit anders verwendet werden, und
jeder Prüfer wird genau das fragen.

**Die Alternative: Der Abgleich passiert auf dem Gerät.** Das Gerät kennt die
Umrisse eurer Felder (das sind Betriebsdaten, keine Personendaten). Es
vergleicht den eigenen Standort damit und schickt nur das Ergebnis:

```
was das Gerät weiss          was den Server erreicht
────────────────────────     ───────────────────────
47.4213 N, 8.7291 O     →    "auf Feld Bachacker"
47.4198 N, 8.7340 O     →    "unterwegs"
47.3901 N, 8.5512 O     →    "ausserhalb"
```

Kein Breitengrad, kein Längengrad, keine Spur. Wer nicht auf einem
Betriebsgelände ist, erzeugt genau ein Wort: *ausserhalb*. Ob das der
Supermarkt, der Arzt oder das eigene Zuhause ist, entsteht nie als Datum —
nicht „wird nicht gespeichert", sondern **entsteht nicht**.

Das ändert die rechtliche Frage von Grund auf: Was am Ende in der Datenbank
liegt, ist funktional ein Stundenrapport. Eine Bewegungsauswertung ist nicht
verboten, sondern unmöglich.

Preis: Wenn jemand sagt „die App hat mich falsch auf dem Oberfeld gesehen",
könnt ihr das nicht nachvollziehen. Gegenmittel, und ein gutes:

> **Die Rohspur bleibt auf dem Gerät, sichtbar nur für die Person selbst,
> sieben Tage lang.** Sie kann nachsehen, warum die App etwas falsch erkannt
> hat, und es korrigieren. Der Betrieb sieht sie nie.

Der Arbeiter sieht über sich mehr als der Chef. Das kostet nichts und ist
genau die Machtverteilung, die so ein System tragbar macht.

---

## 5. Fahrzeit — drei Fragen, die nicht dieselbe sind

„Wenn sie im Auto hocken, zählt das als Autozeit." Dahinter stecken drei
getrennte Probleme.

### Erkennen

Nicht über Geschwindigkeit. Ein Traktor beim Hacken fährt 3–5 km/h, und das
ist Arbeit, keine Fahrt. Derselbe Traktor auf der Strasse ist Fahrt. Ein
Lieferwagen im Stau steht.

Was funktioniert, ist die **Bewegungserkennung des Betriebssystems** — sie
unterscheidet stehen / gehen / im Fahrzeug, kostet fast keinen Akku und
braucht **keinen Standort**. Kombiniert mit „bin ich innerhalb eines
Feldumrisses?" aus §4 ergibt das:

| im Fahrzeug | innerhalb eines Feldes | ⇒ |
|---|---|---|
| ja | ja | Maschinenarbeit |
| ja | nein | Fahrt |
| nein | ja | Handarbeit |
| nein | nein | Hof, Pause, Rüsten |

Das ist robust, sparsam und verrät nichts über den Weg.

### Zuordnen

Fahrzeit muss irgendwohin. Wenn eine Gruppe 25 Minuten zum Bachacker fährt,
um Fenchel zu jäten, gehören die 25 Minuten zum Fenchel — sonst ist das
abgelegene Feld künstlich billig, und genau das wollt ihr ja wissen.

Wird an einem Tag zwischen drei Feldern gependelt, braucht es eine Regel.
Zwei taugen:

- **Fahrt gehört zum nächsten Halt.** Einfach, nachvollziehbar, in fast allen
  Fällen richtig.
- **Anteilig nach Aufenthaltsdauer.** Genauer bei Rundfahrten, schwerer zu
  erklären.

*Vorschlag: zum nächsten Halt.* Die Heimfahrt am Abend gehört zum letzten
Feld. Eine Regel, die jeder im Kopf nachrechnen kann, wird akzeptiert; eine
genauere, die niemand nachvollzieht, nicht.

### Bezahlen

**Das ist keine technische Frage.** Ob die Fahrt vom Hof zum Feld bezahlte
Arbeitszeit ist, steht im Arbeitsvertrag bzw. im kantonalen
Normalarbeitsvertrag, nicht in der App. Der Anfahrtsweg von zuhause zum Hof
ist in aller Regel keine Arbeitszeit.

Für die **Kostenrechnung** ist das fast egal — die Fahrt kostet den Betrieb
so oder so. Für den **Lohn** ist es nicht egal. Die App sollte darum beides
getrennt ausweisen können und die Regel als Einstellung führen, nicht als
Annahme im Code.

Und: Die Auto-Einschaltung um 6 Uhr würde die Fahrt von zuhause zum Hof
mitschneiden — private Zeit, privater Ort. Siehe §8.

---

## 6. „Wer ist hier?" — und was GPS nicht kann

Die Idee: Der Vorarbeiter sagt „wir hacken hier", die App schaut, wer sonst
noch da steht, und fragt „stimmt das, sieben Personen?".

Das ist gut gedacht, weil ein Mensch bestätigt. Drei Einschränkungen:

**GPS kann kein Schiff auflösen.** Ein Handy ist unter freiem Himmel auf
wenige Meter genau, unter Bäumen und neben Gebäuden schlechter. Ein Schiff ist
1,5 bis 3 Meter breit. Die App kann also sagen „auf dem Bachacker" — sie kann
nicht sagen „auf Schiff 3". **Die Zuordnung zum Schiff muss immer aus der
Ansage des Vorarbeiters kommen, nie aus dem Standort.** Das ist keine
Schwäche der Umsetzung, das ist die Physik.

**Wer nicht antwortet, fehlt.** Handy im Auto, Akku leer, Berechtigung
entzogen, Person ohne Gerät. Die vorgeschlagene Liste darf deshalb nie
abschliessend sein: Der Vorarbeiter muss Leute **dazunehmen** und
**wegnehmen** können, und was er bestätigt, gilt — nicht, was die App gesehen
hat.

**Das ist eine Standortabfrage über andere Menschen**, und die einzige im
ganzen System. Sie gehört eng eingefasst:

- nur im Moment des Eröffnens, nicht als laufende Anzeige;
- nur Namen, nur „auf diesem Feld ja/nein", kein Ort, keine Entfernung;
- nur Personen, die gerade im Dienst sind;
- nur für Vorarbeiter, und **jede Abfrage wird protokolliert**.

Ohne die letzte Zeile wird daraus über den Sommer eine Gewohnheit: mal
nachschauen, wo einer steckt. Mit ihr bleibt es, was es sein soll.

---

## 7. Die Saatmaschine, die die Belegung fortschreibt

Die Idee — wer sät, schliesst damit die alte Kultur ab und trägt die neue ein
— ist der beste Gedanke in eurem Ausbau. Sie führt die Buchhaltung als
Nebenprodukt der Arbeit, statt sie jemandem aufzuhalsen. Ohne so etwas wird
die Belegung nach vier Wochen falsch sein, und dann hängen alle Stunden an
den falschen Sätzen.

Zwei Korrekturen:

**Säen ist zu spät.** Vor der Saat kommt räumen, fräsen, düngen, Beet formen.
Wenn erst die Saatmaschine die Belegung wechselt, sind diese Stunden noch der
alten Kultur zugeschlagen. Der Auslöser muss allgemeiner sein: **Der erste
Arbeitsgang, der auf einem Schiff einen neuen Satz nennt, schliesst den
bisherigen.** Damit hängt es nicht an der Saat.

Daraus folgt eine Zurechnungsregel, die ihr festlegen müsst:

> **Räumen gehört zum alten Satz** (es sind die Kosten, ihn fertig zu machen).
> **Bodenbearbeitung und Beet machen gehören zum neuen.**

Sauber, merkbar, und sie verteilt die Wendezeit nicht willkürlich.

**Nicht automatisch, sondern vorgeschlagen.** Ein stiller automatischer
Wechsel auf falscher Grundlage zerstört Geschichte, ohne dass es jemand merkt
— und das ist der einzige Schaden in diesem System, der sich nicht mehr
reparieren lässt. Also:

> *Auf Schiff 3 stand Kopfsalat KW31. Abgeräumt?*
> **[ Ja, am 14.9. ]  [ Nein, ich bin woanders ]**

Ein Tipp. Aber ein menschlicher.

---

## 8. Kontrolle bei den Arbeitern — konkret

Ihr habt ein/aus, 6 Uhr automatisch an, 20 Uhr automatisch aus, und die
Automatik selbst abschaltbar. Das ist die richtige Richtung. Was fehlt:

**Die Automatik sollte am Ort hängen, nicht an der Uhr.** Um 6 Uhr
einzuschalten heisst, die Fahrt von zuhause zum Hof mitzuschneiden — private
Zeit, privater Weg. Besser: Die Erfassung springt an, **wenn jemand auf dem
Betriebsgelände ankommt**, und aus, wenn er es verlässt. Die Uhrzeiten bleiben
als Rahmen darum: Vor 5:30 und nach 20:30 schaut die App gar nicht hin, egal
wo jemand ist. Ort *und* Zeitfenster, nicht Ort *oder* Zeit.

**Eine Pausentaste, die man nicht übersieht.** Sonst landet das Mittagessen in
den Daten, und schlimmer: der Gang zum Arzt.

**Sichtbarer Zustand, immer.** Auf Android erzwingt das System ohnehin eine
dauerhafte Benachrichtigung. Dazu in der App gross und eindeutig: *Erfassung
läuft* / *Erfassung aus*. Keine stille Aufzeichnung, nie.

**Der Tagesabschluss ist das Wichtigste.** Am Ende des Tages zeigt die App,
was sie gesehen hat:

    06:52 – 07:14   Fahrt                        22 min
    07:14 – 11:30   Bachacker · Fenchel · jäten   4 h 16
    11:30 – 12:05   Pause                         35 min
    12:05 – 12:20   Fahrt                         15 min
    12:20 – 16:40   Hausfeld · Salat · hacken     4 h 20
    16:40 – 17:05   Hof                           25 min
    ─────────────────────────────────────────────────────
    Nicht zugeordnet                              18 min

    [ Stimmt so ]   [ Ändern ]

**Nichts geht in die Abrechnung, bevor ein Mensch es bestätigt hat.** Das ist
zugleich die beste Datenqualitätsmassnahme im ganzen System — eine Messung,
die täglich von dem geprüft wird, den sie betrifft, ist besser als jede
Automatik.

**Löschen und korrigieren** muss möglich sein, mit Grund, und die Korrektur
muss sichtbar bleiben (nicht die alte Zahl heimlich überschreiben).

**Alles über sich selbst sehen und mitnehmen können.** Eine Exportfunktion,
die die eigenen Daten als Datei ausgibt.

**Und der Ausstieg muss echt sein.** Wer die App nicht will, bekommt einen
Papier-Stundenrapport oder wird vom Vorarbeiter eingetragen — ohne Nachteil,
ohne Gespräch, ohne dass es jemandem auffällt. Wenn das nicht stimmt, ist die
Einwilligung keine, und dann trägt das ganze System rechtlich nicht. Mehr
dazu in §10.

---

## 9. Was der Betrieb bewusst nicht bekommt

Genauso wichtig wie die Funktionen ist die Liste dessen, was das System nicht
kann. Sie gehört ins Programm, nicht in eine Richtlinie:

- **Keine Rangliste** nach Stunden, Tempo oder Fläche je Person.
- **Kein Verlauf** „wo war X letzte Woche".
- **Keine Pünktlichkeitsauswertung** je Person.
- **Keine Live-Karte.** Die einzige Ausnahme ist die eng eingefasste Abfrage
  aus §6.
- **Keine Koordinaten**, nirgends, nie (§4).

Personenstunden existieren — man muss Stunden ja zählen, und der
Tagesabschluss zeigt sie der Person selbst. Aber die Auswertung des Betriebs
geht über **Sätze, Arbeitsarten und Felder**, nicht über Menschen. Wer später
eine Personenauswertung will, soll sie bewusst dazubauen müssen und dabei
merken, dass er etwas anderes tut.

---

## 10. Recht — was ich sagen kann und was nicht

**Ich bin nicht eure Rechtsberatung, und das hier ersetzt keine.** Bei
laufender Ortung von Arbeitnehmern ist das keine Floskel: Das ist der Bereich,
in dem ein Fehler nicht „wir bauen das nächste Saison um" heisst.

Was ich mit einiger Sicherheit sagen kann:

**Art. 328b OR** ist der zentrale Hebel: Der Arbeitgeber darf nur Daten
bearbeiten, die die Eignung für das Arbeitsverhältnis betreffen oder zur
Durchführung des Arbeitsvertrags nötig sind. Arbeitszeit zu erfassen fällt
klar darunter. Ob der **Ort** dazugehört, ist die Frage — und genau deshalb
ist der Entwurf aus §4 so gebaut, dass am Ende Arbeitszeit gespeichert ist und
nicht Ort.

**Das revidierte DSG** verlangt Zweckbindung, Verhältnismässigkeit,
Erkennbarkeit und Datensicherheit, ein Bearbeitungsverzeichnis, und bei
Bearbeitungen mit hohem Risiko eine **Datenschutz-Folgenabschätzung**. Die
systematische Erfassung von Arbeitnehmern ist ein Lehrbuchfall dafür. Diese
Abschätzung ist keine Schikane — sie zwingt genau zu den Fragen, die dieses
Dokument stellt, und wenn ihr sie ernsthaft macht, habt ihr die Begründung
gleich schriftlich.

**Einwilligung ist die schwache Grundlage.** Im Arbeitsverhältnis gilt sie
wegen des Abhängigkeitsverhältnisses oft als nicht frei erteilt. Ihr schreibt
„mit ihrer Einwilligung" — darauf allein würde ich das System nicht stellen.
Tragfähiger ist: betriebliche Notwendigkeit nach Art. 328b OR, sauber
begründet und dokumentiert, **plus** eine verständliche Information aller
Betroffenen, **plus** ein echter, folgenloser Ausstieg (§8). Die Einwilligung
kommt obendrauf, sie trägt nicht allein.

Was **geprüft werden muss**, weil ich es nicht sicher weiss:

1. **Gilt das Arbeitsgesetz bei euch überhaupt?** Landwirtschaftliche Betriebe
   sind vom ArG weitgehend ausgenommen; stattdessen greift der kantonale
   Normalarbeitsvertrag Landwirtschaft. Das ist wichtig, weil an dieser Frage
   sowohl die Pflicht zur Arbeitszeiterfassung hängt als auch **Art. 26 ArGV 3**,
   der Überwachungssysteme zur Verhaltensüberwachung ausdrücklich verbietet.
   Selbst wenn er formal nicht gilt: Die Aufsichtsbehörden und Gerichte prüfen
   über Art. 328b OR und das DSG nach demselben Massstab. Baut so, als würde
   er gelten.
2. **Was verlangt euer kantonaler NAV** zur Stundenkontrolle? Möglicherweise
   erfüllt ihr damit gleich eine Pflicht, die ihr ohnehin habt — das ist ein
   gutes Argument, innen wie aussen.
3. **Wie sind eure Leute angestellt?** Festangestellte, Saisonniers,
   Temporärbüro? Bei Temporären ist der Arbeitgeber ein anderer, und dann
   erfasst ihr Daten über fremde Arbeitnehmer.

Und einmal grundsätzlich, weil es der Punkt ist, an dem so etwas kippt:
**Der Zweck entscheidet, und der Zweck muss sich im Bau zeigen.** Ein System,
das Verhalten überwachen *soll*, ist unzulässig. Ein System, das Kosten
rechnet und dabei zwangsläufig Zeiten erfasst, ist zulässig, wenn es
verhältnismässig gebaut ist. Der Unterschied steht nicht in der Absicht — er
steht in der Datenbank. §4 und §9 sind genau dieser Unterschied.

---

## 11. Was das kostet

Grössenordnungen, damit die Entscheidung nicht im Nebel fällt:

| Posten | einmalig | laufend |
|---|---|---|
| Native App, zwei Plattformen | deutlich mehr als die Webseite | Pflege bei jedem OS-Wechsel |
| Apple Developer Program | — | ~100 USD/Jahr, nur wenn iPhones dabei sind |
| Firmenhandys (einfache Android-Geräte je Gruppe) | überschaubar, siehe §3 | Abo, Ersatz, Ladegeräte |
| Server/Datenbank | klein | klein — ihr speichert Zustände, keine Spuren |
| Datenschutz-Folgenabschätzung, Information, Reglement | einmalig, mit Fachperson | Nachführen |
| **Betreuung während der Saison** | — | **der grösste Posten, und der am leichtesten übersehene** |

Der letzte Punkt ist ernst gemeint: Ein System, das mitläuft, braucht jemanden,
der die Nachträge anschaut, neue Leute anlegt, Geräte ersetzt und Fragen
beantwortet. Wenn das niemand macht, verrottet die Datenqualität innerhalb
weniger Wochen — und man merkt es erst am Jahresende, wenn die Auswertung
Unsinn zeigt.

---

## 12. Was am Ende herauskommt

Die Kostenrechnung wird erst mit Fahrt- und Restzeit vollständig. Sie sieht
dann so aus:

```
Direkte Zeit je Satz        aus den Aufträgen
+ zugeteilte Fahrzeit       nach der Regel aus §5
──────────────────────────
= Einzelstunden je Satz

Restzeit (Hof, Rüsten, Warten, Werkstatt)
  → nicht einem Satz zurechenbar
  → als Zuschlag auf die Einzelstunden verteilt

Kosten je Satz = (Einzelstunden × Stundensatz) × (1 + Zuschlagssatz)
               + Maschinenstunden × Maschinensatz

Kosten je Are    = Kosten ÷ belegte Fläche
Kosten je Stück  = Kosten ÷ Erntemenge      ← der Nenner fehlt weiterhin
```

Drei Dinge dazu:

**Der Zuschlagssatz ist eine Entscheidung, keine Messung.** Restzeit gleich
über alle Stunden zu verteilen ist die einfachste und meist richtige Annahme.
Wer es genauer will, verteilt nach Fläche oder nach Kultur — dann muss man
aber begründen können, warum der Salat mehr Rüstzeit verursacht als der Lauch.

**Die Erntemenge fehlt immer noch.** Ohne sie bleibt „was kostet ein Kopf
Salat" unbeantwortet, egal wie genau die Zeit erfasst wird. Das ist nach wie
vor die kleinste Änderung mit der grössten Wirkung, und sie muss vor
Saisonbeginn drin sein.

**Maschinenstunden fehlen auch noch.** Mit Fahrzeit-Erkennung kommt ihr
näher dran — „im Fahrzeug, innerhalb eines Feldes" ist Maschinenarbeit —, aber
welche Maschine, weiss die App nicht. Das bleibt eine Ansage.

---

## 13. Was schiefgehen kann

Nach Schadenshöhe sortiert.

**Die Restzeit wird gegen Leute verwendet.** Das ist das Ende des Projekts,
und zwar endgültig. Ein einziges Gespräch der Sorte „du hattest gestern zwei
Stunden nicht zugeordnet" spricht sich in einer Woche herum, und danach liegen
die Handys im Auto. Dann habt ihr Daten, die aussehen wie Messungen und keine
sind — schlimmer als gar keine Daten, weil ihr danach entscheidet.

> **Legt fest, was ihr mit der Restzeit tut, bevor ihr einschaltet — und sagt
> es den Leuten.** Am besten: Sie wird nur aggregiert über den ganzen Betrieb
> angeschaut, nie je Person. Und schreibt es hin.

Die gute Nachricht, die man dabei erzählen kann: Die Restzeit zeigt fast immer
Organisation, nicht Menschen. Dass die Gruppe 40 Minuten auf den Vorarbeiter
wartet. Dass dreimal gefahren wird, wo einmal gereicht hätte. Dass das
Werkzeug am falschen Feld liegt. Das sind eure Probleme, nicht ihre — und wenn
das System die löst, merken es die Leute als Erste.

**Systematisch fehlende Leute.** Handy im Auto, Akku leer, Berechtigung
entzogen. Die Lücke ist nicht zufällig verteilt — sie trifft immer dieselben
Situationen. Gegenmittel: Der Vorarbeiter bestätigt die Gruppengrösse (§6),
und die Differenz zwischen bestätigter Zahl und erfassten Geräten wird
ausgewiesen, nicht versteckt.

**Falsche Präzision.** „4 h 16" sieht genauer aus als „etwa vier Stunden". Die
Auswertung muss dazusagen, worauf sie beruht, sonst wird über Unterschiede von
fünf Prozent diskutiert, die reines Rauschen sind.

**Die Belegung veraltet.** Ohne die Fortschreibung aus §7 stimmt nach einem
Monat nicht mehr, was wo steht — und dann hängen alle Stunden an den falschen
Sätzen, rückwirkend nicht reparierbar.

**Der automatische Start läuft im Privaten mit.** Siehe §8: Ort statt Uhr.

**Sprache.** Wer die Tagesbestätigung nicht lesen kann, bestätigt sie blind.
Dann ist die wichtigste Kontrolle im System nur noch ein Knopf.

**Personalwechsel.** Namen, Geräte, Einwilligungen, Ausstiege — über eine
Saison mit Saisonkräften ist das ein laufender Vorgang, kein Einrichtungsschritt.

---

## 14. Reihenfolge

Nicht alles auf einmal, und in dieser Ordnung, weil jeder Schritt den nächsten
billiger macht und weil ihr nach Schritt 3 vielleicht schon genug wisst.

**1 · Jetzt: die Belegung aufbauen.** Jedes Schiff, jede Fläche, was gerade
drauf steht, seit wann. Ohne Tracking, ohne App — notfalls auf Papier und
abends abgetippt. Das ist die Voraussetzung für alles andere, es kostet
kalendarisch am meisten, und es nützt euch sofort. **Damit könnt ihr diese
Woche anfangen.**

**2 · Rest dieser Saison: erklären üben.** Die bestehende Demo, echt
eingesetzt. Ihr lernt die Arbeitsarten, die Begriffe, wie lange was dauert und
wo der Vorarbeiter-Ablauf hakt. Kostet fast nichts und rettet später Wochen.

**3 · Dienst an / Dienst aus + Tagesbestätigung. Ohne Ortung.** Bezahlte Zeit
minus erklärte Zeit ist die Restzeit (§2). **Das ist der grösste Erkenntnis-
gewinn im ganzen Vorhaben, und er kostet weder native App noch Rechtsgutachten.**
Danach wisst ihr, ob sich der Rest lohnt.

**4 · Entscheiden: Firmenhandys oder private?** (§3) Diese Antwort bestimmt
alles Weitere, auch ob die GPS-Gruppenerkennung überhaupt Sinn hat.

**5 · Parallel: Recht und Information.** Folgenabschätzung, NAV prüfen,
Information der Leute schreiben, Ausstiegsweg festlegen. **Vor** dem Bauen,
nicht danach — die Antworten ändern den Entwurf.

**6 · Native App, kleinster Umfang:** Bewegungserkennung für Fahrt/Arbeit
(§5), noch ohne Ortung. Mit einer Gruppe eine Woche lang.

**7 · Geofence auf dem Gerät** (§4): automatischer Start/Stopp am
Betriebsgelände, Feldzuordnung, die „wer ist hier"-Abfrage.

**8 · Belegungsfortschreibung** (§7) und Erntemenge (§12).

**9 · Eine volle Saison sauber durchlaufen lassen.** Erst danach sind die
Kosten je Kultur belastbar — vorher sind es Zwischenstände.

---

## 15. Die eine Frage, die alles andere entscheidet

Nicht Android oder iOS. Nicht welches Framework.

> **Vertrauen eure Leute dem System genug, das Handy eingeschaltet in der
> Tasche zu lassen?**

Wenn ja, funktioniert auch eine halb fertige Umsetzung und ihr bekommt
brauchbare Zahlen. Wenn nein, funktioniert die beste Technik nicht, und ihr
bekommt Zahlen, die falsch sind, ohne dass es jemand sehen kann.

Alles in §4, §8 und §9 dient dieser einen Frage. Und die billigste Art, sie zu
beantworten, ist, sie zu stellen — vor dem Bauen, den Leuten, die es betrifft.

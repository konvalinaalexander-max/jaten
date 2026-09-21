# Offene Fragen

Nach Gewicht sortiert. Die ersten vier entscheiden über das Datenmodell oder
die Technologiewahl — die sollte man beantworten, **bevor** etwas gebaut wird.
Der Rest kann mitlaufen.

---

## Entscheidet über das Datenmodell

### 1 · Kann ein Schiff halbiert werden?

Liegen auf einem Schiff je zwei Sätze gleichzeitig (halb Salat, halb Kohlrabi)?

- **Nein** → Belegung wird einfach: ein Schiff, ein Satz, ein Zeitraum.
- **Ja** → es braucht einen Flächenanteil, und die Frage „auf welchem Satz
  arbeitest du?" ist beim Eröffnen nicht mehr durch die Belegung beantwortet.
  Ein Tipp mehr, jedes Mal.

Lieber jetzt wissen. Nachträglich einbauen heisst, alle Belegungen anzufassen.

### 2 · Geht ein Satz über mehrere Schiffe?

Vermutlich ja („Salat KW14" füllt drei Schiffe). Dann ist die Frage:

Ist das **ein** Satz auf drei Schiffen, oder **drei** Sätze? Die Antwort hängt
daran, ob ihr sie getrennt auswerten wollt — und ob sie am selben Tag gesät
wurden.

*Vorschlag: ein Satz, drei Belegungen. Feiner kann man immer noch schneiden,
zusammenfassen ist schwerer.*

### 3 · Was ist die Bezugsgrösse für „was kostet die Kultur"?

- Kosten **je m²** — braucht nur die Fläche, habt ihr.
- Kosten **je Stück/kg** — braucht die **Erntemenge**, und die gibt es noch
  nicht. Siehe Konzept §6.

Wenn es je Stück sein soll, muss der Ernte-Auftrag die Menge miterfassen. Das
ist eine kleine Ergänzung — aber wenn sie im Frühjahr fehlt, fehlt sie für die
ganze Saison.

### 4 · Welche Arbeitsarten gibt es wirklich?

Genannt: hacken, jäten, säen, ernten. Was fehlt? Pflanzen, Vlies auflegen und
abnehmen, bewässern, düngen, Beet vorbereiten, räumen, Kisten schleppen,
sortieren?

Und: Wie fein? Ist „jäten" eine Art, oder sind „Handjäten" und
„Maschinenhacken" getrennt? **Zu fein ist schlimmer als zu grob** — jede
zusätzliche Zeile ist eine Zeile, die auf dem nassen Display falsch getroffen
wird.

---

## Entscheidet über die Technologiewahl

### 5 · Wie oft wird das Ausloggen wirklich vergessen?

Davon hängt ab, ob es die native App braucht (Konzept §5). Jeden Tag? Einmal
die Woche? Wenn es selten ist, reicht die Nachtragsliste am Morgen, und das
ganze GPS-Thema schrumpft auf „Standort beim Antippen".

Ehrliche Einschätzung: **das weiss man erst, wenn das System läuft.** Deshalb
im Plan ganz hinten.

### 6 · Android, iOS oder beides?

Reines Android → eine native Hülle wäre später günstig zu haben (APK direkt
aufs Handy, keine Store-Gebühr). Sobald ein iPhone dabei ist → Apple Developer
Programm, ~100 €/Jahr, App-Review. Das verschiebt die Rechnung deutlich.

Nebenfrage: **Wessen Handys?** Betriebsgeräte oder private? Bei privaten Geräten
ist eine Standortberechtigung eine ganz andere Bitte — und jemand, der sie
ablehnt, darf deswegen nicht aus dem System fallen.

### 7 · Wie gut ist das Netz auf den Feldern?

Wenn überall Empfang ist, wird vieles einfacher. Wenn nicht, muss Offline von
Anfang an stehen (Konzept §4) — das ist die Annahme, unter der ich geplant habe.

---

## Muss jemand entscheiden, der dafür geradesteht

### 8 · Welches Land?

`j-ten` fragte AT/DE, die Schlagnamen in der Kürbis-App (Illnau, Uster) deuten
auf die Schweiz. Bestimmt, welches Arbeits- und Datenschutzrecht gilt.

In der Schweiz ist Art. 26 ArGV 3 einschlägig: Überwachungssysteme zur
Verhaltensüberwachung sind untersagt. Das in §5 vorgeschlagene Design — keine
Koordinaten auf dem Server, nur „am Feld ja/nein", nur bei laufendem Auftrag —
ist darauf ausgelegt. **Es ersetzt keine Rechtsauskunft.**

### 9 · Betriebsrat / Arbeitnehmervertretung vorhanden?

Entscheidet, ob eine Betriebsvereinbarung möglich ist oder Einzelzustimmungen
nötig sind. Stand in `j-ten` schon offen.

Unabhängig davon: Die Leute sollten vorher wissen, was erfasst wird und wozu.
Nicht nur wegen der Vorschriften — sondern weil ein System, dem sie nicht
trauen, umgangen wird, und dann sind die Daten wertlos.

### 10 · Sieht der Admin, wer wie lange gearbeitet hat?

Technisch steht es in den Daten (man muss Stunden ja zählen). Die Frage ist, ob
die Oberfläche es **anbietet**.

Konzept §1 schlägt vor: nein. Personenstunden ja, Personen-Rangliste nein. Das
ist der Unterschied zwischen einem Kostenrechnungs- und einem
Leistungsmesssystem — und damit zwischen einem harmlosen und einem
zustimmungspflichtigen Vorhaben. Falls doch gewünscht, ändert das die
rechtliche Lage erheblich und sollte bewusst entschieden werden.

---

## Praktisches

### 11 · Welche Sprachen spricht die Belegschaft?

Bestimmt, wie textfrei die Arbeiter-Oberfläche sein muss. Stand in `j-ten`
schon offen, die Kürbis-App hat es gelöst — übernehmen.

### 12 · Wieviele Leute, wieviele Schiffe, wieviele Sätze pro Saison?

Grössenordnung genügt. Entscheidet, ob die Schiff-Auswahl eine Liste oder eine
Suche braucht — und ob die Gratis-Stufe reicht (sie wird reichen, aber
nachrechnen schadet nicht).

### 13 · Wie melden sich die Arbeiter an?

Vorschlag: gar nicht — QR-Code zum Feld-Zugang wie in der Kürbis-App, dann
Namen antippen. Kein Passwort, kein PIN. `j-ten` sah `pin_hash` vor; das ist
eine Hürde, die auf dem Feld vor allem stört.

Gegenfrage: Reicht das, oder muss man ausschliessen können, dass jemand in
fremdem Namen bucht?

### 14 · Wann beginnt eure Saison?

Bestimmt den Zeitplan. Wenn die Erfassung im Frühjahr starten soll, ist jetzt
gut Zeit — die Arbeiter-Oberfläche steht dann rechtzeitig und man erwischt die
Sätze von Anfang an (Konzept §7). Wenn jetzt noch geerntet wird, könnte eine
Minimalversion schon Daten sammeln.

### 15 · Stundensatz: einer für alle?

Konzept §6 schlägt einen betrieblichen Vollkostensatz vor, keine Einzellöhne.
Reicht das für eure Kostenrechnung, oder müssen Lehrling, Saisonkraft und
Vorarbeiter unterschiedlich verrechnet werden?

Falls ja: **Lohnstufen, nicht Personenlöhne** — eine Stufe je Person, die Sätze
in den Einstellungen. Dann liegen keine Löhne in der App.

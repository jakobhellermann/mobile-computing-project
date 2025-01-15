#import "basic-report.typ": basic-report

#let todo = text(red)[TODO]

#let abstract = [
  NexTrack ist eine App, um seine eSports-Interessen auf einen Klick
  am Handy verfolgen zu können. #todo
]

#show: it => basic-report(
  doc-category: "Projektbericht",
  doc-title: "NexTrack",
  author: "Jakob Hellermann (10014660)\nRico Suska (10015062)",
  abstract: abstract,
  affiliation: "HRW - Mobile Computing",
  logo: image("assets/logo.png", width: 2cm),
  language: "de",
  it,
)


= Projektbericht

#todo

== Projektvision

#todo

== Zielgruppe

#todo

=== Personas

#todo

==== Christian Müller
#todo avatare

Alter: 25 Jahre
/ Beruf: Student und eSports-Fan
/ Interessen: eSports-Events, Profi-Teams, Statistiken
/ Bevorzugte Plattformen: PC und Mobile (App für schnelle Infos unterwegs)

*Portrait*
Christian ist seit Jahren begeistert von eSports und hat ein Faible für professionelle Gaming-Turniere, besonders in Spielen wie Dota 2, League of Legends und Counter-Strike 2.
Er verfolgt die größten Events und kennt die Namen einiger Top-Spieler und Teams.
Als Student nutzt er gelegentlich seine Freizeit, um in diesem Feld auf dem Laufenden zu bleiben.
Dies passiert auch gerne im Zug oder in den kurzen Pausen zwischen den Vorlesungen.
Er nutzt Seiten wie z.B. Liquipedia oder HLTV, um aktuelle Spielstände, Turnierinformationen oder Statistiken zu finden.

*Motivation und Ziele:*

Christian will jederzeit Zugriff auf aktuelle eSports-Informationen haben, ohne lange suchen zu müssen.
Turniere im Blick behalten: Er möchte keine großen eSports-Events verpassen und plant oft seine Woche rund um die Turnierpläne.
Schnelle Ladezeiten: Er schätzt eine App, die schnell lädt und ihm die Infos sofort liefert, besonders wenn er unterwegs ist.

*App-Funktionen, die Christian gefallen könnten:*

- Live-Ergebnisse und Benachrichtigungen: Push-Benachrichtigungen für seine Lieblingsteams und -turniere, um Ergebnisse und Updates sofort zu erfahren.
- Favoriten speichern: Teams und Spieler, die er verfolgt, schnell und einfach als Favoriten speichern können.
- Kalenderintegration: Eine Kalenderfunktion, die ihm hilft, Turniere zu planen und keine Events zu verpassen.

==== Lisa Kühne

#todo

/ Alter: 21 Jahre
/ Beruf: SHK im Lehramtsstudium
/ Interessen: Zeichnen, Casual Gaming,
/ Bevorzugte Plattformen: iPad, Mobile, Laptop

*Portrait*

Lisa ist Student und spielt seit längerem in ihrer Freizeit diverse Singleplayer Games.
Während des Lockdowns in Corona hat sie angefangen mit ihren Freunden Valorant zu spielen und ist seitdem mehr und mehr an der Szene interessiert. Sie hat auf Twitch E-Sport-Streams vorgeschlagen bekommen. Das hat ihr Interesse geweckt und sie würde sich gerne mehr mit dem Thema beschäftigen, allerdings findet sie es schwierig, einen Einstieg zu finden, da es nicht sofort klar ist, welche Events es überhaupt gibt, was für Teams gerade beliebt sind und wo es die Spiele zu sehen gibt. Sie hätte gerne eine einzige Stelle, die ihr sowohl alle Informationen auf einmal gibt, und wo sie ohne klares Ziel etwas herumschauen kann, um zu entdecken, was es gerade so gibt.

*Motivation und Ziele*
Lisa wünscht sich, den Einstieg in ihr neues Hobby zu vereinfachen. Dafür hätte sie gerne einen Ort, wo sie Informationen entdecken kann, die relevant für sie sein könnten.
Übersichtlichkeit: Zu viele Informationen auf einen Blick können sie überfordern, daher bevorzugt sie eine klar strukturierte und intuitiv bedienbare App.

*App-Funktionen, die Lisa gefallen könnten*
- Discover-Feed
- Kein Informationsüberschuss
- Simple Funktionen auch ohne Login verfügbar


== Nutzungsszenarien

=== Lisa

Lisa ist an einem Samstagnachmittag gelangweilt an ihrem iPad und überlegt sich, was sie machen will.
Da fällt ihr ein, dass sie sich mal die E-Sports Szene von Valorant angucken wollte und sich dafür eine App heruntergeladen hatte.
Sie öffnet die App auf dem iPad, um herauszufinden, was für Turniere anstehen. Im Discover-Feed sieht sie direkt einen Abschnitt mit der Überschrift: "Heute live: Valorant Champions Series – Halbfinale!" Darunter findet sie die Startzeit in ihrer Zeitzone (heute Abend), eine Kurzbeschreibung des Matches und die Teams, die gegeneinander antreten.

Mit einem Klick auf das Ergebnis kommt sie zur Detailansicht, die ihr die Möglichkeit bietet, direkt den Stream auf Twitch zu öffnen, oder eine Erinnerung für später zu erstellen. Sie richtet sich eine Erinnerung ein, und klickt dann weiter auf "VCT" um Infos zum Tournament zu sehen, insbesondere die aktuelle Rangliste.

Am Abend bekommt sie eine Benachrichtigung am Handy, dass das Match nun beginnt. Sie öffnet die App und beginnt den Stream anzugucken.

=== Christian

Christian sitzt im Zug auf dem Weg zur Universität. Heute beginnt die Gruppenphase für das CS2-Turnier Shanghai-Major, für das er am Tag davor seine Tipps im In-Game Tippspiel abgegeben hat.
Leider überschneidet sich die Übertragung mit einer seiner Vorlesungen. Er möchte trotzdem informiert bleiben und keine Turnier-Entwicklungen verpassen. Am Morgen öffnet Christian die Esports-App und sucht im Tab "Suche" nach dem "Shanghai-Major". Er wählt das Turnier aus und markiert dieses als Favorit. Dabei aktiviert er die Option „Live-Benachrichtigungen“, damit die App ihn über wichtige Ereignisse wie Spielstände oder das Match-Ergebnis informiert.
Während der Vorlesung schaltet Christian sein Handy auf lautlos. Die Esports-App sendet ihm Push-Benachrichtigungen: „G2 Esports gewinnt gegen Mouz!“.
Er ist beruhigt, dass er die wichtigsten Updates trotz der Vorlesung mitbekommt. Nach der Vorlesung öffnet Christian die App erneut. Im "Kalender" Tab findet er die einzelnen Spiele. Mit einem Klick auf den "VOD/Stream" Button findet er Youtube- und Twitch-Link Vorschläge für die Spielaufnahme der vergangenen Spiele. Christian ist glücklich, dass er ohne eine Suche im Internet alle Informationen über seine App verfügbar hat.


#pagebreak()

== Storyboard

#todo schön machen
#image("assets/storyboards/lisa.jpg")

#todo zweites storyboard

== UML-Anwendungsdiagramm

= Figma Export

#todo

= Git Repo

#import "@preview/iconic-salmon-svg:1.0.0": github-info

#github-info(
  "jakobhellermann/mobile-computing-project",
  url: "https://github.com/jakobhellermann/mobile-computing-project",
)

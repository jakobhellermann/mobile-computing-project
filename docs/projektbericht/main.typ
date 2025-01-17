#import "basic-report.typ": basic-report

#let todo = text(red)[TODO]

#let abstract = [
  NexTrack ist eine App, mit der man seine eSports-Interessen auf einen Klick
  am Handy verfolgen kann, und durch Erinnerungen für Matches, Teams und Tournaments nie wieder ein Spiel ausversehen verpasst.
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

== Projektvision

Die App "NexTrack" soll die zentrale Anlaufstelle für League of Legends Esports-Fans werden. Sie ermöglicht es den Nutzern, Turniere, Teams und Spiele einfach zu entdecken, zu verfolgen und im persönlichen Kalender zu organisieren. Mit einem nutzerzentrierten Ansatz und einer intuitiven Benutzeroberfläche verbindet die App Fans mit ihrer Leidenschaft für Esports. Dabei ist sie nicht nur für erfahrene Nutzer gedacht, sondern soll auch neu Interessierten dabei helfen, einen Einstieg in die eSports-Welt zu finden.

== Zielgruppe

Die App richtet sich an League of Legends Esports-Fans aller Altersgruppen, die ihre Lieblingsteams und Turniere verfolgen möchten. Sie bietet sowohl Gelegenheitsspielern als auch langjährige Esports-Fans eine Plattform, um stets, in einer intuitiven Umgebung, informiert zu bleiben und keine Matches zu verpassen.

Um ein spezifisches Bild einer Nutzergruppe vor Augen zu haben, haben zwei stellvertretene Personas ausdefiniert:

=== Personas

==== Christian Müller

#image("assets/personas/personaChristian.png")

/ Alter: 25 Jahre
/ Beruf: Student und eSports-Fan
/ Interessen: eSports-Events, Profi-Teams, Statistiken
/ Bevorzugte Plattformen: PC und Mobile (App für schnelle Infos unterwegs)

*Portrait*
Christian ist seit Jahren begeistert von eSports und hat ein Faible für professionelle Gaming-Turniere, besonders in Spielen wie Dota 2, League of Legends und Counter-Strike 2.
Er verfolgt die größten Events und kennt die Namen einiger Top-Spieler und Teams.
Als Student nutzt er gelegentlich seine Freizeit, um in diesem Feld auf dem Laufenden zu bleiben.
Dies passiert auch gerne im Zug oder mit einem Blick in den kurzen Pausen zwischen den Vorlesungen.
Er nutzt Seiten wie z.B. Liquipedia oder lol.fandom, um aktuelle Spielstände, Turnierinformationen oder Statistiken zu finden.

*Motivation und Ziele:*

Christian will jederzeit Zugriff auf aktuelle League of Legends eSports-Informationen haben, ohne lange suchen zu müssen.
Turniere im Blick behalten: Er möchte keine großen eSports-Events verpassen und plant oft seine Woche rund um die Turnierpläne.
Schnelle Ladezeiten: Er schätzt eine App, die schnell lädt und ihm die Infos sofort liefert, besonders wenn er unterwegs ist.

*App-Funktionen, die Christian gefallen könnten:*

- Live-Ergebnisse und Benachrichtigungen: Push-Benachrichtigungen für seine Lieblingsteams und -turniere, um Ergebnisse und Updates sofort zu erfahren.
- Favoriten speichern: Teams und Turniere, die er verfolgt, schnell und einfach als Favoriten speichern können.
- Kalenderintegration: Eine Kalenderfunktion, die ihm hilft, Turniere zu planen und keine Events zu verpassen.

==== Lisa Kühne

#image("assets/personas/personaLisa.png")

/ Alter: 21 Jahre
/ Beruf: SHK im Lehramtsstudium
/ Interessen: Zeichnen, Casual Gaming
/ Bevorzugte Plattformen: iPad, Mobile, Laptop

*Portrait*

Lisa ist Student und spielt seit längerem in ihrer Freizeit diverse Singleplayer Games.
Während des Lockdowns in Corona hat sie angefangen mit ihren Freunden League of Legends zu spielen und ist seitdem mehr und mehr an der Szene interessiert. Sie hat auf Twitch E-Sport-Streams vorgeschlagen bekommen. Das hat ihr Interesse geweckt und sie würde sich gerne mehr mit dem Thema beschäftigen, allerdings findet sie es schwierig, einen Einstieg zu finden, da es nicht sofort klar ist, welche Events es überhaupt gibt, was für Teams gerade beliebt sind und wo es die Spiele zu sehen gibt. Sie hätte gerne eine einzige Stelle, die ihr sowohl alle Informationen auf einmal gibt, und wo sie ohne klares Ziel etwas herumschauen kann, um zu entdecken, was es gerade so gibt.

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
Da fällt ihr ein, dass sie sich mal die E-Sports Szene von League of Legends angucken wollte und sich dafür eine App heruntergeladen hatte.
Sie öffnet die App auf dem iPad, um herauszufinden, was für Turniere anstehen. Im Discover-Feed sieht sie direkt einen Abschnitt mit der Überschrift: "Heute live: Worlds 2024 – Halbfinale!". Darunter findet sie die Startzeit in ihrer Zeitzone (heute Abend), eine Kurzbeschreibung des Matches und die Teams, die gegeneinander antreten.

Mit einem Klick auf das Ergebnis kommt sie zur Detailansicht, die ihr die Möglichkeit bietet, eine Erinnerung für später zu erstellen. Sie richtet sich eine Erinnerung ein, und klickt dann weiter auf "Worlds 2024" um Infos zum Tournament zu sehen.
Sie ist gespannt auf das Match später und schließt die App, um bis dahin noch spazieren zu gehen und das Wetter zu genießen.

Am Abend bekommt sie eine Benachrichtigung am Handy, dass das Match nun beginnt. Sie öffnet die App und beginnt den Stream über den Link in der Benachrichtigung anzugucken.

=== Christian

Christian sitzt im Zug auf dem Weg zur Universität. Heute beginnen die Playoffs für die LEC Season Finals 2024, für das er am Tag davor seine Tipps im In-Game Tippspiel abgegeben hat.
Leider überschneidet sich die Übertragung mit einer seiner Vorlesungen. Er möchte nach den Vorlesung schnellen Zugang zu den Turnier-Entwicklungen haben, um möglichst wenig zu verpassen. Am Morgen öffnet Christian die Esports-App und sucht im Tab "Suche" nach dem "LEC Season Finals 2024". Er wählt das Turnier aus und markiert dieses als Favorit. Dabei aktiviert er die Option „Benachrichtigungen aktivieren“, damit die App ihn über wichtige Ereignisse wie Spielstände oder das Match-Ergebnis informiert.
Während der Vorlesung schaltet Christian sein Handy auf lautlos, damit er nicht abgelenkt wird. Die Esports-App sendet ihm Push-Benachrichtigungen: „G2 Esports gewinnt gegen T1!“.
Nach der Vorlesung sieht Christian die Benachrichtigung auf seinem Handy. Er ist beruhigt, dass er die wichtigsten Updates direkt nach der Vorlesung mitbekommt. Im "Kalender" Tab findet er die einzelnen Spiele. Mit einem Klick auf den "VOD/Stream" Button findet er Youtube- und Twitch-Link Vorschläge für die Spielaufnahme der vergangenen Spiele. Christian ist glücklich, dass er ohne eine Suche im Internet alle Informationen über seine App verfügbar hat.


#pagebreak()

== Storyboard

Storyboard Lisa

#image("assets/storyboards/Lisa_Storyboard.png")

Storyboard Christian

#image("assets/storyboards/Christian_Storyboard.png")

== UML-Anwendungsdiagramm

#image("assets/UML/UML_NexTrack2.png")

#let icon-link(icon, content) = align(
  stack(
    dir: ltr,
    spacing: 0.3em,
    image(icon, height: 1em),
    content,
  ),
)

= Externe Links
== Figma Export

Der Prototyp der NexTrack-App ist ein Low-Fidelity Prototyp. Dieser wurde in der früheren Entwicklungsphase erstellt und nur zu geringen Ausmaßen angepasst. Einige Frames zeigen größtenteils Platzhalterdaten an, da sich die Daten bei jedem Aufruf dieses Frames ändern könnten.


- #icon-link(
    "assets/icons/figma.svg",
    link("https://www.figma.com/proto/422llWKXK0jlMsGU3w9Hap/Mobile-Computing-App?node-id=0-1&t=BbwUVtRJfw0UotXN-1")[Figma Prototyp Link],
  )
- #icon-link(
    "assets/icons/figma.svg",
    link("https://www.figma.com/design/422llWKXK0jlMsGU3w9Hap/Mobile-Computing-App?node-id=0-1&p=f&t=uaRbAOG3pE64i5hg-0")[Figma Design Link],
  )

== Git Repo

#icon-link(
  "assets/icons/github.svg",
  link("https://github.com/jakobhellermann/mobile-computing-project")[jakobhellermann/mobile-computing-project],
)

*Fallback-URLs*
- https://github.com/jakobhellermann/mobile-computing-project
- https://www.figma.com/proto/422llWKXK0jlMsGU3w9Hap/Mobile-Computing-App?node-id=0-1&t=BbwUVtRJfw0UotXN-1
- https://www.figma.com/design/422llWKXK0jlMsGU3w9Hap/Mobile-Computing-App?node-id=0-1&p=f&t=uaRbAOG3pE64i5hg-0

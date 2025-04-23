# Funktionsuppgift - Interaktiv lösning

Detta är en interaktiv webbapplikation för att lära sig om olika funktionstyper genom en matematisk uppgift. Appen låter användaren utforska hur linjära, kvadratiska och exponentiella funktioner med samma skärningspunkter kan ha olika beteenden.

## Funktioner

- Växla mellan flikar för uppgift, tips, quiz, diagram och lösning
- Pedagogiskt upplägg där användaren först får tänka själv med hjälp av tips
- Quiz med flervalsfrågor som måste besvaras korrekt för att låsa upp lösningen
- Grafisk visualisering av funktionerna i ett interaktivt diagram
- Fullständig lösning med steg-för-steg förklaringar

## Filstruktur

- `index.html` - Webbapplikationens huvudfil med HTML-struktur
- `styles.css` - Stilmallar för applikationen
- `script.js` - JavaScript-funktionalitet för flikar, quiz och diagrammet
- `uppgift.jpg` - Bild på uppgiften (behöver läggas till)

## Hur man använder applikationen

1. Öppna `index.html` i en webbläsare
2. Läs uppgiften i uppgiftsfliken
3. Använd tips-fliken om du behöver hjälp
4. Besvara quizfrågorna - alla tre måste vara rätt för att låsa upp lösningen
5. Utforska diagrammet för att se hur funktionerna beter sig
6. När quizet är avklarat, se den fullständiga lösningen

## Tekniska detaljer

- Använder Chart.js för att rita diagrammet
- Responsiv design som fungerar på olika skärmstorlekar
- Separerar HTML, CSS och JavaScript i olika filer för bättre struktur

## Uppdatering från ursprungliga kurvor.html

Denna applikation är en uppdatering av den ursprungliga kurvor.html. Följande förbättringar har gjorts:

- Koden har delats upp i separata HTML, CSS och JavaScript-filer
- Ett pedagogiskt flöde har lagts till med uppgift, tips och quiz
- Lösningen är låst tills användaren visar förståelse genom att klara quizet
- Förbättrad design och användargränssnitt med tydliga flikar
- Tydliga kommentarer i koden förklarar funktionaliteten 
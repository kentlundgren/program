# Röda Korset - Utbildningsprogram om Flyktingströmmar (HTML-version)

Detta är den enkla HTML/CSS/JavaScript-versionen av utbildningsprogrammet om Röda Korsets arbete med flyktingströmmar.

## Innehåll

Programmet innehåller fem huvudsektioner:
1. **Uppgiftsbeskrivning** - Introduktion till utbildningsuppgiften och dess mål
2. **Tips** - Vägledning för att angripa uppgiften
3. **Visualisering** - Interaktiv kartvisualisering över globala flyktingströmmar 2015-2023
4. **Quiz** - Kunskapstest med 5 frågor om Röda Korsets arbete
5. **Lösning** - Lösningsförslag som låses upp efter godkänt quiz-resultat

## Teknisk struktur

Programmet är byggt med följande teknologier:
- HTML5 (semantisk struktur)
- CSS3 (responsiv design med flexbox och grid)
- JavaScript (ES2021)
- Leaflet.js för kartvisualisering
- Font Awesome för ikoner

### Filstruktur

```
roda_korset/html_version/
├── index.html           # Huvuddokument
├── styles.css           # Stilmall
├── script.js            # JavaScript-funktionalitet
├── README.md            # Denna dokumentation
└── images/              # Mapp för bilder (behöver skapas)
    └── redcross-logo.png  # Röda Korsets logotyp (behöver läggas till)
```

## Installation och användning

1. Ladda ner eller klona hela projektet
2. Skapa en mapp `images` och lägg till nödvändiga bilder, framförallt `redcross-logo.png`
3. Öppna `index.html` i en modern webbläsare (Chrome, Firefox, Safari, Edge)

## Funktionalitet

### Fliknavigation
Programmet använder en enkel flikbaserad navigation för att växla mellan olika sektioner.

### Visualisering
Kartvisualiseringen använder Leaflet.js för att visa flyktingströmmar över tid. Användaren kan:
- Växla mellan årtal med en slider
- Spela upp en animation över tid
- Se statistik för varje år

### Quiz
Quizet består av 5 frågor om Röda Korsets arbete. För att låsa upp lösningsfliken måste användaren svara rätt på minst 4 av frågorna.

### Lösningslåsning
Lösningsförslaget är låst tills användaren klarar quizet. Statusen sparas i localStorage så att lösningen förblir upplåst mellan sessioner.

## Anpassning och vidareutveckling

För att anpassa eller vidareutveckla programmet:

### Lägga till/ändra frågor
Redigera quiz-frågorna och svaren i `script.js` under `initQuizFunctionality()`.

### Uppdatera visualiseringsdata
Uppdatera `refugeeData`-objektet i `script.js` under `initMapVisualization()`.

### Stiländringar
Anpassa färger och stil genom att ändra CSS-variabler i början av `styles.css`.

## Offline-stöd (PWA)
Programmet har förberedd kod för Service Worker-stöd som kan aktiveras för att skapa en Progressive Web App med offline-funktionalitet. För att aktivera:

1. Avkommentera Service Worker-koden i slutet av `script.js`
2. Skapa en `sw.js`-fil med caching-strategi
3. Lägg till en `manifest.json`-fil

## Licens och rättigheter

Detta är ett utbildningsmaterial och innehåller hänvisningar till Röda Korset och dess arbete. Alla rättigheter till Röda Korsets varumärke tillhör respektive organisation. Detta material är endast för utbildningssyfte.

---

© 2024 Svenska Röda Korset (för bildmaterial och varumärke) 
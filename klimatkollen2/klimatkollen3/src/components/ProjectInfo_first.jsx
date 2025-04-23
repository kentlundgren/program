// Sökväg: src/components/ProjectInfo.jsx

import './ProjectInfo.css'

function ProjectInfo() {
  return (
    <div className="project-info">
      <h2>Om Klimatkollen Projektet</h2>
      
      <section className="info-section">
        <h3>Projektbakgrund</h3>
        <p>
          Klimatkollen Företagsöversikt är en React-baserad webbapplikation som visualiserar 
          företags klimatpåverkan genom att hämta data från Klimatkollen API. Projektet 
          fungerar som ett exempel på modern webbutveckling med React, Vite, Node.js och npm.
        </p>
        <p>
          Under utvecklingen används mockdata för att simulera API-anrop, vilket möjliggör 
          utveckling utan att behöva ett faktiskt API. När produkten är redo, kan den enkelt 
          kopplas till det riktiga API:et genom en enda konfigurationsändring.
        </p>
      </section>

      <section className="info-section">
        <h3>Teknisk översikt</h3>
        <ul>
          <li><strong>React</strong> - Ett JavaScript-bibliotek för att bygga användargränssnitt</li>
          <li><strong>Vite</strong> - En snabb byggverktyg och utvecklingsserver</li>
          <li><strong>Node.js</strong> - JavaScript-runtime som kör utvecklingsmiljön</li>
          <li><strong>npm</strong> - Node Package Manager för hantering av beroenden</li>
        </ul>
      </section>

      <section className="info-section">
        <h3>Projektstruktur</h3>
        <div className="file-structure">
          <pre>
{`project-root/
├── node_modules/         # Installerade paket (skapas av npm install)
├── public/               # Statiska filer som kopieras till build
├── src/                  # Källkod
│   ├── api/              # API-relaterad kod
│   │   ├── mock/         # Mockdata för utveckling
│   │   │   └── mockData.js
│   │   └── index.js      # API-funktioner
│   ├── components/       # React-komponenter
│   │   ├── Dashboard.jsx
│   │   ├── CompanyList.jsx
│   │   ├── CompanyDetails.jsx
│   │   ├── SearchBar.jsx
│   │   └── ProjectInfo.jsx
│   ├── utils/            # Hjälpfunktioner
│   │   └── dataHelpers.js
│   ├── App.jsx           # Huvudkomponent
│   ├── main.jsx          # Applikationens startpunkt
│   ├── App.css           # Stilar för App-komponenten
│   └── index.css         # Globala stilar
├── .gitignore            # Filer att ignorera i versionshantering
├── package.json          # Projektmetadata och beroenden
├── package-lock.json     # Exakta versioner av beroenden
└── vite.config.js        # Konfiguration för Vite`}
          </pre>
        </div>
      </section>

      <section className="info-section">
        <h3>Komponentbaserad arkitektur</h3>
        <p>
          React-applikationer är uppbyggda av komponenter som kan återanvändas och komponeras 
          tillsammans. Varje komponent har sitt eget ansvarsområde:
        </p>
        <ul>
          <li><strong>App</strong> - Huvudkomponenten som innehåller applikationens tillstånd och struktur</li>
          <li><strong>Dashboard</strong> - Visar översikt över företag och hanterar val av företag</li>
          <li><strong>CompanyList</strong> - Rendererar listan med företag</li>
          <li><strong>CompanyDetails</strong> - Visar detaljerad information om ett valt företag</li>
          <li><strong>SearchBar</strong> - Hanterar sökfunktionalitet</li>
        </ul>
      </section>

      <section className="info-section">
        <h3>Datahämtning och mockdata</h3>
        <p>
          Applikationen använder en flexibel datahämtningsstrategi där ett API-lager 
          hanterar kommunikationen med Klimatkollen API. Under utveckling används mockdata 
          som simulerar API-svar:
        </p>
        {/* ÄNDRAD KOD: Konverterad från felaktig HTML-kod med br-taggar till pre med template string */}
        <pre className="code-block">
{`// Växla mellan mockdata och riktigt API
const API_CONFIG = {
  useMockData: true, // Ändra till false för att använda riktigt API
  baseUrl: 'https://api.klimatkollen.se/api',
  apiKey: 'YOUR_API_KEY'
};`}
        </pre>
      </section>

      <section className="info-section">
        <h3>Utvecklingsprocess</h3>
        <h4>Steg 1: Projektinitiering</h4>
        <ol>
          <li>Installera Node.js (inkluderar npm)</li>
          <li>Skapa nytt projekt: <code>npm create vite@latest klimatkollen -- --template react</code></li>
          <li>Navigera till projektet: <code>cd klimatkollen</code></li>
          <li>Installera beroenden: <code>npm install</code></li>
        </ol>

        <h4>Steg 2: Utveckling</h4>
        <ol>
          <li>Starta utvecklingsservern: <code>npm run dev</code></li>
          <li>Redigera källkodsfiler i <code>src/</code>-mappen</li>
          <li>Webbläsaren uppdateras automatiskt när du sparar ändringar</li>
        </ol>

        <h4>Steg 3: Byggprocess och distribution</h4>
        <ol>
          <li>Konfigurera bas-URL i <code>vite.config.js</code> om applikationen inte körs i rotmappen</li>
          <li>Bygg för produktion: <code>npm run build</code></li>
          <li>Produktionsfiler genereras i <code>dist/</code>-mappen</li>
          <li>Ladda upp innehållet i <code>dist/</code> till webbservern</li>
        </ol>
      </section>

      <section className="info-section">
        <h3>Bästa praxis</h3>
        <ul>
          <li><strong>Komponentuppdelning</strong> - Håll komponenter små och fokuserade på en enda uppgift</li>
          <li><strong>Separera ansvarsområden</strong> - Skilj mellan UI, datahantering och affärslogik</li>
          <li><strong>Tillståndshantering</strong> - Använd React hooks som useState och useEffect för att hantera tillstånd</li>
          <li><strong>Felsökning</strong> - Använd React Developer Tools och webbläsarens utvecklingsverktyg</li>
          <li><strong>Kodstruktur</strong> - Organisera koden i logiska mappar och använd tydlig namngivning</li>
          <li><strong>CSS-moduler</strong> - Använd en CSS-fil per komponent för att undvika stilkonflikter</li>
        </ul>
      </section>

      <section className="info-section">
        <h3>Vidareutvecklingsmöjligheter</h3>
        <ul>
          <li>Lägga till diagram för visualisering av utsläppstrender</li>
          <li>Implementera sortering och filtrering av företagslistan</li>
          <li>Lägga till jämförelsefunktionalitet mellan företag</li>
          <li>Förbättra responsivitet för mobilanvändning</li>
          <li>Implementera routing för att kunna länka direkt till specifika företag</li>
          <li>Lägga till autentisering för att skydda känslig data</li>
        </ul>
      </section>
    </div>
  )
}

export default ProjectInfo
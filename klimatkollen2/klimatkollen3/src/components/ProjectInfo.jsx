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
          <li><strong>React</strong> - <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">Ett JavaScript-bibliotek för att bygga användargränssnitt</a></li>
          <li><strong>Vite</strong> - <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">Ett snabbt byggverktyg och utvecklingsserver</a></li>
          <li><strong>Node.js</strong> - <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">JavaScript-runtime som kör utvecklingsmiljön</a></li>
          <li><strong>npm</strong> - <a href="https://www.npmjs.com/" target="_blank" rel="noopener noreferrer">Node Package Manager för hantering av beroenden</a></li>
        </ul>
      </section>

      <section className="info-section">
        <h3>Projektstruktur</h3>
        <div className="file-structure">
          <pre>
{`project-root/
├── node_modules/         # Installerade paket (skapas av npm install)
├── public/               # Statiska filer som kopieras till build
│   └── vite.svg          # Vite-logotypen - ett stiliserad "V" formad som en blixt
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
├── vite.config.js        # Konfiguration för Vite
└── index.html            # HTML-mall för applikationen`}
          </pre>
        </div>
      </section>

      <section className="info-section">
        <h3>Nyckelfilsöversikt</h3>
        <p>Här är en beskrivning av de viktigaste filerna i projektet:</p>
        
        <h4>index.html</h4>
        <p>
          Detta är applikationens HTML-mall som fungerar som startpunkt för webbläsaren. 
          Den innehåller en grundläggande HTML-struktur med ett div-element med ID "root" 
          där React renderar hela applikationen. Vite använder denna fil som mall när den 
          bygger den slutliga index.html för produktion.
        </p>
        <pre className="code-block">
{`<!DOCTYPE html>
<html lang="sv">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Klimatkollen</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`}
        </pre>
        
        <h4>main.jsx</h4>
        <p>
          Detta är applikationens JavaScript-startpunkt. Den importerar React, ReactDOM 
          och App-komponenten. Sedan använder den ReactDOM för att rendera App-komponenten 
          i "root"-elementet från index.html.
        </p>
        
        <h4>App.jsx</h4>
        <p>
          Huvudkomponenten som innehåller applikationens övergripande struktur, tillstånd 
          och logik. Den hanterar datahämtning och bestämmer vilka komponenter som ska visas.
        </p>
        
        <h4>package.json</h4>
        <p>
          Definierar projektets metadata, beroenden (dependencies) och skript som kan 
          köras med npm. Här finns till exempel skripten för att starta utvecklingsservern 
          och bygga produktionsversionen.
        </p>
      </section>

      <section className="info-section">
        <h3>Programflöde och renderingshierarki</h3>
        <p>
          När applikationen startas följer React och webbläsaren dessa steg i följande ordning:
        </p>
        
        <ol className="flow-steps">
          <li>
            <strong>Laddning av index.html</strong> - Webbläsaren laddar index.html-filen först, 
            vilket sätter upp den grundläggande HTML-strukturen och laddar JavaScript.
          </li>
          <li>
            <strong>Körning av main.jsx</strong> - Skriptet laddar React och initierar renderingsprocessen 
            genom att anropa <code>ReactDOM.createRoot(document.getElementById('root')).render()</code>.
          </li>
          <li>
            <strong>Rendering av App-komponenten</strong> - App-komponenten skapas och renderas 
            inuti "root"-elementet.
          </li>
          <li>
            <strong>Körning av useEffect-hook</strong> - När App-komponenten har renderats körs 
            useEffect-hooken med den tomma beroendelistan <code>[]</code>, vilket triggar 
            datahämtningen från API:et (eller mockdata under utveckling).
          </li>
          <li>
            <strong>Uppdatering av applikationstillstånd</strong> - När data mottagits uppdateras 
            App-komponentens state med <code>setCompanies(data)</code> och <code>setLoading(false)</code>.
          </li>
          <li>
            <strong>Re-rendering av App</strong> - React upptäcker att state har ändrats och 
            kör App-funktionen igen för att uppdatera det virtuella DOM:et.
          </li>
          <li>
            <strong>Rendering av Dashboard</strong> - Eftersom loading är false och data finns renderas 
            Dashboard-komponenten, som tar companies-arrayen som prop.
          </li>
          <li>
            <strong>Rendering av CompanyList</strong> - Dashboard renderar CompanyList-komponenten 
            med companies-data.
          </li>
          <li>
            <strong>Användarinteraktion</strong> - När användaren klickar på ett företag i listan 
            anropas <code>onSelectCompany</code>-callbacken som uppdaterar <code>selectedCompany</code> 
            i Dashboard-komponenten.
          </li>
          <li>
            <strong>Rendering av CompanyDetails</strong> - När ett företag väljs renderas 
            CompanyDetails-komponenten med det valda företagets data.
          </li>
        </ol>
        
        <h4>Dataflödesillustrering</h4>
        <div className="data-flow-diagram">
          <pre className="code-block">
{`API/Mock Data → App.jsx → Dashboard.jsx → CompanyList.jsx
                              ↓
                    CompanyDetails.jsx (när ett företag väljs)
                              ↓
                         SearchBar.jsx (för filtrering)`}
          </pre>
        </div>
        
        <p>
          Detta enkelriktade dataflöde är ett kännetecken för React-applikationer. Data flödar 
          nedåt från föräldrakomponent till barnkomponenter via props, medan händelser (events) 
          flödar uppåt via callback-funktioner.
        </p>
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
import React from 'react';
import './ProjectInfo.css';

/**
 * ProjectInfo-komponenten visar detaljerad information om projektets struktur,
 * kodorganisation och användning.
 * 
 * Komponenten är uppbyggd av flera informationssektioner som beskriver olika
 * aspekter av projektet, från filstrukturen till viktig funktionalitet.
 * 
 * @returns {JSX.Element} En komponent som visar all projektinformation
 */
const ProjectInfo = () => {
  return (
    <div className="project-info">
      <h2>Om Klimatkollen-projektet</h2>
      
      {/* Sektion för applikationsöversikt */}
      <section className="info-section">
        <h3>Applikationsöversikt</h3>
        <p>
          Detta projekt är en React-applikation som visualiserar klimatdata och relaterad information. 
          Applikationen erbjuder användare möjlighet att utforska olika dataset relaterade till klimatförändringar.
        </p>
      </section>
      
      {/* Sektion för filstruktur */}
      <section className="info-section">
        <h3>Filstruktur</h3>
        <div className="file-structure">
          <pre>
{`projektets-rot/
├── public/                  # Statiska filer
│   ├── vite.svg             # Favikon för projektet
│   └── ...
├── src/                     # Källkod
│   ├── components/          # React-komponenter
│   │   ├── ProjectInfo.jsx  # Denna komponent
│   │   ├── ProjectInfo.css  # Stilar för denna komponent
│   │   └── ...              # Andra komponenter
│   ├── assets/              # Statiska resurser som bilder
│   ├── App.jsx              # Huvudkomponent som renderar applikationen
│   ├── main.jsx             # Applikationens ingångspunkt
│   └── ...
├── index.html               # HTML-mall för applikationen
├── package.json             # Projektets beroenden och skript
└── ...`}
          </pre>
        </div>
      </section>

      {/* Nytt avsnitt för index.html */}
      <section className="info-section">
        <h3>index.html</h3>
        <p>
          Filen <code>index.html</code> fungerar som applikationens grundläggande HTML-mall.
          Det är denna fil som laddas först när användaren besöker webbplatsen.
        </p>
        <div className="code-block">
{`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Klimatkollen....</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`}
        </div>
        <h4>Viktiga delar i index.html:</h4>
        <ul>
          <li><strong>DOCTYPE och språk</strong>: Definierar HTML5 och specificerar engelska som språk.</li>
          <li><strong>Meta-taggar</strong>: Anger teckenkodning (UTF-8) och viewport-inställningar för responsiv design.</li>
          <li><strong>Titel</strong>: "Klimatkollen...." visas i webbläsarens flik.</li>
          <li><strong>Favicon</strong>: Länk till Vite's standardikon (kan ersättas med projektets egen).</li>
          <li><strong>Root div</strong>: Ett tomt <code>&lt;div id="root"&gt;&lt;/div&gt;</code> element där React kommer att rendera hela applikationen.</li>
          <li><strong>Script</strong>: Laddar <code>main.jsx</code> som startpunkt för React-applikationen.</li>
        </ul>
      </section>
      
      {/* Nytt avsnitt för programflöde och hierarki */}
      <section className="info-section">
        <h3>Programflöde och Hierarki</h3>
        <p>
          När applikationen körs följer programflödet följande steg:
        </p>
        <ol>
          <li>
            <strong>Laddning av index.html</strong>: Webbläsaren laddar först <code>index.html</code> som skapar 
            den grundläggande strukturen och ett tomt <code>&lt;div id="root"&gt;</code> element.
          </li>
          <li>
            <strong>Exekvering av main.jsx</strong>: Script-taggen i index.html laddar <code>main.jsx</code>, 
            som är React-applikationens ingångspunkt.
          </li>
          <li>
            <strong>React-initiering</strong>: <code>main.jsx</code> initierar React och skapar React-rooten, 
            som typiskt inkluderar React StrictMode och eventuella providers för global state-hantering, routing, etc.
          </li>
          <li>
            <strong>Rendering av App.jsx</strong>: <code>main.jsx</code> renderar <code>App</code>-komponenten, 
            som är applikationens huvudkomponent och ansvarar för den övergripande layouten och routingen.
          </li>
          <li>
            <strong>Rendering av underkomponenter</strong>: <code>App.jsx</code> renderar i sin tur olika underkomponenter,
            inklusive <code>ProjectInfo</code> (denna komponent) beroende på routingen och applikationens tillstånd.
          </li>
          <li>
            <strong>Komponenternas livscykel</strong>: När en komponent renderas, körs dess livscykelmetoder (i funktionella komponenter
            hanteras detta via hooks som useEffect) för att hantera sidoeffekter, datahämtning, etc.
          </li>
          <li>
            <strong>Händelsehantering</strong>: Komponenter reagerar på användarinteraktioner genom event listeners, 
            vilket kan leda till tillståndsförändringar och omrenderingar.
          </li>
        </ol>
        
        <h4>Komponenthierarki:</h4>
        <div className="file-structure">
          <pre>
{`index.html
└── main.jsx (React Entry Point)
    └── App.jsx (Root Component)
        ├── Router/Layout Components
        │   ├── Header/Navigation
        │   ├── Main Content Area
        │   │   ├── Dashboard/Home Components
        │   │   ├── Data Visualization Components
        │   │   ├── ProjectInfo (denna komponent)
        │   │   └── Andra sidor/komponenter
        │   └── Footer
        └── Globala UI-komponenter (modaler, notifieringar, etc.)`}
          </pre>
        </div>
        
        <h4>Dataflöde:</h4>
        <p>
          I React-applikationer flödar data generellt uppifrån och ner genom komponentträdet:
        </p>
        <ul>
          <li><strong>Props</strong>: Data skickas från föräldrakomponenter till barnkomponenter via props.</li>
          <li><strong>State</strong>: Komponenter kan ha lokalt tillstånd (state) som hanteras med useState-hooken.</li>
          <li><strong>Context</strong>: Globalt tillstånd kan hanteras med React Context för data som behöver vara tillgänglig för många komponenter.</li>
          <li><strong>Side Effects</strong>: Datahämtning och andra sidoeffekter hanteras typiskt i useEffect-hooks.</li>
        </ul>
      </section>
      
      {/* Sektion för teknologier */}
      <section className="info-section">
        <h3>Teknologier</h3>
        <p>Detta projekt är byggt med följande teknologier:</p>
        <ul>
          <li><strong>React</strong>: JavaScript-bibliotek för att bygga användargränssnitt</li>
          <li><strong>Vite</strong>: Modern byggverktyg som erbjuder snabb utveckling och optimerad produktion</li>
          <li><strong>CSS Modules/CSS</strong>: För komponentspecifika stilar</li>
          <li><strong>Andra paket som kan vara inkluderade</strong>: React Router, Chart.js, etc.</li>
        </ul>
      </section>
      
      {/* Sektion för utvecklarinfo */}
      <section className="info-section">
        <h3>Utvecklarinformation</h3>
        <h4>Kom igång</h4>
        <ol>
          <li>Klona repositoryt</li>
          <li>Installera beroenden med <code>npm install</code></li>
          <li>Starta utvecklingsservern med <code>npm run dev</code></li>
          <li>Öppna <code>http://localhost:5173</code> i din webbläsare</li>
        </ol>
        
        <h4>Byggkommandon</h4>
        <ul>
          <li><code>npm run dev</code>: Startar utvecklingsservern</li>
          <li><code>npm run build</code>: Bygger applikationen för produktion</li>
          <li><code>npm run preview</code>: Förhandsgranskar produktionsbygget lokalt</li>
        </ul>
      </section>
    </div>
  );
};

export default ProjectInfo;
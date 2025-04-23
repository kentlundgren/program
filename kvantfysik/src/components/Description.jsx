// Fil: Description.jsx
// Komponent som visar programbeskrivningen

const Description = () => {
  return (
    <div className="description-container">
      <h2>Programbeskrivning</h2>
      
      <section className="description-section">
        <h3>Översikt</h3>
        <p>
          Detta program är en interaktiv webbapplikation för att lära sig om tunnlingseffekten 
          inom kvantfysik. Programmet är byggt med React och Vite, och använder modern 
          webbteknik för att skapa en engagerande lärupplevelse.
        </p>
      </section>

      <section className="description-section">
        <h3>Utvecklingsverktyg</h3>
        <div className="tools-grid">
          <div className="tool-item">
            <h4>Node.js</h4>
            <p>JavaScript-runtime som möjliggör servermiljö och pakethantering.</p>
            <a href="https://nodejs.org/en" target="_blank" rel="noopener noreferrer">nodejs.org</a>
          </div>
          <div className="tool-item">
            <h4>npm (Node Package Manager)</h4>
            <p>Pakethanterare för JavaScript som hanterar projektets beroenden.</p>
            <a href="https://www.npmjs.com/" target="_blank" rel="noopener noreferrer">npmjs.com</a>
          </div>
          <div className="tool-item">
            <h4>React</h4>
            <p>JavaScript-bibliotek för att bygga användargränssnitt med komponenter.</p>
            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">react.dev</a>
          </div>
          <div className="tool-item">
            <h4>Vite</h4>
            <p>Modern byggverktyg som ger snabb utveckling och optimerad produktion.</p>
            <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">vitejs.dev</a>
          </div>
        </div>
      </section>

      <section className="description-section">
        <h3>Programstruktur</h3>
        <div className="file-structure">
          <ul>
            <li>
              <strong>public/</strong> - Statiska filer
              <ul>
                <li><code>vite.svg</code> - Vite-logotyp som visas i footern</li>
              </ul>
            </li>
            <li>
              <strong>src/</strong> - Källkodsmapp
              <ul>
                <li>
                  <strong>assets/</strong> - Resursfiler
                  <ul>
                    <li><code>react.svg</code> - React-logotyp som visas i footern</li>
                  </ul>
                </li>
                <li>
                  <strong>components/</strong> - React-komponenter
                  <ul>
                    <li><code>Header.jsx</code> - Programhuvud med titel</li>
                    <li><code>TabContainer.jsx</code> - Hanterar fliknavigering</li>
                    <li><code>TaskTab.jsx</code> - Uppgiftsbeskrivning</li>
                    <li><code>TipsTab.jsx</code> - Tips för lösning</li>
                    <li><code>VisualizationTab.jsx</code> - Visualisering av kretsen</li>
                    <li><code>QuizTab.jsx</code> - Quiz som låser upp lösningen</li>
                    <li><code>SolutionTab.jsx</code> - Stegvis lösning av uppgiften</li>
                    <li><code>Description.jsx</code> - Denna beskrivning</li>
                  </ul>
                </li>
                <li>
                  <strong>styles/</strong> - CSS-filer för styling
                  <ul>
                    <li><code>Description.css</code> - Styling för beskrivningen</li>
                    <li><code>Quiz.css</code> - Styling för quiz-komponenten</li>
                    <li><code>Solution.css</code> - Styling för lösningsvisning</li>
                    <li><code>Tabs.css</code> - Styling för fliknavigering</li>
                  </ul>
                </li>
                <li>
                  <strong>utils/</strong> - Hjälpfunktioner
                  <ul>
                    <li><code>dataHelpers.js</code> - Hjälpfunktioner för beräkningar</li>
                  </ul>
                </li>
                <li><code>App.jsx</code> - Huvudkomponent som orkestrerar hela appen</li>
                <li><code>App.css</code> - Styling för huvudkomponenten</li>
                <li><code>index.css</code> - Globala stilar</li>
                <li><code>main.jsx</code> - Startpunkt som renderar App till DOM</li>
              </ul>
            </li>
            <li><code>index.html</code> - HTML-mall</li>
            <li><code>package.json</code> - Projektberoenden och skript</li>
            <li><code>vite.config.js</code> - Vite-konfiguration</li>
          </ul>
        </div>
      </section>

      <section className="description-section">
        <h3>Funktionalitet</h3>
        <p>
          Programmet är uppdelat i fem flikar som guidar användaren genom lärupplevelsen:
        </p>
        <ol>
          <li><strong>Uppgift</strong> - Presenterar problemet och givna värden</li>
          <li><strong>Tips</strong> - Ger vägledning för att lösa uppgiften</li>
          <li><strong>Visualisering</strong> - Visar en grafisk representation av tunnlingseffekten</li>
          <li><strong>Quiz</strong> - Testar förståelse med tre frågor</li>
          <li><strong>Lösning</strong> - Visar steg-för-steg lösning (låst tills quiz är klar)</li>
        </ol>
      </section>

      <section className="description-section">
        <h3>Teknisk Implementation</h3>
        <ul>
          <li>Använder React för komponentbaserad utveckling</li>
          <li>Chart.js för grafisk visualisering</li>
          <li>Responsiv design med CSS</li>
          <li>State management med React hooks</li>
          <li>Modulär kodstruktur för enkel underhåll</li>
        </ul>
      </section>

      <section className="description-section">
        <h3>Dataflöde</h3>
        <p>
          Programmet följer ett linjärt flöde där användaren måste:
        </p>
        <ol>
          <li>Läsa och förstå uppgiften</li>
          <li>Följa tipsen för att lösa problemet</li>
          <li>Studera visualiseringen för konceptuell förståelse</li>
          <li>Svara på quiz-frågorna</li>
          <li>Få tillgång till den detaljerade lösningen</li>
        </ol>
      </section>
    </div>
  );
};

export default Description; 
// ProgramDescription.jsx - Komponent som visar en detaljerad beskrivning av programmet
import React from 'react';
import './ProgramDescription.css'; // Ny CSS-fil för responsiv design

const ProgramDescription = ({ onReturnToProgram }) => {
  return (
    <div className="program-description">
      <div className="description-header">
        <h2>Programbeskrivning: Elektriska Kretsar</h2>
        <button 
          className="return-button"
          onClick={onReturnToProgram}
        >
          Återgå till programmet
        </button>
      </div>

      <div className="description-content">
        <section>
          <h3>Programmets syfte</h3>
          <p>
            Detta program är utvecklat för gymnasieundervisning i fysik och behandlar 
            specifikt elektriska kretsar med blandade serie- och parallellkopplingar. 
            Programmet är byggt med en pedagogisk struktur som guidar eleven från uppgift 
            till lösning genom en process av lärande och förståelse.
          </p>
        </section>

        <section>
          <h3>Teknisk uppbyggnad och säkerhet</h3>
          <p>
            Programmet är byggt med React och Vite, vilket ger en modern och 
            snabb utvecklingsmiljö. React används för att bygga användargränssnittet 
            med återanvändbara komponenter, medan Vite hanterar byggprocessen och 
            optimerar prestandan.
          </p>
          
          <div className="security-info">
            <h4>Content Security Policy (CSP)</h4>
            <p>
              Programmet använder en strikt säkerhetspolicy (CSP) som fungerar i både 
              utvecklings- och produktionsmiljö:
            </p>
            <pre className="code-block">
              {`<meta http-equiv="Content-Security-Policy" 
    content="script-src 'self'; object-src 'self'">`}
            </pre>
            <p>
              <strong>Viktiga punkter om CSP:</strong>
            </p>
            <ul>
              <li>
                <strong>Utvecklingsmiljö:</strong> Vite hanterar hot-reloading och utvecklingsverktyg 
                utan att behöva 'unsafe-eval', tack vare modern ES modules-teknik.
              </li>
              <li>
                <strong>Produktionsmiljö:</strong> All kod är förkompilerad och optimerad, 
                vilket eliminerar behovet av dynamisk kodkörning via eval().
              </li>
              <li>
                <strong>Säkerhet:</strong> Genom att begränsa script-källor till 'self' 
                skyddar vi mot XSS-attacker och andra säkerhetshot.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h3>Programstruktur</h3>
          <h4>Mappstruktur:</h4>
          <div className="file-structure">
            <div className="file-item">
              <span className="folder">📁 elektriska-kretsar-projekt</span>
              <div className="file-children">
                <div className="file-item">
                  <span className="folder">📁 public</span>
                  <div className="file-children">
                    <div className="file-item">
                      <span className="file">📄 vite.svg</span>
                      <span className="file-description">Vite-logotyp som visas i footern</span>
                    </div>
                  </div>
                </div>

                <div className="file-item">
                  <span className="folder">📁 src</span>
                  <div className="file-children">
                    <div className="file-item">
                      <span className="folder">📁 assets</span>
                      <div className="file-children">
                        <div className="file-item">
                          <span className="file">📄 react.svg</span>
                          <span className="file-description">React-logotyp som visas i footern</span>
                        </div>
                      </div>
                    </div>

                    <div className="file-item">
                      <span className="folder">📁 components</span>
                      <div className="file-children">
                        <div className="file-item">
                          <span className="file">📄 Header.jsx</span>
                          <span className="file-description">Programhuvud med titel</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 TabContainer.jsx</span>
                          <span className="file-description">Hanterar fliknavigering</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 TaskTab.jsx</span>
                          <span className="file-description">Uppgiftsbeskrivning</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 TipsTab.jsx</span>
                          <span className="file-description">Tips för lösning</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 VisualizationTab.jsx</span>
                          <span className="file-description">Visualisering av kretsen</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 QuizTab.jsx</span>
                          <span className="file-description">Quiz som låser upp lösningen</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 SolutionTab.jsx</span>
                          <span className="file-description">Stegvis lösning av uppgiften</span>
                        </div>
                        <div className="file-item">
                          <span className="file">📄 ProgramDescription.jsx</span>
                          <span className="file-description">Denna beskrivning</span>
                        </div>
                      </div>
                    </div>

                    <div className="file-item">
                      <span className="folder">📁 utils</span>
                      <div className="file-children">
                        <div className="file-item">
                          <span className="file">📄 dataHelpers.js</span>
                          <span className="file-description">Hjälpfunktioner för beräkningar</span>
                        </div>
                      </div>
                    </div>

                    <div className="file-item">
                      <span className="file">📄 App.jsx</span>
                      <span className="file-description">Huvudkomponent som orkestrerar hela appen</span>
                    </div>
                    <div className="file-item">
                      <span className="file">📄 App.css</span>
                      <span className="file-description">Stilar för huvudkomponenten</span>
                    </div>
                    <div className="file-item">
                      <span className="file">📄 index.css</span>
                      <span className="file-description">Globala stilar</span>
                    </div>
                    <div className="file-item">
                      <span className="file">📄 main.jsx</span>
                      <span className="file-description">Startpunkt som renderar App till DOM</span>
                    </div>
                  </div>
                </div>

                <div className="file-item">
                  <span className="file">📄 index.html</span>
                  <span className="file-description">HTML-mall</span>
                </div>
                <div className="file-item">
                  <span className="file">📄 package.json</span>
                  <span className="file-description">Projektberoenden och skript</span>
                </div>
                <div className="file-item">
                  <span className="file">📄 vite.config.js</span>
                  <span className="file-description">Vite-konfiguration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3>Komponentbeskrivningar</h3>
          
          <div className="component-description">
            <h4>App.jsx</h4>
            <p>
              Huvudkomponenten som orkestrerar hela applikationen. Den hanterar tillståndet 
              för aktiv flik och kontrollerar om quizet har klarats. Importerar och använder 
              alla övriga komponenter.
            </p>
            <p>
              <strong>Tillstånd (State):</strong>
              <ul>
                <li><code>activeTab</code> - Håller reda på vilken flik som är aktiv</li>
                <li><code>quizCompleted</code> - Flagga som visar om quizet är klarat</li>
                <li><code>showDescription</code> - Kontrollerar om programbeskrivningen visas</li>
              </ul>
            </p>
          </div>

          <div className="component-description">
            <h4>Header.jsx</h4>
            <p>
              En enkel komponent som visar programmets titel överst på sidan.
            </p>
          </div>

          <div className="component-description">
            <h4>TabContainer.jsx</h4>
            <p>
              Hanterar fliknavigering och visar den aktiva flikens innehåll. Tar emot props:
              <ul>
                <li><code>tabs</code> - Array med flikdata (titel och komponent)</li>
                <li><code>activeTab</code> - Index för aktiv flik</li>
                <li><code>setActiveTab</code> - Funktion för att ändra aktiv flik</li>
                <li><code>isTabDisabled</code> - Funktion som avgör om en flik ska vara inaktiverad</li>
              </ul>
            </p>
          </div>

          <div className="component-description">
            <h4>TaskTab.jsx</h4>
            <p>
              Visar uppgiftsbeskrivningen för den elektriska kretsen som ska analyseras. 
              Innehåller strukturerad beskrivning av kretsen och vad eleven ska beräkna.
            </p>
          </div>

          <div className="component-description">
            <h4>TipsTab.jsx</h4>
            <p>
              Innehåller hjälpsamma tips, formler och strategier för att lösa uppgiften. 
              Hjälper eleven att förstå grunderna för elektriska kretsar och hur man 
              kan angripa problem med blandade kopplingar.
            </p>
          </div>

          <div className="component-description">
            <h4>VisualizationTab.jsx</h4>
            <p>
              Visar en visuell representation av den elektriska kretsen med hjälp av SVG. 
              Inkluderar också tabeller och förklaringar för att hjälpa eleven förstå 
              kretsens struktur.
            </p>
          </div>

          <div className="component-description">
            <h4>QuizTab.jsx</h4>
            <p>
              Innehåller ett quiz med tre frågor om elektriska kretsar. Eleven måste svara 
              rätt på alla frågor för att låsa upp lösningsfliken. Komponenten hanterar 
              tillstånd för valda svar och kontrollerar om svaren är korrekta.
            </p>
            <p>
              <strong>Tillstånd:</strong>
              <ul>
                <li><code>selectedAnswers</code> - Array med elevens valda svar</li>
                <li><code>showResults</code> - Kontrollerar om resultatet visas</li>
                <li><code>isCompleted</code> - Flagga som visar om quizet är klarat</li>
              </ul>
            </p>
          </div>

          <div className="component-description">
            <h4>SolutionTab.jsx</h4>
            <p>
              Visar en stegvis lösning av uppgiften. Denna flik är endast tillgänglig 
              efter att eleven har klarat quizet. Förklarar i detalj hur man beräknar 
              alla efterfrågade storheter i kretsen.
            </p>
          </div>
          
          <div className="component-description">
            <h4>dataHelpers.js</h4>
            <p>
              Innehåller hjälpfunktioner för att utföra beräkningar relaterade till 
              elektriska kretsar, såsom beräkning av resistans i serie- och parallellkopplingar, 
              strömberäkningar med Ohms lag, effektberäkningar etc.
            </p>
          </div>
        </section>

        <section>
          <h3>Dataflöde och komponentinteraktion</h3>
          <p>
            Programmet använder React's komponentbaserade arkitektur där data flödar nedåt 
            från föräldrar till barn genom props, och händelser flödar uppåt genom callback-funktioner.
          </p>
          <ul>
            <li>
              <strong>App.jsx</strong> är huvudkomponenten som hanterar det övergripande 
              tillståndet och orkestrerar alla andra komponenter.
            </li>
            <li>
              <strong>TabContainer</strong> får information om flikar, aktiv flik och 
              callback-funktioner för att ändra aktiv flik från App.
            </li>
            <li>
              <strong>QuizTab</strong> innehåller sitt eget interna tillstånd för pågående 
              quiz-interaktioner, men rapporterar tillbaka till App när quizet är klarat 
              via en callback-funktion.
            </li>
            <li>
              Tillgången till lösningsfliken kontrolleras av App.jsx baserat på om quizet 
              har klarats eller inte. Detta implementeras genom en funktion (isTabDisabled) 
              som skickas till TabContainer.
            </li>
          </ul>
        </section>

        <section>
          <h3>Stilar och layout</h3>
          <p>
            Programmet använder CSS-filer för styling:
          </p>
          <ul>
            <li><strong>index.css</strong> - Grundläggande stilar och CSS-variabler</li>
            <li><strong>App.css</strong> - Stilar för huvudkomponenten och dess direkta barn</li>
          </ul>
          <p>
            Stilarna är organiserade med klassnamn som följer komponentstrukturen, vilket 
            gör det enkelt att förstå vilka stilar som hör till vilka komponenter.
          </p>
        </section>

        <section>
          <h3>Bygga och distribuera</h3>
          <p>
            Programmet använder Vite för att bygga och optimera för produktion:
          </p>
          <ul>
            <li><code>npm run dev</code> - Startar en utvecklingsserver</li>
            <li><code>npm run build</code> - Bygger en produktionsversion i dist-mappen</li>
            <li>
              <code>vite.config.js</code> innehåller konfiguration för base-URL som 
              säkerställer att alla resurser laddas korrekt när programmet distribueras 
              på en server under en specifik sökväg (/program/fysik/).
            </li>
          </ul>
        </section>

        <section>
          <h3>Pedagogiskt upplägg</h3>
          <p>
            Programmet följer en pedagogisk struktur:
          </p>
          <ol>
            <li>Introduktion till uppgiften</li>
            <li>Tips och metoder för lösning</li>
            <li>Visualisering för att förstå problemet</li>
            <li>Quiz för att testa förståelse</li>
            <li>Stegvis lösning när förståelse har demonstrerats</li>
          </ol>
          <p>
            Detta upplägg främjar aktivt lärande genom att uppmuntra eleven att försöka 
            förstå och lösa problemet innan lösningen avslöjas.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProgramDescription;
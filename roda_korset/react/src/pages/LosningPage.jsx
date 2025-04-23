import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import '../styles/PageStyles.css';

/**
 * LosningPage - Visar lösningsförslag
 * Version: 1.3.1
 * 
 * Denna komponent visar lösningsförslag för uppgiften om Röda Korsets flyktingarbete.
 * Den är ENDAST tillgänglig om användaren har klarat quizet.
 * 
 * Här skedde en uppdatering för att förbättra återställningsfunktionaliteten genom
 * att använda props från App-komponenten istället för att hantera localStorage direkt.
 */
const LosningPage = ({ quizPassed, onResetQuiz }) => {
  const { useRouterNavigation } = useNavigation();
  const navigate = useNavigate();
  
  // Om quizet inte är avklarat och vi använder router-navigation
  // skicka användaren till quiz-sidan omedelbart
  useEffect(() => {
    if (!quizPassed && useRouterNavigation) {
      navigate('/quiz', { 
        state: { 
          message: 'Du måste klara quizet innan du kan se lösningsförslaget' 
        } 
      });
    }
  }, [quizPassed, useRouterNavigation, navigate]);

  // Funktion för att återställa quiz-status
  const handleResetQuiz = () => {
    // Anropa den centrala återställningsfunktionen från App
    onResetQuiz();
    
    // Visa bekräftelsedialog
    alert('Quiz-status återställd! Lösningen är nu låst igen.');
    
    // Omdirigera användaren till startsidan
    if (useRouterNavigation) {
      navigate('/');
    } else {
      window.dispatchEvent(new CustomEvent('tabChange', { 
        detail: { tabId: 'uppgift' } 
      }));
    }
  };

  // Om quizet inte är avklarat, visa ett blockerande meddelande
  // och en tydlig uppmaning att ta quizet först
  if (!quizPassed) {
    return (
      <div className="page-container">
        <h1>Åtkomst nekad</h1>
        
        <div className="warning-box">
          <p><strong>Lösningsförslaget är låst</strong></p>
          <p>Du måste klara quizet innan du kan se lösningsförslaget. 
          Detta säkerställer att du har grundläggande kunskaper om ämnet 
          innan du får tillgång till lösningen.</p>
        </div>
        
        <p>För att låsa upp lösningsförslaget, gå till Quiz-sidan och besvara 
        frågorna. Du behöver få minst 60% rätt för att få tillgång till denna sida.</p>
        
        <div className="button-container">
          {useRouterNavigation ? (
            <a href="#/quiz" className="primary-button">
              Gå till Quiz
            </a>
          ) : (
            <button 
              onClick={() => {
                // Dispatcha en händelse för att navigera till quiz-fliken
                window.dispatchEvent(new CustomEvent('tabChange', { 
                  detail: { tabId: 'quiz' } 
                }));
              }}
              className="primary-button"
            >
              Gå till Quiz
            </button>
          )}
        </div>
      </div>
    );
  }

  // Om användaren har klarat quizet, visa lösningsförslaget
  return (
    <div className="page-container">
      <h1>Lösningsförslag: Analys av Röda Korsets flyktingarbete</h1>
      
      <div className="info-box">
        <p><strong>Grattis!</strong> Du har låst upp lösningsförslaget genom att klara quizet.</p>
        <p>Detta är ett förslag på upplägg och innehåll för uppgiften. 
        Du bör använda det som inspiration och komplettera med egna analyser och perspektiv.</p>
      </div>
      
      {/* Återställningsknapp för lärare/administratörer */}
      <div className="admin-controls">
        <button 
          onClick={handleResetQuiz} 
          className="reset-button" 
          title="För lärare: Återställ quiz-status för att dölja lösningen igen"
        >
          Återställ quiz-status
        </button>
      </div>
      
      <h2>1. Rapportstruktur</h2>
      <p>
        Nedan presenteras ett förslag på rapportstruktur med beskrivning av innehållet 
        för varje avsnitt. Strukturen följer rekommendationerna från uppgiftsbeskrivningen.
      </p>
      
      <h3>1.1 Sammanfattning (200 ord)</h3>
      <div className="content-example">
        <p>
          Denna rapport analyserar Röda Korsets arbete med flyktingströmmar under perioden 
          2015-2023, med fokus på både globala insatser och arbetet i Sverige. Analysen 
          visar att organisationen spelar en avgörande roll i det humanitära arbetet genom 
          hela flyktingkedjan - från krissituationer i konfliktområden, till flyktingläger 
          och slutligen integrationsinsatser i mottagarländer.
        </p>
        <p>
          Undersökningen identifierar tre huvudutmaningar i Röda Korsets arbete: 
          1) Resursbrister i relation till ökande behov, 2) Komplexa säkerhetssituationer 
          i konfliktområden, och 3) Politiska spänningar som påverkar tillgången till 
          hjälpbehövande. Rapporten belyser också hur organisationen utvecklat nya 
          arbetssätt, särskilt under covid-19-pandemin och i samband med Ukrainakrisen.
        </p>
        <p>
          Genom fallstudien av Röda Korsets arbete i Jordanien med syriska flyktingar 
          illustreras både framgångar och utmaningar. Slutsatsen är att organisationens 
          styrka ligger i dess decentraliserade struktur och förmåga att kombinera 
          internationell koordinering med lokal anpassning, men att långsiktiga 
          lösningar kräver ökat samarbete med regeringar och internationella 
          organisationer.
        </p>
      </div>
      
      <h3>1.2 Inledning (300 ord)</h3>
      <p>
        I inledningen bör du presentera följande:
      </p>
      <ul>
        <li><strong>Bakgrund till ämnet</strong> - Ge en kort överblick av flyktingsituationen 
        globalt och Röda Korsets roll.</li>
        <li><strong>Syfte</strong> - Tydliggör att syftet är att analysera Röda Korsets arbete 
        med flyktingströmmar 2015-2023, med fokus på organisatoriska aspekter, 
        resursfördelning och praktiskt arbete.</li>
        <li><strong>Frågeställningar</strong> - Presentera 3-5 specifika forskningsfrågor som 
        du ämnar besvara. Exempel:
          <ul>
            <li>Hur har Röda Korset anpassat sitt arbetssätt för att möta de växande 
            flyktingströmmarna 2015-2023?</li>
            <li>Vilka är de största utmaningarna som Röda Korset möter i sitt flyktingarbete 
            och hur hanteras dessa?</li>
            <li>Hur samarbetar Röda Korset med andra aktörer för att maximera effekten av insatserna?</li>
            <li>Hur påverkar Röda Korsets grundprinciper det praktiska arbetet med flyktingar?</li>
          </ul>
        </li>
        <li><strong>Avgränsningar</strong> - Var tydlig med studiens fokus, exempelvis geografiskt 
        och tidsmässigt. Motivera dina val.</li>
      </ul>
      
      <h2>2. Förslag på relevanta källor</h2>
      <p>
        En nyckelfaktor för en framgångsrik rapport är att använda en bred och välbalanserad 
        uppsättning av källor. Här är förslag på centrala källor för olika delar av arbetet:
      </p>
      
      <h3>2.1 Primära källor</h3>
      <ul>
        <li>Röda Korset (2023) <em>Årsrapport: Internationellt humanitärt arbete</em>. 
        Svenska Röda Korset, Stockholm.</li>
        <li>ICRC (2022) <em>Humanitarian challenges in armed conflict: World report 2022</em>. 
        International Committee of the Red Cross, Geneva.</li>
        <li>IFRC (2023) <em>Global Migration Strategy 2021-2025: Mid-term review</em>. 
        International Federation of Red Cross and Red Crescent Societies.</li>
        <li>Svenska Röda Korset (2021) <em>Röda Korsets flyktingarbete i Sverige: Lägesrapport</em>.</li>
        <li>Informationsintervjuer med representanter från lokala Röda Kors-föreningar (om möjligt).</li>
      </ul>
      
      <h3>2.2 Sekundära källor</h3>
      <ul>
        <li>UNHCR (2023) <em>Global Trends: Forced Displacement in 2022</em>. 
        United Nations High Commissioner for Refugees, Geneva.</li>
        <li>IOM (2023) <em>World Migration Report 2023</em>. 
        International Organization for Migration, Geneva.</li>
        <li>European Commission (2022) <em>Report on Migration and Asylum</em>. Brussels.</li>
        <li>Vetenskapliga artiklar om humanitärt arbete med flyktingar, särskilt studier av 
        Röda Korsets verksamhet.</li>
        <li>Nyhetsrapportering och dokumentärer om flyktingkriser och humanitära insatser.</li>
      </ul>
      
      <h2>3. Förslag på innehåll till analysdelen</h2>
      <p>
        I analysdelen bör du sammankoppla informationen från olika källor för att besvara dina 
        forskningsfrågor. Några centrala punkter att behandla:
      </p>
      
      <h3>3.1 Anpassningsförmåga</h3>
      <ul>
        <li>Analysera hur Röda Korset anpassat sina arbetsmetoder för att möta nya utmaningar.</li>
        <li>Jämför arbetet under olika flyktingkriser (t.ex. Syrien 2015, Afghanistan 2021, Ukraina 2022).</li>
        <li>Identifiera trender i hur organisationen utvecklar sina insatser.</li>
        <li>Exempel från analysen: "Röda Korsets digitaliseringsprocess accelererade dramatiskt 
        under covid-19-pandemin, vilket senare visade sig avgörande för att snabbt mobilisera 
        resurser när Ukrainakrisen utbröt. Genom digitala koordineringsplattformar kunde 
        organisationen på bara dagar skala upp sin verksamhet när miljontals ukrainare flydde 
        från kriget 2022."</li>
      </ul>
      
      <h3>3.2 Utmaningar och lösningar</h3>
      <ul>
        <li>Analysera de största utmaningarna Röda Korset möter i flyktingarbetet.</li>
        <li>Jämför utmaningar i olika kontexter (konfliktområden, flyktingläger, mottagarländer).</li>
        <li>Utvärdera effektiviteten i Röda Korsets lösningar på dessa utmaningar.</li>
        <li>Exempel från analysen: "En återkommande utmaning för Röda Korset är balansen mellan 
        neutralitet och tillgång till hjälpbehövande i politiskt känsliga områden. I Syrien 
        ledde detta till att ICRC utvecklade komplexa förhandlingsprotokoll för att säkerställa 
        humanitärt tillträde samtidigt som organisationens neutrala position bibehölls. Denna 
        modell har sedan anpassats för arbetet i Ukraina, men med betydligt större framgång 
        på grund av tydligare frontlinjer och starkare internationellt stöd."</li>
      </ul>
      
      <h3>3.3 Fallstudie: Röda Korsets arbete i Jordanien</h3>
      <div className="content-example">
        <p>
          Jordanien har tagit emot över 675 000 registrerade syriska flyktingar sedan 
          konfliktens början 2011, men uppskattningsvis finns över 1,3 miljoner syrier i 
          landet. Röda Korset (via ICRC) och Jordanska Röda Halvmånen har samarbetat i ett 
          av regionens mest omfattande humanitära program.
        </p>
        <p>
          Programmet har tre huvudsakliga komponenter:
        </p>
        <ol>
          <li><strong>Akut humanitär hjälp</strong> - Matpaket, hygienartiklar, tillfälliga 
          bostäder och medicinsk akuthjälp vid gränsen och i flyktingläger som Zaatari.</li>
          <li><strong>Hälsovård</strong> - Drift av sju hälsokliniker i samarbete med lokala 
          myndigheter, med fokus på primärvård, mödravård och psykosocialt stöd.</li>
          <li><strong>Långsiktiga lösningar</strong> - Yrkesutbildningar, mikrolån för 
          småföretagare, och stöd för integration i det jordanska samhället.</li>
        </ol>
        <p>
          Framgångsfaktorer i programmet:
        </p>
        <ul>
          <li>Effektiv koordinering med jordanska myndigheter och FN-organ</li>
          <li>Tidig övergång från akuthjälp till långsiktiga lösningar</li>
          <li>Innovativa metoder som kontantbidrag istället för materiell hjälp</li>
          <li>Inkludering av värdbefolkningen för att minska sociala spänningar</li>
        </ul>
        <p>
          Utmaningar:
        </p>
        <ul>
          <li>Utdragen konflikt leder till "givarens utmattning" och minskade resurser</li>
          <li>Integration försvåras av Jordaniens ekonomiska utmaningar</li>
          <li>Begränsad rörlighet för flyktingar på grund av juridiska hinder</li>
        </ul>
      </div>
      
      <h2>4. Diskussionsfrågor för vidare analys</h2>
      <p>
        Följande diskussionsfrågor kan hjälpa dig att fördjupa analysen:
      </p>
      <ol>
        <li>Vilka spänningar kan uppstå mellan Röda Korsets neutralitetsprincip och behovet 
        av att påverka politiska beslut som rör flyktingars situation?</li>
        <li>Hur påverkar medierapportering och politisk opinion i olika länder Röda Korsets 
        möjligheter att bedriva effektivt flyktingarbete?</li>
        <li>Vilka långsiktiga effekter kan Röda Korsets arbete ha för de samhällen där organisationen är verksam?</li>
        <li>Hur kan Röda Korset balansera akuta humanitära behov mot långsiktiga lösningar med begränsade resurser?</li>
        <li>I vilken utsträckning bör Röda Korset anpassa sina arbetssätt till lokala kulturella 
        kontexter, och när bör universella principer stå över lokala sedvänjor?</li>
      </ol>
      
      <h2>5. Tips för muntliga presentationen</h2>
      <p>
        För din muntliga presentation (10-15 minuter) rekommenderas:
      </p>
      <ul>
        <li>Fokusera på 3-4 huvudpoänger från din analys snarare än att försöka täcka allt innehåll.</li>
        <li>Använd visualiseringar för att illustrera flyktingströmmar, resursfördelning och effekter av insatser.</li>
        <li>Inkludera ett konkret exempel eller en kortare fallstudie för att göra presentationen mer levande.</li>
        <li>Avsluta med en reflektion kring vad vi kan lära oss av Röda Korsets arbete för framtida humanitära utmaningar.</li>
        <li>Förbered dig på frågor om metodval, källkritik och dina slutsatser.</li>
      </ul>
      
      <div className="warning-box">
        <p>
          <strong>Viktigt att tänka på:</strong> Detta lösningsförslag är en utgångspunkt 
          för ditt arbete. För att uppnå ett högt betyg bör du utveckla egna perspektiv, 
          visa kritiskt tänkande och göra självständiga kopplingar mellan fakta och analys. 
          Använd lösningsförslaget som inspiration, men gör arbetet till ditt eget genom att 
          tillföra nya perspektiv och egen forskningsinsats.
        </p>
      </div>
      
      <div className="source-reference">
        <p>Förslag på ytterligare fördjupning:</p>
        <p>Barnett, M. (2013) <em>Empire of Humanity: A History of Humanitarianism</em>. Cornell University Press.</p>
        <p>Forsythe, D.P. (2018) <em>The Humanitarians: The International Committee of the Red Cross</em>. Cambridge University Press.</p>
      </div>
    </div>
  );
};

export default LosningPage; 
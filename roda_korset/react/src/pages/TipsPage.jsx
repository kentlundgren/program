import React from 'react';

/**
 * TipsPage - Visar tips och råd
 * Version: 1.1.0
 * 
 * Här skedde en uppdatering för att lägga till gymnasieanpassade 
 * tips för uppgiften om Röda Korsets flyktingarbete.
 */
const TipsPage = () => {
  return (
    <div className="page-container">
      <h1>Tips och råd</h1>
      
      <h2>Generella studietips</h2>
      <ul>
        <li>
          <strong>Planera arbetet:</strong> Gör en tidplan där du delar upp arbetet i mindre delar. 
          Avsätt tillräckligt med tid för informationssökning, analys, skrivande och granskning.
        </li>
        <li>
          <strong>Börja med en tydlig frågeställning:</strong> Formulera 3-5 specifika forskningsfrågor 
          som du vill besvara i din analys.
        </li>
        <li>
          <strong>Dokumentera dina källor:</strong> Skriv ner källinformation direkt när du hittar den. 
          Det sparar tid senare när du ska skriva källförteckningen.
        </li>
        <li>
          <strong>Anteckna medan du läser:</strong> Skriv ner viktiga fakta och reflektioner medan du 
          undersöker dina källor, med tydliga hänvisningar.
        </li>
      </ul>
      
      <h2>Att hitta information om Röda Korset</h2>
      <div className="source-box">
        <h3>Primära källor</h3>
        <ul>
          <li>
            <a href="https://www.rodakorset.se" target="_blank" rel="noopener noreferrer">Svenska Röda Korset</a> - 
            Officiell webbplats med årsrapporter, verksamhetsbeskrivningar och strategidokument.
          </li>
          <li>
            <a href="https://www.icrc.org" target="_blank" rel="noopener noreferrer">Internationella Rödakorskommittén (ICRC)</a> - 
            Fokuserar på konfliktdrabbade områden och internationell humanitär rätt.
          </li>
          <li>
            <a href="https://www.ifrc.org" target="_blank" rel="noopener noreferrer">Internationella Rödakors- och Rödahalvmånefederationen (IFRC)</a> - 
            Koordinerar insatser vid naturkatastrofer och långsiktigt utvecklingsarbete.
          </li>
        </ul>
        
        <h3>Sekundära källor</h3>
        <ul>
          <li>
            <a href="https://www.unhcr.org/data.html" target="_blank" rel="noopener noreferrer">UNHCR:s databaser</a> - 
            Statistik och rapporter om flyktingsituationen globalt.
          </li>
          <li>
            <a href="https://www.iom.int/research" target="_blank" rel="noopener noreferrer">IOM:s forskningsrapporter</a> - 
            Internationella organisationen för migration erbjuder forskningsrapporter om migrationsströmmar.
          </li>
          <li>
            <a href="https://ec.europa.eu/eurostat/web/migration-asylum/asylum/database" target="_blank" rel="noopener noreferrer">Eurostat</a> - 
            Statistik om flyktingmottagande inom EU.
          </li>
          <li>
            <a href="https://reliefweb.int" target="_blank" rel="noopener noreferrer">ReliefWeb</a> - 
            Portal för humanitär information med rapporter från olika krissituationer.
          </li>
        </ul>
      </div>
      
      <h2>Metodtips</h2>
      <div className="tip-box">
        <h3>Kvantitativ analys</h3>
        <ul>
          <li>Samla statistik om flyktingströmmar från olika källor och jämför utvecklingen över tid</li>
          <li>Analysera budgetar och resursfördelning inom Röda Korset för att se prioriteringar</li>
          <li>Använd diagram och tabeller för att visualisera data</li>
        </ul>
        
        <h3>Kvalitativ analys</h3>
        <ul>
          <li>Analysera policydokument och strategier från Röda Korset</li>
          <li>Undersök fallstudier av specifika insatser</li>
          <li>Om möjligt, kontakta lokala Röda Kors-föreningar för informationsintervjuer</li>
        </ul>
      </div>
      
      <h2>Analytiska perspektiv</h2>
      <p>Försök att analysera Röda Korsets arbete utifrån olika perspektiv:</p>
      <ol>
        <li>
          <strong>Effektivitet och resultat:</strong> I vilken utsträckning uppnår Röda Korset sina mål? 
          Vilka faktorer påverkar effektiviteten?
        </li>
        <li>
          <strong>Samarbete och koordinering:</strong> Hur fungerar samarbetet mellan Röda Korset och andra aktörer? 
          Vilka utmaningar finns?
        </li>
        <li>
          <strong>Hållbarhet:</strong> Är Röda Korsets insatser hållbara på lång sikt? Hur balanseras akut hjälp 
          mot långsiktiga lösningar?
        </li>
        <li>
          <strong>Etik och principer:</strong> Hur tillämpar Röda Korset sina grundprinciper (humanitet, opartiskhet, 
          neutralitet, självständighet, frivillighet, enhet, universalitet) i praktiken?
        </li>
        <li>
          <strong>Politiska dimensioner:</strong> Hur påverkas Röda Korsets arbete av internationella relationer och 
          politiska beslut i olika länder?
        </li>
      </ol>
      
      <h2>Vanliga fallgropar att undvika</h2>
      <div className="warning-box">
        <ul>
          <li>
            <strong>Okritisk hållning:</strong> Undvik att enbart förlita dig på Röda Korsets egen information. 
            Sök oberoende utvärderingar och kritiska perspektiv.
          </li>
          <li>
            <strong>För brett fokus:</strong> Avgränsa ditt arbete tydligt. Välj exempelvis specifika konflikter 
            eller geografiska områden att fokusera på.
          </li>
          <li>
            <strong>Förenkling av komplexa situationer:</strong> Flyktingkriser är komplexa och har många dimensioner. 
            Undvik att förenkla orsaker eller lösningar.
          </li>
          <li>
            <strong>Bristande källkritik:</strong> Var noga med att bedöma källors tillförlitlighet, särskilt i 
            politiskt känsliga frågor.
          </li>
        </ul>
      </div>
      
      <h2>Strukturering av rapporten</h2>
      <p>
        En välstrukturerad rapport är lättare att följa och visar på genomtänkt analys. Här är ett förslag på 
        disposition:
      </p>
      <ol>
        <li><strong>Sammanfattning</strong> (ca 200 ord) - Kortfattad översikt av rapportens innehåll och slutsatser</li>
        <li>
          <strong>Inledning</strong> (ca 300 ord)
          <ul>
            <li>Bakgrund till ämnet</li>
            <li>Syfte med undersökningen</li>
            <li>Frågeställningar</li>
            <li>Avgränsningar</li>
          </ul>
        </li>
        <li>
          <strong>Teoretisk bakgrund</strong> (ca 400 ord)
          <ul>
            <li>Röda Korsets historia och uppdrag</li>
            <li>Relevanta begrepp och teorier (t.ex. humanitär intervention, neutralitetsprincipen)</li>
          </ul>
        </li>
        <li>
          <strong>Metod och material</strong> (ca 300 ord)
          <ul>
            <li>Beskrivning av metoder för datainsamling</li>
            <li>Översikt av källmaterial</li>
            <li>Metodkritik</li>
          </ul>
        </li>
        <li>
          <strong>Resultat</strong> (ca 1000 ord)
          <ul>
            <li>Presentation av data och information strukturerad efter dina frågeställningar</li>
            <li>Fallstudie</li>
          </ul>
        </li>
        <li>
          <strong>Analys</strong> (ca 500 ord)
          <ul>
            <li>Koppling mellan resultat och teoretiska perspektiv</li>
            <li>Jämförelser</li>
            <li>Mönster och tendenser</li>
          </ul>
        </li>
        <li>
          <strong>Diskussion och slutsatser</strong> (ca 300 ord)
          <ul>
            <li>Svar på dina frågeställningar</li>
            <li>Reflektioner över resultaten</li>
            <li>Förslag på fortsatt forskning</li>
          </ul>
        </li>
        <li><strong>Källförteckning</strong> - Fullständig lista över alla källor</li>
        <li><strong>Bilagor</strong> (vid behov) - Kompletterande information, intervjuguider etc.</li>
      </ol>
    </div>
  );
};

export default TipsPage; 
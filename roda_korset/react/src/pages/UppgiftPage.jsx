import React from 'react';

/**
 * UppgiftPage - Visar uppgiftsbeskrivningen
 * Version: 1.1.0
 * 
 * Här skedde en uppdatering för att lägga till en gymnasieanpassad 
 * uppgift om Röda Korsets arbete med flyktingströmmar.
 */
const UppgiftPage = () => {
  return (
    <div className="page-container">
      <h1>Uppgift: Analys av Röda Korsets flyktingarbete</h1>
      
      <div className="info-box">
        <p><strong>Målgrupp:</strong> Samhällsvetenskapsprogrammet, Gymnasiets åk 3</p>
        <p><strong>Kurser:</strong> Samhällskunskap 2, Internationella relationer</p>
        <p><strong>Estimerad tid:</strong> 2-3 veckor</p>
      </div>
      
      <h2>Bakgrund</h2>
      <p>
        Röda Korset är en av världens största humanitära organisationer och spelar en central roll i arbetet 
        med flyktingar och migranter globalt. I en värld där antalet människor på flykt har nått historiskt 
        höga nivåer är förståelsen för flyktingströmmar och humanitära insatser viktigare än någonsin.
      </p>
      <p>
        Sedan år 2015 har vi sett flera stora flyktingkriser - från Syrien, Afghanistan, Sydsudan och nu senast 
        Ukraina. Röda Korset arbetar på flera nivåer: akut hjälp i konfliktområden, stöd i flyktingläger, 
        och insatser för integration i mottagarländer.
      </p>
      
      <h2>Uppgiftsbeskrivning</h2>
      <p>
        Din uppgift är att genomföra en djupgående analys av Röda Korsets arbete med flyktingströmmar under 
        perioden 2015-2023. Undersökningen ska omfatta både globala insatser och Röda Korsets specifika arbete i Sverige.
      </p>
      
      <h3>Uppgiften omfattar följande delar:</h3>
      <ol>
        <li>
          <strong>Kartläggning av flyktingströmmar:</strong> Identifiera de största flyktingströmmarna under 
          perioden och analysera hur Röda Korset har arbetat i dessa situationer.
        </li>
        <li>
          <strong>Organisation och samarbete:</strong> Undersök hur Röda Korset samarbetar med andra organisationer, 
          myndigheter och regeringar för att hantera flyktingsituationer.
        </li>
        <li>
          <strong>Resursfördelning:</strong> Analysera hur resurser (ekonomiska, materiella och personella) 
          fördelas i Röda Korsets flyktingarbete.
        </li>
        <li>
          <strong>Utmaningar och möjligheter:</strong> Identifiera de största utmaningarna Röda Korset står 
          inför i sitt arbete med flyktingar, samt möjliga lösningar.
        </li>
        <li>
          <strong>Fallstudie:</strong> Fördjupa dig i en specifik insats eller ett specifikt projekt som 
          Röda Korset har genomfört (valfritt land/region).
        </li>
      </ol>
      
      <h2>Metod</h2>
      <p>
        Undersökningen ska baseras på:
      </p>
      <ul>
        <li>Analys av rapporter och dokument från Röda Korset och andra relevanta organisationer</li>
        <li>Statistik från UNHCR, IOM och andra relevanta källor</li>
        <li>Nyhetsartiklar och mediebevakning</li>
        <li>Om möjligt, intervjuer med representanter från Röda Korset eller personer med erfarenhet av organisationens arbete</li>
      </ul>
      
      <h2>Redovisning</h2>
      <p>
        Resultatet ska presenteras som en skriftlig rapport (2500-3000 ord) med korrekt källhänvisning enligt Harvardmodellen, 
        samt en muntlig presentation (10-15 minuter) med visuellt stöd.
      </p>
      <p>
        Rapporten ska innehålla:
      </p>
      <ul>
        <li>Sammanfattning</li>
        <li>Inledning med syfte och frågeställningar</li>
        <li>Bakgrund om Röda Korset och flyktingsituationen</li>
        <li>Metod och material</li>
        <li>Resultatredovisning</li>
        <li>Analys</li>
        <li>Diskussion och slutsatser</li>
        <li>Källförteckning</li>
      </ul>
      
      <h2>Bedömningskriterier</h2>
      <ul>
        <li>Faktabaserad och nyanserad analys av Röda Korsets arbete</li>
        <li>Relevant användning av samhällsvetenskapliga teorier och begrepp</li>
        <li>Kritiskt förhållningssätt till källor</li>
        <li>Diskussion om etiska aspekter av flyktingarbete</li>
        <li>Välstrukturerad rapport och presentation</li>
        <li>Korrekt källhänvisning</li>
      </ul>
      
      <div className="source-reference">
        <p>Referenser:</p>
        <p>Röda Korset (2023) <em>Årsrapport: Internationellt humanitärt arbete</em>. Svenska Röda Korset, Stockholm.</p>
        <p>UNHCR (2023) <em>Global Trends: Forced Displacement in 2022</em>. United Nations High Commissioner for Refugees, Geneva.</p>
      </div>
    </div>
  );
};

export default UppgiftPage; 
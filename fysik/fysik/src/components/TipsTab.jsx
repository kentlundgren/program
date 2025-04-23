// TipsTab.jsx - Visar hjälpsamma tips för att lösa uppgiften
import React from 'react';

const TipsTab = () => {
  return (
    <div>
      <h2>Tips för att lösa uppgiften</h2>
      
      <div className="tips-container">
        <div className="tip-section">
          <h3>Grundläggande lagar</h3>
          <ul>
            <li>
              <strong>Ohms lag:</strong> U = R × I
              <p>Där U är spänningen (volt), R är resistansen (ohm) och I är strömstyrkan (ampere).</p>
            </li>
            <li>
              <strong>Kirchhoffs strömlag:</strong> Summan av strömmar in till en punkt är lika med summan av strömmar ut från punkten.
            </li>
            <li>
              <strong>Kirchhoffs spänningslag:</strong> Summan av spänningarna runt en sluten krets är noll.
            </li>
          </ul>
        </div>
        
        <div className="tip-section">
          <h3>Steg-för-steg strategi</h3>
          <ol>
            <li>
              <strong>Identifiera kopplingstyp:</strong>
              <p>Avgör vilka delar av kretsen som är serie- respektive parallellkopplade.</p>
            </li>
            <li>
              <strong>Ersättningsresistans:</strong>
              <p>Beräkna den totala resistansen genom att först kombinera seriekopplade resistorer, sedan parallellkopplade.</p>
              <ul>
                <li>För seriekopplade resistorer: R<sub>tot</sub> = R<sub>1</sub> + R<sub>2</sub> + ...</li>
                <li>För parallellkopplade resistorer: 1/R<sub>tot</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ...</li>
              </ul>
            </li>
            <li>
              <strong>Huvudströmmen:</strong>
              <p>Använd Ohms lag för att beräkna den totala strömmen genom batteriet: I = U/R<sub>tot</sub></p>
            </li>
            <li>
              <strong>Strömfördelning:</strong>
              <p>Vid en förgrening fördelas strömmen omvänt proportionellt mot grenens resistans.</p>
            </li>
            <li>
              <strong>Spänningsfall:</strong>
              <p>Beräkna spänningen över varje resistor med Ohms lag: U = R × I</p>
            </li>
            <li>
              <strong>Effekt:</strong>
              <p>Beräkna effektutvecklingen med P = U × I eller P = R × I² eller P = U²/R</p>
            </li>
          </ol>
        </div>
        
        <div className="tip-section">
          <h3>Vanliga misstag att undvika</h3>
          <ul>
            <li>Glömma att resistanser i parallellkoppling ger lägre total resistans än den minsta resistorn.</li>
            <li>Förväxla formler för serie- och parallellkoppling.</li>
            <li>Glömma att strömmen genom seriekopplade komponenter är samma överallt i den grenen.</li>
            <li>Glömma att spänningen över parallellkopplade komponenter är samma.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TipsTab;
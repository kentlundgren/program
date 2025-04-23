// SolutionTab.jsx - Visar den stegvisa lösningen för uppgiften
import React from 'react';

const SolutionTab = () => {
  return (
    <div>
      <h2>Stegvis lösning</h2>
      
      <p className="solution-intro">
        Här presenteras en komplett stegvis lösning av uppgiften. Se hur vi använder lagarna från 
        elteorin för att systematiskt beräkna alla efterfrågade värden.
      </p>
      
      <div className="solution-steps">
        <div className="solution-step">
          <h3>Beräkning av den totala resistansen</h3>
          <p>
            Först identifierar vi de olika kopplingarna:
          </p>
          <ul>
            <li>I gren 1 har vi R1 och R2 i seriekoppling.</li>
            <li>Gren 1 och gren 2 (R3) är parallellkopplade med varandra.</li>
          </ul>
          <p>
            1. Vi beräknar den totala resistansen för gren 1 (R1 och R2 i serie):
          </p>
          <div className="math-formula">
            R<sub>gren1</sub> = R1 + R2 = 4Ω + 6Ω = 10Ω
          </div>
          <p>
            2. Nu beräknar vi den totala resistansen för hela kretsen (R<sub>gren1</sub> och R3 i parallell):
          </p>
          <div className="math-formula">
            1/R<sub>tot</sub> = 1/R<sub>gren1</sub> + 1/R3 = 1/10Ω + 1/3Ω = 0.1 + 0.333... = 0.433...
          </div>
          <div className="math-formula">
            R<sub>tot</sub> = 1/0.433... = 2.31Ω (avrundat till två decimaler)
          </div>
        </div>
        
        <div className="solution-step">
          <h3>Beräkning av den totala strömmen</h3>
          <p>
            Vi använder Ohms lag för att beräkna den totala strömmen genom spänningskällan:
          </p>
          <div className="math-formula">
            I<sub>tot</sub> = U / R<sub>tot</sub> = 12V / 2.31Ω = 5.19A (avrundat till två decimaler)
          </div>
        </div>
        
        <div className="solution-step">
          <h3>Beräkning av strömmen genom de parallella grenarna</h3>
          <p>
            För att beräkna strömmen genom varje gren kan vi antingen:
          </p>
          <p>
            a) Använda spänningsdelning (eftersom samma spänning ligger över parallellkopplade komponenter)
          </p>
          <p>
            b) Använda strömdelning (strömmen fördelas omvänt proportionellt mot grenens resistans)
          </p>
          <p>
            Vi använder strömdelning:
          </p>
          <div className="math-formula">
            I<sub>gren1</sub> = I<sub>tot</sub> × (R<sub>tot</sub> / R<sub>gren1</sub>) = 5.19A × (2.31Ω / 10Ω) = 1.20A
          </div>
          <div className="math-formula">
            I<sub>gren2</sub> = I<sub>tot</sub> × (R<sub>tot</sub> / R3) = 5.19A × (2.31Ω / 3Ω) = 3.99A
          </div>
          <p>
            Kontroll: I<sub>gren1</sub> + I<sub>gren2</sub> = 1.20A + 3.99A = 5.19A = I<sub>tot</sub> ✓
          </p>
        </div>
        
        <div className="solution-step">
          <h3>Beräkning av spänningen över varje resistor</h3>
          <p>
            Vi använder Ohms lag för att beräkna spänningsfallet över varje resistor:
          </p>
          <p>
            För gren 1:
          </p>
          <div className="math-formula">
            U<sub>R1</sub> = I<sub>gren1</sub> × R1 = 1.20A × 4Ω = 4.80V
          </div>
          <div className="math-formula">
            U<sub>R2</sub> = I<sub>gren1</sub> × R2 = 1.20A × 6Ω = 7.20V
          </div>
          <p>
            För gren 2:
          </p>
          <div className="math-formula">
            U<sub>R3</sub> = I<sub>gren2</sub> × R3 = 3.99A × 3Ω = 11.97V ≈ 12V
          </div>
          <p>
            Kontroll för gren 1: U<sub>R1</sub> + U<sub>R2</sub> = 4.80V + 7.20V = 12V ✓
          </p>
          <p>
            Anmärkning: På grund av avrundning får vi 11.97V istället för exakt 12V för R3.
          </p>
        </div>
        
        <div className="solution-step">
          <h3>Beräkning av den totala effektutvecklingen</h3>
          <p>
            Den totala effektutvecklingen kan beräknas på flera sätt:
          </p>
          <div className="math-formula">
            P<sub>tot</sub> = U × I<sub>tot</sub> = 12V × 5.19A = 62.28W
          </div>
          <p>
            Alternativt kan vi beräkna effekten för varje resistor och summera:
          </p>
          <div className="math-formula">
            P<sub>R1</sub> = U<sub>R1</sub> × I<sub>gren1</sub> = 4.80V × 1.20A = 5.76W
          </div>
          <div className="math-formula">
            P<sub>R2</sub> = U<sub>R2</sub> × I<sub>gren1</sub> = 7.20V × 1.20A = 8.64W
          </div>
          <div className="math-formula">
            P<sub>R3</sub> = U<sub>R3</sub> × I<sub>gren2</sub> = 11.97V × 3.99A = 47.76W
          </div>
          <div className="math-formula">
            P<sub>tot</sub> = P<sub>R1</sub> + P<sub>R2</sub> + P<sub>R3</sub> = 5.76W + 8.64W + 47.76W = 62.16W
          </div>
          <p>
            Avvikelsen på 0.12W beror på avrundningar i våra beräkningar.
          </p>
        </div>
        
        <div className="solution-step">
          <h3>Sammanfattning</h3>
          <p>Vi har nu beräknat:</p>
          <ul>
            <li>Den totala resistansen: R<sub>tot</sub> = 2.31Ω</li>
            <li>Strömstyrkan genom spänningskällan: I<sub>tot</sub> = 5.19A</li>
            <li>Strömstyrka genom gren 1 (R1 och R2): I<sub>gren1</sub> = 1.20A</li>
            <li>Strömstyrka genom gren 2 (R3): I<sub>gren2</sub> = 3.99A</li>
            <li>Spänningen över R1: U<sub>R1</sub> = 4.80V</li>
            <li>Spänningen över R2: U<sub>R2</sub> = 7.20V</li>
            <li>Spänningen över R3: U<sub>R3</sub> = 11.97V</li>
            <li>Den totala effektutvecklingen: P<sub>tot</sub> = 62.28W</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SolutionTab;
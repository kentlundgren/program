// VisualizationTab.jsx - Visuell representation av den elektriska kretsen
import React from 'react';

const VisualizationTab = () => {
  return (
    <div>
      <h2>Visualisering av kretsen</h2>
      
      <div className="visualization-container">
        {/* SVG-visualisering av den elektriska kretsen */}
        <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
          {/* Bakgrund för kretsscheman */}
          <rect width="600" height="400" fill="#f9f9f9" />
          
          {/* Spänningskälla */}
          <line x1="100" y1="100" x2="100" y2="300" stroke="black" strokeWidth="2" />
          <line x1="80" y1="130" x2="120" y2="130" stroke="black" strokeWidth="2" />
          <line x1="90" y1="150" x2="110" y2="150" stroke="black" strokeWidth="2" />
          <text x="50" y="200" fontSize="14" textAnchor="middle">12V</text>
          
          {/* Övre ledning till punkt A */}
          <line x1="100" y1="100" x2="200" y2="100" stroke="black" strokeWidth="2" />
          
          {/* Punkt A */}
          <circle cx="200" cy="100" r="5" fill="black" />
          <text x="200" y="85" fontSize="14" textAnchor="middle">A</text>
          
          {/* Övre gren (R1 och R2 i serie) */}
          <line x1="200" y1="100" x2="250" y2="100" stroke="black" strokeWidth="2" />
          
          {/* R1 Resistor */}
          <rect x="250" y="85" width="60" height="30" fill="none" stroke="black" strokeWidth="2" />
          <text x="280" y="105" fontSize="14" textAnchor="middle">R1 = 4Ω</text>
          
          {/* Ledning mellan R1 och R2 */}
          <line x1="310" y1="100" x2="350" y2="100" stroke="black" strokeWidth="2" />
          
          {/* R2 Resistor */}
          <rect x="350" y="85" width="60" height="30" fill="none" stroke="black" strokeWidth="2" />
          <text x="380" y="105" fontSize="14" textAnchor="middle">R2 = 6Ω</text>
          
          {/* Ledning till punkt B */}
          <line x1="410" y1="100" x2="500" y2="100" stroke="black" strokeWidth="2" />
          
          {/* Undre gren (R3) */}
          <line x1="200" y1="100" x2="200" y2="200" stroke="black" strokeWidth="2" />
          <line x1="200" y1="200" x2="250" y2="200" stroke="black" strokeWidth="2" />
          
          {/* R3 Resistor */}
          <rect x="250" y="185" width="60" height="30" fill="none" stroke="black" strokeWidth="2" />
          <text x="280" y="205" fontSize="14" textAnchor="middle">R3 = 3Ω</text>
          
          {/* Ledning från R3 till punkt B */}
          <line x1="310" y1="200" x2="500" y2="200" stroke="black" strokeWidth="2" />
          <line x1="500" y1="200" x2="500" y2="100" stroke="black" strokeWidth="2" />
          
          {/* Punkt B */}
          <circle cx="500" cy="100" r="5" fill="black" />
          <text x="500" y="85" fontSize="14" textAnchor="middle">B</text>
          
          {/* Ledning tillbaka till spänningskällan */}
          <line x1="500" y1="100" x2="500" y2="300" stroke="black" strokeWidth="2" />
          <line x1="500" y1="300" x2="100" y2="300" stroke="black" strokeWidth="2" />
          
          {/* Strömriktningar med pilar */}
          <polygon points="150,95 160,100 150,105" fill="black" />
          <text x="150" y="85" fontSize="12" textAnchor="middle">I_tot</text>
          
          <polygon points="280,75 290,80 280,85" fill="black" />
          <text x="280" y="70" fontSize="12" textAnchor="middle">I_1</text>
          
          <polygon points="280,175 290,180 280,185" fill="black" />
          <text x="280" y="170" fontSize="12" textAnchor="middle">I_2</text>
        </svg>
        
        {/* Beskrivning av kretsen */}
        <div className="diagram-legend">
          <h3>Kretsschema:</h3>
          <ul>
            <li><strong>A och B:</strong> Förgreningspunkter i kretsen</li>
            <li><strong>I_tot:</strong> Total ström från spänningskällan</li>
            <li><strong>I_1:</strong> Ström genom den övre grenen (R1 och R2)</li>
            <li><strong>I_2:</strong> Ström genom den undre grenen (R3)</li>
            <li><strong>Kretsvärden:</strong> Spänningskälla 12V, R1 = 4Ω, R2 = 6Ω, R3 = 3Ω</li>
          </ul>
        </div>
        
        {/* Tabell med översikt */}
        <div className="circuit-table">
          <h3>Översikt:</h3>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Komponent</th>
                <th>Värde</th>
                <th>Kopplingstyp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spänningskälla</td>
                <td>12V</td>
                <td>-</td>
              </tr>
              <tr>
                <td>R1</td>
                <td>4Ω</td>
                <td>Serie med R2, parallell med R3</td>
              </tr>
              <tr>
                <td>R2</td>
                <td>6Ω</td>
                <td>Serie med R1, parallell med R3</td>
              </tr>
              <tr>
                <td>R3</td>
                <td>3Ω</td>
                <td>Parallell med (R1+R2)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisualizationTab;
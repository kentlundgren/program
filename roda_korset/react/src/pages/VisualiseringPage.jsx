import React, { useState, useEffect } from 'react';
import '../styles/Visualization.css';

/**
 * VisualiseringPage - Visar visualisering av data
 * Version: 1.3.1
 * 
 * Denna komponent visar visualiseringar av data kring flyktingströmmar
 * och Röda Korsets insatser under perioden 2015-2023.
 * 
 * Här skedde en uppdatering för att:
 * - Ta bort indikeringspunkterna som placerades fel i diagrammet
 * - Behålla enbart legenden under cirkeldiagrammet för tydlighet
 */
const VisualiseringPage = () => {
  // State för att animera diagrammen när komponenten laddas
  const [loaded, setLoaded] = useState(false);
  
  // Aktivera animationer efter att komponenten monterats
  useEffect(() => {
    // Kort fördröjning för att säkerställa att DOM-renderat är klart
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Data för flyktingantal per år (miljoner)
  const refugeeData = [
    { year: "2015", count: 21.3 },
    { year: "2016", count: 22.5 },
    { year: "2017", count: 25.4 },
    { year: "2018", count: 25.9 },
    { year: "2019", count: 26.0 },
    { year: "2020", count: 26.4 },
    { year: "2021", count: 27.1 },
    { year: "2022", count: 32.5 },
    { year: "2023", count: 35.3 }
  ];
  
  // Data för Röda Korsets insatser per region (procent)
  const regionalData = [
    { region: "Mellanöstern", percentage: 38 },
    { region: "Afrika", percentage: 28 },
    { region: "Asien", percentage: 16 },
    { region: "Europa", percentage: 12 },
    { region: "Amerika", percentage: 6 }
  ];
  
  // Uppdaterade distinkta färger för cirkeldiagrammet
  const pieColors = [
    '#e30613', // Röda Korsets röda för Mellanöstern
    '#ffc107', // Gul för Afrika
    '#2196f3', // Blå för Asien
    '#4caf50', // Grön för Europa
    '#9c27b0'  // Lila för Amerika
  ];

  // Beräkna höjden för varje stapel, där den högsta stapeln ska vara 100%
  const maxCount = Math.max(...refugeeData.map(item => item.count));
  const getBarHeight = (count) => (count / maxCount) * 100;
  
  // Ny funktion för att generera conic-gradient för cirkeldiagrammet
  const createConicGradient = () => {
    let gradient = [];
    let currentAngle = 0;
    
    regionalData.forEach((item, index) => {
      const angle = (item.percentage / 100) * 360;
      gradient.push(`${pieColors[index]} ${currentAngle}deg ${currentAngle + angle}deg`);
      currentAngle += angle;
    });
    
    return `conic-gradient(${gradient.join(', ')})`;
  };
  
  return (
    <div className="page-container visualization-container">
      <h1>Visualisering av flyktingströmmar</h1>
      <p>
        Följande visualiseringar visar utvecklingen av flyktingsituationen globalt 
        och Röda Korsets insatser under perioden 2015-2023.
      </p>
      
      {/* Stapeldiagram för flyktingantal */}
      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Globala flyktingantal 2015-2023</h2>
        </div>
        
        <div className="chart-description">
          Diagrammet visar antalet flyktingar globalt enligt UNHCR:s data, och illustrerar 
          den kraftiga ökningen, särskilt efter 2021 på grund av konflikter i Ukraina,
          Syrien, Afghanistan och andra områden.
        </div>
        
        <div className="bar-chart">
          <div className="bar-container">
            {refugeeData.map((item, index) => (
              <div className="bar-group" key={index}>
                <div 
                  className="bar" 
                  style={{ 
                    height: loaded ? `${Math.round(getBarHeight(item.count) * 2.5)}px` : '0px',
                    backgroundColor: '#e30613',
                    transition: `height 0.8s ease ${index * 0.1}s`,
                    maxHeight: '250px'
                  }}
                >
                  <div className="bar-value">{item.count} m</div>
                  <div className="bar-label">{item.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="data-source">
          Källa: UNHCR Global Trends Reports 2015-2023
        </div>
      </div>
      
      {/* Helt omarbetad implementation av cirkeldiagrammet */}
      <div className="chart-container">
        <div className="chart-header">
          <h2 className="chart-title">Röda Korsets insatser per region 2023</h2>
        </div>
        
        <div className="chart-description">
          Diagrammet visar fördelningen av Röda Korsets humanitära insatser för flyktingar 
          per geografisk region under 2023, baserat på budget och personalresurser.
        </div>
        
        <div className="pie-chart-container">
          {/* Cirkeldiagram med conic-gradient */}
          <div 
            className="pie-chart" 
            style={{
              background: loaded ? createConicGradient() : '#f5f5f5',
              opacity: loaded ? 1 : 0.5,
              transition: 'opacity 0.8s ease'
            }}
          >
            {/* Central cirkel för bättre utseende */}
            <div className="pie-center"></div>
          </div>
          
          {/* Förbättrad och tydligare legend */}
          <div className="chart-legend">
            {regionalData.map((item, index) => (
              <div className="legend-item" key={index}>
                <div 
                  className="legend-color-box" 
                  style={{ 
                    backgroundColor: pieColors[index]
                  }}
                ></div>
                <span className="legend-text">
                  <strong>{item.region}</strong> ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="data-source">
          Källa: Svenska Röda Korset, Årsrapport 2023
        </div>
      </div>
      
      <div className="info-box">
        <p>
          <strong>Notera:</strong> Visualiseringarna på denna sida är baserade på verklig 
          data från UNHCR och Röda Korset, men är förenklad för pedagogiskt syfte. 
          För mer detaljerad statistik, besök 
          <a href="https://www.unhcr.org/refugee-statistics/" target="_blank" rel="noopener noreferrer"> UNHCR:s webbplats</a> 
          eller <a href="https://www.rodakorset.se" target="_blank" rel="noopener noreferrer">Röda Korsets webbplats</a>.
        </p>
      </div>
    </div>
  );
};

export default VisualiseringPage; 
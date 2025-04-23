// TaskTab.jsx - Visar uppgiftsbeskrivningen
import React from 'react';

const TaskTab = () => {
  return (
    <div>
      <h2>Analys av elektriska kretsar</h2>
      
      <div className="task-description">
        <p>
          I denna uppgift ska du beräkna strömstyrka, spänning och resistans i en blandad 
          serie- och parallellkoppling med flera resistorer och spänningskällor.
        </p>
        
        <div className="task-details">
          <h3>Uppgift:</h3>
          <p>
            Betrakta följande krets:
          </p>
          <ul>
            <li>En spänningskälla på 12V är kopplad till en krets.</li>
            <li>
              Från spänningskällan går en ledning till punkt A, där kretsen delar sig i två parallella grenar:
              <ul>
                <li>Gren 1: En resistor R1 = 4Ω följt av en resistor R2 = 6Ω i serie.</li>
                <li>Gren 2: En resistor R3 = 3Ω.</li>
              </ul>
            </li>
            <li>De två grenarna återförenas i punkt B, och leds tillbaka till spänningskällan.</li>
          </ul>
        </div>
        
        <div className="task-questions">
          <h3>Du ska beräkna:</h3>
          <ol>
            <li>Den totala resistansen i kretsen</li>
            <li>Strömstyrkan genom spänningskällan</li>
            <li>Strömstyrkan genom var och en av de parallella grenarna</li>
            <li>Spänningen över varje resistor</li>
            <li>Den totala effektutvecklingen i kretsen</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TaskTab;
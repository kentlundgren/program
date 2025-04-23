// Fil: Tabs.jsx
// Komponent för att hantera flikarna i applikationen
import React, { useState } from 'react';
import '../styles/Tabs.css';

const Tabs = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Array med fliknamn
  const tabNames = [
    'Uppgift',
    'Tips',
    'Visualisering',
    'Quiz',
    'Lösning'
  ];

  return (
    <div className="tabs-container">
      {/* Fliknavigering */}
      <div className="tabs-nav">
        {tabNames.map((name, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Innehåll för aktiv flik */}
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
};

export default Tabs; 
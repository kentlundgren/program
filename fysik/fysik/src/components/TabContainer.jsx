// TabContainer.jsx - Hantering av flikar och deras innehåll
import React from 'react';

// TabContainer tar emot flikar, aktiv flik, funktion för att ändra aktiv flik,
// och funktion för att kontrollera om en flik är inaktiverad
const TabContainer = ({ tabs, activeTab, setActiveTab, isTabDisabled }) => {
  return (
    <div className="tab-container">
      {/* Navigationsdelen med flikknapparna */}
      <div className="tab-navigation">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => !isTabDisabled(index) && setActiveTab(index)}
            disabled={isTabDisabled(index)}
            aria-selected={activeTab === index}
            role="tab"
          >
            {tab.title}
            {/* Visa en lås-ikon om fliken är inaktiverad */}
            {isTabDisabled(index) && ' 🔒'}
          </button>
        ))}
      </div>
      
      {/* Innehållsdelen som visar den aktiva flikens komponent */}
      <div className="tab-content">
        {tabs[activeTab].component}
      </div>
    </div>
  );
};

export default TabContainer;
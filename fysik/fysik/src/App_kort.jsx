import React, { useState } from 'react'
import './App.css'
import Header from './components/Header'
import TabContainer from './components/TabContainer'

function App() {
  // State för att hålla koll på aktuell flik
  const [activeTab, setActiveTab] = useState(0)
  
  // Enkla testflikar
  const tabs = [
    { title: 'Uppgift', component: <div>Uppgiftsinnehåll kommer här</div> },
    { title: 'Tips', component: <div>Tips kommer här</div> },
    { title: 'Visualisering', component: <div>Visualisering kommer här</div> },
    { title: 'Quiz', component: <div>Quiz kommer här</div> },
    { title: 'Lösning', component: <div>Lösningsinnehåll kommer här</div> }
  ]

  // Dummy-funktion som tillåter alla flikar
  const isTabDisabled = () => false

  return (
    <div className="app-container">
      <Header title="Elektriska Kretsar - Gymnasiefysik" />
      <TabContainer 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isTabDisabled={isTabDisabled}
      />
    </div>
  )
}

export default App
import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import TabContainer from './components/TabContainer'
import TaskTab from './components/TaskTab'
import TipsTab from './components/TipsTab'
import VisualizationTab from './components/VisualizationTab'
import QuizTab from './components/QuizTab'
import SolutionTab from './components/SolutionTab'
import ProgramDescription from './components/ProgramDescription'
// Importera loggorna direkt
import reactLogo from './assets/react.svg'
// Importera Vite-loggan - observera att den ligger i public-mappen
import viteLogo from '/vite.svg'

function App() {
  // State för att hålla koll på aktuell flik
  const [activeTab, setActiveTab] = useState(0)
  
  // State för att hålla koll på om quizet är klarat
  const [quizCompleted, setQuizCompleted] = useState(false)
  
  // State för att visa/dölja programbeskrivningen
  const [showDescription, setShowDescription] = useState(false)
  
  // Flikdata - titel och komponent för varje flik
  const tabs = [
    { title: 'Uppgift', component: <TaskTab /> },
    { title: 'Tips', component: <TipsTab /> },
    { title: 'Visualisering', component: <VisualizationTab /> },
    { title: 'Quiz', component: <QuizTab onQuizComplete={() => setQuizCompleted(true)} /> },
    { title: 'Lösning', component: <SolutionTab /> }
  ]

  // Funktion som kontrollerar om en flik är tillgänglig
  // Lösningsfliken är bara tillgänglig om quizet är klarat
  const isTabDisabled = (index) => {
    return index === 4 && !quizCompleted;
  }

  // Funktion för att växla mellan program och beskrivning
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  }

  return (
    <div className="app-container">
      {showDescription ? (
        // Om beskrivningen ska visas
        <ProgramDescription onReturnToProgram={toggleDescription} />
      ) : (
        // Om programmet ska visas
        <>
          {/* Huvudrubrik för appen */}
          <Header title="Elektriska Kretsar - Gymnasiefysik" />
          
          {/* Container för flikar och dess innehåll */}
          <TabContainer 
            tabs={tabs} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isTabDisabled={isTabDisabled}
          />
          
          {/* Fotnot med loggor */}
          <footer className="footer">
            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} alt="React logo" />
              React
            </a>
            <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} alt="Vite logo" />
              Vite
            </a>
          </footer>
          
          {/* Knapp för att visa programbeskrivning */}
          <button 
            className="description-button" 
            onClick={toggleDescription}
            title="Visa programbeskrivning"
          >
            ?
          </button>
        </>
      )}
    </div>
  )
}

export default App
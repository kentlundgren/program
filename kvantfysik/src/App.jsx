import React, { useState } from 'react'
import Tabs from './components/Tabs'
import TaskTab from './components/TaskTab'
import TipsTab from './components/TipsTab'
import VisualizationTab from './components/VisualizationTab'
import QuizTab from './components/QuizTab'
import SolutionTab from './components/SolutionTab'
import Description from './components/Description'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  const handleQuizComplete = () => {
    setQuizCompleted(true)
  }

  const toggleDescription = () => {
    setShowDescription(!showDescription)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Kvantfysik: Tunnlingseffekten</h1>
        <button 
          className="description-button"
          onClick={toggleDescription}
        >
          {showDescription ? 'Tillbaka till programmet' : 'Visa programbeskrivning'}
        </button>
      </header>

      <main className="app-main">
        {showDescription ? (
          <Description />
        ) : (
          <Tabs>
            <TaskTab />
            <TipsTab />
            <VisualizationTab />
            <QuizTab onQuizComplete={handleQuizComplete} />
            {quizCompleted && <SolutionTab />}
          </Tabs>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-links">
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} alt="React Logo" className="footer-logo" />
          </a>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} alt="Vite Logo" className="footer-logo" />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App

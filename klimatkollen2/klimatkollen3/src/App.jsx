// Sökväg: src/App.jsx

import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import ProjectInfo from './components/ProjectInfo' // Ny komponent som vi kommer att skapa
import './App.css'
import { fetchCompanies } from './utils/dataHelpers'

function App() {
  // State för att lagra företagsdata
  const [companies, setCompanies] = useState([])
  // State för att hantera laddningstillstånd
  const [loading, setLoading] = useState(true)
  // State för att hantera felmeddelanden
  const [error, setError] = useState(null)
  // Ny state för att växla mellan app och information
  const [showInfo, setShowInfo] = useState(false)

  // useEffect körs när komponenten monteras
  useEffect(() => {
    // Självkörande asynkron funktion för att hämta data
    (async () => {
      try {
        // Sätt loading till true innan datauthämtning påbörjas
        setLoading(true)
        // Hämta företagsdata från API:et
        const data = await fetchCompanies()
        // Uppdatera state med hämtad data
        setCompanies(data)
        // Nollställ eventuella tidigare fel
        setError(null)
      } catch (err) {
        // Om ett fel uppstår, lagra det i state
        setError('Kunde inte hämta data från Klimatkollen: ' + err.message)
        console.error('Fel vid datahämtning:', err)
      } finally {
        // Sätt loading till false när datahämtningen är klar (oavsett resultat)
        setLoading(false)
      }
    })()
  }, []) // Tom beroende-array betyder att useEffect bara körs en gång när komponenten monteras

  // Funktion för att växla mellan app och info
  const toggleInfo = () => {
    setShowInfo(!showInfo)
  }

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <h1>Klimatkollen Företagsöversikt</h1>
          <button 
            className="info-button" 
            onClick={toggleInfo}
          >
            {showInfo ? 'Visa Applikation' : 'Om Projektet'}
          </button>
        </div>
        <p>Data hämtas nu från <a href="https://kentlundgren.se/program/klimatkollen/mockData.js" 
              target="_blank" rel="noopener noreferrer">mockdata</a> - senare kanske via <a href="https://klimatkollen.se/sv/companies" target="_blank" rel="noopener noreferrer">Klimatkollen.se</a>:s API. Dess 
             baseUrl lär vara: <a href="https://api.klimatkollen.se/api" target="_blank" rel="noopener noreferrer">
             https://api.klimatkollen.se/api</a></p>
      </header>
      
      <main>
        {showInfo ? (
          <ProjectInfo />
        ) : (
          <>
            {/* Visa laddningsmeddelande om data håller på att hämtas */}
            {loading && <p className="loading">Laddar företagsdata...</p>}
            
            {/* Visa felmeddelande om det uppstod ett fel */}
            {error && <p className="error">{error}</p>}
            
            {/* Visa dashboard om data finns tillgänglig */}
            {!loading && !error && companies.length > 0 && (
              <Dashboard companies={companies} />
            )}
            
            {/* Visa meddelande om inga företag hittades */}
            {!loading && !error && companies.length === 0 && (
              <p>Inga företag hittades.</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
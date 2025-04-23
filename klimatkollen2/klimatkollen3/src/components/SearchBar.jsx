import { useState, useEffect } from 'react'
import './SearchBar.css'

function SearchBar({ searchTerm, onSearch }) {
  // Lokal state för att hantera inmatningsfältet
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  
  // Uppdatera lokal state när props ändras
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Hantera ändringar i sökfältet
  const handleChange = (e) => {
    const value = e.target.value
    setLocalSearchTerm(value)
  }

  // Hantera inlämning av sökningen
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(localSearchTerm)
  }

  // Hantera rensning av sökningen
  const handleClear = () => {
    setLocalSearchTerm('')
    onSearch('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Sök företag eller bransch..."
        value={localSearchTerm}
        onChange={handleChange}
        className="search-input"
      />
      
      {localSearchTerm && (
        <button 
          type="button" 
          className="clear-button"
          onClick={handleClear}
          aria-label="Rensa sökning"
        >
          ×
        </button>
      )}
      
      <button type="submit" className="search-button">
        Sök
      </button>
    </form>
  )
}

export default SearchBar
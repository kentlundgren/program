import { useState } from 'react'
import CompanyList from './CompanyList'
import CompanyDetails from './CompanyDetails'
import SearchBar from './SearchBar'
import { filterCompanies } from '../utils/dataHelpers'
import './Dashboard.css'

function Dashboard({ companies }) {
  // State för sökning
  const [searchTerm, setSearchTerm] = useState('')
  
  // State för att hålla det valda företaget
  const [selectedCompany, setSelectedCompany] = useState(null)
  
  // Filtrera företag baserat på sökterm
  const filteredCompanies = filterCompanies(companies, searchTerm)

  // Hantera sökändringar
  const handleSearch = (term) => {
    setSearchTerm(term)
    // Återställ valt företag när sökningen ändras
    setSelectedCompany(null)
  }

  // Hantera klick på företag
  const handleCompanySelect = (company) => {
    console.log("Selected company:", company); // För felsökning
    setSelectedCompany(company)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Företagsöversikt</h2>
        <SearchBar 
          searchTerm={searchTerm} 
          onSearch={handleSearch} 
        />
      </div>
      
      <div className="dashboard-content">
        <div className="companies-section">
          <h3>Företag ({filteredCompanies.length})</h3>
          <CompanyList 
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            onSelectCompany={handleCompanySelect}
          />
        </div>
        
        {selectedCompany && (
          <div className="details-section">
            <CompanyDetails company={selectedCompany} />
          </div>
        )}
        
        {!selectedCompany && (
          <div className="details-section empty-state">
            <p>Välj ett företag för att se detaljerad information</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
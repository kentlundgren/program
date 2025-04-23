import './CompanyList.css'

function CompanyList({ companies, selectedCompany, onSelectCompany }) {
  // Om det inte finns några företag, visa ett meddelande
  if (!companies || companies.length === 0) {
    return <div className="no-companies">Inga företag hittades</div>
  }

  return (
    <div className="company-list">
      <table>
        <thead>
          <tr>
            <th>Företagsnamn</th>
            <th>Bransch</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr 
              key={company.id} 
              className={selectedCompany && selectedCompany.id === company.id ? 'selected' : ''}
              onClick={() => onSelectCompany(company)}
            >
              <td>{company.name}</td>
              <td>{company.sector || 'Ej specificerad'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CompanyList
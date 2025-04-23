import './CompanyDetails.css'

function CompanyDetails({ company }) {
  if (!company) {
    return null
  }

  // Funktion för att formatera utsläppsvärden
  const formatEmissions = (value) => {
    if (value === undefined || value === null) return 'Ej tillgängligt';
    
    // För värden över 1 miljon, visa i miljoner
    if (value >= 1000000) {
      return `${(value / 1000000).toLocaleString('sv-SE', { maximumFractionDigits: 2 })} miljoner ton CO₂e`;
    }
    
    // För värden över 1000, visa i tusentals
    if (value >= 1000) {
      return `${(value / 1000).toLocaleString('sv-SE', { maximumFractionDigits: 1 })} tusen ton CO₂e`;
    }
    
    // För mindre värden, visa som de är
    return `${value.toLocaleString('sv-SE')} ton CO₂e`;
  }

  // Funktion för att få nuvarande år från rapporteringsperiod
  const getCurrentYear = () => {
    if (company.reportingPeriods && company.reportingPeriods.length > 0) {
      const endDate = new Date(company.reportingPeriods[0].endDate);
      return endDate.getFullYear();
    }
    return new Date().getFullYear();
  }

  return (
    <div className="company-details">
      <h3>{company.name}</h3>
      
      {company.description && (
        <p className="description">{company.description}</p>
      )}
      
      <div className="details-grid">
        <div className="detail-item">
          <span className="label">Bransch:</span>
          <span className="value">{company.sector || 'Ej specificerad'}</span>
        </div>
        
        <div className="detail-item">
          <span className="label">Utsläpp senaste året:</span>
          <span className="value">{formatEmissions(company.latestEmissions)}</span>
        </div>
        
        {company.emissionReduction && (
          <div className="detail-item">
            <span className="label">Utsläppsminskning:</span>
            <span className="value">{company.emissionReduction}%</span>
          </div>
        )}
        
        {company.targetYear && (
          <div className="detail-item">
            <span className="label">Målår för nollutsläpp:</span>
            <span className="value">{company.targetYear}</span>
          </div>
        )}
        
        {company.website && (
          <div className="detail-item">
            <span className="label">Webbplats:</span>
            <span className="value">
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                {company.website}
              </a>
            </span>
          </div>
        )}
      </div>
      
      {company.reportingPeriods && company.reportingPeriods.length > 0 && (
        <div className="emissions-details">
          <h4>Detaljer {getCurrentYear()}</h4>
          <div className="scopes-grid">
            <div className="scope-item">
              <span className="label">Scope 1 (direkta utsläpp):</span>
              <span className="value">{formatEmissions(company.reportingPeriods[0].emissions.scope1.total)}</span>
            </div>
            <div className="scope-item">
              <span className="label">Scope 2 (indirekta energiutsläpp):</span>
              <span className="value">{formatEmissions(company.reportingPeriods[0].emissions.scope2.total)}</span>
            </div>
            <div className="scope-item">
              <span className="label">Scope 3 (övriga indirekta utsläpp):</span>
              <span className="value">{formatEmissions(company.reportingPeriods[0].emissions.scope3.total)}</span>
            </div>
          </div>
        </div>
      )}
      
      {company.emissionsHistory && company.emissionsHistory.length > 0 && (
        <div className="emissions-history">
          <h4>Historiska utsläpp</h4>
          <table>
            <thead>
              <tr>
                <th>År</th>
                <th>Utsläpp</th>
                <th>Förändring</th>
              </tr>
            </thead>
            <tbody>
              {company.emissionsHistory.map((item, index) => {
                const prevEmissions = index < company.emissionsHistory.length - 1 
                  ? company.emissionsHistory[index + 1].emissions 
                  : null;
                
                let changePercent = null;
                let changeClass = '';
                
                if (prevEmissions !== null) {
                  changePercent = ((item.emissions - prevEmissions) / prevEmissions) * 100;
                  changeClass = changePercent < 0 ? 'decrease' : changePercent > 0 ? 'increase' : '';
                }
                
                return (
                  <tr key={item.year}>
                    <td>{item.year}</td>
                    <td>{formatEmissions(item.emissions)}</td>
                    <td className={changeClass}>
                      {changePercent !== null 
                        ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%` 
                        : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CompanyDetails
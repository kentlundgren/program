/**
 * Hjälpfunktioner för datahämtning och databearbetning
 */

/**
 * Hämtar företagsdata från Klimatkollen API
 * @returns {Promise<Array>} Array med företagsdata
 */
export async function fetchCompanies() {
    try {
      // Definiera API-URL för att hämta företagsdata
      const apiUrl = 'https://klimatkollen.se/api/companies';
      
      // Göra API-anrop med fetch
      const response = await fetch(apiUrl);
      
      // Kontrollera om svaret är OK
      if (!response.ok) {
        throw new Error(`API svarade med status: ${response.status}`);
      }
      
      // Konvertera svaret till JSON
      const data = await response.json();
      
      // Om API:et inte returnerar en array, kasta ett fel
      if (!Array.isArray(data)) {
        console.warn('API returnerade inte en array. Returnerade data:', data);
        // Om data har en companies-egenskap som är en array, använd den istället
        if (data && Array.isArray(data.companies)) {
          return data.companies;
        }
        return [];
      }
      
      // Returnera data
      return data;
      
    } catch (error) {
      // Logga fel och skicka vidare för hantering i komponenten
      console.error('Fel i fetchCompanies:', error);
      throw error;
    }
  }
  
  /**
   * Filtrerar företag baserat på sökterm
   * @param {Array} companies Lista med företag att filtrera
   * @param {string} searchTerm Sökterm att filtrera efter
   * @returns {Array} Filtrerade företag
   */
  export function filterCompanies(companies, searchTerm) {
    if (!searchTerm) return companies;
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    
    return companies.filter(company => 
      company.name.toLowerCase().includes(lowercaseSearchTerm) ||
      (company.sector && company.sector.toLowerCase().includes(lowercaseSearchTerm))
    );
  }
  
  /**
   * Sorterar företag baserat på kolumn och riktning
   * @param {Array} companies Lista med företag att sortera
   * @param {string} column Kolumn att sortera efter
   * @param {string} direction Riktning att sortera (asc eller desc)
   * @returns {Array} Sorterade företag
   */
  export function sortCompanies(companies, column, direction) {
    if (!column) return companies;
    
    return [...companies].sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];
      
      // Hantera numeriska värden
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      // Hantera textsträngsvärden
      valueA = String(valueA || '').toLowerCase();
      valueB = String(valueB || '').toLowerCase();
      
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
/**
 * api/index.js
 * 
 * Detta är vår huvudsakliga API-modul som hanterar kommunikation med Klimatkollen API
 * och kan växla mellan att använda riktigt API eller mockdata under utveckling.
 */

// Importera mockdata
import { mockCompanies, delay } from './mock/mockData';

// API-konfiguration
const API_CONFIG = {
  // Växla mellan mock-läge och riktigt API
  // OBS: Sätt denna till false när du har fått en riktig API-nyckel
  useMockData: true,
  
  // API-basadress
  baseUrl: 'https://api.klimatkollen.se/api',
  
  // API-nyckel (ersätt med din riktiga nyckel när du fått den)
  apiKey: 'YOUR_API_KEY'
};

/**
 * Basisk fetch-funktion för att göra API-anrop med korrekt autentisering
 * 
 * @param {string} endpoint - API-endpoint att anropa (t.ex. '/companies')
 * @param {Object} options - Fetch-options (method, headers, etc.)
 * @returns {Promise<any>} - Svar från API:et som JSON
 */
async function fetchFromApi(endpoint, options = {}) {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    ...options.headers
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API svarade med status: ${response.status} - ${errorText}`);
  }
  
  return response.json();
}

/**
 * Hämtar lista över alla företag
 * 
 * @returns {Promise<Array>} Lista med företagsdata
 */
export async function fetchCompanies() {
  try {
    // Om vi använder mockdata, returnera det istället för att göra API-anrop
    if (API_CONFIG.useMockData) {
      console.log('Använder mockdata för företag');
      // Simulera nätverksfördröjning för att testa loading states
      await delay(1000);
      return mockCompanies;
    }
    
    // Anropa det riktiga API:et
    return await fetchFromApi('/companies');
  } catch (error) {
    console.error('Fel vid hämtning av företag:', error);
    throw error;
  }
}

/**
 * Hämtar detaljerad information om ett specifikt företag
 * 
 * @param {string} wikidataId - Företagets Wikidata-ID (t.ex. "Q123456")
 * @returns {Promise<Object>} Detaljerad företagsdata
 */
export async function fetchCompanyDetails(wikidataId) {
  try {
    // Om vi använder mockdata, hitta företaget i mockdata
    if (API_CONFIG.useMockData) {
      console.log(`Använder mockdata för företag ${wikidataId}`);
      await delay(800);
      
      const company = mockCompanies.find(c => c.wikidataId === wikidataId);
      if (!company) {
        throw new Error(`Företag med ID ${wikidataId} hittades inte`);
      }
      
      return company;
    }
    
    // Anropa det riktiga API:et
    return await fetchFromApi(`/companies/${wikidataId}`);
  } catch (error) {
    console.error(`Fel vid hämtning av företag ${wikidataId}:`, error);
    throw error;
  }
}

/**
 * Söker efter företag baserat på namn eller andra kriterier
 * 
 * @param {string} searchTerm - Sökterm
 * @returns {Promise<Array>} Lista med matchande företag
 */
export async function searchCompanies(searchTerm) {
  try {
    // Om vi använder mockdata, filtrera mockdata
    if (API_CONFIG.useMockData) {
      console.log(`Söker i mockdata efter "${searchTerm}"`);
      await delay(600);
      
      // Enkelt filter baserat på företagsnamn och beskrivning
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      return mockCompanies.filter(company => 
        company.name.toLowerCase().includes(lowercaseSearchTerm) ||
        (company.description && 
         company.description.toLowerCase().includes(lowercaseSearchTerm))
      );
    }
    
    // I ett riktigt API skulle vi antagligen ha en sökendpoint
    // För nu antar vi att vi behöver hämta alla företag och filtrera själva
    const allCompanies = await fetchFromApi('/companies');
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return allCompanies.filter(company => 
      company.name.toLowerCase().includes(lowercaseSearchTerm) ||
      (company.description && 
       company.description.toLowerCase().includes(lowercaseSearchTerm))
    );
  } catch (error) {
    console.error(`Fel vid sökning efter "${searchTerm}":`, error);
    throw error;
  }
}

// Exportera hela API-objektet för enklare användning
export default {
  fetchCompanies,
  fetchCompanyDetails,
  searchCompanies
};
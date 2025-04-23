/**
 * api.js - Hanterar alla anrop till Kolada API med utökad felhantering och debugging
 */

// BasURL för Kolada API
const API_BASE_URL = 'https://api.kolada.se/v2';

/**
 * Hjälpfunktion för att göra API-anrop med utökad felhantering
 * @param {string} endpoint - API-endpunkt att anropa
 * @param {string} errorMessage - Felmeddelande om anropet misslyckas
 * @returns {Promise<Object>} - Data från API:et
 */
async function apiCall(endpoint, errorMessage) {
    console.log(`Anropar API: ${endpoint}`);
    
    try {
        // Lägg till CORS-proxy om det behövs (för lokal utveckling)
        // const url = `https://cors-anywhere.herokuapp.com/${API_BASE_URL}${endpoint}`;
        const url = `${API_BASE_URL}${endpoint}`;
        
        console.log(`Fullständig URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log(`API svarstatus: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API-fel: ${response.status} ${response.statusText}`);
            console.error(`Felsvar: ${errorText}`);
            throw new Error(`${errorMessage} (HTTP ${response.status}: ${response.statusText})`);
        }
        
        const data = await response.json();
        console.log(`API-data mottagen med ${data.values ? data.values.length : 0} värden`);
        return data;
    } catch (error) {
        console.error(`${errorMessage}: ${error.message}`);
        // Visa felet tydligt på sidan också
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            errorContainer.textContent = `${errorMessage}: ${error.message}`;
            errorContainer.style.display = 'block';
        }
        throw error;
    }
}

/**
 * Hämtar alla KPI-grupper från Kolada API
 * @returns {Promise<Array>} Array med KPI-grupper
 */
async function fetchKpiGroups() {
    const data = await apiCall('/kpi_groups', 'Kunde inte hämta KPI-grupper');
    return data.values;
}

/**
 * Hämtar alla KPIs från Kolada API
 * @returns {Promise<Array>} Array med KPIs
 */
async function fetchAllKpis() {
    const data = await apiCall('/kpi', 'Kunde inte hämta KPIs');
    return data.values;
}

/**
 * Hämtar alla kommuner från Kolada API
 * @returns {Promise<Array>} Array med kommuner
 */
async function fetchMunicipalities() {
    const data = await apiCall('/municipality', 'Kunde inte hämta kommuner');
    return data.values;
}

/**
 * Hämtar KPIs för en specifik grupp
 * @param {string} groupId - ID för KPI-gruppen
 * @returns {Promise<Array>} Array med KPIs i gruppen
 */
async function fetchKpisByGroup(groupId) {
    const data = await apiCall(`/kpi_groups/${groupId}/members`, 'Kunde inte hämta KPIs för gruppen');
    return data.values;
}

/**
 * Hämtar data för ett specifikt KPI, kommun och år
 * @param {string} kpiId - ID för nyckeltalet
 * @param {string} municipalityId - ID för kommunen
 * @param {string} years - År eller årsintervall
 * @returns {Promise<Object>} Data från API:et
 */
async function fetchKpiData(kpiId, municipalityId, years) {
    const endpoint = `/data/kpi/${kpiId}/municipality/${municipalityId}/year/${years}`;
    return await apiCall(endpoint, 'Kunde inte hämta KPI-data');
}

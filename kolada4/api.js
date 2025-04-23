/**
 * api.js - API-kommunikation för Kolada API Datahämtning
 * 
 * Denna fil innehåller all kod som är direkt relaterad till kommunikation med Kolada API.
 * Här finns funktioner för att hämta KPI-grupper, kommuner och data från API:et.
 * Denna separation gör det lättare att byta ut API-implementationen eller testa koden.
 */

// BasURL för Kolada API
const API_BASE_URL = 'https://api.kolada.se/v2';

// Objekt som exponerar API-funktioner
const KoladaAPI = {
    /**
     * Hämtar alla KPI-grupper från API
     * @returns {Promise<Array>} - Array med KPI-grupper
     */
    fetchKpiGroups: async function() {
        const response = await fetch(`${API_BASE_URL}/kpi_groups`);
        
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av KPI-grupper: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    },
    
    /**
     * Hämtar alla kommuner från API
     * @returns {Promise<Array>} - Array med kommuner
     */
    fetchMunicipalities: async function() {
        const response = await fetch(`${API_BASE_URL}/municipality`);
        
        if (!response.ok) {
            throw new Error(`Fel vid hämtning av kommuner: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    },
    
    /**
     * Hämtar data för ett specifikt nyckeltal, kommun och år(en)
     * @param {string} kpiId - ID för nyckeltalet
     * @param {string} municipalityId - ID för kommunen
     * @param {string} years - År (kommaseparerade)
     * @returns {Promise<Object>} - Resultatdata från API
     */
    fetchData: async function(kpiId, municipalityId, years) {
        const response = await fetch(`${API_BASE_URL}/data/kpi/${kpiId}/municipality/${municipalityId}/year/${years}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    }
};

// Exportera API-objektet så att det kan användas från andra filer
// I en riktig modul-baserad applikation skulle vi använt export/import
// men för enkelhetens skull använder vi global variabel
window.KoladaAPI = KoladaAPI;

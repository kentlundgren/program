/**
 * api.js - Hanterar alla anrop till Kolada API
 */

// BasURL för Kolada API
const API_BASE_URL = 'https://api.kolada.se/v2';

/**
 * Hjälpfunktion för att lägga till felsökningsinformation
 * @param {string} message - Meddelandet att logga
 */
function logDebug(message) {
    console.log(message);
    
    // Om felsökningsfunktionen finns, använd den
    if (typeof addDebugInfo === 'function') {
        addDebugInfo(message);
    }
}

/**
 * Hämtar alla KPI-grupper från Kolada API
 * @returns {Promise<Array>} Array med KPI-grupper
 */
async function fetchKpiGroups() {
    logDebug('Hämtar KPI-grupper...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/kpi_groups`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        logDebug(`Hämtade ${data.values.length} KPI-grupper`);
        return data.values;
    } catch (error) {
        logDebug(`Fel vid hämtning av KPI-grupper: ${error.message}`);
        throw error;
    }
}

/**
 * Hämtar alla KPIs från Kolada API
 * @returns {Promise<Array>} Array med KPIs
 */
async function fetchAllKpis() {
    logDebug('Hämtar alla KPIs...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/kpi`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        logDebug(`Hämtade ${data.values.length} KPIs`);
        return data.values;
    } catch (error) {
        logDebug(`Fel vid hämtning av KPIs: ${error.message}`);
        throw error;
    }
}

/**
 * Hämtar alla kommuner från Kolada API
 * @returns {Promise<Array>} Array med kommuner
 */
async function fetchMunicipalities() {
    logDebug('Hämtar kommuner...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/municipality`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        logDebug(`Hämtade ${data.values.length} kommuner`);
        return data.values;
    } catch (error) {
        logDebug(`Fel vid hämtning av kommuner: ${error.message}`);
        throw error;
    }
}

/**
 * Hämtar KPIs för en specifik grupp
 * @param {string} groupId - ID för KPI-gruppen
 * @returns {Promise<Array>} Array med KPIs i gruppen
 */
async function fetchKpisByGroup(groupId) {
    logDebug(`Hämtar KPIs för grupp ${groupId}...`);
    
    try {
        const response = await fetch(`${API_BASE_URL}/kpi_groups/${groupId}/members`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        logDebug(`Hämtade ${data.values.length} KPIs för grupp ${groupId}`);
        return data.values;
    } catch (error) {
        logDebug(`Fel vid hämtning av KPIs för grupp: ${error.message}`);
        throw error;
    }
}

/**
 * Hämtar data för ett specifikt KPI, kommun och år
 * @param {string} kpiId - ID för nyckeltalet
 * @param {string} municipalityId - ID för kommunen
 * @param {string} years - År eller årsintervall
 * @returns {Promise<Object>} Data från API:et
 */
async function fetchKpiData(kpiId, municipalityId, years) {
    logDebug(`Hämtar data för KPI=${kpiId}, kommun=${municipalityId}, år=${years}...`);
    
    try {
        const url = `${API_BASE_URL}/data/kpi/${kpiId}/municipality/${municipalityId}/year/${years}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        logDebug(`Hämtade ${data.values ? data.values.length : 0} datapunkter`);
        return data;
    } catch (error) {
        logDebug(`Fel vid hämtning av KPI-data: ${error.message}`);
        throw error;
    }
}

// Lägg till en kontroll för att se att api.js har laddats korrekt
logDebug('api.js har laddats');

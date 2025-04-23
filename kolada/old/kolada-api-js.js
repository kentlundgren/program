/**
 * api.js - Hanterar alla anrop till Kolada API
 */

// BasURL för Kolada API
const API_BASE_URL = 'https://api.kolada.se/v2';

/**
 * Hämtar alla KPI-grupper från Kolada API
 * @returns {Promise<Array>} Array med KPI-grupper
 */
async function fetchKpiGroups() {
    try {
        const response = await fetch(`${API_BASE_URL}/kpi_groups`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Fel vid hämtning av KPI-grupper:', error);
        throw error;
    }
}

/**
 * Hämtar alla KPIs från Kolada API
 * @returns {Promise<Array>} Array med KPIs
 */
async function fetchAllKpis() {
    try {
        const response = await fetch(`${API_BASE_URL}/kpi`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Fel vid hämtning av KPIs:', error);
        throw error;
    }
}

/**
 * Hämtar alla kommuner från Kolada API
 * @returns {Promise<Array>} Array med kommuner
 */
async function fetchMunicipalities() {
    try {
        const response = await fetch(`${API_BASE_URL}/municipality`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Fel vid hämtning av kommuner:', error);
        throw error;
    }
}

/**
 * Hämtar KPIs för en specifik grupp
 * @param {string} groupId - ID för KPI-gruppen
 * @returns {Promise<Array>} Array med KPIs i gruppen
 */
async function fetchKpisByGroup(groupId) {
    try {
        const response = await fetch(`${API_BASE_URL}/kpi_groups/${groupId}/members`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values;
    } catch (error) {
        console.error('Fel vid hämtning av KPIs för grupp:', error);
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
    try {
        const url = `${API_BASE_URL}/data/kpi/${kpiId}/municipality/${municipalityId}/year/${years}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fel vid hämtning av KPI-data:', error);
        throw error;
    }
}

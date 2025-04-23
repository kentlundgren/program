/**
 * app.js - Applikationslogik för Kolada API-sidan
 */

// Globala variabler för att lagra data
let allKpiGroups = [];
let allKpis = [];
let allMunicipalities = [];

// DOM-element
const kpiTypeSelect = document.getElementById('kpiType');
const kpiSelect = document.getElementById('kpi');
const municipalitySelect = document.getElementById('municipality');
const yearsInput = document.getElementById('years');
const fetchDataButton = document.getElementById('fetchData');
const loadingDiv = document.getElementById('loading');
const errorContainer = document.getElementById('errorContainer');
const tableContainer = document.getElementById('tableContainer');

// Lyssna på händelser
document.addEventListener('DOMContentLoaded', initializeApp);
kpiTypeSelect.addEventListener('change', loadKpisByGroup);
fetchDataButton.addEventListener('click', fetchSelectedData);

/**
 * Initialiserar applikationen genom att hämta nödvändig grunddata
 */
async function initializeApp() {
    try {
        // Visa laddningsindikator
        loadingDiv.style.display = 'block';
        
        // Hämta alla KPI-grupper, KPIs och kommuner parallellt
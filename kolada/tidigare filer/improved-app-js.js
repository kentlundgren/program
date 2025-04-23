/* jshint esversion: 8 */

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
        
        // Kontrollera att api.js-funktioner är tillgängliga
        if (typeof fetchKpiGroups !== 'function' || 
            typeof fetchAllKpis !== 'function' || 
            typeof fetchMunicipalities !== 'function') {
            throw new Error('API-funktioner saknas. Kontrollera att api.js är laddad.');
        }
        
        // Hämta alla KPI-grupper, KPIs och kommuner parallellt
        const results = await Promise.all([
            fetchKpiGroups(),
            fetchAllKpis(),
            fetchMunicipalities()
        ]);
        
        // Spara datan i globala variabler
        allKpiGroups = results[0];
        allKpis = results[1];
        allMunicipalities = results[2];
        
        // Populera dropdown-menyer
        populateKpiGroupsDropdown();
        populateMunicipalitiesDropdown();
        
        // Dölj laddningsindikator
        loadingDiv.style.display = 'none';
        
        console.log('Applikationen har initialiserats med:');
        console.log(`- ${allKpiGroups.length} KPI-grupper`);
        console.log(`- ${allKpis.length} KPIs`);
        console.log(`- ${allMunicipalities.length} kommuner`);
    } catch (error) {
        showError('Kunde inte initialisera applikationen: ' + error.message);
        loadingDiv.style.display = 'none';
    }
}

/**
 * Populerar dropdown-menyn med KPI-grupper
 */
function populateKpiGroupsDropdown() {
    allKpiGroups.forEach(function(group) {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.title;
        kpiTypeSelect.appendChild(option);
    });
}

/**
 * Populerar dropdown-menyn med kommuner
 */
function populateMunicipalitiesDropdown() {
    // Filtrera för att bara inkludera kommuner (inte regioner)
    const municipalities = allMunicipalities.filter(function(m) {
        return m.type === "K";
    });
    
    // Sortera kommuner alfabetiskt
    municipalities.sort(function(a, b) {
        return a.title.localeCompare(b.title);
    });
    
    // Lägg till "Hela riket" som ett alternativ först
    const national = allMunicipalities.find(function(m) {
        return m.id === "0000";
    });
    
    if (national) {
        municipalities.unshift(national);
    }
    
    // Lägg till alla kommuner i dropdown-menyn
    municipalities.forEach(function(municipality) {
        const option = document.createElement('option');
        option.value = municipality.id;
        option.textContent = municipality.title;
        municipalitySelect.appendChild(option);
    });
}

/**
 * Laddar KPIs baserat på vald KPI-grupp
 */
async function loadKpisByGroup() {
    const selectedGroupId = kpiTypeSelect.value;
    
    // Rensa tidigare val
    kpiSelect.innerHTML = '<option value="">Välj ett nyckeltal</option>';
    
    if (!selectedGroupId) {
        kpiSelect.disabled = true;
        return;
    }
    
    try {
        // Visa laddningsindikator
        loadingDiv.style.display = 'block';
        
        // Hämta KPIs i vald grupp
        const kpisInGroup = await fetchKpisByGroup(selectedGroupId);
        
        // För varje KPI i gruppen, hitta dess fullständiga information
        kpisInGroup.forEach(function(kpiRef) {
            const kpi = allKpis.find(function(k) {
                return k.id === kpiRef.member_id;
            });
            
            if (kpi) {
                const option = document.createElement('option');
                option.value = kpi.id;
                option.textContent = `${kpi.id} - ${kpi.title}`;
                kpiSelect.appendChild(option);
            }
        });
        
        kpiSelect.disabled = false;
        loadingDiv.style.display = 'none';
        console.log(`Laddat ${kpisInGroup.length} KPIs för grupp ${selectedGroupId}`);
    } catch (error) {
        showError('Kunde inte hämta KPIs för gruppen: ' + error.message);
        kpiSelect.disabled = true;
        loadingDiv.style.display = 'none';
    }
}

/**
 * Hämtar vald data från Kolada API baserat på användarens val
 */
async function fetchSelectedData() {
    const kpiId = kpiSelect.value;
    const municipalityId = municipalitySelect.value;
    const yearsRange = yearsInput.value.trim();
    
    // Validera indata
    if (!kpiId) {
        showError('Välj ett nyckeltal (KPI)');
        return;
    }
    
    if (!municipalityId) {
        showError('Välj en kommun');
        return;
    }
    
    // Validera och bearbeta årsintervall
    let years;
    if (yearsRange.includes('-')) {
        const yearParts = yearsRange.split('-');
        const startYear = parseInt(yearParts[0].trim(), 10);
        const endYear = parseInt(yearParts[1].trim(), 10);
        
        if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
            showError('Ogiltigt årsintervall. Använd formatet YYYY-YYYY');
            return;
        }
        
        // Skapa en array med alla år i intervallet
        const yearArray = [];
        for (let i = 0; i <= endYear - startYear; i++) {
            yearArray.push(startYear + i);
        }
        years = yearArray.join(',');
    } else {
        // Anta att det är ett enskilt år eller en kommaseparerad lista
        years = yearsRange;
    }
    
    try {
        // Dölj eventuella tidigare felmeddelanden
        errorContainer.style.display = 'none';
        
        // Visa laddningsindikator
        loadingDiv.style.display = 'block';
        
        // Hämta data från API
        const data = await fetchKpiData(kpiId, municipalityId, years);
        
        // Visa resultaten
        displayResults(data, kpiId);
        
        // Dölj laddningsindikator
        loadingDiv.style.display = 'none';
    } catch (error) {
        showError('Kunde inte hämta data: ' + error.message);
        loadingDiv.style.display = 'none';
    }
}

/**
 * Visar resultaten i en tabell
 * @param {Object} data - Data från API:et
 * @param {string} kpiId - ID för det valda nyckeltalet
 */
function displayResults(data, kpiId) {
    if (!data.values || data.values.length === 0) {
        tableContainer.innerHTML = '<p>Inga data hittades för de valda parametrarna.</p>';
        return;
    }
    
    // Hämta info om det valda nyckeltalet
    const selectedKpi = allKpis.find(function(k) {
        return k.id === kpiId;
    });
    
    // Gruppera data efter kommun och år
    const groupedData = {};
    const years = new Set();
    
    data.values.forEach(function(item) {
        const municipalityId = item.municipality;
        const year = item.period;
        const value = item.values[0];
        
        if (!groupedData[municipalityId]) {
            groupedData[municipalityId] = {};
        }
        
        groupedData[municipalityId][year] = value;
        years.add(year);
    });
    
    // Skapa tabellen
    const sortedYears = Array.from(years).sort();
    
    let tableHtml = '<h3>' + (selectedKpi ? selectedKpi.title : kpiId) + '</h3>';
    tableHtml += '<p><strong>Beskrivning:</strong> ' + (selectedKpi && selectedKpi.description ? selectedKpi.description : 'Ingen beskrivning tillgänglig') + '</p>';
    tableHtml += '<table><thead><tr><th>Kommun</th>';
    
    // Lägg till år som kolumnrubriker
    sortedYears.forEach(function(year) {
        tableHtml += '<th>' + year + '</th>';
    });
    
    tableHtml += '</tr></thead><tbody>';
    
    // Lägg till rader för varje kommun
    Object.keys(groupedData).forEach(function(municipalityId) {
        const municipality = allMunicipalities.find(function(m) {
            return m.id === municipalityId;
        });
        const municipalityName = municipality ? municipality.title : municipalityId;
        
        tableHtml += '<tr><td>' + municipalityName + '</td>';
        
        sortedYears.forEach(function(year) {
            const value = groupedData[municipalityId][year];
            tableHtml += '<td>' + (value ? value.toFixed(2) : '-') + '</td>';
        });
        
        tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    
    tableContainer.innerHTML = tableHtml;
}

/**
 * Visar ett felmeddelande
 * @param {string} message - Felmeddelandet som ska visas
 */
function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    console.error(message);
}

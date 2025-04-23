/* jshint esversion: 8 */

/**
 * app.js - Applikationslogik för Kolada API-sidan
 * 
 * VIKTIGA ÄNDRINGAR:
 * 1. NYTT TILLVÄGAGÅNGSSÄTT: Använder medlemsinformation direkt från kpi_groups API-svaret 
 *    istället för att göra separata anrop för varje grupp
 * 2. FÖRENKLAD STRUKTUR: Alla API-anrop görs i initializeApp-funktionen
 * 3. FÖRBÄTTRAD FELHANTERING: Tydligare felmeddelanden och bättre återhämtning från fel
 * 4. INGA SEPARATA ANROP för medlemmar (detta löser 404-felen)
 */

// Globala variabler för att lagra data
let allKpiGroups = [];        // Lagrar alla KPI-grupper med deras medlemmar
let allMunicipalities = [];   // Lagrar alla kommuner

// DOM-element
const kpiTypeSelect = document.getElementById('kpiType');
const kpiSelect = document.getElementById('kpi');
const municipalitySelect = document.getElementById('municipality');
const yearsInput = document.getElementById('years');
const fetchDataButton = document.getElementById('fetchData');
const loadingDiv = document.getElementById('loading');
const errorContainer = document.getElementById('errorContainer');
const tableContainer = document.getElementById('tableContainer');

// BasURL för Kolada API
const API_BASE_URL = 'https://api.kolada.se/v2';

// Lyssna på händelser
document.addEventListener('DOMContentLoaded', initializeApp);
kpiTypeSelect.addEventListener('change', loadKpisByGroup);
fetchDataButton.addEventListener('click', fetchSelectedData);

/**
 * Hjälpfunktion för att lägga till felsökningsinformation
 */
function addDebugInfo(message) {
    console.log(message);
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
        const timestamp = new Date().toLocaleTimeString();
        debugInfo.innerHTML += `[${timestamp}] ${message}<br>`;
    }
}

/**
 * Visar ett felmeddelande
 */
function showError(message) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    console.error(message);
    addDebugInfo('FEL: ' + message);
}

/**
 * Initialiserar applikationen genom att hämta nödvändig grunddata
 * 
 * ÄNDRINGAR: 
 * - Hämtar nu all data i ett steg
 * - Sparar medlemsinformation för varje grupp direkt
 * - Inget behov av att göra separata anrop för medlemmar
 */
async function initializeApp() {
    try {
        // Visa laddningsindikator
        loadingDiv.style.display = 'block';
        
        // ÄNDRING: Logga API-anrop för felsökning
        addDebugInfo('Hämtar KPI-grupper...');
        
        // Hämta alla KPI-grupper MED DERAS MEDLEMMAR i ett enda anrop
        const groupsResponse = await fetch(`${API_BASE_URL}/kpi_groups`);
        
        if (!groupsResponse.ok) {
            throw new Error(`Fel vid hämtning av KPI-grupper: ${groupsResponse.status}`);
        }
        
        const groupsData = await groupsResponse.json();
        allKpiGroups = groupsData.values;
        
        addDebugInfo(`Hämtade ${allKpiGroups.length} KPI-grupper`);
        
        // Hämta alla kommuner
        addDebugInfo('Hämtar kommuner...');
        const municipalitiesResponse = await fetch(`${API_BASE_URL}/municipality`);
        
        if (!municipalitiesResponse.ok) {
            throw new Error(`Fel vid hämtning av kommuner: ${municipalitiesResponse.status}`);
        }
        
        const municipalitiesData = await municipalitiesResponse.json();
        allMunicipalities = municipalitiesData.values;
        
        addDebugInfo(`Hämtade ${allMunicipalities.length} kommuner`);
        
        // Populera dropdown-menyer
        populateKpiGroupsDropdown();
        populateMunicipalitiesDropdown();
        
        // Dölj laddningsindikator
        loadingDiv.style.display = 'none';
    } catch (error) {
        showError('Kunde inte initialisera applikationen: ' + error.message);
        loadingDiv.style.display = 'none';
    }
}

/**
 * Populerar dropdown-menyn med KPI-grupper
 */
function populateKpiGroupsDropdown() {
    addDebugInfo('Populerar KPI-grupper dropdown...');
    
    // Filtrera bort grupper utan medlemmar för att undvika tomma val
    const validGroups = allKpiGroups.filter(function(group) {
        return group.members && group.members.length > 0;
    });
    
    validGroups.forEach(function(group) {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.title;
        kpiTypeSelect.appendChild(option);
    });
    
    addDebugInfo(`Lade till ${validGroups.length} KPI-grupper i dropdown`);
}

/**
 * Populerar dropdown-menyn med kommuner
 */
function populateMunicipalitiesDropdown() {
    addDebugInfo('Populerar kommuner dropdown...');
    
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
    
    addDebugInfo(`Lade till ${municipalities.length} kommuner i dropdown`);
}

/**
 * Laddar KPIs baserat på vald KPI-grupp
 * 
 * STOR ÄNDRING: 
 * - Använder nu medlemsinformation som redan finns i allKpiGroups
 * - Inget separat API-anrop behövs längre
 * - Detta löser 404-felet
 */
function loadKpisByGroup() {
    const selectedGroupId = kpiTypeSelect.value;
    
    addDebugInfo(`Laddar KPIs för grupp ${selectedGroupId}...`);
    
    // Rensa tidigare val
    kpiSelect.innerHTML = '<option value="">Välj ett nyckeltal</option>';
    
    if (!selectedGroupId) {
        kpiSelect.disabled = true;
        return;
    }
    
    try {
        // ÄNDRING: Hitta den valda gruppen i vår lokala data
        const selectedGroup = allKpiGroups.find(function(group) {
            return group.id === selectedGroupId;
        });
        
        if (!selectedGroup || !selectedGroup.members || selectedGroup.members.length === 0) {
            throw new Error('Kunde inte hitta medlemmar för den valda gruppen');
        }
        
        addDebugInfo(`Visar ${selectedGroup.members.length} KPIs för grupp ${selectedGroupId}`);
        
        // Populera dropdown med medlemmar direkt från den sparade gruppdatan
        selectedGroup.members.forEach(function(member) {
            const option = document.createElement('option');
            option.value = member.member_id;
            option.textContent = `${member.member_id} - ${member.member_title}`;
            kpiSelect.appendChild(option);
        });
        
        kpiSelect.disabled = false;
    } catch (error) {
        showError('Kunde inte ladda nyckeltalen: ' + error.message);
        kpiSelect.disabled = true;
    }
}

/**
 * Hämtar vald data från Kolada API baserat på användarens val
 */
async function fetchSelectedData() {
    addDebugInfo('Hämtar data för valda parametrar...');
    
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
        
        // Anropa API för att hämta data
        addDebugInfo(`Anropar API: /data/kpi/${kpiId}/municipality/${municipalityId}/year/${years}`);
        
        const response = await fetch(`${API_BASE_URL}/data/kpi/${kpiId}/municipality/${municipalityId}/year/${years}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        addDebugInfo(`Hämtade ${data.values ? data.values.length : 0} datapunkter`);
        
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
 */
function displayResults(data, kpiId) {
    addDebugInfo('Visar resultat...');
    
    if (!data.values || data.values.length === 0) {
        tableContainer.innerHTML = '<p>Inga data hittades för de valda parametrarna.</p>';
        return;
    }
    
    // Hitta KPI-information för det valda nyckeltalet
    let selectedKpiInfo = null;
    
    // ÄNDRING: Sök igenom alla grupper och deras medlemmar för att hitta KPI-information
    for (let i = 0; i < allKpiGroups.length; i++) {
        const group = allKpiGroups[i];
        if (group.members) {
            const kpiInfo = group.members.find(function(member) {
                return member.member_id === kpiId;
            });
            
            if (kpiInfo) {
                selectedKpiInfo = kpiInfo;
                break;
            }
        }
    }
    
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
    
    let tableHtml = '<h3>' + (selectedKpiInfo ? selectedKpiInfo.member_title : kpiId) + '</h3>';
    tableHtml += '<p><strong>Nyckeltal ID:</strong> ' + kpiId + '</p>';
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
    addDebugInfo('Resultattabell skapad');
}

// Visa/dölj felsökningsinformation
if (document.getElementById('toggleDebug')) {
    document.getElementById('toggleDebug').addEventListener('click', function() {
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) {
            debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
        }
    });
}

// Bekräfta att skriptet har laddats
addDebugInfo('app.js har laddats');

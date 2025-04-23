/**
 * app.js - Applikationslogik för Kolada API-sidan med utökad felhantering och debugging
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

// Kontrollera om alla DOM-element hittades korrekt
if (!kpiTypeSelect || !kpiSelect || !municipalitySelect || !yearsInput || 
    !fetchDataButton || !loadingDiv || !errorContainer || !tableContainer) {
    console.error('Ett eller flera DOM-element kunde inte hittas. Kontrollera HTML-strukturen.');
    alert('Ett fel uppstod vid initialisering. Kontrollera konsolen för detaljer.');
}

// Lyssna på händelser
document.addEventListener('DOMContentLoaded', initializeApp);
kpiTypeSelect.addEventListener('change', loadKpisByGroup);
fetchDataButton.addEventListener('click', fetchSelectedData);

/**
 * Visar ett felmeddelande både i konsolen och på sidan
 * @param {string} message - Felmeddelandet som ska visas
 */
function showError(message) {
    console.error(message);
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        alert(message);
    }
}

/**
 * Initialiserar applikationen genom att hämta nödvändig grunddata
 */
async function initializeApp() {
    console.log('Initialiserar applikationen...');
    
    try {
        // Visa laddningsindikator
        if (loadingDiv) loadingDiv.style.display = 'block';
        
        // Kontrollera att api.js är laddad korrekt
        if (typeof fetchKpiGroups !== 'function') {
            throw new Error('API-funktioner saknas. Kontrollera att api.js är korrekt inkluderad.');
        }
        
        console.log('Startar hämtning av grunddata...');
        
        // Hämta alla KPI-grupper, KPIs och kommuner parallellt
        try {
            console.log('Hämtar KPI-grupper...');
            allKpiGroups = await fetchKpiGroups();
            console.log(`Hämtade ${allKpiGroups.length} KPI-grupper.`);
        } catch (error) {
            console.error('Fel vid hämtning av KPI-grupper:', error);
        }
        
        try {
            console.log('Hämtar KPIs...');
            allKpis = await fetchAllKpis();
            console.log(`Hämtade ${allKpis.length} KPIs.`);
        } catch (error) {
            console.error('Fel vid hämtning av KPIs:', error);
        }
        
        try {
            console.log('Hämtar kommuner...');
            allMunicipalities = await fetchMunicipalities();
            console.log(`Hämtade ${allMunicipalities.length} kommuner.`);
        } catch (error) {
            console.error('Fel vid hämtning av kommuner:', error);
        }
        
        // Populera dropdown-menyer
        console.log('Populerar dropdown-menyer...');
        
        if (allKpiGroups.length > 0) {
            populateKpiGroupsDropdown();
        } else {
            showError('Inga KPI-grupper hämtades från API:et.');
        }
        
        if (allMunicipalities.length > 0) {
            populateMunicipalitiesDropdown();
        } else {
            showError('Inga kommuner hämtades från API:et.');
        }
        
        // Dölj laddningsindikator
        if (loadingDiv) loadingDiv.style.display = 'none';
        
        console.log('Applikationen har initialiserats med:');
        console.log(`- ${allKpiGroups.length} KPI-grupper`);
        console.log(`- ${allKpis.length} KPIs`);
        console.log(`- ${allMunicipalities.length} kommuner`);
    } catch (error) {
        showError('Kunde inte initialisera applikationen: ' + error.message);
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

/**
 * Populerar dropdown-menyn med KPI-grupper
 */
function populateKpiGroupsDropdown() {
    console.log('Populerar KPI-grupper dropdown...');
    
    if (!kpiTypeSelect) {
        console.error('kpiTypeSelect element hittades inte');
        return;
    }
    
    // Rensa befintliga alternativ (förutom det första)
    while (kpiTypeSelect.options.length > 1) {
        kpiTypeSelect.remove(1);
    }
    
    allKpiGroups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.title;
        kpiTypeSelect.appendChild(option);
    });
    
    console.log(`${allKpiGroups.length} KPI-grupper lades till i dropdown.`);
}

/**
 * Populerar dropdown-menyn med kommuner
 */
function populateMunicipalitiesDropdown() {
    console.log('Populerar kommuner dropdown...');
    
    if (!municipalitySelect) {
        console.error('municipalitySelect element hittades inte');
        return;
    }
    
    // Rensa befintliga alternativ (förutom det första)
    while (municipalitySelect.options.length > 1) {
        municipalitySelect.remove(1);
    }
    
    // Filtrera för att bara inkludera kommuner (inte regioner)
    const municipalities = allMunicipalities.filter(m => m.type === "K");
    
    // Sortera kommuner alfabetiskt
    municipalities.sort((a, b) => a.title.localeCompare(b.title));
    
    // Lägg till "Hela riket" som ett alternativ först
    const national = allMunicipalities.find(m => m.id === "0000");
    if (national) {
        municipalities.unshift(national);
    }
    
    // Lägg till alla kommuner i dropdown-menyn
    municipalities.forEach(municipality => {
        const option = document.createElement('option');
        option.value = municipality.id;
        option.textContent = municipality.title;
        municipalitySelect.appendChild(option);
    });
    
    console.log(`${municipalities.length} kommuner lades till i dropdown.`);
}

/**
 * Laddar KPIs baserat på vald KPI-grupp
 */
async function loadKpisByGroup() {
    const selectedGroupId = kpiTypeSelect.value;
    console.log(`loadKpisByGroup anropad med gruppID: ${selectedGroupId}`);
    
    if (!kpiSelect) {
        console.error('kpiSelect element hittades inte');
        return;
    }
    
    // Rensa tidigare val
    kpiSelect.innerHTML = '<option value="">Välj ett nyckeltal</option>';
    
    if (!selectedGroupId) {
        kpiSelect.disabled = true;
        return;
    }
    
    try {
        // Visa laddningsindikator
        if (loadingDiv) loadingDiv.style.display = 'block';
        
        console.log(`Hämtar KPIs för grupp ${selectedGroupId}...`);
        
        // Hämta KPIs i vald grupp
        const kpisInGroup = await fetchKpisByGroup(selectedGroupId);
        console.log(`Hämtade ${kpisInGroup.length} KPIs för grupp ${selectedGroupId}`);
        
        // För varje KPI i gruppen, hitta dess fullständiga information
        kpisInGroup.forEach(kpiRef => {
            const kpi = allKpis.find(k => k.id === kpiRef.member_id);
            if (kpi) {
                const option = document.createElement('option');
                option.value = kpi.id;
                option.textContent = `${kpi.id} - ${kpi.title}`;
                kpiSelect.appendChild(option);
            }
        });
        
        kpiSelect.disabled = false;
        if (loadingDiv) loadingDiv.style.display = 'none';
        console.log(`Lade till ${kpiSelect.options.length - 1} KPIs i dropdown`);
    } catch (error) {
        showError('Kunde inte hämta KPIs för gruppen: ' + error.message);
        kpiSelect.disabled = true;
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

/**
 * Hämtar vald data från Kolada API baserat på användarens val
 */
async function fetchSelectedData() {
    console.log('fetchSelectedData anropad');
    
    const kpiId = kpiSelect.value;
    const municipalityId = municipalitySelect.value;
    const yearsRange = yearsInput.value.trim();
    
    console.log(`Parametrar: KPI=${kpiId}, Kommun=${municipalityId}, År=${yearsRange}`);
    
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
        const [startYear, endYear] = yearsRange.split('-').map(y => parseInt(y.trim()));
        
        if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
            showError('Ogiltigt årsintervall. Använd formatet YYYY-YYYY');
            return;
        }
        
        // Skapa en array med alla år i intervallet
        years = Array.from(
            { length: endYear - startYear + 1 }, 
            (_, i) => startYear + i
        ).join(',');
    } else {
        // Anta att det är ett enskilt år eller en kommaseparerad lista
        years = yearsRange;
    }
    
    console.log(`Bearbetade år: ${years}`);
    
    try {
        // Dölj eventuella tidigare felmeddelanden
        if (errorContainer) errorContainer.style.display = 'none';
        
        // Visa laddningsindikator
        if (loadingDiv) loadingDiv.style.display = 'block';
        
        console.log(`Anropar API för data...`);
        
        // Hämta data från API
        const data = await fetchKpiData(kpiId, municipalityId, years);
        console.log(`Data mottagen: ${data.values ? data.values.length : 0} värden`);
        
        // Visa resultaten
        displayResults(data, kpiId);
        
        // Dölj laddningsindikator
        if (loadingDiv) loadingDiv.style.display = 'none';
    } catch (error) {
        showError('Kunde inte hämta data: ' + error.message);
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

/**
 * Visar resultaten i en tabell
 * @param {Object} data - Data från API:et
 * @param {string} kpiId - ID för det valda nyckeltalet
 */
function displayResults(data, kpiId) {
    console.log('displayResults anropad');
    
    if (!tableContainer) {
        console.error('tableContainer element hittades inte');
        return;
    }
    
    if (!data.values || data.values.length === 0) {
        tableContainer.innerHTML = '<p>Inga data hittades för de valda parametrarna.</p>';
        return;
    }
    
    // Hämta info om det valda nyckeltalet
    const selectedKpi = allKpis.find(k => k.id === kpiId);
    console.log(`Visar resultat för KPI: ${selectedKpi ? selectedKpi.title : kpiId}`);
    
    // Gruppera data efter kommun och år
    const groupedData = {};
    const years = new Set();
    
    data.values.forEach(item => {
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
    
    let tableHtml = `
        <h3>${selectedKpi ? selectedKpi.title : kpiId}</h3>
        <p><strong>Beskrivning:</strong> ${selectedKpi && selectedKpi.description ? selectedKpi.description : 'Ingen beskrivning tillgänglig'}</p>
        <table>
            <thead>
                <tr>
                    <th>Kommun</th>
                    ${sortedYears.map(year => `<th>${year}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;
    
    // Lägg till rader för varje kommun
    Object.keys(groupedData).forEach(municipalityId => {
        const municipality = allMunicipalities.find(m => m.id === municipalityId);
        const municipalityName = municipality ? municipality.title : municipalityId;
        
        tableHtml += `<tr><td>${municipalityName}</td>`;
        
        sortedYears.forEach(year => {
            const value = groupedData[municipalityId][year];
            tableHtml += `<td>${value ? value.toFixed(2) : '-'}</td>`;
        });
        
        tableHtml += `</tr>`;
    });
    
    tableHtml += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHtml;
    console.log('Resultat visas nu i tabellen');
}

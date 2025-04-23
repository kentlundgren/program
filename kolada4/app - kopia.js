/**
 * app.js - Applikationslogik för Kolada API Datahämtning
 * 
 * Denna fil innehåller applikationslogiken för webbapplikationen, såsom:
 * - Hantering av användargränssnittet
 * - Händelsehantering
 * - Datapresentation
 * - Cachehantering
 * - Felhantering
 *
 * Filen kommunicerar med api.js för att hämta data, men har inget direkt beroende
 * till API-implementationen, utan använder det interface som exponeras av KoladaAPI-objektet.
 */

// Globala variabler för att lagra data
let allKpiGroups = [];         // Lagrar alla KPI-grupper hämtade från API
let allMunicipalities = [];    // Lagrar alla kommuner hämtade från API
let dataAvailabilityCache = {}; // Cache för datatillgänglighet

// DOM-element
const kpiTypeSelect = document.getElementById('kpiType');
const kpiSelect = document.getElementById('kpi');
const municipalitySelect = document.getElementById('municipality');
const yearsInput = document.getElementById('years');
const fetchDataButton = document.getElementById('fetchData');
const previewDataButton = document.getElementById('previewData');
const loadingDiv = document.getElementById('loading');
const errorContainer = document.getElementById('errorContainer');
const infoContainer = document.getElementById('infoContainer');
const tableContainer = document.getElementById('tableContainer');
const debugInfo = document.getElementById('debugInfo');

/**
 * Hjälpfunktion för att lägga till felsökningsinformation
 * @param {string} message - Meddelande att logga
 */
function addDebugInfo(message) {
    console.log(message);
    if (debugInfo) {
        const timestamp = new Date().toLocaleTimeString();
        debugInfo.innerHTML += `[${timestamp}] ${message}<br>`;
    }
}

/**
 * Visar ett felmeddelande
 * @param {string} message - Felmeddelande att visa
 */
function showError(message) {
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
        
        // Dölj eventuella informationsmeddelanden
        if (infoContainer) {
            infoContainer.style.display = 'none';
        }
    }
    console.error(message);
    addDebugInfo('FEL: ' + message);
}

/**
 * Visar ett informationsmeddelande
 * @param {string} message - Informationsmeddelande att visa
 */
function showInfo(message) {
    if (infoContainer) {
        infoContainer.textContent = message;
        infoContainer.style.display = 'block';
        
        // Dölj eventuella felmeddelanden
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }
    console.info(message);
    addDebugInfo('INFO: ' + message);
}

/**
 * Initialiserar applikationen genom att hämta nödvändig data från API
 * Kommunicerar med api.js genom att anropa KoladaAPI-funktioner
 */
async function initializeApp() {
    try {
        addDebugInfo("initializeApp startad");
        
        // Visa laddningsindikator
        if (loadingDiv) {
            loadingDiv.style.display = 'block';
        }
        
        // Hämta alla KPI-grupper via KoladaAPI-objektet
        addDebugInfo('Hämtar KPI-grupper via KoladaAPI...');
        allKpiGroups = await window.KoladaAPI.fetchKpiGroups();
        addDebugInfo(`Hämtade ${allKpiGroups.length} KPI-grupper`);
        
        // Hämta alla kommuner via KoladaAPI-objektet
        addDebugInfo('Hämtar kommuner via KoladaAPI...');
        allMunicipalities = await window.KoladaAPI.fetchMunicipalities();
        addDebugInfo(`Hämtade ${allMunicipalities.length} kommuner`);
        
        // Populera dropdown-menyer
        populateKpiGroupsDropdown();
        populateMunicipalitiesDropdown();
        
        // Dölj laddningsindikator
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        
        addDebugInfo("initializeApp klar");
        
        // Visa startmeddelande
        showInfo("Välj KPI-kategori, nyckeltal, kommun och år - använd sedan 'Förhandsgranska' för att kontrollera om data finns tillgänglig");
    } catch (error) {
        showError('Kunde inte initialisera applikationen: ' + error.message);
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
}

/**
 * Populerar dropdown-menyn med KPI-grupper
 */
function populateKpiGroupsDropdown() {
    addDebugInfo('Populerar KPI-grupper dropdown...');
    
    // Filtrera bort grupper utan medlemmar
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
        // Hitta den valda gruppen i vår lokala data
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
 * Förbereder och validerar årsintervall
 * @param {string} yearsRange - Årsintervall angivet av användaren
 * @returns {string|null} - Validerad årsintervall eller null vid fel
 */
function prepareYearsParameter(yearsRange) {
    if (yearsRange.includes('-')) {
        const yearParts = yearsRange.split('-');
        const startYear = parseInt(yearParts[0].trim(), 10);
        const endYear = parseInt(yearParts[1].trim(), 10);
        
        if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
            showError('Ogiltigt årsintervall. Använd formatet YYYY-YYYY');
            return null;
        }
        
        // Skapa en array med alla år i intervallet
        const yearArray = [];
        for (let i = 0; i <= endYear - startYear; i++) {
            yearArray.push(startYear + i);
        }
        return yearArray.join(',');
    } else {
        // Anta att det är ett enskilt år eller en kommaseparerad lista
        return yearsRange;
    }
}

/**
 * Förhandsgranska datatillgänglighet
 * Kommunicerar med api.js genom att anropa KoladaAPI.fetchData
 */
async function previewDataAvailability() {
    const kpiId = kpiSelect.value;
    const municipalityId = municipalitySelect.value;
    const yearsRange = yearsInput.value.trim();
    
    // Validera indata
    if (!kpiId) {
        showError('Välj ett nyckeltal (KPI) för att förhandsgranska');
        return;
    }
    
    if (!municipalityId) {
        showError('Välj en kommun för att förhandsgranska');
        return;
    }
    
    // Validera och bearbeta årsintervall
    const years = prepareYearsParameter(yearsRange);
    if (!years) return; // Felmeddelande visas redan i prepareYearsParameter
    
    // Skapa en cache-nyckel
    const cacheKey = `${kpiId}_${municipalityId}_${years}`;
    
    try {
        // Kontrollera om vi redan har cachad information
        if (dataAvailabilityCache[cacheKey]) {
            const cachedData = dataAvailabilityCache[cacheKey];
            showDataPreview(cachedData, kpiId, municipalityId, years);
            return;
        }
        
        // Dölj eventuella tidigare meddelanden
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        if (infoContainer) {
            infoContainer.style.display = 'none';
        }
        
        // Visa laddningsindikator
        if (loadingDiv) {
            loadingDiv.style.display = 'block';
        }
        
        // Anropa API via KoladaAPI-objektet för att hämta data
        addDebugInfo(`Förhandsgranskar data: kpi/${kpiId}/municipality/${municipalityId}/year/${years}`);
        const data = await window.KoladaAPI.fetchData(kpiId, municipalityId, years);
        
        // Casha resultatet
        dataAvailabilityCache[cacheKey] = data;
        
        // Visa resultatet
        showDataPreview(data, kpiId, municipalityId, years);
        
        // Dölj laddningsindikator
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    } catch (error) {
        showError('Kunde inte förhandsgranska data: ' + error.message);
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
}

/**
 * Visa förhandsgranskning av datatillgänglighet
 * @param {Object} data - Data hämtad från API
 * @param {string} kpiId - ID för valt nyckeltal
 * @param {string} municipalityId - ID för vald kommun
 * @param {string} years - Valda år (kommaseparerade)
 */
function showDataPreview(data, kpiId, municipalityId, years) {
    if (!data.values || data.values.length === 0) {
        showInfo(`?? Inga data hittades för ${kpiId} i ${getMunicipalityName(municipalityId)} för åren ${years}. Prova med andra val.`);
        return;
    }
    
    // Räkna faktiska datapunkter (inte null/undefined)
    let actualDataPoints = 0;
    let totalDataPoints = 0;
    let yearsWithData = new Set();
    
    data.values.forEach(function(item) {
        totalDataPoints++;
        const value = item.values[0] && item.values[0].value;
        if (value !== null && value !== undefined && typeof value === 'number' && !isNaN(value)) {
            actualDataPoints++;
            yearsWithData.add(item.period);
        }
    });
    
    // Hämta KPI-titel
    let kpiTitle = kpiId;
    for (let i = 0; i < allKpiGroups.length; i++) {
        const group = allKpiGroups[i];
        if (group.members) {
            const kpiInfo = group.members.find(function(member) {
                return member.member_id === kpiId;
            });
            
            if (kpiInfo) {
                kpiTitle = kpiInfo.member_title;
                break;
            }
        }
    }
    
    if (actualDataPoints > 0) {
        const yearsWithDataArray = Array.from(yearsWithData).sort();
        showInfo(`? Hittade ${actualDataPoints} datapunkter för "${kpiTitle}" i ${getMunicipalityName(municipalityId)}. 
                 År med data: ${yearsWithDataArray.join(', ')}`);
    } else {
        showInfo(`?? Inga faktiska värden hittades för "${kpiTitle}" i ${getMunicipalityName(municipalityId)} för åren ${years}. 
                 API:et returnerar ${totalDataPoints} tomma datapunkter. Prova med andra val.`);
    }
}

/**
 * Hjälpfunktion för att hämta kommunnamn
 * @param {string} municipalityId - ID för kommunen
 * @returns {string} - Kommunens namn
 */
function getMunicipalityName(municipalityId) {
    const municipality = allMunicipalities.find(function(m) {
        return m.id === municipalityId;
    });
    return municipality ? municipality.title : municipalityId;
}

/**
 * Hämtar vald data från Kolada API
 * Kommunicerar med api.js genom att anropa KoladaAPI.fetchData
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
    const years = prepareYearsParameter(yearsRange);
    if (!years) return; // Felmeddelande visas redan i prepareYearsParameter
    
    // Skapa en cache-nyckel
    const cacheKey = `${kpiId}_${municipalityId}_${years}`;
    
    try {
        // Dölj eventuella tidigare meddelanden
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        if (infoContainer) {
            infoContainer.style.display = 'none';
        }
        
        // Visa laddningsindikator
        if (loadingDiv) {
            loadingDiv.style.display = 'block';
        }
        
        let data;
        
        // Kontrollera om vi har data i cachen
        if (dataAvailabilityCache[cacheKey]) {
            data = dataAvailabilityCache[cacheKey];
            addDebugInfo('Använder cachad data');
        } else {
            // Anropa API via KoladaAPI-objektet
            addDebugInfo(`Anropar API: kpi/${kpiId}/municipality/${municipalityId}/year/${years}`);
            data = await window.KoladaAPI.fetchData(kpiId, municipalityId, years);
            
            // Casha resultatet
            dataAvailabilityCache[cacheKey] = data;
        }
        
        addDebugInfo(`Hämtade ${data.values ? data.values.length : 0} datapunkter`);
        
        // Visa resultaten
        displayResults(data, kpiId);
        
        // Dölj laddningsindikator
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    } catch (error) {
        showError('Kunde inte hämta data: ' + error.message);
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
}

/**
 * Visar resultaten i en tabell
 * @param {Object} data - Data hämtad från API
 * @param {string} kpiId - ID för valt nyckeltal
 */
function displayResults(data, kpiId) {
    addDebugInfo('Visar resultat...');
    
    if (!data.values || data.values.length === 0) {
        tableContainer.innerHTML = '<p>Inga data hittades för de valda parametrarna.</p>';
        return;
    }
    
    // Hitta KPI-information för det valda nyckeltalet
    let selectedKpiInfo = null;
    
    // Sök igenom alla grupper och deras medlemmar för att hitta KPI-information
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

       // const value = item.values && item.values.length > 0 && item.values[0].value;

        // Hitta värdet där gender = "T" (totalt)
        let value = null;
        if (item.values && item.values.length > 0) {
            // Leta igenom values-arrayen efter gender="T"
            for (let i = 0; i < item.values.length; i++) {
                if (item.values[i].gender === "T") {
                    value = item.values[i].value;
                    break;
                }
            }
            // Om ingen gender="T" hittades, använd första värdet som reserv
            if (value === null && item.values[0]) {
                value = item.values[0].value;
            }
        }   
        
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
            
            // Kontrollera noggrant att värdet är ett nummer innan toFixed anropas
            if (value !== null && value !== undefined && typeof value === 'number' && !isNaN(value)) {
                tableHtml += '<td>' + value.toFixed(2) + '</td>';
            } else {
                tableHtml += '<td>-</td>';
            }
        });
        
        tableHtml += '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    
    tableContainer.innerHTML = tableHtml;
    addDebugInfo('Resultattabell skapad');
}

// ===== EVENTLYSSNARE =====

// Initialisera applikationen när DOM är laddad
document.addEventListener('DOMContentLoaded', function() {
    addDebugInfo('DOM laddad, initialiserar applikation...');
    initializeApp();
});

// Lyssna på ändringar i KPI-typ dropdown
kpiTypeSelect.addEventListener('change', loadKpisByGroup);

// Lyssna på klick på förhandsgranskningsknappen
previewDataButton.addEventListener('click', previewDataAvailability);

// Lyssna på klick på hämta data-knappen
fetchDataButton.addEventListener('click', fetchSelectedData);

// Visa/dölj felsökningsinformation
document.getElementById('toggleDebug').addEventListener('click', function() {
    debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
});

// Logga att skriptet har laddats
addDebugInfo('Skriptet har laddats');

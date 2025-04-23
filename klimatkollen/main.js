/**
 * Huvudmodulen som knyter ihop applikationens komponenter
 */

// Elementen i DOM:en som vi kommer att interagera med
let searchInput, searchButton, companiesContainer, loadingIndicator, errorMessage;

// Initialiserar applikationen när DOM:en är laddad
document.addEventListener('DOMContentLoaded', initialize);

/**
 * Initialiserar applikationen och konfigurerar händelselyssnare
 */
function initialize() {
    // Hämta referenser till DOM-element
    searchInput = document.getElementById('searchInput');
    searchButton = document.getElementById('searchButton');
    companiesContainer = document.getElementById('companiesContainer');
    loadingIndicator = document.getElementById('loadingIndicator');
    errorMessage = document.getElementById('errorMessage');
    
    // Konfigurera händelselyssnare
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Ladda initiala företag
    loadInitialCompanies();
}

/**
 * Hanterar sökning när användaren klickar på sökknappen eller trycker Enter
 */
async function handleSearch() {
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm === '') {
        showError('Ange ett sökord för att hitta företag');
        return;
    }
    
    try {
        showLoading(true);
        clearResults();
        
        // Anropa API-funktionen för att söka efter företag
        const response = await searchCompanies(searchTerm);
        
        if (response.success) {
            if (response.data.length === 0) {
                showError('Inga företag hittades för söktermen: ' + searchTerm);
            } else {
                renderCompanies(response.data);
            }
        } else {
            showError('Sökningen misslyckades: ' + response.error);
        }
    } catch (error) {
        console.error('Error during search:', error);
        showError('Ett fel inträffade vid sökning: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Laddar in initiala företagsdata när sidan först visas
 */
async function loadInitialCompanies() {
    try {
        showLoading(true);
        
        // Anropa API-funktionen för att hämta alla företag
        const response = await fetchAllCompanies();
        
        if (response.success) {
            renderCompanies(response.data);
        } else {
            showError('Kunde inte ladda företagsdata: ' + response.error);
        }
    } catch (error) {
        console.error('Error loading initial companies:', error);
        showError('Ett oväntat fel inträffade: ' + error.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Visar företagskort baserat på returnerad data
 * @param {Array} companies - Array med företagsobjekt att visa
 */
function renderCompanies(companies) {
    clearResults();
    
    companies.forEach(company => {
        // Skapa ett div-element för företagskortet
        const companyCard = document.createElement('div');
        companyCard.className = 'company-card';
        
        // Lägg till detaljerad information om företaget
        companyCard.innerHTML = `
            <div class="company-name">${company.name}</div>
            <div>Bransch: ${company.industry}</div>
            <div>Scope 1: ${company.scope1.toLocaleString()} ton CO2e</div>
            <div>Scope 2: ${company.scope2.toLocaleString()} ton CO2e</div>
            <div>Scope 3: ${company.scope3.toLocaleString()} ton CO2e</div>
            <div class="emissions-data">
                <strong>Totala utsläpp: ${company.totalEmissions.toLocaleString()} ton CO2e</strong>
            </div>
            <div class="chart-container">
                <canvas id="chart-${company.id}"></canvas>
            </div>
        `;
        
        // Lägg till kortet i behållaren
        companiesContainer.appendChild(companyCard);
        
        // Skapa diagram för företagets utsläpp
        createEmissionsChart(company, `chart-${company.id}`);
    });
}

/**
 * Visar eller döljer laddningsindikatorn
 * @param {boolean} show - Om laddningsindikatorn ska visas eller inte
 */
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

/**
 * Visar ett felmeddelande
 * @param {string} message - Felmeddelandet som ska visas
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

/**
 * Rensar tidigare sökresultat och felmeddelanden
 */
function clearResults() {
    companiesContainer.innerHTML = '';
    errorMessage.style.display = 'none';
}
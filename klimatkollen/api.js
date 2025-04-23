/**
 * API-modulen hanterar alla anrop till Klimatkollen:s API
 */

// Bas-URL för Klimatkollen:s API (hypotetisk)
const API_BASE_URL = 'https://klimatkollen.se/api/companies';

/**
 * Hämtar alla företag från API:et
 * @returns {Promise} Ett löfte som returnerar företagsdata
 */
async function fetchAllCompanies() {
    try {
        // I ett verkligt scenario skulle detta anropa den faktiska API-endpointen
        // const response = await fetch(`${API_BASE_URL}`);
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // const data = await response.json();
        // return { success: true, data };
        
        // Eftersom vi inte har tillgång till den faktiska API:n, simulerar vi resultatet
        return await simulateApiCall([]);
    } catch (error) {
        console.error('Error fetching companies:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Söker efter företag baserat på sökterm
 * @param {string} searchTerm - Sökterm för att filtrera företag
 * @returns {Promise} Ett löfte som returnerar filtrerade företag
 */
async function searchCompanies(searchTerm) {
    try {
        // I ett verkligt scenario skulle detta anropa den faktiska API-endpointen
        // const response = await fetch(`${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}`);
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // const data = await response.json();
        // return { success: true, data };
        
        // Simulering av API-anrop
        return await simulateApiCall(searchTerm);
    } catch (error) {
        console.error('Error searching companies:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Hämtar detaljerad information om ett specifikt företag
 * @param {string} companyId - ID för företaget
 * @returns {Promise} Ett löfte som returnerar företagsdetaljer
 */
async function getCompanyDetails(companyId) {
    try {
        // I ett verkligt scenario skulle detta anropa den faktiska API-endpointen
        // const response = await fetch(`${API_BASE_URL}/${companyId}`);
        // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // const data = await response.json();
        // return { success: true, data };
        
        // Simulering av API-anrop
        const allCompanies = await simulateApiCall([]);
        if (!allCompanies.success) throw new Error(allCompanies.error);
        
        const company = allCompanies.data.find(c => c.id === companyId);
        if (!company) throw new Error(`Företag med ID ${companyId} hittades inte`);
        
        return { success: true, data: company };
    } catch (error) {
        console.error(`Error fetching company details for ID ${companyId}:`, error);
        return { success: false, error: error.message };
    }
}

/**
 * Simulerar ett API-anrop (används endast för demo)
 * @param {string|array} searchTerm - Sökterm eller tom array för alla företag
 * @returns {Promise} Ett löfte som returnerar simulerade data
 */
async function simulateApiCall(searchTerm) {
    // Simulera en nätverksfördröjning
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulera exempeldata
    const mockCompanies = [
        {
            id: '1',
            name: 'Volvo Group',
            industry: 'Fordonsindustri',
            scope1: 213000,
            scope2: 188000,
            scope3: 34890000,
            totalEmissions: 35291000
        },
        {
            id: '2',
            name: 'IKEA AB',
            industry: 'Detaljhandel',
            scope1: 112000,
            scope2: 467000,
            scope3: 23670000,
            totalEmissions: 24249000
        },
        {
            id: '3',
            name: 'Ericsson',
            industry: 'Telekommunikation',
            scope1: 12600,
            scope2: 134000,
            scope3: 8760000,
            totalEmissions: 8906600
        },
        {
            id: '4',
            name: 'H&M Group',
            industry: 'Detaljhandel',
            scope1: 11800,
            scope2: 339000,
            scope3: 17893000,
            totalEmissions: 18243800
        }
    ];
    
    // Om vi skickar in en tom söksträng, returnera alla företag
    if (searchTerm === '' || searchTerm.length === 0) {
        return {
            success: true,
            data: mockCompanies
        };
    }
    
    // Filtrera företag baserat på söktermen (söker i företagsnamn och bransch)
    if (typeof searchTerm === 'string') {
        const searchTermLower = searchTerm.toLowerCase();
        const filteredCompanies = mockCompanies.filter(company => 
            company.name.toLowerCase().includes(searchTermLower) || 
            company.industry.toLowerCase().includes(searchTermLower)
        );
        
        return {
            success: true,
            data: filteredCompanies
        };
    }
    
    // Om något går fel, returnera ett fel
    return {
        success: false,
        error: 'Ogiltig sökterm'
    };
}
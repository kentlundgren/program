 // ==================== DEL 1 BÖRJAR ====================

// ==================== VIKTIGA ÄNDRINGAR ====================
// 1. Omskriven Excel-exportfunktion för att säkerställa alla 17 dimensioner
// 2. Förbättrad dataformatering innan Excel-export
// 3. Korrigerad hantering av kolumnordning och rubriker
// 4. Säkerställd korrekt hantering av tomma kolumner och valbelopp
// ==================================================

// Originaldata för exemplen (behåller enkel visning för tydlighet)
const originalExampleData = {
    '2a': {
        title: 'Typ 2a: Samma objektkod för både kontering av intäkter och kostnader',
        description: 'Exempel: Fäladen stödboende/akutboende',
        objektkod: '8964',
        rows: [
            { konto: '6132', belopp: 15588, text: 'Fäladen stödboende/akutboende' },
            { konto: '3153', belopp: -2420, text: 'Fäladen stödboende/akutboende - storstädning' },
            { konto: '3153', belopp: -359, text: 'Fäladen stödboende/akutboende - fönsterputs' },
            { konto: '3153', belopp: -12809, text: 'Fäladen stödboende/akutboende - fast intäkt' }
        ]
    },
    '2b': {
        title: 'Typ 2b: Utan objektkod',
        description: 'Exempel: Borstahusen bod/fikarum/omklädningsrum',
        rows: [
            { konto: '6132', belopp: 1821, text: 'Borstahusen bod/fikarum/omklädningsrum' },
            { konto: '3153', belopp: -1821, text: 'Borstahusen bod/fikarum/omklädningsrum - fast intäkt' },
            { konto: '6132', belopp: 151, text: 'Borstahusen bod/fikarum/omklädningsrum' },
            { konto: '3153', belopp: -151, text: 'Borstahusen bod/fikarum/omklädningsrum - storstädning' },
            { konto: '6132', belopp: 26, text: 'Borstahusen bod/fikarum/omklädningsrum' },
            { konto: '3153', belopp: -26, text: 'Borstahusen bod/fikarum/omklädningsrum - fönsterputs' }
        ]
    },
    '2c': {
        title: 'Typ 2c: Objektkod endast på intäkter',
        description: 'Exempel: Tellus idrottsvägen 16',
        objektkod: '8948',
        rows: [
            { konto: '6132', belopp: 12815, text: 'Tellus idrottsvägen 16' },
            { konto: '3153', belopp: -12815, text: 'Tellus idrottsvägen 16 - fast intäkt' },
            { konto: '6132', belopp: 1684, text: 'Tellus idrottsvägen 16' },
            { konto: '3153', belopp: -1684, text: 'Tellus idrottsvägen 16 - storstädning' },
            { konto: '6132', belopp: 459, text: 'Tellus idrottsvägen 16' },
            { konto: '3153', belopp: -459, text: 'Tellus idrottsvägen 16 - fönsterputs' }
        ]
    },
    '2d': {
        title: 'Typ 2d: Objektkod endast på kostnader',
        description: 'Exempel: Emaljgatan våning 3, IT',
        objektkod: '5736',
        rows: [
            { konto: '6132', belopp: 21614, text: 'Emaljgatan våning 3, IT' },
            { konto: '3153', belopp: -20385, text: 'Emaljgatan våning 3, IT - fast intäkt' },
            { konto: '3153', belopp: -1229, text: 'Emaljgatan våning 3, IT - fönsterputs' }
        ]
    }
};
// Globala variabler för tillstånd
let currentState = {
    showingOriginal: false,
    currentData: {}
};
let contracts = [];
let editingId = null;

// ==================== Validering och Formatering ====================

// Validera periodformat (YYYYMM för 2025)
function validatePeriod(period) {
    if (!/^\d{6}$/.test(period)) {
        return false;
    }
    const year = parseInt(period.substring(0, 4));
    const month = parseInt(period.substring(4, 6));
    return year === 2025 && month >= 1 && month <= 12;
}

// Formatera belopp enligt svensk standard
function formatAmount(amount) {
    return Math.abs(amount).toLocaleString('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// ==================== Datahantering och Konvertering ====================

// Skapa fullständig konteringsrad med alla 17 dimensioner
function createFullKonteringsRow(data) {
    return {
        rad: data.rad || '',
        konto: data.konto || '',
        ansvar: data.ansvar || '',
        projekt: '',  // Alltid tom
        anl: '',     // Alltid tom
        verksamhet: data.verksamhet || '',
        aktivitet: data.aktivitet || '',
        motpart: data.motpart || '',
        objekt: data.objekt || '',
        mk: '',      // Alltid tom
        ms: '',      // Alltid tom
        period: data.period || '',
        periodiseringsnyckel: '', // Alltid tom
        valbelopp: data.belopp || 0, // Samma som belopp
        valuta: '',  // Alltid tom
        belopp: data.belopp || 0,
        text: data.text || ''
    };
}

// Generera konteringsrader för ett kontrakt
function generateKontering(contract) {
    let rows = [];
    let rowNumber = 1;

    // Kostnadsrad
    rows.push(createFullKonteringsRow({
        rad: rowNumber++,
        konto: contract.konto || '6132',  // Default till 6132 om inget annat anges
        ansvar: contract.costAnsvar,
        verksamhet: contract.costVerksamhet,
        aktivitet: '7600',
        motpart: '180',
        objekt: (contract.objectCodeType === '2a' || contract.objectCodeType === '2d') ? contract.objectCode : '',
        period: contract.period,
        belopp: contract.totalAmount,
        text: contract.name
    }));

    // Intäktsrader
    const activities = [
        { code: '8036', verksamhet: '9349', text: ' - fast intäkt' },
        { code: '8035', verksamhet: '9347', text: ' - fönsterputs' },
        { code: '8032', verksamhet: '9349', text: ' - storstädning' }
    ];

    activities.forEach(activity => {
        const amount = contract.activities[activity.code].amount;
        if (amount > 0) {
            rows.push(createFullKonteringsRow({
                rad: rowNumber++,
                konto: '3153',
                ansvar: contract.activities[activity.code].ansvar,
                verksamhet: activity.verksamhet,
                aktivitet: activity.code,
                motpart: contract.motpart,
                objekt: (contract.objectCodeType === '2a' || contract.objectCodeType === '2c') ? contract.objectCode : '',
                period: contract.period,
                belopp: -amount,
                text: `${contract.name}${activity.text}`
            }));
        }
    });

    return rows;
}

// ==================== UPPDATERAD Excel Export ====================
// Denna funktion har omstrukturerats för att garantera 17 kolumner

function exportToExcel() {
    // Hämta data från alla kontrakt
    const exportData = contracts.flatMap(contract => generateKontering(contract));
    
    // Definiera kolumnordningen - detta är nyckeln till 17 kolumner
    const columnOrder = [
        'rad', 'konto', 'ansvar', 'projekt', 'anl', 
        'verksamhet', 'aktivitet', 'motpart', 'objekt',
        'mk', 'ms', 'period', 'periodiseringsnyckel',
        'valbelopp', 'valuta', 'belopp', 'text'
    ];

    // Skapa ett objekt för kolumnrubriker
    const headers = columnOrder.reduce((obj, col) => ({...obj, [col]: col}), {});

    // Formatera data med garanterade kolumner
    const formattedData = exportData.map(row => {
        const newRow = {};
        columnOrder.forEach(col => {
            if (col === 'valbelopp') {
                newRow[col] = row.belopp;  // Valbelopp ska vara samma som belopp
            } else if (['projekt', 'anl', 'mk', 'ms', 'periodiseringsnyckel', 'valuta'].includes(col)) {
                newRow[col] = '';  // Dessa kolumner ska alltid vara tomma
            } else {
                newRow[col] = row[col] || '';  // Övriga kolumner
            }
        });
        return newRow;
    });

    // Skapa worksheet med headers först
    const ws = XLSX.utils.json_to_sheet([headers, ...formattedData], {
        header: columnOrder,
        skipHeader: true  // Skippa auto-headers eftersom vi lägger till våra egna
    });

    // Skapa och spara arbetsboken
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Konteringar");
    XLSX.writeFile(wb, "stadavtal_konteringar.xlsx");
}

// ==================== DEL 1 SLUTAR ====================

// ==================== DEL 2 BÖRJAR ====================

// ==================== VIKTIGA ÄNDRINGAR I DEL 2 ====================
// 1. Förbättrad hantering av tabellvisning
// 2. Uppdaterad kontraktslista för att visa period tydligare
// 3. Förbättrad validering av inmatning
// 4. Mer robust formulärhantering
// ==================================================

// ==================== Exempel och Visning ====================

// Generera slumpmässiga belopp för exempel
function generateRandomAmount(originalAmount) {
    const factor = 1 + Math.random() * 99;
    return Math.round(originalAmount * factor);
}

// Skapa anonymiserade data för exempel
function createAnonymizedData() {
    const anonymized = {};
    Object.keys(originalData).forEach(key => {
        anonymized[key] = {
            ...originalData[key],
            rows: originalData[key].rows.map(row => ({
                ...row,
                belopp: generateRandomAmount(row.belopp)
            }))
        };
    });
    return anonymized;
}

// Skapa HTML för exempel-tabell (förenklad visning)
function generateTableHTML(data) {
    return `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="table-container">
            <table class="kontering-table">
                <thead>
                    <tr>
                        <th>Rad</th>
                        <th>Konto</th>
                        <th>Ansvar</th>
                        <th>Verksamhet</th>
                        <th>Aktivitet</th>
                        <th>Motpart</th>
                        <th>Objekt</th>
                        <th>Belopp</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.rows.map((row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${row.konto}</td>
                            <td>${row.ansvar}</td>
                            <td>${row.verksamhet}</td>
                            <td>${row.aktivitet}</td>
                            <td>${row.motpart}</td>
                            <td>${row.objekt || '-'}</td>
                            <td class="amount">${row.belopp >= 0 ? '' : '-'}${formatAmount(Math.abs(row.belopp))} kr</td>
                            <td>${row.text}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Uppdatera exempel
function updateExamples() {
    Object.keys(originalData).forEach(key => {
        const container = document.getElementById(`example-${key}`);
        const data = currentState.showingOriginal ? originalData[key] : currentState.currentData[key];
        container.innerHTML = generateTableHTML(data);
    });
}

// Växla mellan original och anonymiserade värden
function toggleValues() {
    currentState.showingOriginal = !currentState.showingOriginal;
    if (!currentState.showingOriginal) {
        currentState.currentData = createAnonymizedData();
    }
    updateExamples();
}

// ==================== Formulärhantering ====================

// Definiera Site-beskrivningar för ansvarskoder
const siteDescriptions = {
    '41611': 'Site 1:1',
    '41612': 'Site 1:2',
    '41621': 'Site 2:1',
    '41622': 'Site 2:2',
    '41623': 'Site 2:3',
    '41631': 'Site 3:1',
    '41632': 'Site 3:2'
};

// Beräkna månadsbelopp från årsbelopp
function calculateMonthlyAmount(yearlyAmount) {
    return Math.round(yearlyAmount / 12);
}

// Uppdatera månadsbelopp
function updateMonthlyAmounts() {
    ['8036', '8035', '8032'].forEach(activity => {
        const yearlyInput = document.getElementById(`yearly${activity}`);
        const monthlyInput = document.getElementById(`amount${activity}`);
        if (yearlyInput.value) {
            monthlyInput.value = calculateMonthlyAmount(parseFloat(yearlyInput.value));
        }
    });
}

// Generera förhandsvisning av kontering
function generateKonteringPreview(contractData) {
    const konteringRows = generateKontering(contractData);
    
    // Endast visa relevanta kolumner i förhandsvisningen
    const relevantColumns = ['rad', 'konto', 'ansvar', 'verksamhet', 'aktivitet', 'motpart', 'objekt', 'period', 'belopp', 'text'];
    
    return `
        <div class="preview-container">
            <h3>Förhandsvisning av kontering</h3>
            <div class="info-box">
                <p>OBS: I den exporterade Excel-filen kommer alla 17 dimensioner att finnas med, inklusive följande tomma kolumner:</p>
                <ul>
                    <li>Projekt</li>
                    <li>Anl</li>
                    <li>MK</li>
                    <li>MS</li>
                    <li>Periodiseringsnyckel</li>
                    <li>Valuta</li>
                </ul>
            </div>
            <div class="table-container">
                <table class="kontering-table">
                    <thead>
                        <tr>
                            ${relevantColumns.map(col => 
                                `<th>${col.charAt(0).toUpperCase() + col.slice(1)}</th>`
                            ).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${konteringRows.map(row => `
                            <tr>
                                ${relevantColumns.map(col => 
                                    `<td>${col === 'belopp' ? 
                                        (row[col] >= 0 ? '' : '-') + formatAmount(Math.abs(row[col])) + ' kr' : 
                                        row[col] || '-'}</td>`
                                ).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Uppdatera kontraktslistan med förenklad visning
function updateContractsList() {
    const contractsList = document.getElementById('contractsList');
    contractsList.innerHTML = '';

    if (contracts.length > 0) {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Exportera till Excel (17 kolumner)';
        exportButton.onclick = exportToExcel;
        contractsList.appendChild(exportButton);

        const infoText = document.createElement('p');
        infoText.innerHTML = '<strong>OBS:</strong> Excel-filen kommer innehålla alla 17 dimensioner enligt standard.';
        contractsList.appendChild(infoText);

        contracts.forEach(contract => {
            const contractElement = document.createElement('div');
            contractElement.className = 'contract-item';
            contractElement.innerHTML = generateKonteringPreview(contract);
            contractsList.appendChild(contractElement);
        });
    } else {
        contractsList.innerHTML = '<p>Inga städavtal tillagda ännu.</p>';
    }
}

// Formulärhantering
document.addEventListener('DOMContentLoaded', function() {
    // Populera ansvarskod-dropdowns med Site-beskrivningar
    const ansvarSelects = ['ansvar8036', 'ansvar8035', 'ansvar8032'];
    ansvarSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Välj ansvar...</option>' +
                Object.entries(siteDescriptions)
                    .map(([kod, beskrivning]) => 
                        `<option value="${kod}">${kod} - ${beskrivning}</option>`)
                    .join('');
        }
    });

    // Sätt default ansvar för fönsterputs
    document.getElementById('ansvar8035').value = '41612';
    
    // Formulärhantering
    document.getElementById('contractForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validera period
        const period = document.getElementById('period').value;
        if (!validatePeriod(period)) {
            alert('Period måste vara i format YYYYMM för år 2025 (exempel: 202501)');
            return;
        }

        // Samla formulärdata
        const contractData = {
            id: Date.now(),
            name: document.getElementById('contractName').value,
            objectCodeType: document.getElementById('objectCodeType').value,
            objectCode: document.getElementById('objectCode')?.value || '',
            konto: document.getElementById('konto').value || '6132',
            costAnsvar: document.getElementById('costAnsvar').value,
            costVerksamhet: document.getElementById('costVerksamhet').value,
            motpart: document.getElementById('motpart').value,
            period: period,
            activities: {
                '8036': {
                    amount: parseFloat(document.getElementById('amount8036').value) || 0,
                    ansvar: document.getElementById('ansvar8036').value
                },
                '8035': {
                    amount: parseFloat(document.getElementById('amount8035').value) || 0,
                    ansvar: document.getElementById('ansvar8035').value
                },
                '8032': {
                    amount: parseFloat(document.getElementById('amount8032').value) || 0,
                    ansvar: document.getElementById('ansvar8032').value
                }
            }
        };

        // Beräkna totalbelopp
        contractData.totalAmount = Object.values(contractData.activities)
            .reduce((sum, activity) => sum + activity.amount, 0);

        // Lägg till kontrakt och uppdatera lista
        contracts.push(contractData);
        updateContractsList();
        
        // Återställ formulär
        this.reset();
        document.getElementById('objectCodeSection').style.display = 'none';
        document.getElementById('konto').value = '6132'; // Återställ till default kostnadskonto
        document.getElementById('ansvar8035').value = '41612'; // Återställ default för fönsterputs
    });

    // Hantera visning av objektkodsfält
    document.getElementById('objectCodeType').addEventListener('change', function() {
        const objectCodeSection = document.getElementById('objectCodeSection');
        const objectCodeInput = document.getElementById('objectCode');
        
        if (this.value === '2b') {
            objectCodeSection.style.display = 'none';
            objectCodeInput.required = false;
        } else {
            objectCodeSection.style.display = 'block';
            objectCodeInput.required = true;
        }
    });

    // Initiera exempel-funktionalitet
    document.getElementById('resetButton').addEventListener('click', toggleValues);
    currentState.currentData = createAnonymizedData();
    updateExamples();
    
    // Initiera kontraktslista
    updateContractsList();
});

// ==================== DEL 2 SLUTAR ====================
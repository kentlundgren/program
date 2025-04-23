 // Original data structure for examples
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

// State management
let currentState = {
    showingOriginal: true,
    anonymizedData: null
};

// Generate random amounts while maintaining proportions
function generateRandomAmounts(originalAmounts) {
    const factor = 1 + (Math.random() * 99); // Random factor between 1 and 100
    return originalAmounts.map(amount => Math.round(amount * factor));
}

// Format amount according to Swedish standards
function formatAmount(amount) {
    return Math.abs(amount).toLocaleString('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Generate table HTML for an example
function generateExampleHTML(data, anonymized = false) {
    const rows = anonymized ? anonymizeRows(data.rows) : data.rows;
    const total = calculateTotal(rows);
    
    return `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <p>Total kostnad: ${formatAmount(total)} kr</p>
        <div class="table-container">
            <table class="kontering-table">
                <thead>
                    <tr>
                        <th>Rad</th>
                        <th>Konto</th>
                        <th>Belopp</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${row.konto}</td>
                            <td class="amount">${row.belopp >= 0 ? '' : '-'}${formatAmount(row.belopp)} kr</td>
                            <td>${row.text}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Calculate total from rows
function calculateTotal(rows) {
    return rows.reduce((sum, row) => sum + Math.abs(row.belopp), 0) / 2;
}

// Anonymize rows while maintaining proportions
function anonymizeRows(rows) {
    const factor = 1 + (Math.random() * 99); // Random factor between 1 and 100
    return rows.map(row => ({
        ...row,
        belopp: Math.round(row.belopp * factor)
    }));
}

// Update all examples
function updateExamples() {
    Object.keys(originalExampleData).forEach(key => {
        const container = document.getElementById(`example-${key}`);
        const data = originalExampleData[key];
        container.innerHTML = generateExampleHTML(data, !currentState.showingOriginal);
    });
}

// Toggle between original and anonymized values
function toggleValues() {
    currentState.showingOriginal = !currentState.showingOriginal;
    updateExamples();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set up reset button listener
    document.getElementById('resetButton').addEventListener('click', toggleValues);
    
    // Initial render
    updateExamples();
    
    // Initialize the rest of the original functionality
    initializeOriginalFunctionality();
});

// Original functionality initialization
function initializeOriginalFunctionality() {
    // ... Rest of the original JavaScript code ...
    // (Kopiera in resten av den ursprungliga JavaScript-koden här)
}

// Den ursprungliga JavaScript-koden fortsätter här...


 // Global variables
let contracts = [];
let editingId = null;

// Calculate monthly amount from yearly amount
function calculateMonthlyAmount(yearlyAmount) {
    return yearlyAmount / 12;
}

// Update monthly amounts when calculate button is clicked
function updateMonthlyAmounts() {
    const activities = ['8036', '8035', '8032'];
    
    activities.forEach(activity => {
        const yearlyInput = document.getElementById(`yearly${activity}`);
        const monthlyInput = document.getElementById(`amount${activity}`);
        
        if (yearlyInput.value) {
            const yearlyAmount = parseFloat(yearlyInput.value);
            const monthlyAmount = calculateMonthlyAmount(yearlyAmount);
            monthlyInput.value = monthlyAmount.toFixed(2);
        }
    });
}

// Function to generate complete accounting row
function createFullKonteringsRow(data) {
    return {
        rad: data.rad || '',
        konto: data.konto || '',
        ansvar: data.ansvar || '',
        projekt: data.projekt || '',
        anl: data.anl || '',
        verksamhet: data.verksamhet || '',
        aktivitet: data.aktivitet || '',
        motpart: data.motpart || '',
        objekt: data.objekt || '',
        mk: data.mk || '',
        ms: data.ms || '',
        period: '202501',
        periodiseringsnyckel: data.periodiseringsnyckel || '',
        valbelopp: data.belopp || 0,
        valuta: data.valuta || '',
        belopp: data.belopp || 0,
        text: data.text || ''
    };
}

// Generate accounting rows
function generateKontering(contract) {
    let rows = [];
    let rowNumber = 1;

    // Cost row
    const costRow = createFullKonteringsRow({
        rad: rowNumber++,
        konto: '6132',
        ansvar: contract.costAnsvar,
        verksamhet: contract.costVerksamhet,
        aktivitet: '7600',
        motpart: '180',
        objekt: (contract.objectCodeType === '2a' || contract.objectCodeType === '2d') ? contract.objectCode : '',
        belopp: contract.totalAmount,
        text: contract.name
    });
    rows.push(costRow);

    // Income rows
    const activities = [
        {
            code: '8036',
            amount: contract.activities['8036'].amount,
            ansvar: contract.activities['8036'].ansvar,
            verksamhet: '9349'
        },
        {
            code: '8035',
            amount: contract.activities['8035'].amount,
            ansvar: contract.activities['8035'].ansvar,
            verksamhet: '9347'
        },
        {
            code: '8032',
            amount: contract.activities['8032'].amount,
            ansvar: contract.activities['8032'].ansvar,
            verksamhet: '9349'
        }
    ];

    activities.forEach(activity => {
        if (activity.amount > 0) {
            const incomeRow = createFullKonteringsRow({
                rad: rowNumber++,
                konto: '3153',
                ansvar: activity.ansvar,
                verksamhet: activity.verksamhet,
                aktivitet: activity.code,
                motpart: contract.motpart,
                objekt: (contract.objectCodeType === '2a' || contract.objectCodeType === '2c') ? contract.objectCode : '',
                belopp: -activity.amount,
                text: contract.name
            });
            rows.push(incomeRow);
        }
    });

    return rows;
}

// Show/hide object code field
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

// Set default value for window cleaning responsibility
document.getElementById('amount8035').addEventListener('focus', function() {
    const ansvar8035 = document.getElementById('ansvar8035');
    if (!ansvar8035.value) {
        ansvar8035.value = '41612';
    }
});

// Export to Excel
function exportToExcel() {
    let exportData = [];
    
    contracts.forEach(contract => {
        const rows = generateKontering(contract);
        exportData = exportData.concat(rows);
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Konteringar");
    XLSX.writeFile(wb, "stadavtal_konteringar.xlsx");
}

// Form handling
document.getElementById('contractForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const contractData = {
        name: document.getElementById('contractName').value,
        objectCodeType: document.getElementById('objectCodeType').value,
        objectCode: document.getElementById('objectCode')?.value,
        costAnsvar: document.getElementById('costAnsvar').value,
        costVerksamhet: document.getElementById('costVerksamhet').value,
        motpart: document.getElementById('motpart').value,
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

    // Calculate total amount
    contractData.totalAmount = Object.values(contractData.activities)
        .reduce((sum, activity) => sum + activity.amount, 0);

    if (editingId) {
        const index = contracts.findIndex(c => c.id === editingId);
        contractData.id = editingId;
        contracts[index] = contractData;
        editingId = null;
        document.querySelector('button[type="submit"]').textContent = 'Lägg till avtal';
    } else {
        contractData.id = Date.now();
        contracts.push(contractData);
    }

    updateContractsList();
    this.reset();
    document.getElementById('objectCodeSection').style.display = 'none';
});

// Update contracts list
function updateContractsList() {
    const contractsList = document.getElementById('contractsList');
    contractsList.innerHTML = '';

    if (contracts.length > 0) {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Exportera till Excel';
        exportButton.onclick = exportToExcel;
        contractsList.appendChild(exportButton);
    }

    contracts.forEach(contract => {
        const contractElement = document.createElement('div');
        contractElement.className = 'contract-item';
        
        const konteringsRader = generateKontering(contract);
        
        contractElement.innerHTML = `
            <h3>${contract.name}</h3>
            <div class="table-container">
                <table class="kontering-table">
                    <thead>
                        <tr>
                            <th>Rad</th>
                            <th>Konto</th>
                            <th>Ansvar</th>
                            <th>Projekt</th>
                            <th>Anl</th>
                            <th>Verksamhet</th>
                            <th>Aktivitet</th>
                            <th>Motpart</th>
                            <th>Objekt</th>
                            <th>MK</th>
                            <th>MS</th>
                            <th>Period</th>
                            <th>Per.nyckel</th>
                            <th>Val.belopp</th>
                            <th>Valuta</th>
                            <th>Belopp</th>
                            <th>Text</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${konteringsRader.map(row => `
                            <tr>
                                <td>${row.rad}</td>
                                <td>${row.konto}</td>
                                <td>${row.ansvar}</td>
                                <td>${row.projekt}</td>
                                <td>${row.anl}</td>
                                <td>${row.verksamhet}</td>
                                <td>${row.aktivitet}</td>
                                <td>${row.motpart}</td>
                                <td>${row.objekt}</td>
                                <td>${row.mk}</td>
                                <td>${row.ms}</td>
                                <td>${row.period}</td>
                                <td>${row.periodiseringsnyckel}</td>
                                <td>${row.valbelopp.toFixed(2)}</td>
                                <td>${row.valuta}</td>
                                <td>${row.belopp.toFixed(2)}</td>
                                <td>${row.text}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <button onclick="if(confirm('Är du säker?')) { contracts = contracts.filter(c => c.id !== ${contract.id}); updateContractsList(); }">
                Ta bort
            </button>
        `;
        
        contractsList.appendChild(contractElement);
    });

    if (contracts.length === 0) {
        contractsList.innerHTML = '<p>Inga städavtal tillagda ännu.</p>';
    }
}

// Initialize the list
document.addEventListener('DOMContentLoaded', function() {
    updateContractsList();
});
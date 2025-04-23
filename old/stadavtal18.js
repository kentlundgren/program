// =================== OFÖRÄNDRAD KOD BÖRJAR ===================
// Originaldata för exemplen
const originalData = {
    '2a': {
        title: 'Typ 2a: Samma objektkod för både kontering av intäkter och kostnader',
        description: 'Exempel: Fäladen stödboende/akutboende',
        objektkod: '8964',
        rows: [
            { konto: '6132', ansvar: '70322', verksamhet: '5520', aktivitet: '7600', motpart: '180', objekt: '8964', belopp: 15588, text: 'Fäladen stödboende/akutboende' },
            { konto: '3153', ansvar: '41612', verksamhet: '9347', aktivitet: '8032', motpart: '170', objekt: '8964', belopp: -2420, text: 'Fäladen stödboende/akutboende - storstädning' },
            { konto: '3153', ansvar: '41612', verksamhet: '9347', aktivitet: '8035', motpart: '170', objekt: '8964', belopp: -359, text: 'Fäladen stödboende/akutboende - fönsterputs' },
            { konto: '3153', ansvar: '41632', verksamhet: '9349', aktivitet: '8036', motpart: '170', objekt: '8964', belopp: -12809, text: 'Fäladen stödboende/akutboende - fast intäkt' }
        ]
    },
    // ... [resten av originalData objektet är oförändrat]
};

// Tillstånd för visning av data
let currentState = {
    showingOriginal: false,
    currentData: {}
};

// Generera slumpmässiga belopp
function generateRandomAmount(originalAmount) {
    const factor = 1 + Math.random() * 99;
    return Math.round(originalAmount * factor);
}

// Skapa anonymiserade data med slumpmässiga belopp
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

// =================== UPPDATERAD KOD BÖRJAR ===================

// [NY] Validera period format
function validatePeriod(period) {
    if (!/^\d{6}$/.test(period)) {
        return false;
    }
    const year = parseInt(period.substring(0, 4));
    const month = parseInt(period.substring(4, 6));
    return year === 2025 && month >= 1 && month <= 12;
}

// [UPPDATERAD] Formatera belopp enligt svensk standard
function formatAmount(amount) {
    return Math.abs(amount).toLocaleString('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// [UPPDATERAD] Skapa fullständig konteringsrad med alla 17 dimensioner
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

// [UPPDATERAD] Generera konteringsrader för ett kontrakt
function generateKontering(contract) {
    let rows = [];
    let rowNumber = 1;

    if (!validatePeriod(contract.period)) {
        throw new Error('Ogiltig period. Period måste vara i format YYYYMM för år 2025.');
    }

    // Kostnadsrad
    rows.push(createFullKonteringsRow({
        rad: rowNumber++,
        konto: '6132',
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
        { code: '8036', verksamhet: '9349' },
        { code: '8035', verksamhet: '9347' },
        { code: '8032', verksamhet: '9349' }
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
                text: `${contract.name}${activity.code === '8036' ? ' - fast intäkt' : 
                                      activity.code === '8035' ? ' - fönsterputs' : 
                                      ' - storstädning'}`
            }));
        }
    });

    return rows;
}

// [UPPDATERAD] Exportera till Excel med alla 17 kolumner
function exportToExcel() {
    const exportData = contracts.flatMap(contract => generateKontering(contract));
    
    // Definiera kolumnordningen för att matcha kraven
    const columnOrder = [
        'rad', 'konto', 'ansvar', 'projekt', 'anl', 
        'verksamhet', 'aktivitet', 'motpart', 'objekt',
        'mk', 'ms', 'period', 'periodiseringsnyckel',
        'valbelopp', 'valuta', 'belopp', 'text'
    ];

    // Skapa worksheet med specifik kolumnordning
    const ws = XLSX.utils.json_to_sheet(
        exportData.map(row => {
            const orderedRow = {};
            columnOrder.forEach(col => {
                orderedRow[col] = row[col];
            });
            return orderedRow;
        })
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Konteringar");
    XLSX.writeFile(wb, "stadavtal_konteringar.xlsx");
}

// [UPPDATERAD] Formulärhantering
document.getElementById('contractForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const period = document.getElementById('period').value;
    if (!validatePeriod(period)) {
        alert('Period måste vara i format YYYYMM för år 2025 (exempel: 202501)');
        return;
    }

    const contractData = {
        id: editingId || Date.now(),
        name: document.getElementById('contractName').value,
        objectCodeType: document.getElementById('objectCodeType').value,
        objectCode: document.getElementById('objectCode')?.value || '',
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

    contractData.totalAmount = Object.values(contractData.activities)
        .reduce((sum, activity) => sum + activity.amount, 0);

    if (editingId) {
        const index = contracts.findIndex(c => c.id === editingId);
        contracts[index] = contractData;
        editingId = null;
        document.querySelector('button[type="submit"]').textContent = 'Lägg till avtal';
    } else {
        contracts.push(contractData);
    }

    updateContractsList();
    this.reset();
    document.getElementById('objectCodeSection').style.display = 'none';
});

// [UPPDATERAD] Uppdatera kontraktslistan med nya kolumner
function updateContractsList() {
    const contractsList = document.getElementById('contractsList');
    contractsList.innerHTML = '';

    if (contracts.length > 0) {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Exportera till Excel (17 kolumner)';
        exportButton.onclick = exportToExcel;
        contractsList.appendChild(exportButton);

        const infoText = document.createElement('p');
        infoText.innerHTML = '<strong>OBS:</strong> Excel-filen kommer innehålla alla 17 dimensioner enligt standard, inklusive tomma kolumner.';
        contractsList.appendChild(infoText);

        contracts.forEach(contract => {
            const contractElement = document.createElement('div');
            contractElement.className = 'contract-item';
            const konteringsRader = generateKontering(contract);
            
            contractElement.innerHTML = `
                <h3>${contract.name} (Period: ${contract.period})</h3>
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
                                <th>Period</th>
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
                                    <td>${row.verksamhet}</td>
                                    <td>${row.aktivitet}</td>
                                    <td>${row.motpart}</td>
                                    <td>${row.objekt}</td>
                                    <td>${row.period}</td>
                                    <td>${formatAmount(row.belopp)} kr</td>
                                    <td>${row.text}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <button onclick="deleteContract(${contract.id})">Ta bort</button>
                <button onclick="editContract(${contract.id})">Redigera</button>
            `;
            
            contractsList.appendChild(contractElement);
        });
    } else {
        contractsList.innerHTML = '<p>Inga städavtal tillagda ännu.</p>';
    }
}

// [UPPDATERAD] Redigera kontrakt för att inkludera period
function editContract(id) {
    const contract = contracts.find(c => c.id === id);
    if (!contract) return;

    editingId = id;
    
    document.getElementById('contractName').value = contract.name;
    document.getElementById('objectCodeType').value = contract.objectCodeType;
    document.getElementById('objectCode').value = contract.objectCode;
    document.getElementById('costAnsvar').value = contract.costAnsvar;
    document.getElementById('costVerksamhet').value = contract.costVerksamhet;
    document.getElementById('motpart').value = contract.motpart;
    document.getElementById('period').value = contract.period;

    Object.keys(contract.activities).forEach(activity => {
        document.getElementById(`amount${activity}`).value = contract.activities[activity].amount;
        document.getElementById(`ansvar${activity}`).value = contract.activities[activity].ansvar;
    });

    const objectCodeSection = document.getElementById('objectCodeSection');
    objectCodeSection.style.display = contract.objectCodeType === '2b' ? 'none' : 'block';
    
    document.querySelector('button[type="submit"]').textContent = 'Uppdatera avtal';
}

// =================== OFÖRÄNDRAD KOD FORTSÄTTER ===================

// Initialisering vid sidladdning
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ansvar8035').value = '41612';
    document.getElementById('resetButton').addEventListener('click', toggleValues);
    currentState.currentData = createAnonymizedData();
    updateExamples();
    updateContractsList();
});
  // ==================== Komplett JavaScript för Städavtalshantering ====================

// Globala variabler
let contracts = [];
let editingId = null;

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
    '2b': {
        title: 'Typ 2b: Utan objektkod',
        description: 'Exempel: Borstahusen bod/fikarum/omklädningsrum',
        rows: [
            { konto: '6132', ansvar: '80350', verksamhet: '3405', aktivitet: '8105', motpart: '180', objekt: '', belopp: 1821, text: 'Borstahusen bod/fikarum/omklädningsrum' },
            { konto: '3153', ansvar: '41621', verksamhet: '9347', aktivitet: '8036', motpart: '180', objekt: '', belopp: -1821, text: 'Borstahusen bod/fikarum/omklädningsrum - fast intäkt' }
        ]
    },
    '2c': {
        title: 'Typ 2c: Objektkod endast på intäkter',
        description: 'Exempel: Tellus idrottsvägen 16',
        objektkod: '8948',
        rows: [
            { konto: '6132', ansvar: '70232', verksamhet: '5686', aktivitet: '7600', motpart: '180', objekt: '', belopp: 12815, text: 'Tellus idrottsvägen 16' },
            { konto: '3153', ansvar: '41622', verksamhet: '9349', aktivitet: '8036', motpart: '170', objekt: '8948', belopp: -12815, text: 'Tellus idrottsvägen 16 - fast intäkt' }
        ]
    },
    '2d': {
        title: 'Typ 2d: Objektkod endast på kostnader',
        description: 'Exempel: Emaljgatan våning 3, IT',
        objektkod: '5736',
        rows: [
            { konto: '6132', ansvar: '51300', verksamhet: '9275', aktivitet: '5030', motpart: '180', objekt: '5736', belopp: 21614, text: 'Emaljgatan våning 3, IT' },
            { konto: '3153', ansvar: '41611', verksamhet: '9349', aktivitet: '8036', motpart: '150', objekt: '', belopp: -20385, text: 'Emaljgatan våning 3, IT - fast intäkt' }
        ]
    }
};

// ==================== Hjälpfunktioner ====================

function validatePeriod(period) {
    return /^(2025)(0[1-9]|1[0-2])$/.test(period);
}

function formatAmount(amount) {
    return Math.abs(amount).toLocaleString('sv-SE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function createFullRow(data) {
    return {
        rad: data.rad || '',
        konto: data.konto || '',
        ansvar: data.ansvar || '',
        projekt: '',
        anl: '',
        verksamhet: data.verksamhet || '',
        aktivitet: data.aktivitet || '',
        motpart: data.motpart || '',
        objekt: data.objekt || '',
        mk: '',
        ms: '',
        period: data.period || '',
        periodiseringsnyckel: '',
        valbelopp: data.belopp || 0,
        valuta: '',
        belopp: data.belopp || 0,
        text: data.text || ''
    };
}

// ==================== Export till Excel ====================

function exportToExcel() {
    const columnOrder = [
        'rad', 'konto', 'ansvar', 'projekt', 'anl', 'verksamhet', 'aktivitet', 'motpart', 'objekt', 'mk', 'ms', 'period', 'periodiseringsnyckel', 'valbelopp', 'valuta', 'belopp', 'text'
    ];

    const formattedData = contracts.map((contract, index) => createFullRow({ rad: index + 1, ...contract }));
    const headers = columnOrder.reduce((obj, col) => ({ ...obj, [col]: col }), {});

    const worksheet = XLSX.utils.json_to_sheet([headers, ...formattedData], {
        header: columnOrder,
        skipHeader: true
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Städavtal");
    XLSX.writeFile(workbook, "stadavtal.xlsx");
}

// ==================== Kontraktshantering ====================

function addContract(contract) {
    if (editingId !== null) {
        contracts[editingId] = contract;
        editingId = null;
    } else {
        contracts.push(contract);
    }
    updateContractsList();
    document.getElementById('contractForm').reset();
}

function editContract(index) {
    const contract = contracts[index];
    editingId = index;
    const form = document.getElementById('contractForm');

    Object.keys(contract).forEach(key => {
        if (form.elements[key]) {
            form.elements[key].value = contract[key];
        }
    });
}

function deleteContract(index) {
    if (confirm('Är du säker på att du vill ta bort detta avtal?')) {
        contracts.splice(index, 1);
        updateContractsList();
    }
}

function updateContractsList() {
    const container = document.getElementById('contractsList');
    container.innerHTML = '';

    if (contracts.length === 0) {
        container.innerHTML = '<p>Inga städavtal tillagda ännu.</p>';
        return;
    }

    contracts.forEach((contract, index) => {
        const item = document.createElement('div');
        item.className = 'contract-item';
        item.innerHTML = `
            <h3>Avtal ${index + 1}</h3>
            <p>Konto: ${contract.konto}, Ansvar: ${contract.ansvar}, Belopp: ${formatAmount(contract.belopp)} kr</p>
            <button onclick="editContract(${index})">Redigera</button>
            <button onclick="deleteContract(${index})">Radera</button>
        `;
        container.appendChild(item);
    });
}

// ==================== Formulärhantering ====================

const form = document.getElementById('contractForm');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    if (!validatePeriod(data.period)) {
        alert('Felaktig period!');
        return;
    }

    data.belopp = parseFloat(data.belopp) || 0;
    addContract(data);
});

// ==================== Initialisering ====================

document.addEventListener('DOMContentLoaded', function () {
    updateContractsList();
});

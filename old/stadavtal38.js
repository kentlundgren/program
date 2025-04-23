// ===========================================
// DEL 1: GRUNDLÄGGANDE KONFIGURATION OCH INITIERING
'use strict';

// Debugläge för utveckling
const DEBUG = true;

// Globala datastrukturer
let ansvarskoder = [];
let verksamhetskoder = [];
let ansvarBeskrivningar = {};
let verksamhetsBeskrivningar = {};

// Debugloggning
function debugLog(message, data = null) {
    if (DEBUG) {
        console.log(`DEBUG: ${message}`);
        if (data) console.log(data);
    }
}

// Huvudfunktion som körs vid sidladdning
document.addEventListener('DOMContentLoaded', async function () {
    debugLog('Initialiserar applikationen...');
    try {
        await initieraApp();
    } catch (error) {
        console.error('Fel vid initialisering:', error);
    }
});

// Funktion för initialisering
async function initieraApp() {
    await laddaData();
    initieraGränssnitt();
    kopplaHändelsehanterare();
}

// ===========================================
// DEL 2: DATAINLÄSNING

async function laddaData() {
    debugLog('Laddar data...');

    // Mockdata för ansvar och verksamhetskoder
    ansvarskoder = ['101', '202', '303'];
    verksamhetskoder = ['A01', 'B02', 'C03'];

    // Mockdata för beskrivningar
    ansvarBeskrivningar = {
        '101': 'Administration',
        '202': 'Utbildning',
        '303': 'Hälsa och sjukvård'
    };

    verksamhetsBeskrivningar = {
        'A01': 'Personalhantering',
        'B02': 'Studieprogram',
        'C03': 'Klinikverksamhet'
    };

    debugLog('Data inläst', { ansvarskoder, verksamhetskoder });
}

// ===========================================
// DEL 3: GRÄNSSNITTSINITIERING

function initieraGränssnitt() {
    debugLog('Initierar gränssnitt...');

    const ansvarSelect = document.getElementById('ansvarSelect');
    const verksamhetSelect = document.getElementById('verksamhetSelect');

    // Fyll ansvarskoder
    ansvarskoder.forEach(kod => {
        const option = document.createElement('option');
        option.value = kod;
        option.textContent = `${kod} - ${ansvarBeskrivningar[kod] || 'Okänd'}`;
        ansvarSelect.appendChild(option);
    });

    // Fyll verksamhetskoder
    verksamhetskoder.forEach(kod => {
        const option = document.createElement('option');
        option.value = kod;
        option.textContent = `${kod} - ${verksamhetsBeskrivningar[kod] || 'Okänd'}`;
        verksamhetSelect.appendChild(option);
    });
}

// ===========================================
// DEL 4: HÄNDELSEHANTERING

function kopplaHändelsehanterare() {
    debugLog('Kopplar händelsehanterare...');

    document.getElementById('ansvarSelect').addEventListener('change', function (e) {
        const valtAnsvar = e.target.value;
        const beskrivning = ansvarBeskrivningar[valtAnsvar] || 'Ingen beskrivning tillgänglig';
        document.getElementById('ansvarBeskrivning').textContent = beskrivning;
    });

    document.getElementById('verksamhetSelect').addEventListener('change', function (e) {
        const valtVerksamhet = e.target.value;
        const beskrivning = verksamhetsBeskrivningar[valtVerksamhet] || 'Ingen beskrivning tillgänglig';
        document.getElementById('verksamhetBeskrivning').textContent = beskrivning;
    });
}

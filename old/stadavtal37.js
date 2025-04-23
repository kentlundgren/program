// ===========================================
// DEL 1: GRUNDLÄGGANDE KONFIGURATION OCH INITIERING
// Denna del hanterar grundläggande inställningar och 
// initialisering av applikationen
// ===========================================

'use strict';

// Debugläge för utveckling
const DEBUG = true;

// Globala datastrukturer
let ansvarskoder = [];              // Lista med alla unika ansvarskoder
let verksamhetskoder = [];          // Lista med alla unika verksamhetskoder
let kodKombinationer = [];          // Lista med giltiga kombinationer
let ansvarVerksamhetMapping = {};   // Mapping mellan ansvar och vanliga verksamhetskoder

// Debugloggning
function debugLog(message, data = null) {
    if (DEBUG) {
        console.log(`DEBUG: ${message}`);
        if (data) console.log(data);
    }
}

// Huvudfunktion som körs när sidan laddas
document.addEventListener('DOMContentLoaded', async function() {
    debugLog('Initialiserar applikation...');
    try {
        await initieraApp();
    } catch (error) {
        hanteraFel('Initialiseringsfel', error);
    }
});

// Huvudfunktion för applikationsinitiering
async function initieraApp() {
    await laddaOchAnalyseraData();
    initieraGränssnitt();
    kopplaHändelsehanterare();
    uppdateraStatistik();
}

// DEL 1 SLUT

// ===========================================
// DEL 2: DATAINLÄSNING OCH DATAANALYS
// Denna del hanterar inläsning av data från paste.txt
// och analyserar denna för att hitta mönster
// ===========================================

// Funktion för att läsa in och analysera data
async function laddaOchAnalyseraData() {
    try {
        debugLog('Börjar läsa in data...');
        
        const response = await fetch('https://kentlundgren.se/program/paste.txt');
        if (!response.ok) {
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }
        
        const data = await response.text();
        const parseResult = Papa.parse(data, {
            delimiter: '\t',
            header: true,
            skipEmptyLines: true
        });

        if (parseResult.errors.length > 0) {
            throw new Error('Parsningsfel: ' + parseResult.errors[0].message);
        }

        analyseraData(parseResult.data);
        skapaRekommendationsModell();
        
    } catch (error) {
        throw new Error('Datainläsningsfel: ' + error.message);
    }
}

// Analysera inläst data och extrahera viktig information
function analyseraData(data) {
    debugLog('Analyserar data...');

    // Extrahera unika koder
    ansvarskoder = _.uniq(data
        .map(row => row.Ansvar)
        .filter(Boolean))
        .sort();

    verksamhetskoder = _.uniq(data
        .map(row => row.Verksamhet)
        .filter(Boolean))
        .sort();

    // Skapa lista med giltiga kombinationer
    kodKombinationer = data
        .filter(row => row.Ansvar && row.Verksamhet)
        .map(row => ({
            ansvar: row.Ansvar,
            verksamhet: row.Verksamhet
        }));

    debugLog('Dataanalys klar', {
        antalAnsvar: ansvarskoder.length,
        antalVerksamhet: verksamhetskoder.length,
        antalKombinationer: kodKombinationer.length
    });
}

// DEL 2 SLUT

// ===========================================
// DEL 3: SMART REKOMMENDATIONSLOGIK
// Denna del innehåller logiken för att generera 
// smarta rekommendationer baserat på tidigare val
// ===========================================

// Skapa rekommendationsmodell baserad på historisk data
function skapaRekommendationsModell() {
    debugLog('Skapar rekommendationsmodell...');
    
    // Räkna frekvensen av verksamhetskoder för varje ansvarskod
    ansvarVerksamhetMapping = {};
    
    kodKombinationer.forEach(({ ansvar, verksamhet }) => {
        if (!ansvarVerksamhetMapping[ansvar]) {
            ansvarVerksamhetMapping[ansvar] = {};
        }
        ansvarVerksamhetMapping[ansvar][verksamhet] = 
            (ansvarVerksamhetMapping[ansvar][verksamhet] || 0) + 1;
    });

    debugLog('Rekommendationsmodell skapad', ansvarVerksamhetMapping);
}

// Generera rekommendationer baserat på vald ansvarskod
function genereraRekommendationer(ansvarskod) {
    if (!ansvarskod || !ansvarVerksamhetMapping[ansvarskod]) {
        return [];
    }

    // Sortera verksamhetskoder efter frekvens
    const verksamheterFrekvens = ansvarVerksamhetMapping[ansvarskod];
    return Object.entries(verksamheterFrekvens)
        .sort(([, a], [, b]) => b - a)
        .map(([kod, frekvens]) => ({
            kod,
            frekvens,
            procent: Math.round(frekvens * 100 / 
                Object.values(verksamheterFrekvens).reduce((a, b) => a + b, 0))
        }));
}

// DEL 3 SLUT

// ===========================================
// DEL 4: ANVÄNDARINTERAKTION OCH HÄNDELSEHANTERING
// Denna del hanterar användarinteraktioner och 
// kopplar händelsehanterare till UI-element
// ===========================================

// Koppla händelsehanterare till UI-element
function kopplaHändelsehanterare() {
    debugLog('Kopplar händelsehanterare...');

    // Hantera val i dropdown-listor
    document.getElementById('ansvarSelect')
        .addEventListener('change', hanteraAnsvarVal);
    document.getElementById('verksamhetSelect')
        .addEventListener('change', hanteraVerksamhetVal);

    // Hantera knappar för nya koder
    document.getElementById('nyAnsvarBtn')
        .addEventListener('click', () => hanteraNyKod('ansvar'));
    document.getElementById('nyVerksamhetBtn')
        .addEventListener('click', () => hanteraNyKod('verksamhet'));
    document.getElementById('sparaNyKodBtn')
        .addEventListener('click', sparaNyKod);
}

// Hantera val av ansvarskod
function hanteraAnsvarVal(event) {
    const valtAnsvar = event.target.value;
    if (!valtAnsvar) return;

    // Generera och visa rekommendationer
    const rekommendationer = genereraRekommendationer(valtAnsvar);
    visaRekommendationer(rekommendationer);

    // Uppdatera kombination om verksamhetskod redan är vald
    const valtVerksamhet = document.getElementById('verksamhetSelect').value;
    if (valtVerksamhet) {
        valideraKombination(valtAnsvar, valtVerksamhet);
    }
}

// Hantera val av verksamhetskod
function hanteraVerksamhetVal(event) {
    const valtVerksamhet = event.target.value;
    const valtAnsvar = document.getElementById('ansvarSelect').value;

    if (valtAnsvar && valtVerksamhet) {
        valideraKombination(valtAnsvar, valtVerksamhet);
    }
}

// DEL 4 SLUT

// ===========================================
// DEL 5: DOM-MANIPULERING OCH UI-UPPDATERINGAR
// Denna del hanterar uppdateringar av användargränssnittet
// ===========================================

// Initiera gränssnittet
function initieraGränssnitt() {
    debugLog('Initierar gränssnitt...');
    fyllDropdowns();
}

// Fyll dropdown-listorna med data
function fyllDropdowns() {
    const ansvarSelect = document.getElementById('ansvarSelect');
    const verksamhetSelect = document.getElementById('verksamhetSelect');

    // Rensa och fyll ansvarskoder
    ansvarSelect.innerHTML = '<option value="">-- Välj ansvarskod --</option>';
    ansvarskoder.forEach(kod => {
        const option = document.createElement('option');
        option.value = kod;
        option.textContent = kod;
        ansvarSelect.appendChild(option);
    });

    // Rensa och fyll verksamhetskoder
    verksamhetSelect.innerHTML = '<option value="">-- Välj verksamhetskod --</option>';
    verksamhetskoder.forEach(kod => {
        const option = document.createElement('option');
        option.value = kod;
        option.textContent = kod;
        verksamhetSelect.appendChild(option);
    });
}

// Visa rekommendationer i gränssnittet
function visaRekommendationer(rekommendationer) {
    const panel = document.getElementById('rekommendationerPanel');
    const lista = document.getElementById('rekommendationerLista');

    if (rekommendationer.length === 0) {
        panel.classList.add('d-none');
        return;
    }

    lista.innerHTML = rekommendationer
        .map(rek => `
            <div class="recommendation-item">
                <strong>${rek.kod}</strong> 
                (använd i ${rek.procent}% av fallen)
            </div>
        `)
        .join('');

    panel.classList.remove('d-none');
}

// Uppdatera statistikvyn
function uppdateraStatistik() {
    const översiktInfo = document.getElementById('översiktInfo');
    översiktInfo.innerHTML = `
        <p>Antal ansvarskoder: ${ansvarskoder.length}</p>
        <p>Antal verksamhetskoder: ${verksamhetskoder.length}</p>
        <p>Antal unika kombinationer: ${kodKombinationer.length}</p>
    `;
}

// DEL 5 SLUT

// ===========================================
// DEL 6: HJÄLPFUNKTIONER OCH UTILITIES
// Denna del innehåller olika hjälpfunktioner som 
// används genom hela applikationen
// ===========================================

// Validera en kombination av koder
function valideraKombination(ansvar, verksamhet) {
    const ärGiltig = kodKombinationer.some(
        k => k.ansvar === ansvar && k.verksamhet === verksamhet
    );

    const feedback = document.getElementById('kombinationFeedback');
    feedback.className = `alert alert-${ärGiltig ? 'success' : 'warning'}`;
    feedback.textContent = ärGiltig
        ? 'Detta är en tidigare använd kombination.'
        : 'OBS! Detta är en ny kombination som inte använts tidigare.';
    feedback.classList.remove('d-none');
}

// Hantera fel i applikationen
function hanteraFel(kontext, error) {
    console.error(`${kontext}:`, error);
    const feedback = document.getElementById('kombinationFeedback');
    feedback.className = 'alert alert-danger';
    feedback.textContent = `Ett fel uppstod: ${error.message}`;
    feedback.classList.remove('d-none');
}

// Hantera tillägg av ny kod
async function hanteraNyKod(typ) {
    const modalTitel = document.querySelector('#nyKodModal .modal-title');
    modalTitel.textContent = `Lägg till ny ${typ}kod`;
    
    const modal = new bootstrap.Modal(document.getElementById('nyKodModal'));
    modal.show();
}

// Spara ny kod
function sparaNyKod() {
    const nyKod = document.getElementById('nyKodInput').value.trim();
    
    if (!/^\d{4,10}$/.test(nyKod)) {
        alert('Koden måste bestå av 4-10 siffror.');
        return;
    }

    // Lägg till koden i rätt lista och uppdatera gränssnittet
    if (modalTitel.textContent.includes('ansvar')) {
        ansvarskoder.push(nyKod);
        ansvarskoder.sort();
    } else {
        verksamhetskoder.push(nyKod);
        verksamhetskoder.sort();
    }

    fyllDropdowns();
    uppdateraStatistik();

    // Stäng modalen
    bootstrap.Modal.getInstance(document.getElementById('nyKodModal')).hide();
}

// DEL 6 SLUT
// =============================================================
// STÄDAVTALSHANTERING Version 36
// Denna fil hanterar logiken för städavtalshanteringssystemet
// =============================================================

// Aktivera strikt läge för säkrare kod
'use strict';

// Globala variabler som används genom hela programmet
const DEBUG = true;  // Debugläge för utveckling
let ansvarskoder = [];      // Lista med unika ansvarskoder
let verksamhetskoder = [];  // Lista med unika verksamhetskoder
let kodKombinationer = [];  // Lista med giltiga kombinationer

// Hjälpfunktion för debugutskrifter
function debugLog(message, data = null) {
    if (DEBUG) {
        console.log(`DEBUG: ${message}`);
        if (data) console.log(data);
    }
}

// Funktion som körs när sidan har laddats
document.addEventListener('DOMContentLoaded', async function() {
    debugLog('Sidan har laddats, initialiserar programmet...');
    
    try {
        await initiera();
    } catch (error) {
        hanteraFel('Initialiseringsfel', error);
    }
});

// Huvudfunktion för initiering av programmet
async function initiera() {
    // Verifiera att alla nödvändiga DOM-element finns
    const elements = verifieraElement();
    
    // Läs in data från textfilen
    await laddaData();
    
    // Sätt upp händelsehanterare
    kopplaHändelsehanterare(elements);
    
    // Uppdatera statistikvyn
    uppdateraStatistik();
}

// Verifierar att alla nödvändiga DOM-element finns tillgängliga
function verifieraElement() {
    const elements = {
        ansvarSelect: document.getElementById('ansvarSelect'),
        verksamhetSelect: document.getElementById('verksamhetSelect'),
        nyAnsvarBtn: document.getElementById('nyAnsvarBtn'),
        nyVerksamhetBtn: document.getElementById('nyVerksamhetBtn'),
        konteringFeedback: document.getElementById('konteringFeedback')
    };

    // Kontrollera att alla element hittades
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            throw new Error(`Kunde inte hitta elementet: ${key}`);
        }
    }

    return elements;
}

// Laddar in data från textfilen
async function laddaData() {
    try {
        debugLog('Börjar läsa in data...');
        
        // Hämta datafilen
        const response = await fetch('https://kentlundgren.se/program/paste.txt');
        if (!response.ok) {
            throw new Error(`HTTP-fel! Status: ${response.status}`);
        }
        
        const data = await response.text();
        debugLog('Data inläst, börjar parsa...');

        // Använd PapaParse för att tolka TSV-data
        const parseResult = Papa.parse(data, {
            delimiter: '\t',
            header: true,
            skipEmptyLines: true
        });

        if (parseResult.errors.length > 0) {
            throw new Error('Fel vid parsning av data: ' + parseResult.errors[0].message);
        }

        // Extrahera unika koder
        bearbetaInlästaData(parseResult.data);
        
        // Fyll dropdown-listorna med data
        fyllDropdownListor();
        
        debugLog('Datainläsning klar');
        
    } catch (error) {
        throw new Error('Fel vid datainläsning: ' + error.message);
    }
}

// Bearbetar den inlästa datan och extraherar unika koder
function bearbetaInlästaData(data) {
    debugLog('Bearbetar inläst data...');
    
    // Extrahera och filtrera ansvarskoder
    ansvarskoder = _.uniq(
        data.map(row => row.Ansvar)
            .filter(kod => kod && kod.trim() !== '')
    ).sort();

    // Extrahera och filtrera verksamhetskoder
    verksamhetskoder = _.uniq(
        data.map(row => row.Verksamhet)
            .filter(kod => kod && kod.trim() !== '')
    ).sort();

    // Spara giltiga kombinationer
    kodKombinationer = data
        .filter(row => row.Ansvar && row.Verksamhet)
        .map(row => ({
            ansvar: row.Ansvar,
            verksamhet: row.Verksamhet
        }));

    debugLog('Antal ansvarskoder:', ansvarskoder.length);
    debugLog('Antal verksamhetskoder:', verksamhetskoder.length);
}

// Fyller dropdown-listorna med data
function fyllDropdownListor() {
    debugLog('Fyller dropdown-listor...');
    
    const ansvarSelect = document.getElementById('ansvarSelect');
    const verksamhetSelect = document.getElementById('verksamhetSelect');

    // Rensa befintliga val
    ansvarSelect.innerHTML = '<option value="">-- Välj ansvarskod --</option>';
    verksamhetSelect.innerHTML = '<option value="">-- Välj verksamhetskod --</option>';

    // Fyll ansvarskoder
    ansvarskoder.forEach(kod => {
        const option = document.createElement('option');
        option.value = kod;
        option.textContent = kod;
        ansvarSelect.appendChild(option);
    });

    // Fyll verksamhetskoder
    verksamhetskoder.forEach(kod => {
        const option = document.createElement('option');
        option.value = kod;
        option.textContent = kod;
        verksamhetSelect.appendChild(option);
    });
}

// Kopplar händelsehanterare till element
function kopplaHändelsehanterare(elements) {
    debugLog('Kopplar händelsehanterare...');
    
    // Händelsehanterare för val i dropdown-listor
    elements.ansvarSelect.addEventListener('change', hanteraKodVal);
    elements.verksamhetSelect.addEventListener('change', hanteraKodVal);

    // Händelsehanterare för knappar
    elements.nyAnsvarBtn.addEventListener('click', () => hanteraNyKod('ansvar'));
    elements.nyVerksamhetBtn.addEventListener('click', () => hanteraNyKod('verksamhet'));
}

// Hanterar val i dropdown-listorna
function hanteraKodVal() {
    const ansvarSelect = document.getElementById('ansvarSelect');
    const verksamhetSelect = document.getElementById('verksamhetSelect');
    const feedback = document.getElementById('konteringFeedback');
    
    const valtAnsvar = ansvarSelect.value;
    const valtVerksamhet = verksamhetSelect.value;

    // Visa feedback endast om båda värden är valda
    if (valtAnsvar && valtVerksamhet) {
        const ärGiltigKombination = kodKombinationer.some(
            k => k.ansvar === valtAnsvar && k.verksamhet === valtVerksamhet
        );

        if (ärGiltigKombination) {
            visaFeedback('success', 'Detta är en tidigare använd kombination.');
        } else {
            visaFeedback('warning', 
                'Detta är en ny kombination som inte har använts tidigare. ' +
                'Kontrollera att kombinationen är korrekt.');
        }
    } else {
        feedback.classList.add('d-none');
    }
}

// Visar feedback till användaren
function visaFeedback(typ, meddelande) {
    const feedback = document.getElementById('konteringFeedback');
    feedback.className = `alert alert-${typ}`;
    feedback.textContent = meddelande;
    feedback.classList.remove('d-none');
}

// Hanterar fel som uppstår i programmet
function hanteraFel(kontext, error) {
    console.error(`${kontext}:`, error);
    visaFeedback('danger', `Ett fel uppstod: ${error.message}`);
}

// Uppdaterar statistikvyn
function uppdateraStatistik() {
    debugLog('Uppdaterar statistik...');
    
    const översiktInfo = document.getElementById('översiktInfo');
    if (översiktInfo) {
        översiktInfo.innerHTML = `
            <p>Antal ansvarskoder: ${ansvarskoder.length}</p>
            <p>Antal verksamhetskoder: ${verksamhetskoder.length}</p>
            <p>Antal unika kombinationer: ${kodKombinationer.length}</p>
        `;
    }
}

// Hantera nya koder
function hanteraNyKod(typ) {
    const kod = prompt(`Ange ny ${typ}skod:`);
    if (kod && /^\d+$/.test(kod)) {
        if (typ === 'ansvar') {
            ansvarskoder.push(kod);
            ansvarskoder.sort();
        } else {
            verksamhetskoder.push(kod);
            verksamhetskoder.sort();
        }
        fyllDropdownListor();
        uppdateraStatistik();
    } else if (kod) {
        alert('Ogiltig kod. Använd endast siffror.');
    }
}
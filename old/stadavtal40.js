// Baserat på funktionaliteten från version 17 och 37 föreslår jag följande uppdelning av JavaScript-filen i 7 delar:
//
// 1. Grundkonfiguration och initialiseringsfunktioner

// Globala variabler
// Grundläggande inställningar
// Initieringsfunktioner


// 2. Datahantering och datainläsning
// Inläsning från paste.txt
// Parsing och validering
// Datastrukturer för koder och kombinationer


// 3 Smart konteringslogik

// Rekommendationssystem
// Validering av kombinationer
// Feedback till användaren


// 4. Formulärhantering

// Insamling av formulärdata
// Validering av input
// Beloppsberäkningar


// 5 Excel-exportfunktionalitet

// 17-kolumners formatering
// XLSX-generering
// Filhantering
// 
//
// 6. UI-uppdateringar och DOM-manipulation

// Tabell- och listrendering
// Feedback-meddelanden
// Dynamiska UI-uppdateringar
// 
//
// 7. Hjälpfunktioner och verktyg
//
// Formatering
// Validering
// Felhantering


// ===========================================
// DEL 1: GRUNDKONFIGURATION OCH INITIERING
// Denna del hanterar grundläggande inställningar,
// globala variabler och initialiseringsfunktioner
// ===========================================

'use strict';

// Debugläge för utveckling
const DEBUG = true;

// Globala variabler för datahantering
let ansvarskoder = [];              // Lista med alla unika ansvarskoder
let verksamhetskoder = [];          // Lista med alla unika verksamhetskoder
let kodKombinationer = [];          // Lista med giltiga kombinationer
let ansvarVerksamhetMapping = {};   // Mapping mellan ansvar och vanliga verksamhetskoder
let contracts = [];                 // Lista över aktiva kontrakt
let currentState = {               // Hantering av programmets tillstånd
    showingOriginal: false,
    currentData: {}
};

// Site-beskrivningar för ansvarskoder
const siteDescriptions = {
    '41611': 'Site 1:1',
    '41612': 'Site 1:2',
    '41621': 'Site 2:1',
    '41622': 'Site 2:2',
    '41623': 'Site 2:3',
    '41631': 'Site 3:1',
    '41632': 'Site 3:2'
};

// Standardkonfiguration
const CONFIG = {
    DEFAULT_KONTO: '6132',
    DEFAULT_INTAKT_KONTO: '3153',
    YEAR: '2025',
    FILE_URL: 'https://kentlundgren.se/program/paste.txt',
    DEBUG: true
};

// Aktivitetskonfiguration
const ACTIVITIES = {
    '8036': { name: 'Fast intäkt', verksamhet: '9349' },
    '8035': { name: 'Fönsterputs', verksamhet: '9347' },
    '8032': { name: 'Storstädning', verksamhet: '9349' }
};

// Debugloggning
function debugLog(message, data = null) {
    if (CONFIG.DEBUG) {
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
    try {
        await verifieraElement();
        await laddaOchAnalyseraData();
        initieraGränssnitt();
        kopplaHändelsehanterare();
        await laddaExempel();
        uppdateraStatistik();
        debugLog('Initialisering slutförd');
    } catch (error) {
        hanteraFel('Initieringsfel', error);
        throw error;
    }
}

// Verifierar att alla nödvändiga DOM-element finns
function verifieraElement() {
    const requiredElements = [
        'ansvarSelect',
        'verksamhetSelect',
        'contractForm',
        'contractsList',
        'kombinationFeedback'
    ];

    const missingElements = requiredElements.filter(id => 
        !document.getElementById(id)
    );

    if (missingElements.length > 0) {
        throw new Error(`Saknade element: ${missingElements.join(', ')}`);
    }

    return true;
}

// Grundläggande felhantering
function hanteraFel(kontext, error) {
    console.error(`${kontext}:`, error);
    const feedback = document.getElementById('kombinationFeedback');
    if (feedback) {
        feedback.className = 'alert alert-danger';
        feedback.textContent = `Ett fel uppstod: ${error.message}`;
        feedback.classList.remove('d-none');
    }
}

// Globala händelsehanterare
window.onerror = function(msg, url, lineNo, columnNo, error) {
    debugLog('Globalt fel:', {
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        error: error
    });
    return false;
};

// === DEL 1 SLUT ===
// ===========================================
// DEL 2: DATAHANTERING OCH DATAINLÄSNING
// Denna del hanterar inläsning från paste.txt samt
// bearbetning och strukturering av data
// ===========================================

// Funktion för att läsa in och bearbeta grunddata
async function laddaOchAnalyseraData() {
    try {
        debugLog('Börjar läsa data från paste.txt');
        const response = await fetch(CONFIG.FILE_URL);
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

        bearbetaInlästData(parseResult.data);
        skapaKodMappningar();
        debugLog('Datainläsning slutförd', {
            antalRader: parseResult.data.length,
            antalAnsvar: ansvarskoder.length,
            antalVerksamhet: verksamhetskoder.length
        });

    } catch (error) {
        throw new Error('Datainläsningsfel: ' + error.message);
    }
}

// Bearbetar inläst data och extraherar relevanta koder
function bearbetaInlästData(data) {
    debugLog('Bearbetar inläst data...');
    
    // Extrahera unika koder med Lodash
    ansvarskoder = _.uniq(
        data.map(row => row.Ansvar)
            .filter(kod => kod && kod.trim() !== '')
    ).sort();

    verksamhetskoder = _.uniq(
        data.map(row => row.Verksamhet)
            .filter(kod => kod && kod.trim() !== '')
    ).sort();

    // Spara giltiga kombinationer
    kodKombinationer = data
        .filter(row => row.Ansvar && row.Verksamhet)
        .map(row => ({
            ansvar: row.Ansvar,
            verksamhet: row.Verksamhet,
            aktivitet: row.Aktivitet,
            frekvens: 1
        }));

    // Räkna frekvenser för kombinationer
    kodKombinationer = _.groupBy(kodKombinationer, 
        kombo => `${kombo.ansvar}-${kombo.verksamhet}`);
    
    kodKombinationer = Object.entries(kodKombinationer).map(([key, values]) => ({
        ansvar: values[0].ansvar,
        verksamhet: values[0].verksamhet,
        frekvens: values.length,
        aktiviteter: _.uniq(values.map(v => v.aktivitet))
    }));
}

// Skapar mappningar mellan koder för rekommendationer
function skapaKodMappningar() {
    debugLog('Skapar kodmappningar...');
    
    // Mappning för ansvar till verksamhet
    ansvarVerksamhetMapping = {};
    kodKombinationer.forEach(kombo => {
        if (!ansvarVerksamhetMapping[kombo.ansvar]) {
            ansvarVerksamhetMapping[kombo.ansvar] = [];
        }
        ansvarVerksamhetMapping[kombo.ansvar].push({
            verksamhet: kombo.verksamhet,
            frekvens: kombo.frekvens,
            aktiviteter: kombo.aktiviteter
        });
    });

    // Sortera mappningar efter frekvens
    Object.keys(ansvarVerksamhetMapping).forEach(ansvar => {
        ansvarVerksamhetMapping[ansvar].sort((a, b) => b.frekvens - a.frekvens);
    });
}

// Validera periodformat (YYYYMM för 2025)
function valideraPeriod(period) {
    if (!/^\d{6}$/.test(period)) {
        return false;
    }
    const year = parseInt(period.substring(0, 4));
    const month = parseInt(period.substring(4, 6));
    return year === 2025 && month >= 1 && month <= 12;
}

// Kontrollera om en kombination är giltig
function ärGiltigKombination(ansvar, verksamhet) {
    return kodKombinationer.some(kombo => 
        kombo.ansvar === ansvar && 
        kombo.verksamhet === verksamhet
    );
}

// Hämta vanligaste verksamhetskoder för ett ansvar
function hämtaVanligaVerksamhetskoder(ansvar) {
    if (!ansvarVerksamhetMapping[ansvar]) {
        return [];
    }
    return ansvarVerksamhetMapping[ansvar]
        .sort((a, b) => b.frekvens - a.frekvens)
        .slice(0, 5);
}

// Beräkna statistik för kombinationer
function beräknaKombinationsStatistik() {
    return {
        totalKombinationer: kodKombinationer.length,
        unikaAnsvar: ansvarskoder.length,
        unikaVerksamhet: verksamhetskoder.length,
        vanligasteKombinationer: _.take(
            _.orderBy(kodKombinationer, ['frekvens'], ['desc']),
            5
        )
    };
}

// === DEL 2 SLUT ===
// ===========================================
// DEL 3: SMART KONTERINGSLOGIK
// Denna del hanterar den smarta konteringslogiken med
// rekommendationer och validering av kombinationer
// ===========================================

// Generera rekommendationer baserat på valt ansvar
function genereraRekommendationer(ansvar) {
    debugLog('Genererar rekommendationer för ansvar:', ansvar);
    
    if (!ansvar || !ansvarVerksamhetMapping[ansvar]) {
        return [];
    }

    return ansvarVerksamhetMapping[ansvar].map(kombination => ({
        verksamhet: kombination.verksamhet,
        frekvens: kombination.frekvens,
        aktiviteter: kombination.aktiviteter,
        procent: beräknaAnvändningsProcent(ansvar, kombination.frekvens)
    }));
}

// Beräkna användningsprocent för en kombination
function beräknaAnvändningsProcent(ansvar, frekvens) {
    const totalAnvändning = ansvarVerksamhetMapping[ansvar]
        .reduce((sum, kombination) => sum + kombination.frekvens, 0);
    return Math.round((frekvens / totalAnvändning) * 100);
}

// Validera och ge feedback på vald kombination
function valideraKombination(ansvar, verksamhet) {
    const ärGiltig = kodKombinationer.some(kombo => 
        kombo.ansvar === ansvar && kombo.verksamhet === verksamhet);
    
    const kombination = kodKombinationer.find(kombo => 
        kombo.ansvar === ansvar && kombo.verksamhet === verksamhet);

    const feedback = {
        status: ärGiltig ? 'success' : 'warning',
        message: '',
        detaljer: null
    };

    if (ärGiltig) {
        feedback.message = 'Detta är en tidigare använd kombination.';
        feedback.detaljer = {
            frekvens: kombination.frekvens,
            aktiviteter: kombination.aktiviteter
        };
    } else {
        const rekommendationer = genereraRekommendationer(ansvar);
        feedback.message = 'OBS! Detta är en ny kombination som inte använts tidigare.';
        feedback.detaljer = {
            rekommendationer: rekommendationer.slice(0, 3)
        };
    }

    return feedback;
}

// Hantera val av ansvarskod
function hanteraAnsvarVal(event) {
    const valtAnsvar = event.target.value;
    debugLog('Ansvarskod vald:', valtAnsvar);

    if (!valtAnsvar) {
        döljRekommendationer();
        return;
    }

    const rekommendationer = genereraRekommendationer(valtAnsvar);
    visaRekommendationer(rekommendationer);

    const valtVerksamhet = document.getElementById('verksamhetSelect').value;
    if (valtVerksamhet) {
        const feedback = valideraKombination(valtAnsvar, valtVerksamhet);
        visaKombinationsFeedback(feedback);
    }
}

// Hantera val av verksamhetskod
function hanteraVerksamhetVal(event) {
    const valtVerksamhet = event.target.value;
    const valtAnsvar = document.getElementById('ansvarSelect').value;

    if (valtAnsvar && valtVerksamhet) {
        const feedback = valideraKombination(valtAnsvar, valtVerksamhet);
        visaKombinationsFeedback(feedback);
    }
}

// Visa rekommendationer i gränssnittet
function visaRekommendationer(rekommendationer) {
    const rekommendationerDiv = document.getElementById('verksamhetRekommendationer');
    if (!rekommendationerDiv) return;

    if (rekommendationer.length === 0) {
        rekommendationerDiv.innerHTML = '';
        rekommendationerDiv.classList.add('d-none');
        return;
    }

    let html = '<div class="rekommendationer-lista">';
    html += '<h6>Vanliga verksamhetskoder för detta ansvar:</h6>';
    rekommendationer.forEach(rek => {
        html += `
            <div class="rekommendation-item">
                <strong>${rek.verksamhet}</strong>
                <span class="procent">(${rek.procent}%)</span>
                <div class="aktiviteter">
                    Använd med aktiviteter: ${rek.aktiviteter.join(', ')}
                </div>
            </div>
        `;
    });
    html += '</div>';

    rekommendationerDiv.innerHTML = html;
    rekommendationerDiv.classList.remove('d-none');
}

// Visa feedback för vald kombination
function visaKombinationsFeedback(feedback) {
    const feedbackDiv = document.getElementById('kombinationFeedback');
    if (!feedbackDiv) return;

    feedbackDiv.className = `alert alert-${feedback.status}`;
    
    let html = `<p>${feedback.message}</p>`;
    if (feedback.detaljer) {
        if (feedback.detaljer.frekvens) {
            html += `<p>Använd ${feedback.detaljer.frekvens} gånger tidigare.</p>`;
        }
        if (feedback.detaljer.rekommendationer) {
            html += '<p>Föreslagna alternativ:</p><ul>';
            feedback.detaljer.rekommendationer.forEach(rek => {
                html += `<li>Verksamhetskod ${rek.verksamhet} (${rek.procent}%)</li>`;
            });
            html += '</ul>';
        }
    }

    feedbackDiv.innerHTML = html;
    feedbackDiv.classList.remove('d-none');
}

// Dölj rekommendationer
function döljRekommendationer() {
    const rekommendationerDiv = document.getElementById('verksamhetRekommendationer');
    const feedbackDiv = document.getElementById('kombinationFeedback');

    if (rekommendationerDiv) {
        rekommendationerDiv.innerHTML = '';
        rekommendationerDiv.classList.add('d-none');
    }

    if (feedbackDiv) {
        feedbackDiv.classList.add('d-none');
    }
}

// === DEL 3 SLUT ===
// ===========================================
// DEL 4: FORMULÄRHANTERING
// Denna del hanterar formulärinmatning, validering
// och beräkningar för städavtal
// ===========================================

// Hantera formulärinlämning
document.getElementById('contractForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!valideraFormulär()) {
        return;
    }

    const contractData = samlaFormulärData();
    contracts.push(contractData);
    uppdateraKontraktLista();
    återställFormulär();
});

// Validera hela formuläret
function valideraFormulär() {
    const period = document.getElementById('period').value;
    if (!valideraPeriod(period)) {
        visaFelmeddelande('Period måste vara i format YYYYMM för år 2025');
        return false;
    }

    const totalBelopp = beräknaTotalbelopp();
    if (totalBelopp <= 0) {
        visaFelmeddelande('Minst ett belopp måste anges');
        return false;
    }

    return true;
}

// Samla in all formulärdata
function samlaFormulärData() {
    const data = {
        id: Date.now(),
        name: document.getElementById('contractName').value,
        period: document.getElementById('period').value,
        objectCodeType: document.getElementById('objectCodeType').value,
        objectCode: document.getElementById('objectCode')?.value || '',
        konto: document.getElementById('konto')?.value || CONFIG.DEFAULT_KONTO,
        costAnsvar: document.getElementById('ansvarSelect').value,
        costVerksamhet: document.getElementById('verksamhetSelect').value,
        motpart: document.getElementById('motpart').value,
        activities: {
            '8036': samlaAktivitetsData('8036'),
            '8035': samlaAktivitetsData('8035'),
            '8032': samlaAktivitetsData('8032')
        }
    };

    data.totalAmount = Object.values(data.activities)
        .reduce((sum, activity) => sum + activity.amount, 0);

    return data;
}

// Samla data för en specifik aktivitet
function samlaAktivitetsData(aktivitetsKod) {
    return {
        amount: parseFloat(document.getElementById(`amount${aktivitetsKod}`).value) || 0,
        yearlyAmount: parseFloat(document.getElementById(`yearly${aktivitetsKod}`).value) || 0,
        ansvar: document.getElementById(`ansvar${aktivitetsKod}`).value
    };
}

// Beräkna totalbelopp från alla aktiviteter
function beräknaTotalbelopp() {
    return ['8036', '8035', '8032'].reduce((total, aktivitet) => {
        const belopp = parseFloat(document.getElementById(`amount${aktivitet}`).value) || 0;
        return total + belopp;
    }, 0);
}

// Beräkna månadsbelopp från årsbelopp
function beräknaMånadsbelopp(årsbelopp) {
    return Math.round(årsbelopp / 12);
}

// Uppdatera månadsbelopp för alla aktiviteter
function updateMonthlyAmounts() {
    ['8036', '8035', '8032'].forEach(aktivitet => {
        const årsInput = document.getElementById(`yearly${aktivitet}`);
        const månadsInput = document.getElementById(`amount${aktivitet}`);
        
        if (årsInput.value) {
            månadsInput.value = beräknaMånadsbelopp(parseFloat(årsInput.value));
        }
    });
}

// Hantera objektkodstyp
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

// Återställ formuläret
function återställFormulär() {
    document.getElementById('contractForm').reset();
    document.getElementById('objectCodeSection').style.display = 'none';
    document.getElementById('kombinationFeedback').classList.add('d-none');
    
    // Återställ standardvärden
    if (document.getElementById('konto')) {
        document.getElementById('konto').value = CONFIG.DEFAULT_KONTO;
    }
    if (document.getElementById('ansvar8035')) {
        document.getElementById('ansvar8035').value = '41612';
    }
}

// Visa felmeddelande
function visaFelmeddelande(meddelande) {
    const feedback = document.getElementById('kombinationFeedback');
    feedback.className = 'alert alert-danger';
    feedback.textContent = meddelande;
    feedback.classList.remove('d-none');
}

// === DEL 4 SLUT ===
// ===========================================
// DEL 5: EXCEL-EXPORT FUNKTIONALITET
// Denna del hanterar export av data till Excel med
// korrekt formatering för 17 kolumner
// ===========================================

// Huvudfunktion för Excel-export
function exportToExcel() {
    debugLog('Startar Excel-export');
    const exportData = skapaExportData();
    genereraExcelFil(exportData);
}

// Skapa data för export
function skapaExportData() {
    return contracts.flatMap(contract => genereraKonteringsrader(contract));
}

// Generera konteringsrader för ett kontrakt
function genereraKonteringsrader(contract) {
    let rows = [];
    let rowNumber = 1;

    // Kostnadsrad
    rows.push(skapaKonteringsrad({
        rad: rowNumber++,
        konto: contract.konto || CONFIG.DEFAULT_KONTO,
        ansvar: contract.costAnsvar,
        verksamhet: contract.costVerksamhet,
        aktivitet: '7600',
        motpart: '180',
        objekt: (contract.objectCodeType === '2a' || contract.objectCodeType === '2d') 
            ? contract.objectCode : '',
        period: contract.period,
        belopp: contract.totalAmount,
        text: contract.name
    }));

    // Intäktsrader för varje aktivitet
    const activities = {
        '8036': { verksamhet: '9349', text: ' - fast intäkt' },
        '8035': { verksamhet: '9347', text: ' - fönsterputs' },
        '8032': { verksamhet: '9349', text: ' - storstädning' }
    };

    Object.entries(activities).forEach(([kod, info]) => {
        const activity = contract.activities[kod];
        if (activity.amount > 0) {
            rows.push(skapaKonteringsrad({
                rad: rowNumber++,
                konto: CONFIG.DEFAULT_INTAKT_KONTO,
                ansvar: activity.ansvar,
                verksamhet: info.verksamhet,
                aktivitet: kod,
                motpart: contract.motpart,
                objekt: (contract.objectCodeType === '2a' || contract.objectCodeType === '2c') 
                    ? contract.objectCode : '',
                period: contract.period,
                belopp: -activity.amount,
                text: `${contract.name}${info.text}`
            }));
        }
    });

    return rows;
}

// Skapa en enskild konteringsrad med alla 17 dimensioner
function skapaKonteringsrad(data) {
    return {
        rad: data.rad,
        konto: data.konto,
        ansvar: data.ansvar,
        projekt: '',  // Alltid tom
        anl: '',     // Alltid tom
        verksamhet: data.verksamhet,
        aktivitet: data.aktivitet,
        motpart: data.motpart,
        objekt: data.objekt,
        mk: '',      // Alltid tom
        ms: '',      // Alltid tom
        period: data.period,
        periodiseringsnyckel: '', // Alltid tom
        valbelopp: data.belopp,   // Samma som belopp
        valuta: '',  // Alltid tom
        belopp: data.belopp,
        text: data.text
    };
}

// Generera Excel-fil med korrekt formatering
function genereraExcelFil(data) {
    // Definiera kolumnordning för de 17 dimensionerna
    const columnOrder = [
        'rad', 'konto', 'ansvar', 'projekt', 'anl', 
        'verksamhet', 'aktivitet', 'motpart', 'objekt',
        'mk', 'ms', 'period', 'periodiseringsnyckel',
        'valbelopp', 'valuta', 'belopp', 'text'
    ];

    // Skapa kolumnrubriker
    const headers = columnOrder.reduce((obj, col) => ({...obj, [col]: col}), {});

    // Formatera data enligt specifikation
    const formattedData = data.map(row => {
        const newRow = {};
        columnOrder.forEach(col => {
            if (col === 'valbelopp') {
                newRow[col] = row.belopp;
            } else if (['projekt', 'anl', 'mk', 'ms', 'periodiseringsnyckel', 'valuta'].includes(col)) {
                newRow[col] = '';
            } else {
                newRow[col] = row[col] || '';
            }
        });
        return newRow;
    });

    // Skapa Excel-arbetsbok
    const ws = XLSX.utils.json_to_sheet([headers, ...formattedData], {
        header: columnOrder,
        skipHeader: true
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Konteringar");

    // Spara filen
    try {
        XLSX.writeFile(wb, "stadavtal_konteringar.xlsx");
        debugLog('Excel-export slutförd');
    } catch (error) {
        hanteraFel('Excel-export misslyckades', error);
    }
}

// Formatera belopp för Excel
function formateraBelopp(belopp) {
    return typeof belopp === 'number' ? belopp : 0;
}

// === DEL 5 SLUT ===
// ===========================================
// DEL 6: UI-UPPDATERINGAR OCH DOM-MANIPULATION
// Denna del hanterar uppdateringar av användargränssnittet
// och manipulering av DOM-element
// ===========================================

// Uppdatera kontraktslistan
function uppdateraKontraktLista() {
    const contractsList = document.getElementById('contractsList');
    contractsList.innerHTML = '';

    if (contracts.length === 0) {
        contractsList.innerHTML = '<p>Inga städavtal tillagda ännu.</p>';
        return;
    }

    // Lägg till exportknapp
    const exportButton = document.createElement('button');
    exportButton.className = 'btn btn-primary mb-3';
    exportButton.textContent = 'Exportera till Excel (17 kolumner)';
    exportButton.onclick = exportToExcel;
    contractsList.appendChild(exportButton);

    // Visa varje kontrakt
    contracts.forEach(contract => {
        const contractElement = document.createElement('div');
        contractElement.className = 'contract-item mb-4';
        contractElement.innerHTML = skapaKontraktHTML(contract);
        contractsList.appendChild(contractElement);
    });
}

// Skapa HTML för ett kontrakt
function skapaKontraktHTML(contract) {
    return `
        <div class="card">
            <div class="card-header">
                <h3 class="h5 mb-0">${contract.name}</h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>Period:</strong> ${contract.period}</p>
                        <p><strong>Ansvarskod:</strong> ${contract.costAnsvar}</p>
                        <p><strong>Verksamhetskod:</strong> ${contract.costVerksamhet}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Objektkodstyp:</strong> ${contract.objectCodeType}</p>
                        <p><strong>Objektkod:</strong> ${contract.objectCode || '-'}</p>
                        <p><strong>Motpart:</strong> ${contract.motpart}</p>
                    </div>
                </div>
                ${skapaAktivitetsTabellHTML(contract)}
            </div>
        </div>
    `;
}

// Skapa HTML för aktivitetstabell
function skapaAktivitetsTabellHTML(contract) {
    return `
        <table class="table table-sm mt-3">
            <thead>
                <tr>
                    <th>Aktivitet</th>
                    <th>Ansvar</th>
                    <th>Belopp</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(contract.activities)
                    .filter(([_, activity]) => activity.amount > 0)
                    .map(([kod, activity]) => `
                        <tr>
                            <td>${ACTIVITIES[kod].name} (${kod})</td>
                            <td>${activity.ansvar}</td>
                            <td>${formateraBeloppförVisning(activity.amount)}</td>
                        </tr>
                    `).join('')}
                <tr class="table-info">
                    <td colspan="2"><strong>Totalt:</strong></td>
                    <td><strong>${formateraBeloppförVisning(contract.totalAmount)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;
}

// Uppdatera dropdown-listor
function uppdateraDropdowns() {
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

// Uppdatera statistikvyn
function uppdateraStatistik() {
    const statistik = beräknaKombinationsStatistik();
    const översiktInfo = document.getElementById('översiktInfo');
    
    if (!översiktInfo) return;

    översiktInfo.innerHTML = `
        <div class="statistics-container">
            <div class="stat-item">
                <span class="stat-label">Antal ansvarskoder:</span>
                <span class="stat-value">${statistik.unikaAnsvar}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Antal verksamhetskoder:</span>
                <span class="stat-value">${statistik.unikaVerksamhet}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Antal unika kombinationer:</span>
                <span class="stat-value">${statistik.totalKombinationer}</span>
            </div>
        </div>
    `;
}

// Formatera belopp för visning
function formateraBeloppförVisning(belopp) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(belopp);
}

// Visa laddningsindikator
function visaLaddning(element) {
    element.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Laddar...</span></div>';
}

// Dölj laddningsindikator
function döljLaddning(element, innehåll) {
    element.innerHTML = innehåll;
}

// === DEL 6 SLUT ===
// ===========================================
// DEL 7: HJÄLPFUNKTIONER OCH VERKTYG
// Denna del innehåller diverse hjälpfunktioner för
// validering, formatering och felhantering
// ===========================================

// Formatera nummer enligt svensk standard
function formateraNummer(nummer, decimaler = 0) {
    return new Intl.NumberFormat('sv-SE', {
        minimumFractionDigits: decimaler,
        maximumFractionDigits: decimaler
    }).format(nummer);
}

// Validera sifferkod
function valideraSifferkod(kod, minLängd = 4, maxLängd = 6) {
    const pattern = new RegExp(`^\\d{${minLängd},${maxLängd}}$`);
    return pattern.test(kod);
}

// Skapa unik id för nya poster
function skapaUniktId() {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Säker avrundning för belopp
function avrundaBelopp(belopp, decimaler = 0) {
    const faktor = Math.pow(10, decimaler);
    return Math.round(belopp * faktor) / faktor;
}

// Deep clone av objekt
function djupKopia(objekt) {
    return JSON.parse(JSON.stringify(objekt));
}

// Validera datumformat YYYYMM
function valideraDatumFormat(datum) {
    return /^2025(0[1-9]|1[0-2])$/.test(datum);
}

// Konvertera till heltal
function tillHeltal(värde, standard = 0) {
    const num = parseInt(värde);
    return isNaN(num) ? standard : num;
}

// Escapea HTML
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Logga händelser med tidsstämpel
function loggaHändelse(meddelande, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${meddelande}`);
    if (data) {
        console.log(data);
    }
}

// Kontrollera om värde är numeriskt
function ärNumeriskt(värde) {
    return !isNaN(parseFloat(värde)) && isFinite(värde);
}

// Summera array av nummer
function summeraArray(array) {
    return array.reduce((sum, num) => sum + (ärNumeriskt(num) ? parseFloat(num) : 0), 0);
}

// Formatera datum YYYYMM
function formateraDatum(datum) {
    const år = datum.getFullYear();
    const månad = String(datum.getMonth() + 1).padStart(2, '0');
    return `${år}${månad}`;
}

// Kontrollera om objekt är tomt
function ärTomt(obj) {
    return Object.keys(obj).length === 0;
}

// Validera e-postadress
function valideraEpost(epost) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost);
}

// Hantera API-fel
function hanteraApiFel(error) {
    loggaHändelse('API-fel:', error);
    return {
        success: false,
        error: error.message || 'Ett okänt fel inträffade'
    };
}

// Debounce funktion
function debounce(func, väntetid) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), väntetid);
    };
}

// Throttle funktion
function throttle(func, gräns) {
    let senastAnrop = 0;
    return function (...args) {
        const nu = Date.now();
        if (nu - senastAnrop >= gräns) {
            func.apply(this, args);
            senastAnrop = nu;
        }
    };
}

// Local storage hantering
const lokalLagring = {
    spara: (nyckel, värde) => {
        try {
            localStorage.setItem(nyckel, JSON.stringify(värde));
            return true;
        } catch (e) {
            console.error('Fel vid sparande till local storage:', e);
            return false;
        }
    },
    hämta: (nyckel) => {
        try {
            const data = localStorage.getItem(nyckel);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Fel vid hämtning från local storage:', e);
            return null;
        }
    }
};

// Cookie hantering
const cookies = {
    sätt: (namn, värde, dagar = 7) => {
        const d = new Date();
        d.setTime(d.getTime() + (dagar * 24 * 60 * 60 * 1000));
        document.cookie = `${namn}=${värde};expires=${d.toUTCString()};path=/`;
    },
    hämta: (namn) => {
        const namnet = namn + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(namnet) === 0) {
                return c.substring(namnet.length, c.length);
            }
        }
        return "";
    }
};

// === DEL 7 SLUT ===

// === JAVASCRIPT-FILEN SLUT ===
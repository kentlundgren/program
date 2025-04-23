// ==================== DEL 1: Grundläggande datastrukturer och konfiguration ====================

// Definiera giltiga ansvarskoder med beskrivningar baserat på analysen av existerande avtal
const ansvarKoder = {
    // Omsorgsförvaltningen (30000-33999)
    "30510": "Omsorg - Administration",
    "30520": "Omsorg - Ledning",
    "30525": "Omsorg - Verksamhetsstöd",
    "31000": "Omsorg - Hemvård",
    "31011": "Hemvård - Team 1",
    "31013": "Hemvård - Team 2",
    "31014": "Hemvård - Specialteam",
    "31021": "Hemvård - Natt Nord",
    "31023": "Hemvård - Natt Syd",
    "31031": "Särskilt boende - Enhet 1",
    "31032": "Särskilt boende - Enhet 2",
    "31033": "Särskilt boende - Enhet 3",
    "31071": "Omsorg - Specialverksamhet",
    "31081": "Omsorg - Dagverksamhet",
    "32000": "Funktionsstöd - Ledning",
    "32159": "Funktionsstöd - Boende",
    "32201": "Funktionsstöd - Daglig verksamhet",
    "32301": "Funktionsstöd - Service",
    "32302": "Funktionsstöd - Stöd",
    "32303": "Funktionsstöd - Boendestöd",
    "32307": "Funktionsstöd - Särskilt boende 1",
    "32308": "Funktionsstöd - Särskilt boende 2",
    "33010": "HSL - Ledning",
    "33020": "HSL - Team Nord",
    "33021": "HSL - Team Syd",
    "33025": "HSL - Specialistteam",
    "33105": "HSL - Rehabilitering",
    "33204": "HSL - Administration",
    "33205": "HSL - Verksamhetsstöd",

    // Kommunledning och administration (50000-59999)
    "50103": "Arbetsmarknad",
    "50400": "Fackliga organisationer",
    "51300": "IT-avdelning",
    "52200": "Projekt och utveckling",
    "54001": "Räddningstjänst",
    "59240": "Fastighet - Område Nord",
    "59250": "Fastighet - Område Syd",
    "59260": "Fastighet - Centrum",

    // Kultur och fritid (62000-62999)
    "62200": "Bibliotek",
    "62400": "Kultur - Administration",
    "62500": "Kultur - Program",
    "62600": "Kulturskola",

    // Individ och familj (70000-70999)
    "70014": "IFO - Administration",
    "70210": "IFO - Barn och familj",
    "70220": "IFO - Vuxen",
    "70231": "IFO - Boende 1",
    "70232": "IFO - Boende 2",
    "70253": "IFO - Öppenvård",
    "70260": "IFO - Förebyggande",
    "70261": "IFO - Fältgrupp",
    "70285": "IFO - Stödboende",
    "70290": "IFO - Kvinnofrid",
    "70300": "IFO - Ekonomiskt bistånd",
    "70313": "IFO - Integration",
    "70322": "IFO - Stödverksamhet",
    "70326": "IFO - Behandling",
    "70340": "IFO - Myndighet",

    // Teknisk förvaltning (80000-80999)
    "80301": "Teknisk service",
    "80350": "Fritid - Anläggningar",
    "80370": "Fritid - Administration",
    "80601": "Teknisk drift",
    "80671": "Teknisk utveckling",

    // Utbildning (90000-95999)
    "90005": "Utbildning - Administration",
    "91050": "Förskola - Administration",
    "91200": "Förskola - Område 1",
    "91300": "Förskola - Område 2",
    "91625": "Förskola - Område 3",
    "91645": "Förskola - Område 4",
    "92110": "Grundskola - Administration",
    "92300": "Grundskola - Område 1",
    "92400": "Grundskola - Område 2",
    "92600": "Grundskola - Område 3",
    "92630": "Grundskola - Område 4",
    "93010": "Särskola",
    "94100": "Gymnasium - Administration",
    "95100": "Vuxenutbildning"
};

// Definiera verksamhetskoder med beskrivningar
const verksamhetKoder = {
    // Teknisk verksamhet (2000-2999)
    "2601": "Offentliga toaletter",
    "2700": "Räddningstjänst",

    // Kultur och fritid (3000-3999)
    "3103": "Teater",
    "3151": "Museum",
    "3161": "Kulturverksamhet",
    "3200": "Bibliotek",
    "3300": "Kulturskola",
    "3402": "Fritidsanläggningar - Administration",
    "3405": "Idrottsanläggningar",
    "3406": "Sporthallar",
    "3408": "Idrottshallar",

    // Pedagogisk verksamhet (4000-4999)
    "4071": "Förskola",
    "4400": "Grundskola",
    "4500": "Gymnasieskola",
    "4600": "Särskola",
    "4799": "Vuxenutbildning",

    // Vård och omsorg (5000-5999)
    "5101": "Hemtjänst",
    "5103": "Särskilt boende - Administration",
    "5104": "Specialiserad hemtjänst",
    "5105": "Hemsjukvård",
    "5108": "Dagverksamhet",
    "5120": "Rehabilitering",
    "5135": "Korttidsboende",
    "5145": "Träffpunkter",
    "5198": "Anhörigstöd",
    "5202": "Boendestöd",
    "5204": "Personligt ombud",
    "5210": "LSS-boende",
    "5231": "Daglig verksamhet LSS",
    "5290": "LSS-administration",
    "5300": "HSL-verksamhet",
    "5320": "Rehab-verksamhet",
    "5520": "IFO - Administration",
    "5541": "Barn och familj",
    "5570": "Vuxenenhet",
    "5583": "Behandlingsenhet",
    "5681": "Förebyggande verksamhet",
    "5686": "Boende/lokaler",
    "5688": "Fältverksamhet",
    "5712": "Kvinnofrid",
    "5750": "Integration",

    // Övrig verksamhet (6000-9999)
    "6113": "Arbetsmarknadsåtgärder",
    "9110": "Fastighetsservice",
    "9125": "Lokalvård",
    "9180": "Fastighetsdrift",
    "9220": "Skolservice",
    "9231": "Omsorgsservice",
    "9237": "Administrativ service",
    "9243": "Socialtjänst service",
    "9257": "Projektledning",
    "9258": "Facklig verksamhet",
    "9262": "Kulturadministration",
    "9275": "IT-drift",
    "9340": "Teknisk service",
    "9365": "Utvecklingsprojekt",
    "9366": "Förbättringsprojekt",
    "9368": "Specialprojekt",
    "9388": "Förrådsverksamhet"
};

// Definiera vanliga kombinationer av ansvar och verksamhet baserat på analys
const vanligaKombinationer = [
    { ansvar: "80350", verksamhet: "3405", beskrivning: "Idrottsanläggningar" },
    { ansvar: "80350", verksamhet: "3408", beskrivning: "Idrottshallar" },
    { ansvar: "62400", verksamhet: "3151", beskrivning: "Museum" },
    { ansvar: "62200", verksamhet: "3200", beskrivning: "Bibliotek" },
    { ansvar: "70232", verksamhet: "5686", beskrivning: "IFO Boende" },
    { ansvar: "31000", verksamhet: "5101", beskrivning: "Hemtjänst" },
    { ansvar: "32301", verksamhet: "5210", beskrivning: "LSS-boende" },
    { ansvar: "59260", verksamhet: "9110", beskrivning: "Fastighetsservice Centrum" }
];

// Validering och formatering
function valideraAnsvar(ansvar) {
    return ansvarKoder.hasOwnProperty(ansvar);
}

function valideraVerksamhet(verksamhet) {
    return verksamhetKoder.hasOwnProperty(verksamhet);
}

function valideraKombination(ansvar, verksamhet) {
    // Kontrollera först att både ansvar och verksamhet är giltiga
    if (!valideraAnsvar(ansvar) || !valideraVerksamhet(verksamhet)) {
        return false;
    }

    // Kontrollera om kombinationen finns i vanliga kombinationer
    const finnsVanlig = vanligaKombinationer.some(
        kombo => kombo.ansvar === ansvar && kombo.verksamhet === verksamhet
    );

    if (finnsVanlig) {
        return { giltig: true, vanlig: true };
    }

    // Kontrollera logiska regler för kombinationer
    const ansvarPrefix = ansvar.substring(0, 2);
    const verksamhetPrefix = verksamhet.substring(0, 1);

    // Exempel på logiska regler:
    // - Omsorg (30-33) bör användas med verksamhet 5xxx
    // - Skola (90-95) bör användas med verksamhet 4xxx
    // - Kultur (62) bör användas med verksamhet 3xxx
    const logiskaRegler = {
        "30": ["5"], "31": ["5"], "32": ["5"], "33": ["5"],
        "62": ["3"],
        "90": ["4"], "91": ["4"], "92": ["4"], "93": ["4"], "94": ["4"], "95": ["4"]
    };

    if (logiskaRegler[ansvarPrefix] && !logiskaRegler[ansvarPrefix].includes(verksamhetPrefix)) {
        return { giltig: true, vanlig: false, varning: "Ovanlig kombination för denna typ av verksamhet" };
    }

    return { giltig: true, vanlig: false };
}

// Formatering av belopp enligt svensk standard
function formateraBelopp(belopp) {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(belopp);
}

// Exportera funktioner och konstanter som behövs i andra delar
export {
    ansvarKoder,
    verksamhetKoder,
    vanligaKombinationer,
    valideraAnsvar,
    valideraVerksamhet,
    valideraKombination,
    formateraBelopp
};

// ==================== DEL 2 BÖRJAR: Hantering av kombinationer ansvar/verksamhet ====================

// Importera nödvändiga funktioner och konstanter från Del 1
import {
    ansvarKoder,
    verksamhetKoder,
    vanligaKombinationer,
    valideraAnsvar,
    valideraVerksamhet,
    valideraKombination
} from './stadavtal34-del1.js';

// Hantering av ansvar/verksamhet kombinationer
class KombinationsHanterare {
    constructor() {
        // Spara historiska kombinationer för analys
        this.historiskaKombinationer = new Map();
        
        // Cache för snabb åtkomst till förslag
        this.forslagsCache = new Map();
    }

    // Lägg till en ny kombination i historiken
    laggTillKombination(ansvar, verksamhet) {
        const nyckel = `${ansvar}-${verksamhet}`;
        if (!this.historiskaKombinationer.has(nyckel)) {
            this.historiskaKombinationer.set(nyckel, 1);
        } else {
            this.historiskaKombinationer.set(
                nyckel,
                this.historiskaKombinationer.get(nyckel) + 1
            );
        }
        // Rensa cachen när ny data läggs till
        this.forslagsCache.clear();
    }

    // Hämta förslag på verksamhetskoder baserat på valt ansvar
    hamtaVerksamhetsforslag(ansvar) {
        if (this.forslagsCache.has(ansvar)) {
            return this.forslagsCache.get(ansvar);
        }

        const forslag = new Set();
        const ansvarPrefix = ansvar.substring(0, 2);

        // Lägg till verksamhetskoder från vanliga kombinationer
        vanligaKombinationer
            .filter(kombo => kombo.ansvar === ansvar)
            .forEach(kombo => forslag.add(kombo.verksamhet));

        // Lägg till verksamhetskoder baserat på logiska regler
        switch (ansvarPrefix) {
            case "30": // Omsorgsförvaltning administration
            case "31": // Hemvård
            case "32": // Funktionsstöd
            case "33": // HSL
                Object.keys(verksamhetKoder)
                    .filter(kod => kod.startsWith("5"))
                    .forEach(kod => forslag.add(kod));
                break;

            case "62": // Kultur och fritid
                Object.keys(verksamhetKoder)
                    .filter(kod => kod.startsWith("3"))
                    .forEach(kod => forslag.add(kod));
                break;

            case "70": // Individ och familj
                Object.keys(verksamhetKoder)
                    .filter(kod => kod.startsWith("5"))
                    .forEach(kod => forslag.add(kod));
                break;

            case "80": // Teknisk förvaltning
                ["2", "3", "9"].forEach(prefix => {
                    Object.keys(verksamhetKoder)
                        .filter(kod => kod.startsWith(prefix))
                        .forEach(kod => forslag.add(kod));
                });
                break;

            case "90": // Utbildning administration
            case "91": // Förskola
            case "92": // Grundskola
            case "93": // Särskola
            case "94": // Gymnasium
            case "95": // Vuxenutbildning
                Object.keys(verksamhetKoder)
                    .filter(kod => kod.startsWith("4"))
                    .forEach(kod => forslag.add(kod));
                break;
        }

        // Sortera förslagen efter relevans
        const sorteradeForslag = Array.from(forslag).sort((a, b) => {
            const aVanlig = vanligaKombinationer.some(
                k => k.ansvar === ansvar && k.verksamhet === a
            );
            const bVanlig = vanligaKombinationer.some(
                k => k.ansvar === ansvar && k.verksamhet === b
            );
            
            if (aVanlig && !bVanlig) return -1;
            if (!aVanlig && bVanlig) return 1;
            return a.localeCompare(b);
        });

        // Spara i cache och returnera
        this.forslagsCache.set(ansvar, sorteradeForslag);
        return sorteradeForslag;
    }

    // Generera varningsmeddelande för ovanliga kombinationer
    genereraVarning(ansvar, verksamhet) {
        const validering = valideraKombination(ansvar, verksamhet);
        if (!validering.giltig) {
            return "Ogiltig kombination av ansvar och verksamhet";
        }
        
        if (validering.varning) {
            return validering.varning;
        }

        if (!validering.vanlig) {
            return "OBS! Detta är en ovanlig kombination. Verifiera att den är korrekt.";
        }

        return null;
    }

    // Hämta beskrivning för en kombination
    hamtaKombinationsBeskrivning(ansvar, verksamhet) {
        const ansvarNamn = ansvarKoder[ansvar] || "Okänt ansvar";
        const verksamhetNamn = verksamhetKoder[verksamhet] || "Okänd verksamhet";
        
        // Kolla om det finns en specifik beskrivning i vanliga kombinationer
        const vanligKombination = vanligaKombinationer.find(
            k => k.ansvar === ansvar && k.verksamhet === verksamhet
        );

        if (vanligKombination) {
            return vanligKombination.beskrivning;
        }

        // Annars generera en beskrivning baserat på individuella koder
        return `${ansvarNamn} - ${verksamhetNamn}`;
    }

    // Uppdatera dropdown-menyer baserat på val
    uppdateraVerksamhetsval(ansvarSelect, verksamhetSelect) {
        const ansvar = ansvarSelect.value;
        const forslag = this.hamtaVerksamhetsforslag(ansvar);
        
        // Töm nuvarande alternativ
        verksamhetSelect.innerHTML = '<option value="">Välj verksamhet...</option>';
        
        // Lägg till nya alternativ
        forslag.forEach(verksamhet => {
            const beskrivning = this.hamtaKombinationsBeskrivning(ansvar, verksamhet);
            const option = document.createElement('option');
            option.value = verksamhet;
            option.textContent = `${verksamhet} - ${beskrivning}`;
            verksamhetSelect.appendChild(option);
        });
    }
}

// Skapa och exportera en instans av kombinationshanteraren
const kombinationsHanterare = new KombinationsHanterare();

export {
    kombinationsHanterare
};

// ==================== DEL 2 SLUTAR: Hantering av kombinationer ansvar/verksamhet ====================
// ==================== DEL 3 BÖRJAR: Formulärhantering och användarinteraktion ====================

// Importera nödvändiga funktioner och konstanter från tidigare delar
import {
    ansvarKoder,
    verksamhetKoder,
    formateraBelopp
} from './stadavtal34-del1.js';

import {
    kombinationsHanterare
} from './stadavtal34-del2.js';

// Globala variabler för tillstånd
let currentState = {
    contracts: [],
    editingId: null,
    showingOriginal: false
};

// ==================== Formulärhantering ====================

class FormularHanterare {
    constructor() {
        this.initieraFormular();
        this.initieraEventListeners();
    }

    initieraFormular() {
        // Populera ansvar dropdown
        const ansvarSelect = document.getElementById('costAnsvar');
        ansvarSelect.innerHTML = '<option value="">Välj ansvar...</option>';
        Object.entries(ansvarKoder).forEach(([kod, beskrivning]) => {
            const option = document.createElement('option');
            option.value = kod;
            option.textContent = `${kod} - ${beskrivning}`;
            ansvarSelect.appendChild(option);
        });

        // Initiera verksamhet dropdown (tom tills ansvar väljs)
        const verksamhetSelect = document.getElementById('costVerksamhet');
        verksamhetSelect.innerHTML = '<option value="">Välj först ansvar...</option>';

        // Sätt standardvärden
        document.getElementById('konto').value = '6132';
        this.uppdateraAktivitetsBelopp();
    }

    initieraEventListeners() {
        // Lyssna på ändringar i ansvar-väljaren
        document.getElementById('costAnsvar').addEventListener('change', (e) => {
            const verksamhetSelect = document.getElementById('costVerksamhet');
            kombinationsHanterare.uppdateraVerksamhetsval(e.target, verksamhetSelect);
            this.visaVarningOmFinns();
        });

        // Lyssna på ändringar i verksamhet-väljaren
        document.getElementById('costVerksamhet').addEventListener('change', () => {
            this.visaVarningOmFinns();
        });

        // Lyssna på ändringar i årsbelopp
        ['8036', '8035', '8032'].forEach(aktivitet => {
            document.getElementById(`yearly${aktivitet}`).addEventListener('input', (e) => {
                this.beraknaManadsbelopp(aktivitet, e.target.value);
            });
        });

        // Hantera formulärinlämning
        document.getElementById('contractForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.hanteraFormularInlamning();
        });

        // Lyssna på ändringar i objektkodstyp
        document.getElementById('objectCodeType').addEventListener('change', (e) => {
            this.hanteraObjektkodTypAndring(e.target.value);
        });
    }

    visaVarningOmFinns() {
        const ansvar = document.getElementById('costAnsvar').value;
        const verksamhet = document.getElementById('costVerksamhet').value;
        
        if (ansvar && verksamhet) {
            const varning = kombinationsHanterare.genereraVarning(ansvar, verksamhet);
            const varningsdiv = document.getElementById('kombinationsVarning');
            
            if (varning) {
                varningsdiv.textContent = varning;
                varningsdiv.style.display = 'block';
                varningsdiv.className = 'varning-meddelande';
            } else {
                varningsdiv.style.display = 'none';
            }
        }
    }

    beraknaManadsbelopp(aktivitet, arsbelopp) {
        const manadsbelopp = arsbelopp ? Math.round(parseFloat(arsbelopp) / 12) : 0;
        document.getElementById(`amount${aktivitet}`).value = manadsbelopp;
        this.uppdateraAktivitetsBelopp();
    }

    uppdateraAktivitetsBelopp() {
        const totalBelopp = ['8036', '8035', '8032'].reduce((sum, aktivitet) => {
            return sum + (parseFloat(document.getElementById(`amount${aktivitet}`).value) || 0);
        }, 0);

        document.getElementById('totalAmount').textContent = formateraBelopp(totalBelopp);
    }

    hanteraObjektkodTypAndring(typ) {
        const objektkodSektion = document.getElementById('objectCodeSection');
        const objektkodInput = document.getElementById('objectCode');
        
        if (typ === '2b') {
            objektkodSektion.style.display = 'none';
            objektkodInput.required = false;
        } else {
            objektkodSektion.style.display = 'block';
            objektkodInput.required = true;
        }
    }

    valideraFormular() {
        const period = document.getElementById('period').value;
        if (!/^2025(0[1-9]|1[0-2])$/.test(period)) {
            alert('Period måste vara i format YYYYMM för år 2025 (exempel: 202501)');
            return false;
        }

        const ansvar = document.getElementById('costAnsvar').value;
        const verksamhet = document.getElementById('costVerksamhet').value;
        if (!ansvar || !verksamhet) {
            alert('Både ansvar och verksamhet måste väljas');
            return false;
        }

        const totalBelopp = ['8036', '8035', '8032'].reduce((sum, aktivitet) => {
            return sum + (parseFloat(document.getElementById(`amount${aktivitet}`).value) || 0);
        }, 0);

        if (totalBelopp <= 0) {
            alert('Minst ett aktivitetsbelopp måste anges');
            return false;
        }

        return true;
    }

    hanteraFormularInlamning() {
        if (!this.valideraFormular()) {
            return;
        }

        const formularData = {
            id: Date.now(),
            name: document.getElementById('contractName').value,
            period: document.getElementById('period').value,
            objectCodeType: document.getElementById('objectCodeType').value,
            objectCode: document.getElementById('objectCode')?.value || '',
            konto: document.getElementById('konto').value,
            costAnsvar: document.getElementById('costAnsvar').value,
            costVerksamhet: document.getElementById('costVerksamhet').value,
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

        // Lägg till kombinationen i historiken
        kombinationsHanterare.laggTillKombination(
            formularData.costAnsvar,
            formularData.costVerksamhet
        );

        // Uppdatera kontrakt och visa
        if (currentState.editingId) {
            currentState.contracts = currentState.contracts.map(c => 
                c.id === currentState.editingId ? formularData : c
            );
            currentState.editingId = null;
        } else {
            currentState.contracts.push(formularData);
        }

        this.uppdateraKontraktLista();
        this.aterStallFormular();
    }

    aterStallFormular() {
        document.getElementById('contractForm').reset();
        document.getElementById('konto').value = '6132';
        document.getElementById('objectCodeSection').style.display = 'none';
        document.getElementById('kombinationsVarning').style.display = 'none';
        document.getElementById('totalAmount').textContent = formateraBelopp(0);
    }

    uppdateraKontraktLista() {
        const contractsList = document.getElementById('contractsList');
        contractsList.innerHTML = '';

        if (currentState.contracts.length > 0) {
            // Lägg till export-knapp
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Exportera till Excel';
            exportButton.onclick = () => window.exportToExcel(); // Definieras i Del 4
            contractsList.appendChild(exportButton);

            // Visa kontrakt
            currentState.contracts.forEach(contract => {
                const kontraktElement = document.createElement('div');
                kontraktElement.className = 'contract-item';
                kontraktElement.innerHTML = this.genereraKontraktHTML(contract);
                contractsList.appendChild(kontraktElement);
            });
        } else {
            contractsList.innerHTML = '<p>Inga städavtal tillagda ännu.</p>';
        }
    }

    genereraKontraktHTML(contract) {
        const ansvarNamn = ansvarKoder[contract.costAnsvar] || 'Okänt ansvar';
        const verksamhetNamn = verksamhetKoder[contract.costVerksamhet] || 'Okänd verksamhet';
        
        return `
            <h3>${contract.name}</h3>
            <div class="contract-details">
                <p><strong>Period:</strong> ${contract.period}</p>
                <p><strong>Ansvar:</strong> ${contract.costAnsvar} - ${ansvarNamn}</p>
                <p><strong>Verksamhet:</strong> ${contract.costVerksamhet} - ${verksamhetNamn}</p>
                <p><strong>Objektkod:</strong> ${contract.objectCode || 'Ingen'}</p>
                <h4>Aktiviteter:</h4>
                <ul>
                    ${Object.entries(contract.activities)
                        .filter(([_, data]) => data.amount > 0)
                        .map(([kod, data]) => `
                            <li>${kod}: ${formateraBelopp(data.amount)}</li>
                        `).join('')}
                </ul>
                <div class="contract-actions">
                    <button onclick="redigeraKontrakt(${contract.id})">Redigera</button>
                    <button onclick="raderaKontrakt(${contract.id})">Radera</button>
                </div>
            </div>
        `;
    }
}

// Skapa och exportera en instans av formulärhanteraren
const formularHanterare = new FormularHanterare();

// Exportera funktioner som behövs globalt
window.redigeraKontrakt = function(id) {
    const contract = currentState.contracts.find(c => c.id === id);
    if (!contract) return;

    currentState.editingId = id;
    
    // Fyll i formuläret med kontraktets data
    document.getElementById('contractName').value = contract.name;
    document.getElementById('period').value = contract.period;
    document.getElementById('objectCodeType').value = contract.objectCodeType;
    document.getElementById('konto').value = contract.konto;
    document.getElementById('costAnsvar').value = contract.costAnsvar;
    
    // Trigga uppdatering av verksamhetsval
    kombinationsHanterare.uppdateraVerksamhetsval(
        document.getElementById('costAnsvar'),
        document.getElementById('costVerksamhet')
    );
    
    document.getElementById('costVerksamhet').value = contract.costVerksamhet;
    
    if (contract.objectCode) {
        document.getElementById('objectCode').value = contract.objectCode;
        document.getElementById('objectCodeSection').style.display = 'block';
    }

    // Fyll i aktiviteter
    Object.entries(contract.activities).forEach(([kod, data]) => {
        document.getElementById(`amount${kod}`).value = data.amount;
        document.getElementById(`ansvar${kod}`).value = data.ansvar;
    });

    formularHanterare.uppdateraAktivitetsBelopp();
    formularHanterare.visaVarningOmFinns();
};

window.raderaKontrakt = function(id) {
    if (confirm('Är du säker på att du vill radera detta kontrakt?')) {
        currentState.contracts = currentState.contracts.filter(c => c.id !== id);
        formularHanterare.uppdateraKontraktLista();
    }
};

export {
    formularHanterare,
    currentState
};

// ==================== DEL 3 SLUTAR: Formulärhantering och användarinteraktion ====================
// ==================== DEL 4 BÖRJAR: Konteringslogik och Excel-export ====================

// Importera nödvändiga funktioner och data från tidigare delar
import {
    formateraBelopp
} from './stadavtal34-del1.js';

import {
    currentState
} from './stadavtal34-del3.js';

// ==================== Konteringslogik ====================

class KonteringsHanterare {
    constructor() {
        // Definiera standardvärden för kontering
        this.standardVarden = {
            kostnadskonto: '6132',
            intaktskonto: '3153',
            aktivitetKostnad: '7600',
            motpartKostnad: '180'
        };

        // Definiera kolumnordning enligt specifikation
        this.kolumnOrdning = [
            'rad',
            'konto',
            'ansvar',
            'projekt',
            'anl',
            'verksamhet',
            'aktivitet',
            'motpart',
            'objekt',
            'mk',
            'ms',
            'period',
            'periodiseringsnyckel',
            'valbelopp',
            'valuta',
            'belopp',
            'text'
        ];
    }

    // Skapa en konteringsrad med alla 17 dimensioner
    skapaKonteringsrad(data) {
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
            valbelopp: data.belopp || 0,
            valuta: '',  // Alltid tom
            belopp: data.belopp || 0,
            text: data.text || ''
        };
    }

    // Generera konteringsrader för ett kontrakt
    genereraKontering(contract) {
        let rows = [];
        let radNummer = 1;

        // 1. Kostnadsrad
        rows.push(this.skapaKonteringsrad({
            rad: radNummer++,
            konto: contract.konto || this.standardVarden.kostnadskonto,
            ansvar: contract.costAnsvar,
            verksamhet: contract.costVerksamhet,
            aktivitet: this.standardVarden.aktivitetKostnad,
            motpart: this.standardVarden.motpartKostnad,
            objekt: this.bestamObjektkod(contract, 'kostnad'),
            period: contract.period,
            belopp: this.beraknaKostnadsbelopp(contract),
            text: contract.name
        }));

        // 2. Intäktsrader
        const aktiviteter = [
            { kod: '8036', verksamhet: '9349', text: ' - fast intäkt' },
            { kod: '8035', verksamhet: '9347', text: ' - fönsterputs' },
            { kod: '8032', verksamhet: '9349', text: ' - storstädning' }
        ];

        aktiviteter.forEach(aktivitet => {
            const belopp = contract.activities[aktivitet.kod].amount;
            if (belopp > 0) {
                rows.push(this.skapaKonteringsrad({
                    rad: radNummer++,
                    konto: this.standardVarden.intaktskonto,
                    ansvar: contract.activities[aktivitet.kod].ansvar,
                    verksamhet: aktivitet.verksamhet,
                    aktivitet: aktivitet.kod,
                    motpart: contract.motpart,
                    objekt: this.bestamObjektkod(contract, 'intakt'),
                    period: contract.period,
                    belopp: -belopp, // Negativ för intäkt
                    text: `${contract.name}${aktivitet.text}`
                }));
            }
        });

        return rows;
    }

    // Bestäm objektkod baserat på typ
    bestamObjektkod(contract, typ) {
        switch (contract.objectCodeType) {
            case '2a': // Samma objektkod för både intäkter och kostnader
                return contract.objectCode;
            case '2b': // Utan objektkod
                return '';
            case '2c': // Objektkod endast på intäkter
                return typ === 'intakt' ? contract.objectCode : '';
            case '2d': // Objektkod endast på kostnader
                return typ === 'kostnad' ? contract.objectCode : '';
            default:
                return '';
        }
    }

    // Beräkna totalt kostnadsbelopp
    beraknaKostnadsbelopp(contract) {
        return Object.values(contract.activities)
            .reduce((sum, activity) => sum + activity.amount, 0);
    }

    // Generera Excel-exportdata
    genereraExportData() {
        // Samla alla konteringsrader från alla kontrakt
        const alleRader = currentState.contracts.flatMap(contract => 
            this.genereraKontering(contract)
        );

        // Skapa kolumnrubriker
        const headers = this.kolumnOrdning.reduce((obj, col) => ({...obj, [col]: col}), {});

        // Formatera data enligt kolumnordningen
        const formateradData = alleRader.map(row => {
            const nyRad = {};
            this.kolumnOrdning.forEach(col => {
                if (col === 'valbelopp') {
                    nyRad[col] = row.belopp; // Valbelopp ska vara samma som belopp
                } else {
                    nyRad[col] = row[col] || ''; // Övriga kolumner
                }
            });
            return nyRad;
        });

        return [headers, ...formateradData];
    }
}

// Skapa och exportera en instans av konteringshanteraren
const konteringsHanterare = new KonteringsHanterare();

// ==================== Excel Export ====================

// Exportera till Excel med alla 17 dimensioner
window.exportToExcel = function() {
    if (currentState.contracts.length === 0) {
        alert('Inga kontrakt att exportera.');
        return;
    }

    try {
        // Hämta formaterad data från konteringshanteraren
        const exportData = konteringsHanterare.genereraExportData();

        // Skapa ett nytt arbetsblad
        const ws = XLSX.utils.json_to_sheet(exportData, {
            skipHeader: true // Vi har redan lagt till våra egna headers
        });

        // Skapa en ny arbetsbok och lägg till arbetsbladet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Konteringar");

        // Spara arbetsboken som en Excel-fil
        const filename = `stadavtal_konteringar_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(wb, filename);

        console.log('Excel-export slutförd:', filename);
    } catch (error) {
        console.error('Fel vid Excel-export:', error);
        alert('Ett fel uppstod vid export till Excel. Kontrollera console för detaljer.');
    }
};

// Exportera för användning i andra delar
export {
    konteringsHanterare
};

// ==================== DEL 4 SLUTAR: Konteringslogik och Excel-export ====================
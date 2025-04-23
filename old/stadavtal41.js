// ==================== DEL 1: Datastrukturer och Dropdown-hantering ====================

// Definiera strukturer för ansvar och verksamhetskoder baserat på analys av tidigare data
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

// Definiera verksamhetskoder
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
    "5750": "Integration"
};

// Klass för hantering av dropdown-listor
class DropdownHandler {
    constructor() {
        this.ansvarSelect = document.getElementById('ansvarskod');
        this.verksamhetSelect = document.getElementById('verksamhetskod');
        this.initDropdowns();
        this.attachEventListeners();
    }

    // Initiera dropdown-listor
    initDropdowns() {
        // Rensa och återställ dropdowns
        this.ansvarSelect.innerHTML = '<option value="">-- Välj ansvarskod --</option>';
        this.verksamhetSelect.innerHTML = '<option value="">-- Välj först ansvar --</option>';

        // Populera ansvarskoder sorterade efter kod
        Object.entries(ansvarKoder)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([kod, beskrivning]) => {
                const option = document.createElement('option');
                option.value = kod;
                option.textContent = `${kod} - ${beskrivning}`;
                this.ansvarSelect.appendChild(option);
            });
    }

    // Koppla event listeners
    attachEventListeners() {
        // Hantera val av ansvarskod
        this.ansvarSelect.addEventListener('change', () => {
            this.updateVerksamhetskoder();
            this.validateKombination();
        });

        // Hantera val av verksamhetskod
        this.verksamhetSelect.addEventListener('change', () => {
            this.validateKombination();
        });
    }

    // Uppdatera verksamhetskoder baserat på vald ansvarskod
    updateVerksamhetskoder() {
        const ansvar = this.ansvarSelect.value;
        this.verksamhetSelect.innerHTML = '<option value="">-- Välj verksamhetskod --</option>';

        if (!ansvar) return;

        // Hämta relevanta verksamhetskoder baserat på ansvarskod
        const relevantaKoder = this.getRelevantaVerksamhetskoder(ansvar);

        // Populera verksamhetskoder
        Object.entries(verksamhetKoder)
            .filter(([kod]) => relevantaKoder.includes(kod))
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([kod, beskrivning]) => {
                const option = document.createElement('option');
                option.value = kod;
                option.textContent = `${kod} - ${beskrivning}`;
                this.verksamhetSelect.appendChild(option);
            });
    }

    // Hämta relevanta verksamhetskoder baserat på ansvarskod
    getRelevantaVerksamhetskoder(ansvar) {
        const prefix = ansvar.substring(0, 2);
        // Definiera vilka verksamhetskoder som är relevanta för olika ansvarskoder
        const verksamhetsMapping = {
            // Omsorg (30-33)
            "30": ["5101", "5103", "5104", "5105", "5108", "5120", "5135", "5145"],
            "31": ["5101", "5103", "5104", "5105", "5108", "5120", "5135", "5145"],
            "32": ["5210", "5231", "5290", "5202"],
            "33": ["5300", "5320"],

            // Kultur (62)
            "62": ["3103", "3151", "3161", "3200", "3300"],

            // IFO (70)
            "70": ["5520", "5541", "5570", "5583", "5681", "5686", "5688", "5712", "5750"],

            // Teknisk (80)
            "80": ["2601", "2700", "3402", "3405", "3406", "3408"],

            // Utbildning (90-95)
            "90": ["4071", "4400", "4500", "4600", "4799"],
            "91": ["4071"],
            "92": ["4400"],
            "93": ["4600"],
            "94": ["4500"],
            "95": ["4799"]
        };

        return verksamhetsMapping[prefix] || Object.keys(verksamhetKoder);
    }

    // Validera kombination av ansvar och verksamhet
    validateKombination() {
        const ansvar = this.ansvarSelect.value;
        const verksamhet = this.verksamhetSelect.value;
        const varningDiv = document.getElementById('kombinationsVarning');

        if (!ansvar || !verksamhet) {
            varningDiv.style.display = 'none';
            return;
        }

        const relevantaKoder = this.getRelevantaVerksamhetskoder(ansvar);
        if (!relevantaKoder.includes(verksamhet)) {
            varningDiv.textContent = 'OBS! Ovanlig kombination av ansvar och verksamhet. Verifiera att detta är korrekt.';
            varningDiv.style.display = 'block';
            varningDiv.className = 'alert alert-warning';
        } else {
            varningDiv.style.display = 'none';
        }
    }
}

// Exportera för användning i andra delar
export const dropdownHandler = new DropdownHandler();

// ==================== DEL 2 BÖRJAR: Formulärhantering och Validering ====================

import { dropdownHandler } from './stadavtal41-part1.js';

class FormHandler {
    constructor() {
        this.form = document.getElementById('avtalsFormular');
        this.initializeForm();
        this.attachEventListeners();
    }

    initializeForm() {
        // Sätt standardvärden
        document.getElementById('kostnadskonto').value = '6132';
        
        // Initiera objektkodshantering
        document.getElementById('objektkodsTyp').addEventListener('change', (e) => {
            const objektkodContainer = document.getElementById('objektkodContainer');
            objektkodContainer.style.display = e.target.value === '2b' ? 'none' : 'block';
            
            const objektkodInput = document.getElementById('objektkod');
            objektkodInput.required = e.target.value !== '2b';
        });

        // Initiera beloppshantering
        ['8036', '8035', '8032'].forEach(aktivitet => {
            // Lägg till event listeners för årsbelopp
            document.getElementById(`arsbelopp${aktivitet}`).addEventListener('input', (e) => {
                const manadsbelopp = this.calculateMonthlyAmount(e.target.value);
                document.getElementById(`manadsbelopp${aktivitet}`).value = manadsbelopp;
                this.updateTotalAmount();
            });

            // Lägg till event listeners för månadsbelopp
            document.getElementById(`manadsbelopp${aktivitet}`).addEventListener('input', () => {
                this.updateTotalAmount();
            });
        });
    }

    attachEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.handleSubmit();
            }
        });
    }

    calculateMonthlyAmount(yearlyAmount) {
        return yearlyAmount ? Math.round(parseFloat(yearlyAmount) / 12) : 0;
    }

    updateTotalAmount() {
        const total = ['8036', '8035', '8032'].reduce((sum, aktivitet) => {
            const belopp = parseFloat(document.getElementById(`manadsbelopp${aktivitet}`).value) || 0;
            return sum + belopp;
        }, 0);

        document.getElementById('totalBelopp').textContent = 
            new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' })
                .format(total);
    }

    validateForm() {
        // Validera period
        const period = document.getElementById('period').value;
        if (!/^2025(0[1-9]|1[0-2])$/.test(period)) {
            this.showError('Period måste vara i format YYYYMM för år 2025 (exempel: 202501)');
            return false;
        }

        // Validera ansvar och verksamhet
        if (!dropdownHandler.ansvarSelect.value || !dropdownHandler.verksamhetSelect.value) {
            this.showError('Både ansvar och verksamhet måste väljas');
            return false;
        }

        // Validera objektkod
        const objektkodsTyp = document.getElementById('objektkodsTyp').value;
        const objektkod = document.getElementById('objektkod').value;
        if (objektkodsTyp !== '2b' && !objektkod) {
            this.showError('Objektkod måste anges för vald objektkodstyp');
            return false;
        }

        // Validera att minst ett belopp är angivet
        const hasAmount = ['8036', '8035', '8032'].some(aktivitet => {
            return parseFloat(document.getElementById(`manadsbelopp${aktivitet}`).value) > 0;
        });
        if (!hasAmount) {
            this.showError('Minst ett aktivitetsbelopp måste anges');
            return false;
        }

        return true;
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessages');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Dölj felmeddelandet efter 5 sekunder
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    handleSubmit() {
        const formData = this.getFormData();
        // Spara data och uppdatera gränssnittet
        this.saveAvtal(formData);
        this.resetForm();
        this.showSuccess('Avtalet har sparats');
    }

    getFormData() {
        return {
            id: Date.now(), // Unikt ID för avtalet
            namn: document.getElementById('avtalsnamn').value,
            period: document.getElementById('period').value,
            kostnadskonto: document.getElementById('kostnadskonto').value,
            ansvar: dropdownHandler.ansvarSelect.value,
            verksamhet: dropdownHandler.verksamhetSelect.value,
            objektkodsTyp: document.getElementById('objektkodsTyp').value,
            objektkod: document.getElementById('objektkod').value,
            motpart: document.getElementById('motpart').value,
            aktiviteter: {
                '8036': {
                    arsbelopp: document.getElementById('arsbelopp8036').value,
                    manadsbelopp: document.getElementById('manadsbelopp8036').value
                },
                '8035': {
                    arsbelopp: document.getElementById('arsbelopp8035').value,
                    manadsbelopp: document.getElementById('manadsbelopp8035').value
                },
                '8032': {
                    arsbelopp: document.getElementById('arsbelopp8032').value,
                    manadsbelopp: document.getElementById('manadsbelopp8032').value
                }
            }
        };
    }

    saveAvtal(formData) {
        // Hämta befintliga avtal från localStorage
        let avtal = JSON.parse(localStorage.getItem('stadavtal') || '[]');
        avtal.push(formData);
        localStorage.setItem('stadavtal', JSON.stringify(avtal));
        
        // Uppdatera avtalslistan i gränssnittet
        window.dispatchEvent(new CustomEvent('avtalUpdated'));
    }

    resetForm() {
        this.form.reset();
        document.getElementById('kostnadskonto').value = '6132';
        document.getElementById('objektkodContainer').style.display = 'none';
        document.getElementById('totalBelopp').textContent = '0 kr';
        dropdownHandler.updateVerksamhetskoder();
    }

    showSuccess(message) {
        const toast = new bootstrap.Toast(document.getElementById('meddelandeToast'));
        document.getElementById('toastMeddelande').textContent = message;
        toast.show();
    }
}

// Skapa och exportera en instans av FormHandler
export const formHandler = new FormHandler();

// ==================== DEL 2 SLUTAR: Formulärhantering och Validering ====================
// ==================== DEL 3 BÖRJAR: Avtalslistning och Excel-export ====================

import { dropdownHandler } from './stadavtal41-part1.js';
import { formHandler } from './stadavtal41-part2.js';

class AvtalsHandler {
    constructor() {
        this.avtalsListElement = document.getElementById('avtalsListBody');
        this.tomListaMeddelande = document.getElementById('tomListaMeddelande');
        this.initializeAvtalsList();
        this.attachEventListeners();
    }

    initializeAvtalsList() {
        this.updateAvtalsList();
    }

    attachEventListeners() {
        // Lyssna på uppdateringar av avtalslistan
        window.addEventListener('avtalUpdated', () => this.updateAvtalsList());

        // Hantera radering via modal
        document.getElementById('bekraftaRadering').addEventListener('click', () => {
            const avtalId = document.getElementById('raderaModal').dataset.avtalId;
            if (avtalId) {
                this.raderaAvtal(parseInt(avtalId));
                const modal = bootstrap.Modal.getInstance(document.getElementById('raderaModal'));
                modal.hide();
            }
        });
    }

    updateAvtalsList() {
        const avtal = this.getAvtal();
        this.avtalsListElement.innerHTML = '';
        
        if (avtal.length === 0) {
            this.tomListaMeddelande.style.display = 'block';
            return;
        }

        this.tomListaMeddelande.style.display = 'none';
        avtal.forEach(this.createAvtalRow.bind(this));
    }

    getAvtal() {
        return JSON.parse(localStorage.getItem('stadavtal') || '[]');
    }

    createAvtalRow(avtal) {
        const row = document.createElement('tr');
        row.dataset.avtalId = avtal.id;

        // Skapa celler för avtalsdata
        const cells = [
            { text: avtal.namn },
            { text: this.formateraPeriod(avtal.period) },
            { text: `${avtal.ansvar} - ${dropdownHandler.ansvarKoder[avtal.ansvar]}` },
            { text: `${avtal.verksamhet} - ${dropdownHandler.verksamhetKoder[avtal.verksamhet]}` },
            { text: this.formateraBelopp(this.calculateTotalAmount(avtal)) },
            { 
                html: `
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary" onclick="redigeraAvtal(${avtal.id})">
                            <i class="bi bi-pencil"></i> Redigera
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="visaRaderaModal(${avtal.id})">
                            <i class="bi bi-trash"></i> Radera
                        </button>
                    </div>
                `
            }
        ];

        cells.forEach(cell => {
            const td = document.createElement('td');
            if (cell.html) {
                td.innerHTML = cell.html;
            } else {
                td.textContent = cell.text;
            }
            row.appendChild(td);
        });

        this.avtalsListElement.appendChild(row);
    }

    formateraPeriod(period) {
        return `${period.substring(0, 4)}-${period.substring(4)}`;
    }

    formateraBelopp(belopp) {
        return new Intl.NumberFormat('sv-SE', { 
            style: 'currency', 
            currency: 'SEK' 
        }).format(belopp);
    }

    calculateTotalAmount(avtal) {
        return Object.values(avtal.aktiviteter).reduce((sum, aktivitet) => {
            return sum + (parseFloat(aktivitet.manadsbelopp) || 0);
        }, 0);
    }

    raderaAvtal(id) {
        let avtal = this.getAvtal();
        avtal = avtal.filter(a => a.id !== id);
        localStorage.setItem('stadavtal', JSON.stringify(avtal));
        this.updateAvtalsList();
    }

    redigeraAvtal(id) {
        const avtal = this.getAvtal().find(a => a.id === id);
        if (!avtal) return;

        // Fyll i formuläret med avtalets data
        document.getElementById('avtalsnamn').value = avtal.namn;
        document.getElementById('period').value = avtal.period;
        document.getElementById('kostnadskonto').value = avtal.kostnadskonto;
        dropdownHandler.ansvarSelect.value = avtal.ansvar;
        dropdownHandler.updateVerksamhetskoder();
        dropdownHandler.verksamhetSelect.value = avtal.verksamhet;
        
        document.getElementById('objektkodsTyp').value = avtal.objektkodsTyp;
        const objektkodContainer = document.getElementById('objektkodContainer');
        objektkodContainer.style.display = avtal.objektkodsTyp === '2b' ? 'none' : 'block';
        document.getElementById('objektkod').value = avtal.objektkod;
        
        document.getElementById('motpart').value = avtal.motpart;

        // Fyll i aktivitetsbelopp
        Object.entries(avtal.aktiviteter).forEach(([aktivitet, data]) => {
            document.getElementById(`arsbelopp${aktivitet}`).value = data.arsbelopp;
            document.getElementById(`manadsbelopp${aktivitet}`).value = data.manadsbelopp;
        });

        formHandler.updateTotalAmount();
        
        // Scrolla till formuläret
        document.getElementById('avtalsFormular').scrollIntoView({ behavior: 'smooth' });
    }
}

// Skapa och exportera en instans av AvtalsHandler
export const avtalsHandler = new AvtalsHandler();

// Excel-export funktionalitet
class ExcelExporter {
    constructor() {
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

    exportToExcel() {
        const avtal = avtalsHandler.getAvtal();
        if (avtal.length === 0) {
            alert('Inga avtal att exportera');
            return;
        }

        try {
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(
                this.prepareExcelData(avtal),
                { header: this.kolumnOrdning }
            );

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Konteringar');
            
            // Generera filnamn med datum
            const datum = new Date().toISOString().split('T')[0];
            const filnamn = `stadavtal_konteringar_${datum}.xlsx`;
            
            XLSX.writeFile(workbook, filnamn);
        } catch (error) {
            console.error('Fel vid Excel-export:', error);
            alert('Ett fel uppstod vid export till Excel');
        }
    }

    prepareExcelData(avtal) {
        let radnummer = 1;
        const rader = [];

        avtal.forEach(avtal => {
            // Lägg till kostnadsrad
            rader.push(this.createKonteringsrad({
                rad: radnummer++,
                konto: avtal.kostnadskonto,
                ansvar: avtal.ansvar,
                verksamhet: avtal.verksamhet,
                aktivitet: '7600',
                motpart: '180',
                objekt: this.getObjektkod(avtal, 'kostnad'),
                period: avtal.period,
                belopp: this.calculateTotalAmount(avtal),
                text: avtal.namn
            }));

            // Lägg till intäktsrader för varje aktivitet
            ['8036', '8035', '8032'].forEach(aktivitet => {
                const belopp = parseFloat(avtal.aktiviteter[aktivitet].manadsbelopp);
                if (belopp > 0) {
                    rader.push(this.createKonteringsrad({
                        rad: radnummer++,
                        konto: '3153',
                        ansvar: avtal.ansvar,
                        verksamhet: this.getVerksamhetForAktivitet(aktivitet),
                        aktivitet: aktivitet,
                        motpart: avtal.motpart,
                        objekt: this.getObjektkod(avtal, 'intakt'),
                        period: avtal.period,
                        belopp: -belopp,
                        text: `${avtal.namn}${this.getAktivitetsText(aktivitet)}`
                    }));
                }
            });
        });

        return rader;
    }

    createKonteringsrad(data) {
        return {
            rad: data.rad,
            konto: data.konto,
            ansvar: data.ansvar,
            projekt: '',
            anl: '',
            verksamhet: data.verksamhet,
            aktivitet: data.aktivitet,
            motpart: data.motpart,
            objekt: data.objekt,
            mk: '',
            ms: '',
            period: data.period,
            periodiseringsnyckel: '',
            valbelopp: data.belopp,
            valuta: '',
            belopp: data.belopp,
            text: data.text
        };
    }

    getVerksamhetForAktivitet(aktivitet) {
        const verksamhetsMapping = {
            '8036': '9349', // Fast intäkt
            '8035': '9347', // Fönsterputs
            '8032': '9349'  // Storstädning
        };
        return verksamhetsMapping[aktivitet] || '9349';
    }

    getAktivitetsText(aktivitet) {
        const textMapping = {
            '8036': ' - fast intäkt',
            '8035': ' - fönsterputs',
            '8032': ' - storstädning'
        };
        return textMapping[aktivitet] || '';
    }

    getObjektkod(avtal, typ) {
        switch (avtal.objektkodsTyp) {
            case '2a': return avtal.objektkod;
            case '2b': return '';
            case '2c': return typ === 'intakt' ? avtal.objektkod : '';
            case '2d': return typ === 'kostnad' ? avtal.objektkod : '';
            default: return '';
        }
    }

    calculateTotalAmount(avtal) {
        return Object.values(avtal.aktiviteter).reduce((sum, aktivitet) => {
            return sum + (parseFloat(aktivitet.manadsbelopp) || 0);
        }, 0);
    }
}

// Skapa och exportera en instans av ExcelExporter
export const excelExporter = new ExcelExporter();

// Globala funktioner för användning i HTML
window.redigeraAvtal = (id) => avtalsHandler.redigeraAvtal(id);
window.visaRaderaModal = (id) => {
    const modal = document.getElementById('raderaModal');
    modal.dataset.avtalId = id;
    new bootstrap.Modal(modal).show();
};
window.exportToExcel = () => excelExporter.exportToExcel();

// ==================== DEL 3 SLUTAR: Avtalslistning och Excel-export ====================
// ==================== DEL 4 BÖRJAR: Programinitiering och huvudprogram ====================

class StadavtalProgram {
    constructor() {
        // Skapa instanser av alla handlers när programmet startar
        this.dropdownHandler = new DropdownHandler();
        this.formHandler = new FormHandler();
        this.avtalsHandler = new AvtalsHandler();
        this.excelExporter = new ExcelExporter();

        this.initializeEventListeners();
        this.initializeComponents();
        this.checkBrowserSupport();
    }

    initializeEventListeners() {
        // Vänta på att DOM:en är helt laddad
        document.addEventListener('DOMContentLoaded', () => {
            console.log('Initierar Städavtalsprogram v41...');
            this.startupSequence();
            console.log('Städavtalsprogram v41 initierat.');
        });

        // Hantera webbläsarens back/forward knappar
        window.addEventListener('popstate', () => {
            this.handleNavigation();
        });

        // Lyssna på ändringar i localStorage från andra flikar
        window.addEventListener('storage', (e) => {
            if (e.key === 'stadavtal') {
                this.avtalsHandler.updateAvtalsList();
            }
        });
    }

    startupSequence() {
        // Initiera alla komponenter i rätt ordning
        this.initializeBootstrapComponents();
        this.initializeAutoCalculate();
        this.setupKeyboardShortcuts();
        this.avtalsHandler.updateAvtalsList();
    }

    initializeComponents() {
        // Bootstrap-komponenter
        this.initializeBootstrapTooltips();
        this.initializeBootstrapPopovers();
        
        // Formulärkomponenter
        this.initializeFormDefaults();
        
        // Aktivera keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    initializeBootstrapTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        tooltipTriggerList.map(tooltipTriggerEl => 
            new bootstrap.Tooltip(tooltipTriggerEl)
        );
    }

    initializeBootstrapPopovers() {
        const popoverTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="popover"]')
        );
        popoverTriggerList.map(popoverTriggerEl => 
            new bootstrap.Popover(popoverTriggerEl)
        );
    }

    initializeFormDefaults() {
        // Sätt standard kostnadskonto
        document.getElementById('kostnadskonto').value = '6132';
        
        // Initiera ansvar och verksamhetskoder
        this.dropdownHandler.initDropdowns();
        
        // Sätt standardvärden för aktiviteter
        ['8036', '8035', '8032'].forEach(aktivitet => {
            document.getElementById(`arsbelopp${aktivitet}`).value = '0';
            document.getElementById(`manadsbelopp${aktivitet}`).value = '0';
        });
    }

    initializeAutoCalculate() {
        ['8036', '8035', '8032'].forEach(aktivitet => {
            const arsInput = document.getElementById(`arsbelopp${aktivitet}`);
            const manadsInput = document.getElementById(`manadsbelopp${aktivitet}`);

            arsInput.addEventListener('input', () => {
                if (arsInput.value) {
                    const manadsbelopp = Math.round(parseFloat(arsInput.value) / 12);
                    manadsInput.value = manadsbelopp;
                    this.formHandler.updateTotalAmount();
                }
            });

            manadsInput.addEventListener('input', () => {
                this.formHandler.updateTotalAmount();
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + S för att spara formulär
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton) submitButton.click();
            }
            
            // Escape för att rensa formulär
            if (e.key === 'Escape') {
                const resetButton = document.querySelector('button[type="button"].secondary');
                if (resetButton) resetButton.click();
            }
        });
    }

    checkBrowserSupport() {
        const requiredFeatures = {
            'localStorage': () => !!window.localStorage,
            'ES6 Modules': () => 'noModule' in document.createElement('script'),
            'Fetch API': () => 'fetch' in window,
            'CSS Grid': () => CSS.supports('display', 'grid')
        };

        const missingFeatures = Object.entries(requiredFeatures)
            .filter(([, test]) => !test())
            .map(([feature]) => feature);

        if (missingFeatures.length > 0) {
            this.showBrowserWarning(missingFeatures);
        }
    }

    showBrowserWarning(missingFeatures) {
        console.warn('Varning: Följande funktioner stöds inte:', missingFeatures);
        
        const warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-warning alert-dismissible fade show';
        warningDiv.innerHTML = `
            <strong>Varning!</strong> 
            Din webbläsare saknar stöd för följande funktioner:
            <ul>
                ${missingFeatures.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <p>Vänligen uppdatera din webbläsare för bästa upplevelse.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.insertBefore(warningDiv, document.body.firstChild);
    }

    handleNavigation() {
        const hash = window.location.hash;
        switch(hash) {
            case '#nytt-avtal':
                this.formHandler.resetForm();
                document.getElementById('avtalsFormular')
                    .scrollIntoView({ behavior: 'smooth' });
                break;
            case '#lista-avtal':
                document.getElementById('avtalsList')
                    .scrollIntoView({ behavior: 'smooth' });
                break;
            // Lägg till fler navigation handlers vid behov
        }
    }
}

// Skapa en global instans av programmet
const stadavtalProgram = new StadavtalProgram();

// Gör nödvändiga funktioner tillgängliga globalt för användning i HTML
window.stadavtalProgram = stadavtalProgram;
window.redigeraAvtal = (id) => stadavtalProgram.avtalsHandler.redigeraAvtal(id);
window.visaRaderaModal = (id) => {
    const modal = document.getElementById('raderaModal');
    modal.dataset.avtalId = id;
    new bootstrap.Modal(modal).show();
};
window.exportToExcel = () => stadavtalProgram.excelExporter.exportToExcel();

// Lägg till version och byggdatum
console.log('Städavtalshantering Version 41');
console.log('Byggdatum: 2024-12-26');

// ==================== DEL 4 SLUTAR: Programinitiering och huvudprogram ====================
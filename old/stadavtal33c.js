/**
 * stadavtal33c.js
 * Exportmodul för städavtalshantering
 */

class StadavtalExporter {
    constructor() {
        // Konstanter för Excel-export
        this.COLUMNS = {
            headers: [
                'Rad', 'Konto', 'Ansvar', 'Projekt', 'Anl',
                'Verksamhet', 'Aktivitet', 'Motpart', 'Objekt',
                'MK', 'MS', 'Period', 'Periodiseringsnyckel',
                'Val.belopp', 'Valuta', 'Belopp', 'Text'
            ],
            // Kolumner som alltid ska vara tomma
            emptyColumns: [
                'Projekt', 'Anl', 'MK', 'MS', 
                'Periodiseringsnyckel', 'Valuta'
            ]
        };

        // Standardvärden
        this.DEFAULT_VALUES = {
            konto: {
                kostnad: '6132',
                intakt: '3153'
            },
            aktivitet: {
                kostnad: '7600',
                intakter: {
                    fast: '8036',
                    fonsterputs: '8035',
                    storstadning: '8032'
                }
            }
        };

        // Initiera lyssnare för formulärdata
        this.initieraEventListeners();
        
        // Radräknare för Excel
        this.radNummer = 1;
    }

    /**
     * Initierar eventlyssnare
     */
    initieraEventListeners() {
        document.addEventListener('stadavtalFormComplete', (event) => {
            this.skapaExcelFil(event.detail);
        });
    }

    /**
     * Skapar Excel-fil från formulärdata
     * @param {Object} formData - Data från formuläret
     */
    skapaExcelFil(formData) {
        try {
            // Återställ radräknare
            this.radNummer = 1;

            // Skapa rader för Excel
            const rader = this.skapaRader(formData);

            // Skapa arbetsbok och lägg till data
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(rader, {
                header: this.COLUMNS.headers
            });

            // Lägg till bladet i arbetsboken
            XLSX.utils.book_append_sheet(workbook, worksheet, "Konteringar");

            // Generera filnamn och spara
            const filnamn = this.skapaFilnamn(formData);
            XLSX.writeFile(workbook, filnamn);

            // Visa bekräftelse till användaren
            this.visaBekraftelse('Excel-fil har skapats framgångsrikt!');

        } catch (error) {
            console.error('Fel vid Excel-export:', error);
            this.visaFelmeddelande('Kunde inte skapa Excel-fil: ' + error.message);
        }
    }

    /**
     * Skapar alla rader för Excel
     * @param {Object} formData - Formulärdata
     * @returns {Array} Array med rader för Excel
     */
    skapaRader(formData) {
        const rader = [];

        // Lägg till kostnadsrad först
        rader.push(this.skapaKostnadsrad(formData));

        // Lägg till intäktsrader för varje aktivitet
        if (formData.activities) {
            Object.entries(formData.activities).forEach(([aktivitet, data]) => {
                if (data.amounts && data.amounts.length > 0) {
                    data.amounts.forEach(belopp => {
                        rader.push(this.skapaIntaktsrad(formData, aktivitet, belopp, data.ansvar));
                    });
                }
            });
        }

        return rader;
    }

    /**
     * Skapar kostnadsrad
     * @param {Object} formData - Formulärdata
     * @returns {Object} Kostnadsrad för Excel
     */
    skapaKostnadsrad(formData) {
        return {
            Rad: this.radNummer++,
            Konto: this.DEFAULT_VALUES.konto.kostnad,
            Ansvar: formData.costAnsvar,
            Projekt: '',
            Anl: '',
            Verksamhet: formData.costVerksamhet,
            Aktivitet: this.DEFAULT_VALUES.aktivitet.kostnad,
            Motpart: formData.motpart || '180',
            Objekt: this.hamtaObjektkod(formData, 'kostnad'),
            MK: '',
            MS: '',
            Period: formData.period,
            Periodiseringsnyckel: '',
            'Val.belopp': this.formateraBelopp(formData.totalAmount),
            Valuta: '',
            Belopp: this.formateraBelopp(formData.totalAmount),
            Text: formData.name
        };
    }

    /**
     * Skapar intäktsrad
     * @param {Object} formData - Formulärdata
     * @param {string} aktivitet - Aktivitetskod
     * @param {number} belopp - Belopp för raden
     * @param {string} ansvar - Ansvarskod
     * @returns {Object} Intäktsrad för Excel
     */
    skapaIntaktsrad(formData, aktivitet, belopp, ansvar) {
        return {
            Rad: this.radNummer++,
            Konto: this.DEFAULT_VALUES.konto.intakt,
            Ansvar: ansvar,
            Projekt: '',
            Anl: '',
            Verksamhet: this.hamtaVerksamhetForAktivitet(aktivitet),
            Aktivitet: aktivitet,
            Motpart: formData.motpart,
            Objekt: this.hamtaObjektkod(formData, 'intakt'),
            MK: '',
            MS: '',
            Period: formData.period,
            Periodiseringsnyckel: '',
            'Val.belopp': this.formateraBelopp(-belopp),
            Valuta: '',
            Belopp: this.formateraBelopp(-belopp),
            Text: this.skapaAktivitetsText(formData.name, aktivitet)
        };
    }

    /**
     * Hämtar verksamhetskod för aktivitet
     * @param {string} aktivitet - Aktivitetskod
     * @returns {string} Verksamhetskod
     */
    hamtaVerksamhetForAktivitet(aktivitet) {
        const mapping = {
            '8036': '9349', // Fast kostnad/intäkt
            '8035': '9347', // Fönsterputs
            '8032': '9349'  // Storstädning
        };
        return mapping[aktivitet] || '';
    }

    /**
     * Hämtar objektkod baserat på typ
     * @param {Object} formData - Formulärdata
     * @param {string} typ - Typ av rad (kostnad/intakt)
     * @returns {string} Objektkod
     */
    hamtaObjektkod(formData, typ) {
        if (!formData.objectCodeType || formData.objectCodeType === '2b') {
            return '';
        }

        switch (formData.objectCodeType) {
            case '2a': // Samma objektkod för både kostnader och intäkter
                return formData.objectCode || '';
            case '2c': // Objektkod endast på intäkter
                return typ === 'intakt' ? formData.objectCode || '' : '';
            case '2d': // Objektkod endast på kostnader
                return typ === 'kostnad' ? formData.objectCode || '' : '';
            default:
                return '';
        }
    }

    /**
     * Skapar text för aktivitetsrad
     * @param {string} basText - Grundtext
     * @param {string} aktivitet - Aktivitetskod
     * @returns {string} Genererad text
     */
    skapaAktivitetsText(basText, aktivitet) {
        const aktivitetsTexter = {
            '8036': ' - fast intäkt',
            '8035': ' - fönsterputs',
            '8032': ' - storstädning'
        };
        return basText + (aktivitetsTexter[aktivitet] || '');
    }

    /**
     * Skapar filnamn för Excel-filen
     * @param {Object} formData - Formulärdata
     * @returns {string} Filnamn
     */
    skapaFilnamn(formData) {
        const saneraNamn = (namn) => {
            return namn
                .toLowerCase()
                .replace(/[åä]/g, 'a')
                .replace(/[ö]/g, 'o')
                .replace(/[^a-z0-9]/g, '_')
                .replace(/_+/g, '_')
                .replace(/^_|_$/g, '');
        };

        return `stadavtal_${formData.period}_${saneraNamn(formData.name)}.xlsx`;
    }

    /**
     * Formaterar belopp enligt svensk standard
     * @param {number} belopp - Belopp att formatera
     * @returns {string} Formaterat belopp
     */
    formateraBelopp(belopp) {
        return belopp.toLocaleString('sv-SE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    /**
     * Visar bekräftelsemeddelande
     * @param {string} meddelande - Meddelande att visa
     */
    visaBekraftelse(meddelande) {
        const popupDiv = document.createElement('div');
        popupDiv.className = 'popup success';
        popupDiv.innerHTML = `
            <div class="popup-content">
                <span class="popup-message">${meddelande}</span>
                <button class="popup-close">&times;</button>
            </div>
        `;
        document.body.appendChild(popupDiv);
        
        // Ta bort popup efter 3 sekunder
        setTimeout(() => {
            popupDiv.remove();
        }, 3000);
    }

    /**
     * Visar felmeddelande
     * @param {string} meddelande - Felmeddelande att visa
     */
    visaFelmeddelande(meddelande) {
        const popupDiv = document.createElement('div');
        popupDiv.className = 'popup error';
        popupDiv.innerHTML = `
            <div class="popup-content">
                <span class="popup-message">${meddelande}</span>
                <button class="popup-close">&times;</button>
            </div>
        `;
        document.body.appendChild(popupDiv);

        // Lägg till click-händelse för stängknappen
        popupDiv.querySelector('.popup-close').addEventListener('click', () => {
            popupDiv.remove();
        });
    }

    /**
     * Validerar belopp innan export
     * @param {Object} formData - Formulärdata att validera
     * @returns {boolean} Är beloppen giltiga?
     */
    valideraBelopp(formData) {
        let totalIntakter = 0;
        
        // Summera alla intäkter
        Object.values(formData.activities).forEach(activity => {
            if (activity.amounts) {
                activity.amounts.forEach(belopp => {
                    totalIntakter += belopp;
                });
            }
        });

        // Jämför med totalt kostnadsbelopp
        const diff = Math.abs(formData.totalAmount - totalIntakter);
        
        // Tillåt en liten avrundningsskillnad
        return diff < 0.01;
    }
}

// Skapa en instans av exportören när skriptet laddas
const exporter = new StadavtalExporter();

// Exportera för användning i andra moduler
export default StadavtalExporter;

// ==================== SLUT PÅ stadavtal33c.js ====================
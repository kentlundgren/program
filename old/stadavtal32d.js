class ExcelExporter {
    // Konstanter för Excel-kolumner
    static COLUMNS = {
        headers: [
            'rad', 'konto', 'ansvar', 'projekt', 'anl', 
            'verksamhet', 'aktivitet', 'motpart', 'objekt',
            'mk', 'ms', 'period', 'periodiseringsnyckel',
            'valbelopp', 'valuta', 'belopp', 'text'
        ],
        emptyColumns: ['projekt', 'anl', 'mk', 'ms', 'periodiseringsnyckel', 'valuta']
    };

    constructor() {
        this.rowCounter = 1;
    }

    // Skapa Excel-fil från formulärdata
    createExcelFile(formData) {
        this.rowCounter = 1; // Återställ radräknare
        const rows = this.generateRows(formData);
        
        // Skapa arbetsbok och blad
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows, { 
            header: ExcelExporter.COLUMNS.headers
        });

        // Lägg till bladet i arbetsboken
        XLSX.utils.book_append_sheet(wb, ws, "Konteringar");

        // Spara filen
        const fileName = `stadavtal_${formData.period}_${this.sanitizeFileName(formData.name)}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    // Generera rader för Excel
    generateRows(formData) {
        const rows = [];

        // Lägg till kostnadsrad
        rows.push(this.createCostRow(formData));

        // Lägg till intäktsrader för varje aktivitet
        Object.entries(formData.activities).forEach(([activity, data]) => {
            if (data.amounts && data.amounts.length > 0) {
                data.amounts.forEach(amount => {
                    rows.push(this.createIncomeRow(formData, activity, amount, data.ansvar));
                });
            }
        });

        return rows;
    }

    // Skapa kostnadsrad
    createCostRow(formData) {
        return {
            rad: this.rowCounter++,
            konto: formData.konto,
            ansvar: formData.costAnsvar,
            projekt: '',
            anl: '',
            verksamhet: formData.costVerksamhet,
            aktivitet: '7600',
            motpart: '180',
            objekt: this.getObjectCode(formData, 'cost'),
            mk: '',
            ms: '',
            period: formData.period,
            periodiseringsnyckel: '',
            valbelopp: this.amountToString(this.calculateTotalCost(formData)),
            valuta: '',
            belopp: this.amountToString(this.calculateTotalCost(formData)),
            text: formData.name
        };
    }

    // Skapa intäktsrad
    createIncomeRow(formData, activity, amount, ansvar) {
        return {
            rad: this.rowCounter++,
            konto: '3153',
            ansvar: ansvar,
            projekt: '',
            anl: '',
            verksamhet: this.getVerksamhetForActivity(activity),
            aktivitet: activity,
            motpart: formData.motpart,
            objekt: this.getObjectCode(formData, 'income'),
            mk: '',
            ms: '',
            period: formData.period,
            periodiseringsnyckel: '',
            valbelopp: this.amountToString(amount),
            valuta: '',
            belopp: this.amountToString(amount),
            text: this.generateActivityText(formData.name, activity)
        };
    }

    // Hämta objektkod baserat på typ
    getObjectCode(formData, type) {
        switch (formData.objectCodeType) {
            case '2a': // Samma objektkod för både kostnader och intäkter
                return formData.objectCode;
            case '2c': // Objektkod endast på intäkter
                return type === 'income' ? formData.objectCode : '';
            case '2d': // Objektkod endast på kostnader
                return type === 'cost' ? formData.objectCode : '';
            default:
                return '';
        }
    }

    // Beräkna total kostnad
    calculateTotalCost(formData) {
        let total = 0;
        Object.values(formData.activities).forEach(data => {
            data.amounts.forEach(amount => {
                total += Math.abs(amount);
            });
        });
        return total;
    }

    // Formatera belopp som sträng
    amountToString(amount) {
        return amount.toLocaleString('sv-SE', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    // Generera text för aktivitet
    generateActivityText(baseName, activity) {
        const activityTexts = {
            '8036': ' - fast intäkt',
            '8035': ' - fönsterputs',
            '8032': ' - storstädning'
        };
        return baseName + (activityTexts[activity] || '');
    }

    // Hämta verksamhetskod för aktivitet
    getVerksamhetForActivity(activity) {
        const verksamhetMap = {
            '8036': '9349', // Fast kostnad/intäkt
            '8035': '9347', // Fönsterputs
            '8032': '9349'  // Storstädning
        };
        return verksamhetMap[activity] || '';
    }

    // Sanera filnamn
    sanitizeFileName(name) {
        return name.replace(/[^a-z0-9åäö]/gi, '_').toLowerCase();
    }
}

// ==================== Popup-hantering ====================

class PopupHandler {
    static show(type, message, duration = 5000) {
        const popup = document.createElement('div');
        popup.className = `popup popup-${type}`;
        popup.innerHTML = `
            <div class="popup-content">
                <span class="popup-message">${message}</span>
                <button class="popup-close">&times;</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Hantera stängning
        const closeButton = popup.querySelector('.popup-close');
        closeButton.addEventListener('click', () => popup.remove());

        // Automatisk stängning efter angiven tid
        setTimeout(() => popup.remove(), duration);
    }

    static showError(message) {
        this.show('error', message);
    }

    static showWarning(message) {
        this.show('warning', message);
    }

    static showSuccess(message) {
        this.show('success', message);
    }

    static showInfo(message) {
        this.show('info', message);
    }
}

// ==================== Programinitialisering ====================

class ProgramInitializer {
    constructor() {
        this.formHandler = null;
        this.excelExporter = null;
        this.analyzer = null;
    }

    // Initialisera programmet
    async initialize() {
        try {
            // Läs in historisk data
            const historicalData = await this.loadHistoricalData();
            
            // Skapa nödvändiga instanser
            this.analyzer = new HistoricalDataAnalyzer(historicalData);
            const amountHandler = new AmountHandler();
            const smartSearch = new SmartSearch(this.analyzer);
            
            // Skapa hanterare
            this.formHandler = new FormHandler(this.analyzer, amountHandler, smartSearch);
            this.excelExporter = new ExcelExporter();

            // Initiera UI-komponenter
            this.initializeUI();

            PopupHandler.showSuccess('Programmet har initierats framgångsrikt');
        } catch (error) {
            PopupHandler.showError('Ett fel uppstod vid initialisering av programmet: ' + error.message);
            console.error('Initialiseringsfel:', error);
        }
    }

    // Läs in historisk data
    async loadHistoricalData() {
        try {
            const response = await window.fs.readFile('paste.txt', { encoding: 'utf8' });
            return response;
        } catch (error) {
            throw new Error('Kunde inte läsa in historisk data: ' + error.message);
        }
    }

    // Initiera UI-komponenter
    initializeUI() {
        // Sätt upp reset-knapp
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.handleReset());
        }

        // Initiera hjälptexter
        this.initializeTooltips();
    }

    // Hantera återställning
    handleReset() {
        if (confirm('Är du säker på att du vill återställa formuläret?')) {
            document.getElementById('contractForm').reset();
            PopupHandler.showInfo('Formuläret har återställts');
        }
    }

    // Initiera hjälptexter
    initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseover', e => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = element.dataset.tooltip;
                document.body.appendChild(tooltip);

                // Positionera tooltip
                const rect = element.getBoundingClientRect();
                tooltip.style.top = rect.bottom + 5 + 'px';
                tooltip.style.left = rect.left + 'px';

                element.addEventListener('mouseout', () => tooltip.remove());
            });
        });
    }
}

// Starta programmet när sidan laddats
document.addEventListener('DOMContentLoaded', () => {
    const initializer = new ProgramInitializer();
    initializer.initialize()
        .catch(error => {
            console.error('Fel vid programstart:', error);
            PopupHandler.showError('Kunde inte starta programmet. Se konsolen för detaljer.');
        });
});


/**
 * stadavtal33b.js
 * Formulärhantering för städavtalshantering
 */

import StadavtalAnalyzer from './stadavtal33a.js';

class StadavtalFormHandler {
    constructor() {
        // Grundläggande initiering
        this.analyzer = new StadavtalAnalyzer();
        this.initieraElementReferenser();
        this.initieraEventListeners();
        
        // Status och valideringsdata
        this.formStatus = {
            isValid: false,
            currentSuggestions: null,
            isDirty: false
        };

        // Beloppshantering
        this.belopp = {
            total: 0,
            fordelning: {
                '8036': 0.85,  // Fast intäkt
                '8035': 0.05,  // Fönsterputs
                '8032': 0.10   // Storstädning
            }
        };
    }

    /**
     * Initierar referenser till DOM-element
     */
    initieraElementReferenser() {
        // Huvudformulär
        this.form = document.getElementById('contractForm');
        
        // Grundinformation
        this.elements = {
            contractName: document.getElementById('contractName'),
            period: document.getElementById('period'),
            
            // Konteringsfält
            costAnsvar: document.getElementById('costAnsvar'),
            costVerksamhet: document.getElementById('costVerksamhet'),
            konto: document.getElementById('konto'),
            motpart: document.getElementById('motpart'),
            
            // Objektkodshantering
            objectCodeType: document.getElementById('objectCodeType'),
            objectCodeSection: document.getElementById('objectCodeSection'),
            objectCode: document.getElementById('objectCode'),
            
            // Beloppshantering
            totalAmount: document.getElementById('totalAmount'),
            
            // Aktivitetssektioner
            activity8036: {
                section: document.getElementById('activity8036'),
                yearly: document.getElementById('yearly8036'),
                monthly: document.getElementById('amount8036'),
                split: document.getElementById('split8036'),
                container: document.getElementById('split8036Container'),
                ansvar: document.getElementById('ansvar8036')
            },
            activity8035: {
                section: document.getElementById('activity8035'),
                yearly: document.getElementById('yearly8035'),
                monthly: document.getElementById('amount8035'),
                split: document.getElementById('split8035'),
                container: document.getElementById('split8035Container'),
                ansvar: document.getElementById('ansvar8035')
            },
            activity8032: {
                section: document.getElementById('activity8032'),
                yearly: document.getElementById('yearly8032'),
                monthly: document.getElementById('amount8032'),
                split: document.getElementById('split8032'),
                container: document.getElementById('split8032Container'),
                ansvar: document.getElementById('ansvar8032')
            }
        };
    }

    /**
     * Initierar alla event listeners
     */
    initieraEventListeners() {
        // Formulärsubmit
        this.form.addEventListener('submit', (e) => this.hanteraFormSubmit(e));
        
        // Konteringslyssnare
        this.elements.costAnsvar.addEventListener('change', () => this.valideraKontering());
        this.elements.costVerksamhet.addEventListener('change', () => this.valideraKontering());
        
        // Avtalsnamn input
        this.elements.contractName.addEventListener('input', (e) => this.hanteraAvtalsNamnInput(e));
        
        // Period validering
        this.elements.period.addEventListener('input', () => this.valideraPeriod());
        
        // Objektkodslyssnare
        this.elements.objectCodeType.addEventListener('change', () => this.hanteraObjektkodTyp());
        
        // Beloppslyssnare
        this.elements.totalAmount.addEventListener('input', () => this.beraknaMånadsbelopp());
        
        // Aktivitetslyssnare
        Object.values(this.elements).forEach(activity => {
            if (activity.split) {
                activity.split.addEventListener('change', () => this.hanteraBeloppsuppdelning(activity));
            }
        });
    }

    /**
     * Initierar formuläret med historisk data
     * @param {string} historicalData - CSV-data med historiska städavtal
     */
    async initiera(historicalData) {
        try {
            // Initiera analysmotorn
            await this.analyzer.initiera(historicalData);
            
            // Populera dropdown-listor
            this.populeraDropdowns();
            
            // Sätt standardvärden
            this.sattStandardvarden();
            
            console.log('Formulärhantering initierad framgångsrikt');
            return true;
        } catch (error) {
            console.error('Fel vid initiering av formulärhantering:', error);
            throw error;
        }
    }

    /**
     * Populerar alla dropdown-listor med data
     */
    populeraDropdowns() {
        // Populera ansvarsdropdown
        const ansvarskoder = this.analyzer.hamtaAnsvarskoder();
        this.populeraSelect(this.elements.costAnsvar, ansvarskoder, 'Välj ansvar', 
            (kod) => `${kod.kod} - ${kod.beskrivning} (${kod.frekvens} förekomster)`);

        // Populera verksamhetsdropdown
        const verksamhetskoder = this.analyzer.hamtaVerksamhetskoder();
        this.populeraSelect(this.elements.costVerksamhet, verksamhetskoder, 'Välj verksamhet', 
            (kod) => `${kod.kod} - ${kod.beskrivning} (${kod.frekvens} förekomster)`);

        // Populera ansvarsdropdowns för aktiviteter
        ['8036', '8035', '8032'].forEach(aktivitet => {
            const selectElement = this.elements[`activity${aktivitet}`].ansvar;
            this.populeraSelect(selectElement, ansvarskoder, 'Välj ansvar', 
                (kod) => `${kod.kod} - ${kod.beskrivning}`);
        });
    }

    /**
     * Populerar en select-element med alternativ
     * @param {HTMLSelectElement} select - Select-element att populera
     * @param {Array} data - Data att populera med
     * @param {string} defaultText - Text för default option
     * @param {Function} formatFunc - Funktion för att formatera optiontext
     */
    populeraSelect(select, data, defaultText, formatFunc) {
        select.innerHTML = `<option value="">${defaultText}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.kod;
            option.textContent = formatFunc(item);
            select.appendChild(option);
        });
    }

    /**
     * Validerar konteringskombination
     */
    valideraKontering() {
        const ansvar = this.elements.costAnsvar.value;
        const verksamhet = this.elements.costVerksamhet.value;

        if (!ansvar || !verksamhet) return;

        const validering = this.analyzer.valideraKombination(ansvar, verksamhet);
        
        // Återställ tidigare styling
        this.elements.costAnsvar.classList.remove('valid', 'warning', 'invalid');
        this.elements.costVerksamhet.classList.remove('valid', 'warning', 'invalid');

        if (!validering.giltig) {
            this.visaKonteringsVarning(validering);
            this.elements.costAnsvar.classList.add('invalid');
            this.elements.costVerksamhet.classList.add('invalid');
        } else if (validering.varning) {
            this.visaKonteringsVarning(validering);
            this.elements.costAnsvar.classList.add('warning');
            this.elements.costVerksamhet.classList.add('warning');
        } else {
            this.elements.costAnsvar.classList.add('valid');
            this.elements.costVerksamhet.classList.add('valid');
            this.doljKonteringsVarning();
        }
    }

    /**
     * Visar varning för konteringskombination
     * @param {Object} validering - Valideringsresultat
     */
    visaKonteringsVarning(validering) {
        let warningDiv = document.querySelector('.kontering-warning');
        if (!warningDiv) {
            warningDiv = document.createElement('div');
            warningDiv.className = 'kontering-warning';
            this.elements.costVerksamhet.parentNode.appendChild(warningDiv);
        }

        if (!validering.giltig) {
            warningDiv.innerHTML = `
                <p>Varning: ${validering.meddelande}</p>
                ${validering.forslag.verksamhet ? 
                    `<p>Förslag på verksamhet: ${validering.forslag.verksamhet}</p>` : ''}
                ${validering.forslag.ansvar ? 
                    `<p>Förslag på ansvar: ${validering.forslag.ansvar}</p>` : ''}
            `;
        } else if (validering.varning) {
            warningDiv.innerHTML = `
                <p>OBS: ${validering.varning}</p>
                <p>Denna kombination förekommer i ${validering.andelProcent}% av fallen.</p>
            `;
        }
    }

    /**
     * Döljer konteringsvarning
     */
    doljKonteringsVarning() {
        const warning = document.querySelector('.kontering-warning');
        if (warning) {
            warning.remove();
        }
    }

    /**
     * Validerar period
     * @returns {boolean} Är perioden giltig?
     */
    valideraPeriod() {
        const period = this.elements.period.value;
        const isValid = /^2025(0[1-9]|1[0-2])$/.test(period);
        
        this.elements.period.classList.toggle('invalid', !isValid);
        
        if (!isValid) {
            this.visaFelmeddelande(this.elements.period, 
                'Period måste vara för år 2025 (format: YYYYMM)');
        } else {
            this.doljFelmeddelande(this.elements.period);
        }

        return isValid;
    }

    /**
     * Visar felmeddelande för ett element
     * @param {HTMLElement} element - Element att visa fel för
     * @param {string} message - Felmeddelande
     */
    visaFelmeddelande(element, message) {
        let errorDiv = element.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            element.parentNode.insertBefore(errorDiv, element.nextSibling);
        }
        errorDiv.textContent = message;
    }

    /**
     * Döljer felmeddelande för ett element
     * @param {HTMLElement} element - Element att dölja fel för
     */
    doljFelmeddelande(element) {
        const errorDiv = element.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
    }

    /**
     * Hanterar ändringar i objektkodstyp
     */
    hanteraObjektkodTyp() {
        const selectedType = this.elements.objectCodeType.value;
        this.elements.objectCodeSection.style.display = 
            selectedType === '2b' ? 'none' : 'block';
    }

    /**
     * Beräknar månadsbelopp baserat på totalbelopp
     */
    beraknaMånadsbelopp() {
        const totalBelopp = parseFloat(this.elements.totalAmount.value) || 0;
        
        // Beräkna belopp för varje aktivitet
        Object.entries(this.belopp.fordelning).forEach(([aktivitet, andel]) => {
            const activity = this.elements[`activity${aktivitet}`];
            const arsbelopp = totalBelopp * andel;
            const månadsbelopp = Math.round(arsbelopp / 12);
            
            activity.yearly.value = Math.round(arsbelopp);
            activity.monthly.value = månadsbelopp;
        });
    }

    /**
     * Hanterar beloppsuppdelning för en aktivitet
     * @param {Object} activity - Aktivitetsobjekt
     */
    hanteraBeloppsuppdelning(activity) {
        const container = activity.container;
        const isChecked = activity.split.checked;
        
        if (isChecked) {
            const månadsbelopp = parseFloat(activity.monthly.value) || 0;
            container.innerHTML = `
                <div class="split-amount">
                    <input type="number" value="${månadsbelopp}" class="amount-input" />
                    <button type="button" class="remove-split">&times;</button>
                </div>
            `;
        } else {
            container.innerHTML = '';
        }
    }

    /**
     * Sätter standardvärden i formuläret
     */
    sattStandardvarden() {
        this.elements.konto.value = '6132';
        this.elements.period.value = '202501';
    }

    /**
     * Hanterar input i avtalsnamn
     * @param {Event} event - Input event
     */
    hanteraAvtalsNamnInput(event) {
        const text = event.target.value.trim();
        if (text.length < 3) return;

        const suggestions = this.analyzer.generateSuggestions(text);
        if (suggestions && suggestions.confidence > 0.5) {
            this.visaKonteringsforslag(suggestions);
        }
    }


        /**
     * Visar konteringsförslag
     * @param {Object} suggestions - Konteringsförslag
     */
    visaKonteringsforslag(suggestions) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestion-box';
        suggestionDiv.innerHTML = `
            <h4>Förslag på kontering:</h4>
            ${suggestions.ansvar ? 
                `<p>Ansvar: ${suggestions.ansvar}</p>` : ''}
            ${suggestions.verksamhet ? 
                `<p>Verksamhet: ${suggestions.verksamhet}</p>` : ''}
            <button type="button" class="apply-suggestion">
                Använd förslag
            </button>
        `;

        // Rensa tidigare förslag
        const existingBox = document.querySelector('.suggestion-box');
        if (existingBox) {
            existingBox.remove();
        }

        this.elements.contractName.parentNode.appendChild(suggestionDiv);
        
        // Lägg till click-händelse för knappen
        suggestionDiv.querySelector('.apply-suggestion').addEventListener('click', () => {
            this.tillampaKonteringsforslag(suggestions);
        });
    }

    /**
     * Tillämpar valda konteringsförslag
     * @param {Object} suggestions - Konteringsförslag att tillämpa
     */
    tillampaKonteringsforslag(suggestions) {
        if (suggestions.ansvar) {
            this.elements.costAnsvar.value = suggestions.ansvar;
        }
        if (suggestions.verksamhet) {
            this.elements.costVerksamhet.value = suggestions.verksamhet;
        }
        this.valideraKontering();
        
        // Ta bort förslagsrutan
        const suggestionBox = document.querySelector('.suggestion-box');
        if (suggestionBox) {
            suggestionBox.remove();
        }
    }

    /**
     * Hanterar formulärsubmit
     * @param {Event} event - Submit event
     */
    hanteraFormSubmit(event) {
        event.preventDefault();
        
        if (!this.valideraFormular()) {
            return;
        }

        const formData = this.samlaFormularData();
        
        // Emittera event för att meddela att data är redo för export
        const customEvent = new CustomEvent('stadavtalFormComplete', {
            detail: formData
        });
        document.dispatchEvent(customEvent);
    }

    /**
     * Validerar hela formuläret
     * @returns {boolean} Är formuläret giltigt?
     */
    valideraFormular() {
        let isValid = true;

        // Validera period
        if (!this.valideraPeriod()) {
            isValid = false;
        }

        // Validera kontering
        const ansvar = this.elements.costAnsvar.value;
        const verksamhet = this.elements.costVerksamhet.value;
        if (!ansvar || !verksamhet) {
            this.visaFelmeddelande(this.elements.costAnsvar, 'Välj ansvar och verksamhet');
            isValid = false;
        } else {
            const validering = this.analyzer.valideraKombination(ansvar, verksamhet);
            if (!validering.giltig) {
                isValid = false;
            }
        }

        // Validera belopp
        if (!this.elements.totalAmount.value || 
            isNaN(this.elements.totalAmount.value)) {
            this.visaFelmeddelande(this.elements.totalAmount, 'Ange ett giltigt belopp');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Samlar in all formulärdata
     * @returns {Object} Formulärdata
     */
    samlaFormularData() {
        const data = {
            name: this.elements.contractName.value,
            period: this.elements.period.value,
            costAnsvar: this.elements.costAnsvar.value,
            costVerksamhet: this.elements.costVerksamhet.value,
            motpart: this.elements.motpart.value,
            objectCodeType: this.elements.objectCodeType.value,
            objectCode: this.elements.objectCode.value,
            totalAmount: parseFloat(this.elements.totalAmount.value),
            activities: {}
        };

        // Samla aktivitetsdata
        ['8036', '8035', '8032'].forEach(aktivitet => {
            const activity = this.elements[`activity${aktivitet}`];
            data.activities[aktivitet] = {
                yearly: parseFloat(activity.yearly.value) || 0,
                monthly: parseFloat(activity.monthly.value) || 0,
                ansvar: activity.ansvar.value,
                split: activity.split.checked,
                amounts: this.hamtaUppdeladeBelopp(activity)
            };
        });

        return data;
    }

    /**
     * Hämtar uppdelade belopp för en aktivitet
     * @param {Object} activity - Aktivitetsobjekt
     * @returns {Array} Array med belopp
     */
    hamtaUppdeladeBelopp(activity) {
        if (!activity.split.checked) {
            return [parseFloat(activity.monthly.value) || 0];
        }

        const amounts = [];
        activity.container.querySelectorAll('input[type="number"]').forEach(input => {
            amounts.push(parseFloat(input.value) || 0);
        });
        return amounts;
    }

    /**
     * Återställer formuläret
     */
    aterstallFormular() {
        this.form.reset();
        this.sattStandardvarden();
        this.doljKonteringsVarning();
        
        // Återställ alla felmeddelanden
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Återställ alla uppdelade belopp
        Object.values(this.elements).forEach(activity => {
            if (activity.container) {
                activity.container.innerHTML = '';
            }
        });
    }
}

// Exportera klassen för användning i andra moduler
export default StadavtalFormHandler;

// ==================== SLUT PÅ stadavtal33b.js ====================
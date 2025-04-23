
// Initialization and main functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialization started');
    const initializer = new ProgramInitializer();
    initializer.initialize()
        .catch(error => {
            console.error('Initialization Error:', error);
            PopupHandler.showError('Could not initialize the program. Check the console for details.');
        });
});
    

class HistoricalDataAnalyzer {
    constructor(csvData) {
        // Huvuddatastruktur för att lagra all analyserad data
        this.data = this.parseCSVData(csvData);
        
        // Frekvensräknare för olika typer av data
        this.frequencies = {
            ansvar: new Map(),           // Räknar förekomster av ansvarskoder
            verksamhet: new Map(),       // Räknar förekomster av verksamhetskoder
            combinations: new Map(),      // Räknar kombinationer av ansvar-verksamhet
            textPatterns: new Map(),     // Kopplar nyckelord till verksamhetskoder
            ansvarMotpart: new Map(),    // Räknar kombinationer av ansvar-motpart
            ansvarObjekt: new Map()      // Räknar kombinationer av ansvar-objekt
        };
        
        // Starta dataanalysen
        this.analyzeData();
    }

    // Parsar CSV-data och grupperar efter städavtal
    parseCSVData(csvData) {
        const contracts = new Map();
        
        // Dela upp CSV-rader och process var och en
        csvData.split('\n').forEach(line => {
            const fields = line.split('\t');
            const contractId = fields[0];
            
            // Hoppa över rubrikrad och tomma rader
            if (!contractId || contractId === 'StädavtalNr') return;

            // Skapa ny array för varje unikt avtal
            if (!contracts.has(contractId)) {
                contracts.set(contractId, []);
            }

            // Lägg till rad i relevant avtalsgrupp
            contracts.get(contractId).push({
                rad: fields[1],
                konto: fields[2],
                ansvar: fields[3],
                verksamhet: fields[5],
                aktivitet: fields[6],
                motpart: fields[7],
                objekt: fields[8],
                belopp: parseFloat(fields[16].replace(/\s/g, '')),
                text: fields[17]
            });
        });

        return contracts;
    }

    // Huvudfunktion för dataanalys
    analyzeData() {
        this.data.forEach((rows, contractId) => {
            rows.forEach(row => {
                // Grundläggande frekvensanalys
                this.countFrequencies(row);
                
                // Analys av kodkombinationer
                this.analyzeCombinations(row);

                // Analys av textmönster
                this.analyzeTextPattern(row.text, row.verksamhet);

                // Analys av aktivitetsrelationer
                this.analyzeActivityRelations(row);
            });
        });
    }

    // Räknar frekvenser för olika koder
    countFrequencies(row) {
        // Räkna enskilda koder
        this.incrementFrequency(this.frequencies.ansvar, row.ansvar);
        this.incrementFrequency(this.frequencies.verksamhet, row.verksamhet);
        
        // Räkna kombinationer
        const ansvarMotpart = `${row.ansvar}-${row.motpart}`;
        this.incrementFrequency(this.frequencies.ansvarMotpart, ansvarMotpart);
        
        // Räkna objektkopplingar om objekt finns
        if (row.objekt) {
            const ansvarObjekt = `${row.ansvar}-${row.objekt}`;
            this.incrementFrequency(this.frequencies.ansvarObjekt, ansvarObjekt);
        }
    }

    // Analyserar kombinationer av olika koder
    analyzeCombinations(row) {
        // Spara ansvar-verksamhet kombination
        const combination = `${row.ansvar}-${row.verksamhet}`;
        this.incrementFrequency(this.frequencies.combinations, combination);

        // Analysera aktivitet-verksamhet kopplingar
        if (!this.activityVerksamhet) {
            this.activityVerksamhet = new Map();
        }
        if (!this.activityVerksamhet.has(row.aktivitet)) {
            this.activityVerksamhet.set(row.aktivitet, new Map());
        }
        this.incrementFrequency(
            this.activityVerksamhet.get(row.aktivitet),
            row.verksamhet
        );
    }

    // Ökar frekvensräknare för en nyckel i en Map
    incrementFrequency(map, key) {
        if (!key) return;
        map.set(key, (map.get(key) || 0) + 1);
    }

    // Analyserar text för att hitta nyckelord kopplade till verksamhetskoder
    analyzeTextPattern(text, verksamhet) {
        if (!text || !verksamhet) return;
        
        const keywords = this.extractKeywords(text.toLowerCase());
        keywords.forEach(keyword => {
            if (!this.frequencies.textPatterns.has(keyword)) {
                this.frequencies.textPatterns.set(keyword, new Map());
            }
            const verksamhetMap = this.frequencies.textPatterns.get(keyword);
            this.incrementFrequency(verksamhetMap, verksamhet);
        });
    }

    // Extraherar relevanta nyckelord från text
    extractKeywords(text) {
        const keywords = new Set();
        
        // Definiera vanliga nyckelord och deras varianter
        const keywordPatterns = {
            'idrottshall': ['idrottshall', 'sporthall', 'gymnastiksal', 'idrottshus'],
            'skola': ['skola', 'skolans', 'gymnasium', 'grundskola'],
            'förskola': ['förskola', 'fsk', 'dagis', 'förskoleklass'],
            'bibliotek': ['bibliotek', 'bibl', 'biblioteksfilia'],
            'museum': ['museum', 'museet', 'utställning'],
            'stödboende': ['stödboende', 'boende', 'boendestöd', 'akutboende'],
            'omsorg': ['omsorg', 'hemvård', 'äldreboende', 'hemtjänst'],
            'fritid': ['fritid', 'ungdomsgård', 'aktivitetshus'],
            'kontor': ['kontor', 'förvaltning', 'administration'],
            'kultur': ['kultur', 'teater', 'konsthall']
        };

        // Sök efter alla varianter av nyckelord
        Object.entries(keywordPatterns).forEach(([main, variants]) => {
            variants.forEach(variant => {
                if (text.includes(variant)) {
                    keywords.add(main);
                }
            });
        });

        return Array.from(keywords);
    }

    // Analyserar relationer mellan aktiviteter och andra koder
    analyzeActivityRelations(row) {
        if (!this.activityRelations) {
            this.activityRelations = {
                ansvar: new Map(),
                motpart: new Map(),
                belopp: new Map()
            };
        }

        // Spara relationer för varje aktivitet
        const activity = row.aktivitet;
        if (activity) {
            // Ansvar-relation
            if (!this.activityRelations.ansvar.has(activity)) {
                this.activityRelations.ansvar.set(activity, new Map());
            }
            this.incrementFrequency(
                this.activityRelations.ansvar.get(activity),
                row.ansvar
            );

            // Motpart-relation
            if (!this.activityRelations.motpart.has(activity)) {
                this.activityRelations.motpart.set(activity, new Map());
            }
            this.incrementFrequency(
                this.activityRelations.motpart.get(activity),
                row.motpart
            );

            // Spara beloppsintervall
            if (!this.activityRelations.belopp.has(activity)) {
                this.activityRelations.belopp.set(activity, {
                    min: Infinity,
                    max: -Infinity,
                    sum: 0,
                    count: 0
                });
            }
            const stats = this.activityRelations.belopp.get(activity);
            const amount = Math.abs(row.belopp);
            stats.min = Math.min(stats.min, amount);
            stats.max = Math.max(stats.max, amount);
            stats.sum += amount;
            stats.count++;
        }
    }

    // Returnerar sorterad lista med ansvarskoder och frekvenser
    getSortedAnsvar() {
        return Array.from(this.frequencies.ansvar.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([code, freq]) => ({
                code,
                frequency: freq,
                description: this.getAnsvarDescription(code)
            }));
    }

    // Returnerar sorterad lista med verksamhetskoder och frekvenser
    getSortedVerksamhet() {
        return Array.from(this.frequencies.verksamhet.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([code, freq]) => ({
                code,
                frequency: freq,
                description: this.getVerksamhetDescription(code)
            }));
    }

    // Kontrollerar om en kombination är vanlig
    isCommonCombination(ansvar, verksamhet) {
        const combination = `${ansvar}-${verksamhet}`;
        const frequency = this.frequencies.combinations.get(combination) || 0;
        const totalAnsvar = this.frequencies.ansvar.get(ansvar) || 0;
        
        // Returnera true om kombinationen förekommer i minst 10% av fallen
        return frequency / totalAnsvar >= 0.1;
    }

    // Beskrivningar för ansvarskoder
    getAnsvarDescription(code) {
        const descriptions = {
            '41611': 'Site 1:1 - Generell städning',
            '41612': 'Site 1:2 - Specialiserad på fönsterputs',
            '41621': 'Site 2:1 - Skolstädning',
            '41622': 'Site 2:2 - Kontorsstädning',
            '41623': 'Site 2:3 - Idrottsanläggningar',
            '41631': 'Site 3:1 - Kulturbyggnader',
            '41632': 'Site 3:2 - Omsorgsbyggnader'
        };
        return descriptions[code] || code;
    }

    // Beskrivningar för verksamhetskoder
    getVerksamhetDescription(code) {
        const descriptions = {
            '9349': 'Fast kostnad/intäkt - Standardstädning',
            '9347': 'Fönsterputs och specialrengöring',
            '3405': 'Idrottsanläggningar - Generellt',
            '3408': 'Skol-idrottshallar och gymnastiksalar',
            '4071': 'Förskoleverksamhet',
            '4400': 'Skolverksamhet',
            '5520': 'Stödboende och omsorgsverksamhet',
            '3151': 'Museum och utställningslokaler'
        };
        return descriptions[code] || code;
    }

    // Hämtar vanligaste verksamhetskod för en aktivitet
    getMostCommonVerksamhet(aktivitet) {
        const verksamhetMap = this.activityVerksamhet.get(aktivitet);
        if (!verksamhetMap) return null;

        return Array.from(verksamhetMap.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0];
    }
}

// ==================== DEL 1 SLUTAR ====================


// ================== BELOPPS- OCH SÖKHANTERING ==================

// ==================== Belopphantering ====================

class AmountHandler {
    constructor() {
        // Huvuddatastrukturer för belopphantering
        this.activities = new Map();      // Lagrar belopp per aktivitet
        this.splitActivities = new Set(); // Håller koll på uppdelade aktiviteter
        this.totalCost = 0;              // Total kostnad för avtalet
    }

    // Initierar nytt städavtal med totalbelopp
    initializeContract(totalAmount) {
        this.totalCost = this.roundAmount(totalAmount);
        this.activities.clear();
        this.splitActivities.clear();
        
        // Standardfördelning av belopp
        this.distributeAmount();
    }

    // Lägger till eller uppdaterar aktivitet
    setActivity(activity, amount, split = false) {
        const roundedAmount = this.roundAmount(amount);

        if (split) {
            // Hantera uppdelad aktivitet
            this.splitActivities.add(activity);
            if (!this.activities.has(activity)) {
                this.activities.set(activity, []);
            }
            this.activities.get(activity).push(roundedAmount);
        } else {
            // Hantera enkel aktivitet
            this.activities.set(activity, [roundedAmount]);
            this.splitActivities.delete(activity);
        }

        // Validera total balans efter varje ändring
        this.validateAndAdjust();
    }

    // Avrunda belopp till heltal
    roundAmount(amount) {
        return Math.round(amount);
    }

    // Beräkna totalt belopp för en aktivitet
    getActivityTotal(activity) {
        const amounts = this.activities.get(activity) || [];
        return amounts.reduce((sum, amount) => sum + amount, 0);
    }

    // Beräkna totalt belopp för alla aktiviteter
    getTotalAmount() {
        let total = 0;
        this.activities.forEach(amounts => {
            amounts.forEach(amount => {
                total += amount;
            });
        });
        return total;
    }

    // Validera att debet = kredit
    validateBalance() {
        const totalIncome = this.getTotalAmount();
        return Math.abs(this.totalCost + totalIncome) < 0.01;
    }

    // Fördela totalbelopp över aktiviteter enligt standardfördelning
    distributeAmount() {
        // Standardfördelning mellan aktiviteter
        const distribution = {
            '8036': 0.85,  // 85% till fast kostnad/intäkt
            '8035': 0.05,  // 5% till fönsterputs
            '8032': 0.10   // 10% till storstädning
        };

        Object.entries(distribution).forEach(([activity, ratio]) => {
            const amount = -Math.round(this.totalCost * ratio); // Negativ för intäkt
            this.setActivity(activity, amount);
        });

        // Säkerställ exakt balans
        this.adjustAmounts();
    }

    // Justera belopp för att säkerställa balans
    adjustAmounts() {
        if (this.validateBalance()) return;

        const currentTotal = this.getTotalAmount();
        const diff = this.totalCost + currentTotal;
        
        // Hitta största beloppet för justering
        let maxActivity = null;
        let maxAmount = 0;
        
        this.activities.forEach((amounts, activity) => {
            const sum = amounts.reduce((a, b) => a + b, 0);
            if (Math.abs(sum) > Math.abs(maxAmount)) {
                maxAmount = sum;
                maxActivity = activity;
            }
        });

        // Justera största beloppet för att uppnå balans
        if (maxActivity) {
            const amounts = this.activities.get(maxActivity);
            amounts[0] += diff;
            this.activities.set(maxActivity, amounts);
        }
    }

    // Validera och justera alla belopp
    validateAndAdjust() {
        if (!this.validateBalance()) {
            this.adjustAmounts();
        }
    }

    // Kontrollera om en aktivitet är uppdelad
    isActivitySplit(activity) {
        return this.splitActivities.has(activity);
    }

    // Dela upp en aktivitet i flera delar
    splitActivity(activity, amounts) {
        if (!Array.isArray(amounts) || amounts.length < 2) {
            throw new Error('Måste ange minst två belopp för uppdelning');
        }

        // Validera att summan av delbeloppen stämmer
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
        const currentAmount = this.getActivityTotal(activity);

        if (Math.abs(totalAmount - currentAmount) > 0.01) {
            throw new Error('Summan av delbeloppen måste matcha ursprungsbeloppet');
        }

        // Uppdatera aktiviteten med nya delbelopp
        this.splitActivities.add(activity);
        this.activities.set(activity, amounts.map(amount => this.roundAmount(amount)));
    }

    // Slå ihop delar av en uppdelad aktivitet
    mergeActivity(activity) {
        if (!this.isActivitySplit(activity)) return;

        const totalAmount = this.getActivityTotal(activity);
        this.activities.set(activity, [totalAmount]);
        this.splitActivities.delete(activity);
    }
}

// ==================== Smart Sökfunktionalitet ====================

class SmartSearch {
    constructor(analyzer) {
        this.analyzer = analyzer;
        this.searchCache = new Map();
        this.initializeSearchIndex();
    }

    // Initialisera sökindex
    initializeSearchIndex() {
        this.searchIndex = {
            text: new Map(),      // Text till verksamhetskoder
            codes: new Map(),     // Kodrelationer
            patterns: new Map()   // Textmönster
        };

        // Indexera alla tidigare städavtal
        this.analyzer.data.forEach((rows, contractId) => {
            rows.forEach(row => {
                this.indexText(row.text, row);
                this.indexCodes(row);
            });
        });
    }

    // Indexera text för sökning
    indexText(text, data) {
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (word.length < 2) return; // Ignorera mycket korta ord

            if (!this.searchIndex.text.has(word)) {
                this.searchIndex.text.set(word, []);
            }
            this.searchIndex.text.get(word).push(data);
        });
    }

    // Indexera koder för sökning
    indexCodes(data) {
        const key = `${data.ansvar}-${data.verksamhet}-${data.motpart}`;
        if (!this.searchIndex.codes.has(key)) {
            this.searchIndex.codes.set(key, []);
        }
        this.searchIndex.codes.get(key).push(data);
    }

    // Huvudsökfunktion
    search(query, filters = {}) {
        query = query.toLowerCase().trim();
        
        // Använd cache om möjligt och inga filter är aktiva
        const cacheKey = JSON.stringify({ query, filters });
        if (this.searchCache.has(cacheKey)) {
            return this.searchCache.get(cacheKey);
        }

        const results = {
            verksamhet: this.searchVerksamhet(query, filters),
            previousContracts: this.searchPreviousContracts(query, filters),
            suggestions: this.generateSuggestions(query, filters)
        };

        // Cacha resultaten
        this.searchCache.set(cacheKey, results);
        return results;
    }

    // Sök verksamhetskoder
    searchVerksamhet(query, filters) {
        const suggestions = this.analyzer.suggestVerksamhet(query);
        
        if (filters.ansvar) {
            // Filtrera baserat på vanliga kombinationer med valt ansvar
            return suggestions.filter(s => 
                this.analyzer.isCommonCombination(filters.ansvar, s.code)
            );
        }
        
        return suggestions;
    }

    // Sök i tidigare städavtal
    searchPreviousContracts(query, filters) {
        const matches = [];
        const searchWords = query.split(/\s+/);

        this.searchIndex.text.forEach((data, word) => {
            // Kontrollera om något sökord matchar
            if (searchWords.some(searchWord => word.includes(searchWord))) {
                data.forEach(row => {
                    // Applicera filter om de finns
                    if (this.matchesFilters(row, filters)) {
                        matches.push({
                            text: row.text,
                            verksamhet: row.verksamhet,
                            ansvar: row.ansvar,
                            motpart: row.motpart,
                            aktivitet: row.aktivitet
                        });
                    }
                });
            }
        });

        // Ta bort dubbletter och sortera efter relevans
        return this.deduplicateAndSort(matches);
    }

    // Kontrollera om en rad matchar filter
    matchesFilters(row, filters) {
        if (filters.ansvar && row.ansvar !== filters.ansvar) return false;
        if (filters.verksamhet && row.verksamhet !== filters.verksamhet) return false;
        if (filters.motpart && row.motpart !== filters.motpart) return false;
        return true;
    }

    // Ta bort dubbletter och sortera resultat
    deduplicateAndSort(matches) {
        // Använd Map för att ta bort dubbletter baserat på text
        const unique = new Map();
        matches.forEach(match => {
            const key = match.text;
            if (!unique.has(key) || this.isMoreRelevant(match, unique.get(key))) {
                unique.set(key, match);
            }
        });

        return Array.from(unique.values())
            .sort((a, b) => this.calculateRelevance(b) - this.calculateRelevance(a));
    }

    // Beräkna relevans för sortering
    calculateRelevance(match) {
        let relevance = 0;
        
        // Ge poäng baserat på hur ofta denna kombination förekommer
        const combination = `${match.ansvar}-${match.verksamhet}-${match.motpart}`;
        const frequency = this.searchIndex.codes.get(combination)?.length || 0;
        relevance += frequency * 10;

        // Ge extra poäng för vanliga aktiviteter
        if (match.aktivitet === '8036') relevance += 5;  // Vanlig fast kostnad
        if (match.aktivitet === '8032') relevance += 3;  // Storstädning
        
        return relevance;
    }

    // Kontrollera om en match är mer relevant än en annan
    isMoreRelevant(newMatch, existingMatch) {
        return this.calculateRelevance(newMatch) > this.calculateRelevance(existingMatch);
    }

    // Generera förslag baserat på partial input
    generateSuggestions(query, filters) {
        return {
            verksamhet: this.suggestVerksamhet(query, filters),
            ansvar: this.suggestAnsvar(query, filters),
            text: this.suggestText(query, filters)
        };
    }

    // Föreslå verksamhetskoder
    suggestVerksamhet(query, filters) {
        let suggestions = this.analyzer.getSortedVerksamhet();
        
        if (filters.ansvar) {
            suggestions = suggestions.filter(s => 
                this.analyzer.isCommonCombination(filters.ansvar, s.code)
            );
        }

        // Begränsa antal förslag
        return suggestions.slice(0, 5);
    }

    // Föreslå ansvarskoder
    suggestAnsvar(query, filters) {
        let suggestions = this.analyzer.getSortedAnsvar();
        
        if (filters.verksamhet) {
            suggestions = suggestions.filter(s => 
                this.analyzer.isCommonCombination(s.code, filters.verksamhet)
            );
        }

        // Begränsa antal förslag
        return suggestions.slice(0, 5);
    }

    // Föreslå textbeskrivningar
    suggestText(query, filters) {
        const matches = this.searchPreviousContracts(query, filters);
        return matches.slice(0, 5).map(m => m.text);
    }
}

// ==================== DEL 2 SLUTAR ====================


// ================== EXCEL-EXPORT OCH INITIALISERING ==================

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


// ==================== DEL 1 BÖRJAR ====================
// DATAANALYS OCH GRUNDLÄGGANDE STRUKTURER
// Version: 1.0
// Senast uppdaterad: 2024-12-22
// Beskrivning: Denna del hanterar inladdning och analys av historisk data
//              samt skapar grundläggande datastrukturer för programmet.

"use strict";

// Debug-inställningar
const DEBUG = true;
const logDebug = (message, data = null) => {
    if (DEBUG) {
        if (data) {
            console.log(`[DEBUG] ${message}:`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
};

// Grundläggande validering av CSV-data
function isValidCSVRow(fields) {
    if (!fields || fields.length < 17) {
        logDebug('Ogiltig CSV-rad, fel antal fält:', fields);
        return false;
    }
    return true;
}

// Huvudklass för dataanalys
class HistoricalDataAnalyzer {
    constructor(csvData) {
        logDebug('Initierar HistoricalDataAnalyzer');
        
        // Huvuddatastruktur för att lagra all analyserad data
        this.data = new Map();
        
        // Frekvensräknare för olika typer av data
        this.frequencies = {
            ansvar: new Map(),           // Räknar förekomster av ansvarskoder
            verksamhet: new Map(),       // Räknar förekomster av verksamhetskoder
            combinations: new Map(),      // Räknar kombinationer av ansvar-verksamhet
            textPatterns: new Map(),     // Kopplar nyckelord till verksamhetskoder
            ansvarMotpart: new Map(),    // Räknar kombinationer av ansvar-motpart
            ansvarObjekt: new Map()      // Räknar kombinationer av ansvar-objekt
        };

        // Relationsmappningar
        this.activityVerksamhet = new Map();  // Koppling mellan aktiviteter och verksamheter
        this.commonCombinations = new Set();  // Vanliga kombinationer av ansvar-verksamhet

        // Parse och analysera data
        try {
            this.parseAndAnalyzeData(csvData);
            logDebug('Data framgångsrikt analyserad');
        } catch (error) {
            console.error('Fel vid dataanalys:', error);
            throw error;
        }
    }

    // Parsar och analyserar CSV-data
    parseAndAnalyzeData(csvData) {
        logDebug('Börjar parsa CSV-data');
        
        if (!csvData) {
            throw new Error('Ingen CSV-data tillgänglig');
        }

        // Dela upp i rader och analysera
        const rows = csvData.split('\n');
        logDebug(`Antal rader att analysera: ${rows.length}`);

        // Spara ursprunglig header för validering
        const headerRow = rows[0];
        this.validateHeader(headerRow);

        let processedContracts = 0;
        let currentContract = null;

        rows.slice(1).forEach((line, index) => {
            try {
                const fields = line.split('\t');
                
                if (!isValidCSVRow(fields)) {
                    logDebug(`Hoppar över ogiltig rad ${index + 2}`);
                    return;
                }

                const contractId = fields[0];
                if (!contractId) {
                    logDebug(`Tomt avtals-ID på rad ${index + 2}`);
                    return;
                }

                // Skapa eller uppdatera avtal
                if (!this.data.has(contractId)) {
                    this.data.set(contractId, []);
                    processedContracts++;
                }

                // Lägg till rad i avtalet
                const row = {
                    rad: fields[1],
                    konto: fields[2],
                    ansvar: fields[3],
                    verksamhet: fields[5],
                    aktivitet: fields[6],
                    motpart: fields[7],
                    objekt: fields[8],
                    belopp: this.parseBelopp(fields[16]),
                    text: fields[17]
                };

                this.data.get(contractId).push(row);

                // Analysera rad
                this.analyzeRow(row);

            } catch (error) {
                console.error(`Fel vid processning av rad ${index + 2}:`, error);
                logDebug('Problematisk rad:', line);
            }
        });

        logDebug(`Processade avtal: ${processedContracts}`);
        this.validateAnalyzedData();
    }

    // Validera header
    validateHeader(headerRow) {
        const expectedHeaders = [
            'StädavtalNr', 'Radnummer', 'Konto', 'Ansvar', 'Projekt', 
            'Anl', 'Verksamhet', 'Aktivitet', 'Motpart', 'Objekt/Frikod'
        ];

        const headers = headerRow.split('\t');
        const missingHeaders = expectedHeaders.filter(
            expected => !headers.some(h => h.includes(expected))
        );

        if (missingHeaders.length > 0) {
            logDebug('Saknade headers:', missingHeaders);
            throw new Error('CSV-filen har inte förväntad struktur');
        }
    }

    // Parsa belopp
    parseBelopp(beloppStr) {
        try {
            // Ta bort mellanslag och eventuella valutasymboler
            const cleaned = beloppStr.replace(/\s+/g, '').replace('kr', '');
            const amount = parseFloat(cleaned);
            
            if (isNaN(amount)) {
                logDebug('Ogiltigt belopp:', beloppStr);
                return 0;
            }
            return amount;
        } catch (error) {
            logDebug('Fel vid parsing av belopp:', beloppStr);
            return 0;
        }
    }

    // Analysera en rad med data
    analyzeRow(row) {
        // Räkna frekvenser
        this.incrementFrequency(this.frequencies.ansvar, row.ansvar);
        this.incrementFrequency(this.frequencies.verksamhet, row.verksamhet);

        // Analysera kombinationer
        this.analyzeCombinations(row);

        // Analysera text och mönster
        if (row.text) {
            this.analyzeTextPattern(row.text, row.verksamhet);
        }

        // Spara aktivitet-verksamhet relation
        if (row.aktivitet && row.verksamhet) {
            if (!this.activityVerksamhet.has(row.aktivitet)) {
                this.activityVerksamhet.set(row.aktivitet, new Map());
            }
            this.incrementFrequency(
                this.activityVerksamhet.get(row.aktivitet),
                row.verksamhet
            );
        }
    }

    // Öka frekvensräknare för en nyckel
    incrementFrequency(map, key) {
        if (!key) return;
        map.set(key, (map.get(key) || 0) + 1);
        if (DEBUG && map.get(key) === 1) {
            logDebug('Ny nyckel hittad:', key);
        }
    }

    // Analysera kombinationer av koder
    analyzeCombinations(row) {
        const combination = `${row.ansvar}-${row.verksamhet}`;
        this.incrementFrequency(this.frequencies.combinations, combination);

        // Ansvar-Motpart kombination
        const ansvarMotpart = `${row.ansvar}-${row.motpart}`;
        this.incrementFrequency(this.frequencies.ansvarMotpart, ansvarMotpart);

        // Ansvar-Objekt kombination om objekt finns
        if (row.objekt) {
            const ansvarObjekt = `${row.ansvar}-${row.objekt}`;
            this.incrementFrequency(this.frequencies.ansvarObjekt, ansvarObjekt);
        }
    }

    // Analysera text för att hitta nyckelord
    analyzeTextPattern(text, verksamhet) {
        const keywords = this.extractKeywords(text.toLowerCase());
        keywords.forEach(keyword => {
            if (!this.frequencies.textPatterns.has(keyword)) {
                this.frequencies.textPatterns.set(keyword, new Map());
            }
            this.incrementFrequency(
                this.frequencies.textPatterns.get(keyword),
                verksamhet
            );
        });
    }

    // Extrahera nyckelord från text
    extractKeywords(text) {
        const keywords = new Set();
        
        // Definiera nyckelordsmönster och deras varianter
        const patterns = {
            'idrottshall': [
                'idrottshall', 'sporthall', 'gymnastiksal', 
                'idrottshus', 'gymnastik'
            ],
            'skola': [
                'skola', 'skolans', 'gymnasium', 'grundskola', 
                'högstadie', 'låg och mellan'
            ],
            'förskola': [
                'förskola', 'fsk', 'dagis', 'förskoleklass', 
                'förskole'
            ],
            'bibliotek': [
                'bibliotek', 'bibl', 'biblioteksfilia', 
                'biblioteks'
            ],
            'museum': [
                'museum', 'museet', 'utställning', 
                'kulturhus'
            ],
            'stödboende': [
                'stödboende', 'boende', 'boendestöd', 
                'akutboende', 'gruppboende'
            ],
            'omsorg': [
                'omsorg', 'hemvård', 'äldreboende', 
                'hemtjänst', 'vårdboende'
            ],
            'fritid': [
                'fritid', 'ungdomsgård', 'aktivitetshus', 
                'fritidsgård'
            ],
            'kontor': [
                'kontor', 'förvaltning', 'administration', 
                'kansli'
            ],
            'kultur': [
                'kultur', 'teater', 'konsthall', 
                'kulturskola'
            ]
        };

        Object.entries(patterns).forEach(([main, variants]) => {
            if (variants.some(variant => text.includes(variant))) {
                keywords.add(main);
                logDebug(`Nyckelord hittat i text: ${main}`);
            }
        });

        return Array.from(keywords);
    }

    // Validera analyserad data
    validateAnalyzedData() {
        logDebug('Validerar analyserad data');

        // Kontrollera att vi har data
        if (this.data.size === 0) {
            throw new Error('Ingen data analyserad');
        }

        // Kontrollera frekvensräknare
        Object.entries(this.frequencies).forEach(([type, map]) => {
            if (map.size === 0) {
                logDebug(`Varning: Inga frekvenser för ${type}`);
            }
        });

        // Validera aktivitet-verksamhet kopplingar
        if (this.activityVerksamhet.size === 0) {
            logDebug('Varning: Inga aktivitet-verksamhet kopplingar hittade');
        }

        logDebug('Datavalidering slutförd');
    }

    // Hämta sorterad lista med ansvarskoder
    getSortedAnsvar() {
        logDebug('Hämtar sorterad ansvarslista');
        return Array.from(this.frequencies.ansvar.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([code, freq]) => ({
                code,
                frequency: freq,
                description: this.getAnsvarDescription(code)
            }));
    }

    // Hämta sorterad lista med verksamhetskoder
    getSortedVerksamhet() {
        logDebug('Hämtar sorterad verksamhetslista');
        return Array.from(this.frequencies.verksamhet.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([code, freq]) => ({
                code,
                frequency: freq,
                description: this.getVerksamhetDescription(code)
            }));
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

    // Publika metoder för att hämta analyserad data
    getCommonActivitiesForVerksamhet(verksamhet) {
        return Array.from(this.activityVerksamhet.entries())
            .filter(([_, map]) => map.has(verksamhet))
            .map(([activity]) => activity);
    }

    isCommonCombination(ansvar, verksamhet) {
        const combination = `${ansvar}-${verksamhet}`;
        const frequency = this.frequencies.combinations.get(combination) || 0;
        const totalAnsvar = this.frequencies.ansvar.get(ansvar) || 0;
        return frequency / totalAnsvar >= 0.1;
    }
}

logDebug('Del 1 laddad');
// ==================== DEL 1 SLUTAR ====================
// ==================== DEL 2 BÖRJAR ====================
// BELOPPHANTERING OCH VALIDERING
// Version: 1.0
// Senast uppdaterad: 2024-12-22
// Beskrivning: Denna del hanterar alla beloppsberäkningar, 
//              inklusive validering och balansering av debet/kredit

// Fortsätt använda debug-loggning från Del 1
logDebug('Initierar Del 2 - Belopphantering');

class AmountHandler {
    constructor() {
        logDebug('Initierar AmountHandler');
        
        // Huvuddatastrukturer för belopphantering
        this.activities = new Map();      // Lagrar belopp per aktivitet
        this.splitActivities = new Set(); // Håller koll på uppdelade aktiviteter
        this.totalCost = 0;              // Total kostnad för avtalet
        
        // Standardfördelning mellan aktiviteter
        this.defaultDistribution = {
            '8036': 0.85,  // 85% till fast kostnad/intäkt
            '8035': 0.05,  // 5% till fönsterputs
            '8032': 0.10   // 10% till storstädning
        };

        logDebug('Standardfördelning av belopp:', this.defaultDistribution);
    }

    // Validera beloppsformat
    validateAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            logDebug('Ogiltigt belopp:', amount);
            throw new Error('Belopp måste vara ett nummer');
        }
        return true;
    }

    // Initiera nytt städavtal med totalbelopp
    initializeContract(totalAmount) {
        logDebug('Initierar nytt avtal med totalbelopp:', totalAmount);
        
        try {
            this.validateAmount(totalAmount);
            this.totalCost = this.roundAmount(totalAmount);
            this.activities.clear();
            this.splitActivities.clear();
            
            // Skapa standardfördelning
            this.distributeAmount();
            
            logDebug('Avtal initierat med fördelade belopp');
            return true;
        } catch (error) {
            console.error('Fel vid initiering av avtal:', error);
            return false;
        }
    }

    // Lägg till eller uppdatera aktivitet
    setActivity(activity, amount, split = false) {
        logDebug(`Sätter belopp för aktivitet ${activity}:`, {
            amount: amount,
            split: split
        });

        try {
            this.validateAmount(amount);
            const roundedAmount = this.roundAmount(amount);

            if (split) {
                this.handleSplitActivity(activity, roundedAmount);
            } else {
                this.handleSingleActivity(activity, roundedAmount);
            }

            // Validera total balans efter varje ändring
            this.validateAndAdjust();
            return true;
        } catch (error) {
            console.error(`Fel vid sättning av belopp för ${activity}:`, error);
            return false;
        }
    }

    // Hantera uppdelad aktivitet
    handleSplitActivity(activity, amount) {
        this.splitActivities.add(activity);
        if (!this.activities.has(activity)) {
            this.activities.set(activity, []);
        }
        this.activities.get(activity).push(amount);
        logDebug(`Lade till delbelopp för ${activity}:`, amount);
    }

    // Hantera enkel aktivitet
    handleSingleActivity(activity, amount) {
        this.activities.set(activity, [amount]);
        this.splitActivities.delete(activity);
        logDebug(`Satte enkelbelopp för ${activity}:`, amount);
    }

    // Avrunda belopp till heltal
    roundAmount(amount) {
        const rounded = Math.round(amount);
        logDebug('Avrundat belopp:', {
            original: amount,
            rounded: rounded
        });
        return rounded;
    }

    // Beräkna totalt belopp för en aktivitet
    getActivityTotal(activity) {
        if (!this.activities.has(activity)) {
            logDebug(`Ingen data för aktivitet ${activity}`);
            return 0;
        }

        const amounts = this.activities.get(activity);
        const total = amounts.reduce((sum, amount) => sum + amount, 0);
        logDebug(`Total för aktivitet ${activity}:`, total);
        return total;
    }

    // Beräkna totalt belopp för alla aktiviteter
    getTotalAmount() {
        let total = 0;
        this.activities.forEach((amounts, activity) => {
            const activityTotal = amounts.reduce((sum, amount) => sum + amount, 0);
            total += activityTotal;
            logDebug(`Deltotal för ${activity}:`, activityTotal);
        });
        
        logDebug('Totalt belopp:', total);
        return total;
    }

    // Validera att debet = kredit
    validateBalance() {
        const totalIncome = this.getTotalAmount();
        const diff = Math.abs(this.totalCost + totalIncome);
        const isBalanced = diff < 0.01;

        logDebug('Balansvalidering:', {
            totalCost: this.totalCost,
            totalIncome: totalIncome,
            difference: diff,
            isBalanced: isBalanced
        });

        return isBalanced;
    }

    // Fördela totalbelopp enligt standardfördelning
    distributeAmount() {
        logDebug('Fördelar totalbelopp:', this.totalCost);

        Object.entries(this.defaultDistribution).forEach(([activity, ratio]) => {
            const amount = -Math.round(this.totalCost * ratio); // Negativ för intäkt
            this.setActivity(activity, amount);
            logDebug(`Fördelat till ${activity}:`, amount);
        });

        // Säkerställ exakt balans
        this.adjustAmounts();
    }

    // Justera belopp för att säkerställa balans
    adjustAmounts() {
        if (this.validateBalance()) {
            logDebug('Ingen justering behövs, redan balanserat');
            return;
        }

        const currentTotal = this.getTotalAmount();
        const diff = this.totalCost + currentTotal;
        
        logDebug('Justerar belopp:', {
            currentTotal: currentTotal,
            difference: diff
        });

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

        // Justera största beloppet
        if (maxActivity) {
            const amounts = this.activities.get(maxActivity);
            amounts[0] += diff;
            this.activities.set(maxActivity, amounts);
            logDebug(`Justerat ${maxActivity} med:`, diff);
        }
    }

    // Validera och justera alla belopp
    validateAndAdjust() {
        logDebug('Validerar och justerar alla belopp');
        
        if (!this.validateBalance()) {
            this.adjustAmounts();
            logDebug('Justering genomförd');
        }
    }

    // Dela upp en aktivitet i flera delar
    splitActivity(activity, amounts) {
        logDebug(`Försöker dela upp ${activity}:`, amounts);

        if (!Array.isArray(amounts) || amounts.length < 2) {
            throw new Error('Måste ange minst två belopp för uppdelning');
        }

        // Validera att summan av delbeloppen stämmer
        const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
        const currentAmount = this.getActivityTotal(activity);

        logDebug('Validerar uppdelning:', {
            totalAmount: totalAmount,
            currentAmount: currentAmount
        });

        if (Math.abs(totalAmount - currentAmount) > 0.01) {
            throw new Error('Summan av delbeloppen måste matcha ursprungsbeloppet');
        }

        // Uppdatera aktiviteten
        this.splitActivities.add(activity);
        this.activities.set(activity, amounts.map(amount => this.roundAmount(amount)));
        logDebug(`Aktivitet ${activity} uppdelad`);
    }

    // Slå ihop delar av en uppdelad aktivitet
    mergeActivity(activity) {
        logDebug(`Försöker slå ihop delar för ${activity}`);

        if (!this.isActivitySplit(activity)) {
            logDebug(`${activity} är inte uppdelad`);
            return;
        }

        const totalAmount = this.getActivityTotal(activity);
        this.activities.set(activity, [totalAmount]);
        this.splitActivities.delete(activity);
        
        logDebug(`Aktivitet ${activity} sammanslagen till:`, totalAmount);
    }

    // Kontrollera om en aktivitet är uppdelad
    isActivitySplit(activity) {
        const isSplit = this.splitActivities.has(activity);
        logDebug(`Kontrollerar om ${activity} är uppdelad:`, isSplit);
        return isSplit;
    }

    // Hämta statistik om aktiviteter
    getActivityStatistics() {
        const stats = {};
        this.activities.forEach((amounts, activity) => {
            stats[activity] = {
                total: this.getActivityTotal(activity),
                parts: amounts.length,
                isSplit: this.isActivitySplit(activity)
            };
        });
        
        logDebug('Aktivitetsstatistik:', stats);
        return stats;
    }
}

logDebug('Del 2 laddad');
// ==================== DEL 2 SLUTAR ====================
// ==================== DEL 3 BÖRJAR ====================
// SÖKFUNKTIONALITET OCH SUGGESTIONS
// Version: 1.0
// Senast uppdaterad: 2024-12-22
// Beskrivning: Denna del hanterar sökfunktionalitet och förslag
//              baserat på analys av historisk data

logDebug('Initierar Del 3 - Sökfunktionalitet');

class SmartSearch {
    constructor(analyzer) {
        logDebug('Initierar SmartSearch');
        this.analyzer = analyzer;
        this.searchCache = new Map();
        this.searchIndex = null;
        
        this.initializeSearchIndex();
        this.setupSuggestionThresholds();
    }

    // Initiera sökindex
    initializeSearchIndex() {
        logDebug('Bygger sökindex');
        
        this.searchIndex = {
            text: new Map(),      // Text till verksamhetskoder
            codes: new Map(),     // Kodrelationer
            patterns: new Map(),   // Textmönster
            combinations: new Set() // Validerade kombinationer
        };

        try {
            // Indexera alla tidigare städavtal
            this.analyzer.data.forEach((rows, contractId) => {
                rows.forEach(row => {
                    this.indexText(row.text, row);
                    this.indexCodes(row);
                });
            });

            logDebug('Sökindex byggt:', {
                textEntries: this.searchIndex.text.size,
                codeEntries: this.searchIndex.codes.size,
                patternEntries: this.searchIndex.patterns.size
            });

        } catch (error) {
            console.error('Fel vid byggande av sökindex:', error);
            throw error;
        }
    }

    // Sätt upp tröskelvärden för förslag
    setupSuggestionThresholds() {
        this.thresholds = {
            minSearchLength: 2,         // Minsta antal tecken för sökning
            maxSuggestions: 5,          // Max antal förslag
            relevanceThreshold: 0.3,    // Minimum relevans för förslag
            combinationThreshold: 0.1   // Minimum frekvens för kombinationer
        };

        logDebug('Tröskelvärden satta:', this.thresholds);
    }

    // Indexera text för sökning
    indexText(text, data) {
        if (!text) return;

        const words = text.toLowerCase()
            .split(/\s+/)
            .filter(word => word.length >= this.thresholds.minSearchLength);

        words.forEach(word => {
            if (!this.searchIndex.text.has(word)) {
                this.searchIndex.text.set(word, []);
            }
            this.searchIndex.text.get(word).push(data);
        });

        logDebug(`Text indexerad: "${text.substring(0, 30)}..."`);
    }

    // Indexera koder för sökning
    indexCodes(data) {
        // Skapa kombinationsnycklar
        const keys = [
            `${data.ansvar}-${data.verksamhet}`,
            `${data.ansvar}-${data.motpart}`,
            `${data.verksamhet}-${data.aktivitet}`
        ];

        keys.forEach(key => {
            if (!this.searchIndex.codes.has(key)) {
                this.searchIndex.codes.set(key, []);
            }
            this.searchIndex.codes.get(key).push(data);
        });

        // Spara validerade kombinationer
        if (this.analyzer.isCommonCombination(data.ansvar, data.verksamhet)) {
            this.searchIndex.combinations.add(`${data.ansvar}-${data.verksamhet}`);
        }
    }

    // Huvudsökfunktion
    search(query, filters = {}) {
        logDebug('Söker:', { query, filters });

        query = query.toLowerCase().trim();
        if (query.length < this.thresholds.minSearchLength) {
            logDebug('För kort sökfråga');
            return this.getDefaultResults();
        }

        // Använd cache om möjligt och inga filter är aktiva
        const cacheKey = JSON.stringify({ query, filters });
        if (this.searchCache.has(cacheKey)) {
            logDebug('Returnerar cachade resultat');
            return this.searchCache.get(cacheKey);
        }

        const results = {
            verksamhet: this.searchVerksamhet(query, filters),
            previousContracts: this.searchPreviousContracts(query, filters),
            suggestions: this.generateSuggestions(query, filters)
        };

        // Cacha resultaten
        this.searchCache.set(cacheKey, results);
        logDebug('Sökresultat:', {
            verksamhetCount: results.verksamhet.length,
            contractCount: results.previousContracts.length,
            suggestionCount: Object.keys(results.suggestions).length
        });

        return results;
    }

    // Sök verksamhetskoder
    searchVerksamhet(query, filters) {
        const suggestions = this.analyzer.suggestVerksamhet(query);
        
        if (filters.ansvar) {
            return suggestions.filter(s => 
                this.searchIndex.combinations.has(`${filters.ansvar}-${s.code}`)
            );
        }
        
        return suggestions;
    }

    // Sök i tidigare städavtal
    searchPreviousContracts(query, filters) {
        const matches = [];
        const searchWords = query.split(/\s+/);
        const seenTexts = new Set(); // För att undvika duplicering

        this.searchIndex.text.forEach((data, word) => {
            if (searchWords.some(searchWord => word.includes(searchWord))) {
                data.forEach(row => {
                    if (this.matchesFilters(row, filters) && !seenTexts.has(row.text)) {
                        matches.push(this.createContractSummary(row));
                        seenTexts.add(row.text);
                    }
                });
            }
        });

        return this.rankAndLimitResults(matches);
    }

    // Skapa sammanfattning av avtal
    createContractSummary(row) {
        return {
            text: row.text,
            verksamhet: row.verksamhet,
            ansvar: row.ansvar,
            motpart: row.motpart,
            aktivitet: row.aktivitet,
            belopp: Math.abs(row.belopp),
            relevance: 0  // Sätts senare vid rankning
        };
    }

    // Kontrollera om en rad matchar filter
    matchesFilters(row, filters) {
        for (const [key, value] of Object.entries(filters)) {
            if (value && row[key] !== value) {
                return false;
            }
        }
        return true;
    }

    // Ranka och begränsa resultat
    rankAndLimitResults(matches) {
        return matches
            .map(match => this.calculateRelevance(match))
            .filter(match => match.relevance >= this.thresholds.relevanceThreshold)
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, this.thresholds.maxSuggestions);
    }

    // Beräkna relevans för ett resultat
    calculateRelevance(match) {
        let relevance = 0;
        
        // Frekvensbaserad relevans
        const combination = `${match.ansvar}-${match.verksamhet}`;
        const frequency = this.searchIndex.codes.get(combination)?.length || 0;
        relevance += frequency * 0.1;

        // Aktivitetsbaserad relevans
        if (match.aktivitet === '8036') relevance += 0.2;  // Vanlig fast kostnad
        if (match.aktivitet === '8032') relevance += 0.1;  // Storstädning

        // Normalisera relevans till 0-1
        match.relevance = Math.min(relevance, 1);
        return match;
    }

    // Generera förslag baserat på partiell inmatning
    generateSuggestions(query, filters) {
        logDebug('Genererar förslag för:', query);

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
                this.searchIndex.combinations.has(`${filters.ansvar}-${s.code}`)
            );
        }

        logDebug('Verksamhetsförslag:', suggestions.length);
        return suggestions.slice(0, this.thresholds.maxSuggestions);
    }

    // Föreslå ansvarskoder
    suggestAnsvar(query, filters) {
        let suggestions = this.analyzer.getSortedAnsvar();
        
        if (filters.verksamhet) {
            suggestions = suggestions.filter(s => 
                this.searchIndex.combinations.has(`${s.code}-${filters.verksamhet}`)
            );
        }

        logDebug('Ansvarförslag:', suggestions.length);
        return suggestions.slice(0, this.thresholds.maxSuggestions);
    }

    // Föreslå textbeskrivningar
    suggestText(query, filters) {
        const matches = this.searchPreviousContracts(query, filters);
        return matches.map(m => ({
            text: m.text,
            relevance: m.relevance
        }));
    }

    // Hämta standardresultat när ingen sökning gjorts
    getDefaultResults() {
        return {
            verksamhet: this.analyzer.getSortedVerksamhet()
                .slice(0, this.thresholds.maxSuggestions),
            previousContracts: [],
            suggestions: {
                verksamhet: [],
                ansvar: [],
                text: []
            }
        };
    }

    // Rensa sökcache
    clearCache() {
        logDebug('Rensar sökcache');
        this.searchCache.clear();
    }

    // Uppdatera sökindex med ny data
    updateSearchIndex(newData) {
        logDebug('Uppdaterar sökindex med ny data');
        
        try {
            this.indexText(newData.text, newData);
            this.indexCodes(newData);
            this.clearCache(); // Rensa cache efter uppdatering
            
            logDebug('Sökindex uppdaterat');
            return true;
        } catch (error) {
            console.error('Fel vid uppdatering av sökindex:', error);
            return false;
        }
    }
}

logDebug('Del 3 laddad');
// ==================== DEL 3 SLUTAR ====================
// ==================== DEL 4 BÖRJAR ====================
// UI-HANTERING OCH PROGRAMINITIALISERING
// Version: 1.0
// Senast uppdaterad: 2024-12-22
// Beskrivning: Denna del hanterar användargränssnittet,
//              Excel-export och programmets initialisering

logDebug('Initierar Del 4 - UI och Initialisering');

// ==================== FormHandler ====================
class FormHandler {
    constructor(analyzer, amountHandler, smartSearch) {
        logDebug('Initierar FormHandler');
        
        this.analyzer = analyzer;
        this.amountHandler = amountHandler;
        this.smartSearch = smartSearch;
        this.currentSuggestions = null;
        
        this.setupEventListeners();
        this.initializeDropdowns();
        
        logDebug('FormHandler initierad');
    }

    // Initialisera dropdown-listor
    initializeDropdowns() {
        logDebug('Initierar dropdowns');

        try {
            // Populera ansvarskoder
            const ansvarSelect = document.getElementById('costAnsvar');
            if (!ansvarSelect) {
                throw new Error('Kunde inte hitta ansvar-select element');
            }

            const ansvarOptions = this.analyzer.getSortedAnsvar();
            logDebug('Antal ansvar-alternativ:', ansvarOptions.length);

            ansvarSelect.innerHTML = `
                <option value="">Välj ansvar...</option>
                ${ansvarOptions.map(opt => `
                    <option value="${opt.code}" data-frequency="${opt.frequency}">
                        ${opt.code} - ${opt.description} (${opt.frequency} förekomster)
                    </option>
                `).join('')}
            `;

            // Populera verksamhetskoder
            const verksamhetSelect = document.getElementById('costVerksamhet');
            if (!verksamhetSelect) {
                throw new Error('Kunde inte hitta verksamhet-select element');
            }

            const verksamhetOptions = this.analyzer.getSortedVerksamhet();
            logDebug('Antal verksamhet-alternativ:', verksamhetOptions.length);

            verksamhetSelect.innerHTML = `
                <option value="">Välj verksamhet...</option>
                ${verksamhetOptions.map(opt => `
                    <option value="${opt.code}" data-frequency="${opt.frequency}">
                        ${opt.code} - ${opt.description} (${opt.frequency} förekomster)
                    </option>
                `).join('')}
            `;

            logDebug('Dropdowns initierade framgångsrikt');
        } catch (error) {
            console.error('Fel vid initiering av dropdowns:', error);
            PopupHandler.showError('Kunde inte initiera dropdown-listor: ' + error.message);
        }
    }

    // Sätt upp event listeners
    setupEventListeners() {
        logDebug('Sätter upp event listeners');

        try {
            // Avtalsnamn input
            this.setupContractNameListener();

            // Ansvar och verksamhet
            this.setupCodeListeners();

            // Belopphantering
            this.setupAmountListeners();

            // Formulärhantering
            this.setupFormListeners();

            logDebug('Event listeners uppsatta framgångsrikt');
        } catch (error) {
            console.error('Fel vid uppsättning av event listeners:', error);
            PopupHandler.showError('Kunde inte sätta upp event handlers: ' + error.message);
        }
    }

    // Sätt upp lyssnare för avtalsnamn
    setupContractNameListener() {
        const contractName = document.getElementById('contractName');
        if (!contractName) {
            throw new Error('Kunde inte hitta contractName element');
        }

        contractName.addEventListener('input', e => {
            this.handleContractNameInput(e.target.value);
        });

        // Sätt upp suggestions-lista
        const suggestionsList = document.createElement('ul');
        suggestionsList.className = 'suggestions-list';
        contractName.parentNode.appendChild(suggestionsList);

        // Hantera klick utanför förslagslistan
        document.addEventListener('click', e => {
            if (!contractName.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.style.display = 'none';
            }
        });
    }

    // Sätt upp lyssnare för koder
    setupCodeListeners() {
        // Ansvarskod
        document.getElementById('costAnsvar')?.addEventListener('change', e => {
            this.handleAnsvarChange(e.target.value);
        });

        // Verksamhetskod
        document.getElementById('costVerksamhet')?.addEventListener('change', e => {
            this.handleVerksamhetChange(e.target.value);
        });

        // Objektkodstyp
        document.getElementById('objectCodeType')?.addEventListener('change', e => {
            this.handleObjectCodeTypeChange(e.target.value);
        });
    }

    // Sätt upp lyssnare för belopp
    setupAmountListeners() {
        // Totalbelopp
        document.getElementById('totalAmount')?.addEventListener('input', e => {
            this.handleTotalAmountChange(e.target.value);
        });

        // Aktivitetsbelopp
        ['8036', '8035', '8032'].forEach(activity => {
            // Årsbelopp
            document.getElementById(`yearly${activity}`)?.addEventListener('input', e => {
                this.handleYearlyAmountChange(activity, e.target.value);
            });

            // Uppdelning av belopp
            document.getElementById(`split${activity}`)?.addEventListener('change', e => {
                this.handleActivitySplitChange(activity, e.target.checked);
            });
        });
    }

    // Sätt upp lyssnare för formulär
    setupFormListeners() {
        const form = document.getElementById('contractForm');
        if (!form) {
            throw new Error('Kunde inte hitta formulärelement');
        }

        form.addEventListener('submit', e => {
            this.handleFormSubmit(e);
        });

        // Reset-knapp
        document.querySelector('.reset-button')?.addEventListener('click', () => {
            if (confirm('Är du säker på att du vill återställa formuläret?')) {
                form.reset();
                this.amountHandler.initializeContract(0);
                PopupHandler.showInfo('Formuläret har återställts');
            }
        });
    }

    // Hantera input i avtalsnamnsfältet
    handleContractNameInput(text) {
        logDebug('Hanterar avtalsnamn input:', text);

        if (text.length < 2) {
            this.hideSuggestions();
            return;
        }

        const filters = {
            ansvar: document.getElementById('costAnsvar')?.value,
            verksamhet: document.getElementById('costVerksamhet')?.value,
            motpart: document.getElementById('motpart')?.value
        };

        const results = this.smartSearch.search(text, filters);
        this.currentSuggestions = results;
        this.showSuggestions(results);

        if (results.verksamhet.length > 0) {
            this.suggestVerksamhetCode(results.verksamhet[0]);
        }
    }

    // ... (Fortsättning följer i nästa del)
}

// ==================== ExcelExporter ====================
class ExcelExporter {
    constructor() {
        logDebug('Initierar ExcelExporter');
        this.rowCounter = 1;
    }

    // Skapa Excel-fil från formulärdata
    createExcelFile(formData) {
        logDebug('Skapar Excel-fil');
        
        try {
            this.rowCounter = 1; // Återställ radräknare
            const rows = this.generateRows(formData);
            
            // Skapa arbetsbok
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(rows, { 
                header: [
                    'rad', 'konto', 'ansvar', 'projekt', 'anl', 
                    'verksamhet', 'aktivitet', 'motpart', 'objekt',
                    'mk', 'ms', 'period', 'periodiseringsnyckel',
                    'valbelopp', 'valuta', 'belopp', 'text'
                ]
            });

            XLSX.utils.book_append_sheet(wb, ws, "Konteringar");

            // Spara filen
            const fileName = `stadavtal_${formData.period}_${this.sanitizeFileName(formData.name)}.xlsx`;
            XLSX.writeFile(wb, fileName);

            logDebug('Excel-fil skapad:', fileName);
            return true;
        } catch (error) {
            console.error('Fel vid skapande av Excel-fil:', error);
            PopupHandler.showError('Kunde inte skapa Excel-fil: ' + error.message);
            return false;
        }
    }

    // Generera rader för Excel
    generateRows(formData) {
        const rows = [];

        // Lägg till kostnadsrad
        rows.push(this.createCostRow(formData));

        // Lägg till intäktsrader
        Object.entries(formData.activities).forEach(([activity, data]) => {
            if (data.amounts && data.amounts.length > 0) {
                data.amounts.forEach(amount => {
                    rows.push(this.createIncomeRow(formData, activity, amount, data.ansvar));
                });
            }
        });

        logDebug('Antal genererade rader:', rows.length);
        return rows;
    }

    // Sanera filnamn
    sanitizeFileName(name) {
        return name.replace(/[^a-z0-9åäö]/gi, '_').toLowerCase();
    }
}

// ==================== PopupHandler ====================
class PopupHandler {
    static show(type, message, duration = 5000) {
        logDebug('Visar popup:', { type, message });

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

        // Automatisk stängning
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
        logDebug('Initierar ProgramInitializer');
        this.formHandler = null;
        this.excelExporter = null;
        this.analyzer = null;
    }

    // Initialisera programmet
    async initialize() {
        logDebug('Startar programinitialisering');

        try {
            // Läs in historisk data
            const historicalData = await this.loadHistoricalData();
            logDebug('Historisk data inläst');
            
            // Skapa baskomponenter
            this.analyzer = new HistoricalDataAnalyzer(historicalData);
            const amountHandler = new AmountHandler();
            const smartSearch = new SmartSearch(this.analyzer);
            
            // Skapa UI-hanterare
            this.formHandler = new FormHandler(this.analyzer, amountHandler, smartSearch);
            this.excelExporter = new ExcelExporter();

            // Initiera UI-komponenter
            this.initializeUI();

            logDebug('Program initialiserat framgångsrikt');
            PopupHandler.showSuccess('Programmet har initierats framgångsrikt');
        } catch (error) {
            console.error('Fel vid programinitialisering:', error);
            PopupHandler.showError('Ett fel uppstod vid initialisering: ' + error.message);
        }
    }

    // Läs in historisk data
    async loadHistoricalData() {
        logDebug('Läser in historisk data');

        try {
            const response = await window.fs.readFile('paste.txt', { encoding: 'utf8' });
            logDebug('Historisk data inläst:', response.length, 'tecken');
            return response;
        } catch (error) {
            console.error('Fel vid inläsning av historisk data:', error);
            throw new Error('Kunde inte läsa in historisk data: ' + error.message);
        }
    }

    // Initiera UI-komponenter
    initializeUI() {
        logDebug('Initierar UI-komponenter');

        // Sätt upp tooltips
        this.initializeTooltips();

        // Aktivera Reset-knapp
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.handleReset());
        }
    }

    // Initiera tooltips
    initializeTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseover', e => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = element.dataset.tooltip;
                document.body.appendChild(tooltip);

                const rect = element.getBoundingClientRect();
                tooltip.style.top = rect.bottom + 5 + 'px';
                tooltip.style.left = rect.left + 'px';

                element.addEventListener('mouseout', () => tooltip.remove());
            });
        });
    }

    // Hantera återställning
    handleReset() {
        if (confirm('Är du säker på att du vill återställa formuläret?')) {
            document.getElementById('contractForm').reset();
            PopupHandler.showInfo('Formuläret har återställts');
        }
    }
}

// Starta programmet när sidan laddats
document.addEventListener('DOMContentLoaded', () => {
    logDebug('Sidan laddad, startar program');
    
    const initializer = new ProgramInitializer();
    initializer.initialize()
        .catch(error => {
            console.error('Fel vid programstart:', error);
            PopupHandler.showError('Kunde inte starta programmet. Se konsolen för detaljer.');
        });
});

logDebug('Del 4 laddad');
// ==================== DEL 4 SLUTAR ====================
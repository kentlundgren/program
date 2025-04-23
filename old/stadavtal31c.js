

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

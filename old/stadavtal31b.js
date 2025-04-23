

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

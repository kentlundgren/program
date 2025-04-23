/**
 * stadavtal33a.js
 * Analysmodul för städavtalshantering
 */

class StadavtalAnalyzer {
    constructor() {
        // Huvuddatastrukturer för analyserad data
        this.data = {
            ansvar: new Map(),        // Lagrar ansvarskoder och frekvenser
            verksamhet: new Map(),    // Lagrar verksamhetskoder och frekvenser
            kombinationer: new Map(),  // Lagrar giltiga kombinationer av ansvar-verksamhet
            textMatchningar: new Map() // Lagrar textuella mönster
        };

        // Vanliga aktivitetskoder
        this.aktiviteter = {
            FAST_INTAKT: '8036',
            FONSTERPUTS: '8035',
            STORSTADNING: '8032'
        };

        // Standardvärden för kontering
        this.standardVarden = {
            kostnadskonto: '6132',
            intaktskonto: '3153'
        };
    }

    /**
     * Initierar analysmotorn med historisk data
     * @param {string} csvData - Historisk data i CSV-format
     */
    async initiera(csvData) {
        try {
            console.log('Initierar analys av historisk data...');
            const rader = csvData.split('\n');
            
            // Skippa headerraden och börja med faktisk data
            for (let i = 1; i < rader.length; i++) {
                if (rader[i].trim()) {
                    await this.analyseraRad(rader[i]);
                }
            }

            console.log('Analys slutförd. Antal ansvarskoder:', this.data.ansvar.size);
            console.log('Antal verksamhetskoder:', this.data.verksamhet.size);
            return true;

        } catch (error) {
            console.error('Fel vid initiering av analys:', error);
            throw error;
        }
    }

    /**
     * Analyserar en enskild rad från CSV-datan
     * @param {string} rad - En rad från CSV-filen
     */
    async analyseraRad(rad) {
        const falt = rad.split('\t');
        const [avtalNr, _, konto, ansvar, , , verksamhet, aktivitet, motpart, , , , , , , , belopp, text] = falt;

        // Räkna frekvenser för ansvar och verksamhet
        this.raknaNyckel(this.data.ansvar, ansvar);
        this.raknaNyckel(this.data.verksamhet, verksamhet);

        // Spara kombinationer av ansvar och verksamhet
        if (ansvar && verksamhet) {
            const kombination = `${ansvar}-${verksamhet}`;
            this.raknaNyckel(this.data.kombinationer, kombination);
        }

        // Analysera text för mönsteridentifiering
        if (text) {
            this.analyseraText(text.toLowerCase(), ansvar, verksamhet);
        }
    }

    /**
     * Räknar förekomster av en nyckel i en Map
     * @param {Map} map - Map att uppdatera
     * @param {string} nyckel - Nyckel att räkna
     */
    raknaNyckel(map, nyckel) {
        if (!nyckel) return;
        map.set(nyckel, (map.get(nyckel) || 0) + 1);
    }

    /**
     * Analyserar text för att hitta mönster
     * @param {string} text - Text att analysera
     * @param {string} ansvar - Ansvarskod
     * @param {string} verksamhet - Verksamhetskod
     */
    analyseraText(text, ansvar, verksamhet) {
        const nyckelord = {
            idrottsanlaggning: ['idrottshall', 'sporthall', 'gymnastiksal', 'ishall'],
            skola: ['skola', 'gymnasium', 'grundskola'],
            forskola: ['förskola', 'fsk'],
            omsorg: ['boende', 'omsorg', 'hemvård', 'stödboende'],
            kultur: ['bibliotek', 'museum', 'teater']
        };

        for (const [kategori, ord] of Object.entries(nyckelord)) {
            if (ord.some(o => text.includes(o))) {
                const nyckel = `${kategori}-${ansvar}-${verksamhet}`;
                this.raknaNyckel(this.data.textMatchningar, nyckel);
            }
        }
    }

    /**
     * Hämtar sorterad lista med ansvarskoder
     * @returns {Array} Sorterad lista med ansvarskoder och frekvenser
     */
    hamtaAnsvarskoder() {
        return Array.from(this.data.ansvar.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([kod, frekvens]) => ({
                kod,
                frekvens,
                beskrivning: this.hamtaAnsvarsBeskrivning(kod)
            }));
    }

    /**
     * Hämtar sorterad lista med verksamhetskoder
     * @returns {Array} Sorterad lista med verksamhetskoder och frekvenser
     */
    hamtaVerksamhetskoder() {
        return Array.from(this.data.verksamhet.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([kod, frekvens]) => ({
                kod,
                frekvens,
                beskrivning: this.hamtaVerksamhetsBeskrivning(kod)
            }));
    }

    /**
     * Validerar en kombination av ansvar och verksamhet
     * @param {string} ansvar - Ansvarskod
     * @param {string} verksamhet - Verksamhetskod
     * @returns {Object} Valideringsresultat
     */
    valideraKombination(ansvar, verksamhet) {
        const kombination = `${ansvar}-${verksamhet}`;
        const frekvens = this.data.kombinationer.get(kombination) || 0;
        const totalAnsvar = this.data.ansvar.get(ansvar) || 0;

        if (frekvens === 0) {
            return {
                giltig: false,
                meddelande: 'Denna kombination har inte använts tidigare.',
                forslag: this.hittaLiknandeCombination(ansvar, verksamhet)
            };
        }

        const andel = frekvens / totalAnsvar;
        if (andel < 0.1) {
            return {
                giltig: true,
                varning: 'Denna kombination är ovanlig.',
                andelProcent: Math.round(andel * 100)
            };
        }

        return { giltig: true };
    }

    /**
     * Hittar liknande kombinationer som förslag
     * @param {string} ansvar - Ansvarskod
     * @param {string} verksamhet - Verksamhetskod
     * @returns {Object} Förslag på alternativa koder
     */
    hittaLiknandeCombination(ansvar, verksamhet) {
        const vanligasteVerksamhet = Array.from(this.data.kombinationer.entries())
            .filter(([key]) => key.startsWith(`${ansvar}-`))
            .sort((a, b) => b[1] - a[1])[0];

        const vanligasteAnsvar = Array.from(this.data.kombinationer.entries())
            .filter(([key]) => key.endsWith(`-${verksamhet}`))
            .sort((a, b) => b[1] - a[1])[0];

        return {
            verksamhet: vanligasteVerksamhet ? vanligasteVerksamhet[0].split('-')[1] : null,
            ansvar: vanligasteAnsvar ? vanligasteAnsvar[0].split('-')[0] : null
        };
    }

    /**
     * Hämtar beskrivning för ansvarskod
     * @param {string} kod - Ansvarskod
     * @returns {string} Beskrivning av ansvarskoden
     */
    hamtaAnsvarsBeskrivning(kod) {
        const beskrivningar = {
            '41611': 'Generell städning',
            '41612': 'Specialiserad städning',
            '41621': 'Skolstädning',
            '41622': 'Kontorsstädning',
            '41623': 'Idrottsanläggningar',
            '41631': 'Kulturbyggnader',
            '41632': 'Omsorgsbyggnader',
            '41633': 'Specialfastigheter'
        };
        return beskrivningar[kod] || `Ansvar ${kod}`;
    }

    /**
     * Hämtar beskrivning för verksamhetskod
     * @param {string} kod - Verksamhetskod
     * @returns {string} Beskrivning av verksamhetskoden
     */
    hamtaVerksamhetsBeskrivning(kod) {
        const beskrivningar = {
            '9349': 'Standardstädning',
            '9347': 'Specialrengöring',
            '3405': 'Idrottsanläggningar',
            '3408': 'Skolidrott',
            '4071': 'Förskola',
            '4400': 'Skola',
            '5520': 'Omsorg',
            '3151': 'Kulturverksamhet'
        };
        return beskrivningar[kod] || `Verksamhet ${kod}`;
    }
}

// Exponera klassen för användning i andra moduler
export default StadavtalAnalyzer;

// ==================== SLUT PÅ stadavtal33a.js ====================
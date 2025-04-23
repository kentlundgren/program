// Städavtal - Typ 2a och 2b
// =======================================
// Typ 2a: Samma objektkod för både intäkter och kostnader
// Typ 2b: Utan objektkod

const stadavtalData2aOch2b = {
    // Typ 2a - Samma objektkod för både intäkter och kostnader
    typ2a: {
        1: { // StädavtalNr 1: Samma objektkod (8964) för alla rader
            namn: "Fäladen stödboende/akutboende",
            objektkod: "8964",
            rader: [
                { rad: 1, konto: "6132", ansvar: "70322", verksamhet: "5520", aktivitet: "7600", motpart: "180", objekt: "8964", belopp: 15588, text: "Fäladen stödboende/akutboende" },
                { rad: 2, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8032", motpart: "170", objekt: "8964", belopp: -2420, text: "Fäladen stödboende/akutboende - storstädning" },
                { rad: 3, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "170", objekt: "8964", belopp: -359, text: "Fäladen stödboende/akutboende - fönsterputs" },
                { rad: 4, konto: "3153", ansvar: "41632", verksamhet: "9349", aktivitet: "8036", motpart: "170", objekt: "8964", belopp: -12809, text: "Fäladen stödboende/akutboende - fast intäkt" }
            ]
        },
        2: { // StädavtalNr 2: Samma objektkod (8994) för alla rader
            namn: "Albanoskolan Idrottshall",
            objektkod: "8994",
            rader: [
                { rad: 5, konto: "6132", ansvar: "80350", verksamhet: "3408", aktivitet: "8105", motpart: "180", objekt: "8994", belopp: 13562, text: "Albanoskolan Idrottshall" },
                { rad: 6, konto: "3153", ansvar: "41623", verksamhet: "9349", aktivitet: "8036", motpart: "180", objekt: "8994", belopp: -13562, text: "Albanoskolan Idrottshall" }
            ]
        },
        3: { // StädavtalNr 3: Samma objektkod (8989) för alla rader
            namn: "Asmundtorp Idrottshall",
            objektkod: "8989",
            rader: [
                { rad: 7, konto: "6132", ansvar: "80350", verksamhet: "3408", aktivitet: "8105", motpart: "180", objekt: "8989", belopp: 38444, text: "Asmundtorp Idrottshall" },
                { rad: 8, konto: "3153", ansvar: "41621", verksamhet: "9349", aktivitet: "8036", motpart: "180", objekt: "8989", belopp: -38444, text: "Asmundtorp Idrottshall" }
            ]
        },
        6: { // StädavtalNr 6: Samma objektkod (0365) för alla rader
            namn: "Anhörigcenter Kung Karl",
            objektkod: "0365",
            rader: [
                { rad: 19, konto: "6132", ansvar: "30525", verksamhet: "5145", aktivitet: "3111", motpart: "180", objekt: "0365", belopp: 596, text: "Anhörigcenter Kung Karl" },
                { rad: 20, konto: "6132", ansvar: "30525", verksamhet: "5145", aktivitet: "3111", motpart: "180", objekt: "0365", belopp: 1638, text: "Anhörigcenter Kung Karl" },
                { rad: 21, konto: "6132", ansvar: "30525", verksamhet: "5145", aktivitet: "3111", motpart: "180", objekt: "0365", belopp: 12053, text: "Anhörigcenter Kung Karl" },
                { rad: 22, konto: "3153", ansvar: "41633", verksamhet: "9349", aktivitet: "8036", motpart: "130", objekt: "0365", belopp: -12053, text: "Anhörigcenter Kung Karl" },
                { rad: 23, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8032", motpart: "130", objekt: "0365", belopp: -1638, text: "Anhörigcenter Kung Karl" },
                { rad: 24, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "130", objekt: "0365", belopp: -596, text: "Anhörigcenter Kung Karl" }
            ]
        },
        22: { // StädavtalNr 22: Samma objektkod (8970) för alla rader
            namn: "Hjalmar Brantingsvägen 11E",
            objektkod: "8970",
            rader: [
                { rad: 77, konto: "6132", ansvar: "32307", verksamhet: "5210", aktivitet: "3111", motpart: "180", objekt: "8970", belopp: 153, text: "Hjalmar Brantingsvägen 11E" },
                { rad: 78, konto: "6132", ansvar: "32307", verksamhet: "5210", aktivitet: "3111", motpart: "180", objekt: "8970", belopp: 2805, text: "Hjalmar Brantingsvägen 11E" },
                { rad: 79, konto: "6132", ansvar: "32307", verksamhet: "5210", aktivitet: "3111", motpart: "180", objekt: "8970", belopp: 12808, text: "Hjalmar Brantingsvägen 11E" },
                { rad: 80, konto: "3153", ansvar: "41611", verksamhet: "9349", aktivitet: "8036", motpart: "130", objekt: "8970", belopp: -12808, text: "Hjalmar Brantingsvägen 11E" },
                { rad: 81, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8032", motpart: "130", objekt: "8970", belopp: -2805, text: "Hjalmar Brantingsvägen 11E" },
                { rad: 82, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "130", objekt: "8970", belopp: -153, text: "Hjalmar Brantingsvägen 11E" }
            ]
        }
        // ... fler typ 2a avtal kan läggas till här
    },

    // Typ 2b - Utan objektkod
    typ2b: {
        5: { // StädavtalNr 5: Inga objektkoder
            namn: "Borstahusen bod/fikarum/omklädningsrum",
            objektkod: "",
            rader: [
                { rad: 13, konto: "6132", ansvar: "80350", verksamhet: "3405", aktivitet: "8105", motpart: "180", objekt: "", belopp: 1821, text: "Borstahusen bod/fikarum/omklädningsrum" },
                { rad: 14, konto: "3153", ansvar: "41621", verksamhet: "9347", aktivitet: "8036", motpart: "180", objekt: "", belopp: -1821, text: "Borstahusen bod/fikarum/omklädningsrum" },
                { rad: 15, konto: "6132", ansvar: "80350", verksamhet: "3405", aktivitet: "8105", motpart: "180", objekt: "", belopp: 151, text: "Borstahusen bod/fikarum/omklädningsrum" },
                { rad: 16, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8032", motpart: "180", objekt: "", belopp: -151, text: "Borstahusen bod/fikarum/omklädningsrum" },
                { rad: 17, konto: "6132", ansvar: "80350", verksamhet: "3405", aktivitet: "8105", motpart: "180", objekt: "", belopp: 26, text: "Borstahusen bod/fikarum/omklädningsrum" },
                { rad: 18, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "180", objekt: "", belopp: -26, text: "Borstahusen bod/fikarum/omklädningsrum" }
            ]
        },
        7: { // StädavtalNr 7: Inga objektkoder
            namn: "Artillerigatan",
            objektkod: "",
            rader: [
                { rad: 25, konto: "6132", ansvar: "33204", verksamhet: "5105", aktivitet: "3111", motpart: "180", objekt: "", belopp: 25633, text: "Artillerigatan" },
                { rad: 26, konto: "3153", ansvar: "41633", verksamhet: "9349", aktivitet: "8036", motpart: "130", objekt: "", belopp: -25633, text: "Artillerigatan" },
                { rad: 27, konto: "6132", ansvar: "33205", verksamhet: "5120", aktivitet: "3111", motpart: "180", objekt: "", belopp: 1536, text: "Artillerigatan" },
                { rad: 28, konto: "3153", ansvar: "41633", verksamhet: "9349", aktivitet: "8036", motpart: "130", objekt: "", belopp: -1536, text: "Artillerigatan" }
            ]
        }
        // ... fler typ 2b avtal kan läggas till här
    }
};
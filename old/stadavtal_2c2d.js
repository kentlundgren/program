// Städavtal - Typ 2c och 2d
// =======================================
// Typ 2c: Objektkod endast på intäkter
// Typ 2d: Objektkod endast på kostnader

const stadavtalData2cOch2d = {
    // Typ 2c - Objektkod endast på intäkter (konto 3*)
    typ2c: {
        68: { // StädavtalNr 68: Objektkod (8948) endast på intäktsrader
            namn: "Tellus idrottsvägen 16",
            objektkod: "8948",
            rader: [
                { rad: 223, konto: "3153", ansvar: "41622", verksamhet: "9349", aktivitet: "8036", motpart: "170", objekt: "8948", belopp: -12815, text: "Tellus idrottsvägen 16" },
                { rad: 224, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8032", motpart: "170", objekt: "8948", belopp: -1684, text: "Tellus idrottsvägen 16" },
                { rad: 225, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "170", objekt: "8948", belopp: -459, text: "Tellus idrottsvägen 16" },
                { rad: 226, konto: "6132", ansvar: "70232", verksamhet: "5686", aktivitet: "7600", motpart: "180", objekt: "", belopp: 459, text: "Tellus idrottsvägen 16" },
                { rad: 227, konto: "6132", ansvar: "70232", verksamhet: "5686", aktivitet: "7600", motpart: "180", objekt: "", belopp: 1684, text: "Tellus idrottsvägen 16" },
                { rad: 228, konto: "6132", ansvar: "70232", verksamhet: "5686", aktivitet: "7600", motpart: "180", objekt: "", belopp: 12815, text: "Tellus idrottsvägen 16" }
            ]
        },
        10: { // StädavtalNr 10: Objektkod (015610) endast på intäktsrad
            namn: "Björkbacken",
            objektkod: "015610",
            rader: [
                { rad: 34, konto: "3153", ansvar: "41621", verksamhet: "9349", aktivitet: "8036", motpart: "150", objekt: "015610", belopp: -25794, text: "Björkbacken" },
                { rad: 35, konto: "6132", ansvar: "59250", verksamhet: "9180", aktivitet: "8105", motpart: "180", objekt: "", belopp: 25794, text: "Björkbacken" }
            ]
        },
        11: { // StädavtalNr 11: Objektkod (015611) endast på intäktsrad
            namn: "Björkbacken omkl.rum",
            objektkod: "015611",
            rader: [
                { rad: 36, konto: "3153", ansvar: "41621", verksamhet: "9349", aktivitet: "8036", motpart: "150", objekt: "015611", belopp: -14409, text: "Björkbacken omkl.rum" },
                { rad: 37, konto: "6132", ansvar: "59250", verksamhet: "9125", aktivitet: "8105", motpart: "180", objekt: "", belopp: 14409, text: "Björkbacken omkl.rum" }
            ]
        }
    },

    // Typ 2d - Objektkod endast på kostnader (konto 6*)
    typ2d: {
        89: { // StädavtalNr 89: Objektkod (5736) endast på kostnadsrad
            namn: "Emaljgatan våning 3, IT",
            objektkod: "5736",
            rader: [
                { rad: 334, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "150", objekt: "", belopp: -1229, text: "Emaljgatan våning 3, IT" },
                { rad: 335, konto: "3153", ansvar: "41611", verksamhet: "9349", aktivitet: "8036", motpart: "150", objekt: "", belopp: -20385, text: "Emaljgatan våning 3, IT" },
                { rad: 336, konto: "6132", ansvar: "51300", verksamhet: "9275", aktivitet: "5030", motpart: "180", objekt: "5736", belopp: 21614, text: "Emaljgatan våning 3, IT" }
            ]
        },
        13: { // StädavtalNr 13: Objektkod (0115) endast på kostnadsrad
            namn: "Brandstationen",
            objektkod: "0115",
            rader: [
                { rad: 42, konto: "6132", ansvar: "54001", verksamhet: "2700", aktivitet: "6138", motpart: "180", objekt: "0115", belopp: 35241, text: "Brandstationen" },
                { rad: 43, konto: "3153", ansvar: "41621", verksamhet: "9349", aktivitet: "8036", motpart: "150", objekt: "", belopp: -35241, text: "Brandstationen" }
            ]
        },
        49: { // StädavtalNr 49: Objektkod (8947) endast på kostnadsrad
            namn: "Rådhuset fd Fröfabriken",
            objektkod: "8947",
            rader: [
                { rad: 165, konto: "3153", ansvar: "41632", verksamhet: "9349", aktivitet: "8036", motpart: "162", objekt: "", belopp: -1529, text: "Rådhuset fd Fröfabriken" },
                { rad: 166, konto: "6132", ansvar: "62500", verksamhet: "9262", aktivitet: "6211", motpart: "180", objekt: "6268", belopp: 1529, text: "Rådhuset fd Fröfabriken" }
            ]
        },
        96: { // StädavtalNr 96: Objektkod endast på kostnadsrad
            namn: "Emaljgatan 1 C våning 0,1,2",
            objektkod: "",
            rader: [
                { rad: 349, konto: "6132", ansvar: "80601", verksamhet: "9340", aktivitet: "8105", motpart: "180", objekt: "", belopp: 28993, text: "Emaljgatan 1 C våning 0,1,2" },
                { rad: 350, konto: "3153", ansvar: "41611", verksamhet: "9349", aktivitet: "8036", motpart: "180", objekt: "", belopp: -26535, text: "Emaljgatan 1 C våning 0,1,2" },
                { rad: 351, konto: "3153", ansvar: "41612", verksamhet: "9347", aktivitet: "8035", motpart: "180", objekt: "", belopp: -2457, text: "Emaljgatan 1 C våning 0,1,2" }
            ]
        }
    }
};
// Data från exempel 2a
const testData = [
    { 
        rad: 1,
        konto: '6132',
        ansvar: '70322',
        verksamhet: '5520',
        aktivitet: '7600',
        motpart: '180',
        objekt: '8964',
        belopp: 15588,
        text: 'Fäladen stödboende/akutboende'
    },
    {
        rad: 2,
        konto: '3153',
        ansvar: '41612',
        verksamhet: '9347',
        aktivitet: '8032',
        motpart: '170',
        objekt: '8964',
        belopp: -2420,
        text: 'Fäladen stödboende/akutboende - storstädning'
    },
    {
        rad: 3,
        konto: '3153',
        ansvar: '41612',
        verksamhet: '9347',
        aktivitet: '8035',
        motpart: '170',
        objekt: '8964',
        belopp: -359,
        text: 'Fäladen stödboende/akutboende - fönsterputs'
    },
    {
        rad: 4,
        konto: '3153',
        ansvar: '41632',
        verksamhet: '9349',
        aktivitet: '8036',
        motpart: '170',
        objekt: '8964',
        belopp: -12809,
        text: 'Fäladen stödboende/akutboende - fast intäkt'
    }
];

function exportToExcel() {
    // Definiera exakt ordning för alla 17 kolumner
    const columnOrder = [
        'rad', 'konto', 'ansvar', 'projekt', 'anl', 
        'verksamhet', 'aktivitet', 'motpart', 'objekt',
        'mk', 'ms', 'period', 'periodiseringsnyckel',
        'valbelopp', 'valuta', 'belopp', 'text'
    ];

    // Sätt period för test
    const testPeriod = '202501';

    // Formatera data med alla 17 kolumner
    const formattedData = testData.map(row => ({
        rad: row.rad,
        konto: row.konto,
        ansvar: row.ansvar,
        projekt: '',  // Tom kolumn
        anl: '',     // Tom kolumn
        verksamhet: row.verksamhet,
        aktivitet: row.aktivitet,
        motpart: row.motpart,
        objekt: row.objekt,
        mk: '',      // Tom kolumn
        ms: '',      // Tom kolumn
        period: testPeriod,
        periodiseringsnyckel: '', // Tom kolumn
        valbelopp: row.belopp,    // Samma som belopp
        valuta: '',  // Tom kolumn
        belopp: row.belopp,
        text: row.text
    }));

    // Skapa kolumnrubriker
    const headers = columnOrder.reduce((obj, col) => ({...obj, [col]: col}), {});

    // Skapa worksheet med rubriker först, sedan data
    const ws = XLSX.utils.json_to_sheet([headers, ...formattedData], {
        header: columnOrder,
        skipHeader: true
    });

    // Skapa arbetsboken och lägg till worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TestData");

    // Spara filen
    XLSX.writeFile(wb, "test_17kolumner.xlsx");
}
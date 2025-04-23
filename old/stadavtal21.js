  // Globala variabler
let radnummer = 1;
const stadavtalData = [];

// Funktion för att generera CSV-sträng
function generateCSV() {
  // Rubrikraden för CSV
  const headers = [
    "Rad","Konto","Ansvar","Projekt","Anl","Verksamhet","Aktivitet","Motpart",
    "Objekt","MK","MS","Period","Periodiseringsnyckel","Val.belopp","Valuta","Belopp","Text"
  ];

  // Bygg en array med alla rader: först headers, sedan data
  const csvRows = [];
  csvRows.push(headers.join(";")); // separera med semikolon eller komma

  stadavtalData.forEach(row => {
    const rowArr = [
      row.rad,
      row.konto,
      row.ansvar,
      row.projekt,
      row.anl,
      row.verksamhet,
      row.aktivitet,
      row.motpart,
      row.objekt,
      row.mk,
      row.ms,
      row.period,
      row.perNyckel,
      row.valBelopp,
      row.valuta,
      row.belopp,
      row.text
    ];
    csvRows.push(rowArr.join(";"));
  });

  return csvRows.join("\n");
}

// Exportfunktion - laddar ner fil som .csv
function exportToExcel() {
  const csvContent = generateCSV();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "stadavtalshantering.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Funktion för att validera period
function validatePeriod(periodStr) {
  // Regex är redan i HTML men vi gör en extra koll
  const pattern = /^2025(0[1-9]|1[0-2])$/;
  return pattern.test(periodStr);
}

// När sidan laddas
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("stadavtalForm");
  const previewTbody = document.querySelector("#previewTable tbody");
  const exportBtn = document.getElementById("exportBtn");

  // Lägg till rad i tabell + stadavtalData
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Hämta fältvärden
    const konto = document.getElementById("konto").value;
    const ansvar = document.getElementById("ansvar").value;
    const projekt = document.getElementById("projekt").value;
    const anl = document.getElementById("anl").value;
    const verksamhet = document.getElementById("verksamhet").value;
    const aktivitet = document.getElementById("aktivitet").value;
    const motpart = document.getElementById("motpart").value;
    const objekt = document.getElementById("objekt").value;
    const mk = document.getElementById("mk").value;
    const ms = document.getElementById("ms").value;
    const period = document.getElementById("period").value;
    const perNyckel = document.getElementById("perNyckel").value;
    const valBelopp = document.getElementById("valBelopp").value;
    const valuta = document.getElementById("valuta").value;
    const belopp = document.getElementById("belopp").value;
    const text = document.getElementById("text").value;

    // Validera period
    if (!validatePeriod(period)) {
      alert("Perioden måste vara mellan 202501 och 202512.");
      return;
    }

    // Skapa objekt för en rad
    const rowData = {
      rad: radnummer++,
      konto: konto,
      ansvar: ansvar,
      projekt: projekt,
      anl: anl,
      verksamhet: verksamhet,
      aktivitet: aktivitet,
      motpart: motpart,
      objekt: objekt,
      mk: mk,
      ms: ms,
      period: period,
      perNyckel: perNyckel,
      valBelopp: valBelopp,
      valuta: valuta,
      belopp: belopp,
      text: text
    };

    // Lägg i array
    stadavtalData.push(rowData);

    // Lägg till i HTML-tabellen
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${rowData.rad}</td>
      <td>${rowData.konto}</td>
      <td>${rowData.ansvar}</td>
      <td>${rowData.projekt}</td>
      <td>${rowData.anl}</td>
      <td>${rowData.verksamhet}</td>
      <td>${rowData.aktivitet}</td>
      <td>${rowData.motpart}</td>
      <td>${rowData.objekt}</td>
      <td>${rowData.mk}</td>
      <td>${rowData.ms}</td>
      <td>${rowData.period}</td>
      <td>${rowData.perNyckel}</td>
      <td>${rowData.valBelopp}</td>
      <td>${rowData.valuta}</td>
      <td>${rowData.belopp}</td>
      <td>${rowData.text}</td>
    `;
    previewTbody.appendChild(newRow);

    form.reset(); // nollställ formulär
  });

  // Koppla exportknappen
  exportBtn.addEventListener("click", exportToExcel);
});

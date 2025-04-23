// Initiera kartan med centrering på global vy
const map = L.map('map').setView([20, 0], 2);

// Lägg till OpenStreetMap som bakgrundskarta
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Data för tullrelationer mellan Sverige och andra länder
const tullRelationer = {
    "USA": {
        land: "USA",
        koordinater: [37.0902, -95.7129],
        sverigeTullar: {
            "Jordbruksprodukter": 20,
            "Industrivaror": 2,
            "Läkemedel": 0,
            "Livsmedel": 5,
            "Textilier": 10,
            "Elektronik": 0,
            "Bilar": 10,
            "Lastbilar": 22,
            "Kemikalier": 3
        },
        motpartTullar: {
            "Jordbruksprodukter": 5,
            "Industrivaror": 2.5,
            "Läkemedel": 0,
            "Livsmedel": 3,
            "Textilier": 8,
            "Elektronik": 0,
            "Bilar": 2.5,
            "Lastbilar": 25,
            "Kemikalier": 2.5
        },
        beskrivning: "Omfattande handelsrelation med fokus på teknologisk export/import. Sverige/EU har högre genomsnittliga tullavgifter (6,95%) mot USA än tvärtom (2,9%)."
    },
    "Tyskland": {
        land: "Tyskland",
        koordinater: [51.1657, 10.4515],
        sverigeTullar: {
            "Industrivaror": 0,
            "Läkemedel": 0,
            "Livsmedel": 0,
            "Textilier": 0,
            "Elektronik": 0,
            "Bilar": 0,
            "Kemikalier": 0
        },
        motpartTullar: {
            "Industrivaror": 0,
            "Läkemedel": 0,
            "Livsmedel": 0,
            "Textilier": 0,
            "Elektronik": 0,
            "Bilar": 0,
            "Kemikalier": 0
        },
        beskrivning: "Inga tullavgifter inom EU (fri handel)"
    },
    "Kina": {
        land: "Kina",
        koordinater: [35.8617, 104.1954],
        sverigeTullar: {
            "Industrivaror": 5,
            "Läkemedel": 0,
            "Livsmedel": 10,
            "Textilier": 12,
            "Elektronik": 0,
            "Bilar": 25,
            "Kemikalier": 5
        },
        motpartTullar: {
            "Industrivaror": 8,
            "Läkemedel": 5,
            "Livsmedel": 15,
            "Textilier": 10,
            "Elektronik": 0,
            "Bilar": 15,
            "Kemikalier": 7
        },
        beskrivning: "Växande handelsrelation med fokus på elektronik och tillverkningsvaror"
    },
    "Norge": {
        land: "Norge",
        koordinater: [60.4720, 8.4689],
        sverigeTullar: {
            "Industrivaror": 0,
            "Läkemedel": 0,
            "Livsmedel": 0,
            "Textilier": 0,
            "Elektronik": 0,
            "Bilar": 0,
            "Kemikalier": 0
        },
        motpartTullar: {
            "Industrivaror": 0,
            "Läkemedel": 0,
            "Livsmedel": 0,
            "Textilier": 0,
            "Elektronik": 0,
            "Bilar": 0,
            "Kemikalier": 0
        },
        beskrivning: "Inga tullavgifter inom EES (fri handel)"
    },
    "Storbritannien": {
        land: "Storbritannien",
        koordinater: [55.3781, -3.4360],
        sverigeTullar: {
            "Industrivaror": 2.5,
            "Läkemedel": 0,
            "Livsmedel": 5,
            "Textilier": 12,
            "Elektronik": 0,
            "Bilar": 10,
            "Kemikalier": 3
        },
        motpartTullar: {
            "Industrivaror": 2.5,
            "Läkemedel": 0,
            "Livsmedel": 5,
            "Textilier": 12,
            "Elektronik": 0,
            "Bilar": 10,
            "Kemikalier": 3
        },
        beskrivning: "Post-Brexit handelsrelation med liknande tullavgifter i båda riktningarna"
    },
    "Ryssland": {
        land: "Ryssland",
        koordinater: [61.5240, 105.3188],
        sverigeTullar: {
            "Industrivaror": 15,
            "Läkemedel": 5,
            "Livsmedel": 15,
            "Textilier": 15,
            "Elektronik": 5,
            "Bilar": 25,
            "Kemikalier": 10
        },
        motpartTullar: {
            "Industrivaror": 15,
            "Läkemedel": 5,
            "Livsmedel": 15,
            "Textilier": 15,
            "Elektronik": 5,
            "Bilar": 25,
            "Kemikalier": 10
        },
        beskrivning: "Begränsad handel på grund av sanktioner och höga tullavgifter"
    },
    "Japan": {
        land: "Japan",
        koordinater: [36.2048, 138.2529],
        sverigeTullar: {
            "Industrivaror": 3,
            "Läkemedel": 0,
            "Livsmedel": 8,
            "Textilier": 10,
            "Elektronik": 0,
            "Bilar": 10,
            "Kemikalier": 3
        },
        motpartTullar: {
            "Industrivaror": 3,
            "Läkemedel": 0,
            "Livsmedel": 8,
            "Textilier": 10,
            "Elektronik": 0,
            "Bilar": 10,
            "Kemikalier": 3
        },
        beskrivning: "Jämnställda tullavgifter i båda riktningarna enligt handelsavtal"
    },
    "Brasilien": {
        land: "Brasilien",
        koordinater: [-14.2350, -51.9253],
        sverigeTullar: {
            "Industrivaror": 10,
            "Läkemedel": 5,
            "Livsmedel": 15,
            "Textilier": 20,
            "Elektronik": 10,
            "Bilar": 35,
            "Kemikalier": 15
        },
        motpartTullar: {
            "Industrivaror": 10,
            "Läkemedel": 5,
            "Livsmedel": 15,
            "Textilier": 20,
            "Elektronik": 10,
            "Bilar": 35,
            "Kemikalier": 15
        },
        beskrivning: "Höga tullavgifter i båda riktningarna på grund av skyddande handelspolitik"
    }
};

// Skapa markörer för varje land med tullrelation
Object.values(tullRelationer).forEach(relation => {
    const marker = L.marker(relation.koordinater)
        .addTo(map)
        .bindPopup(`
            <h3>${relation.land}</h3>
            <p>${relation.beskrivning}</p>
        `);

    // Lägg till klickhändelse för att visa detaljerad information
    marker.on('click', () => {
        const tullDetails = document.getElementById('tull-details');
        
        // Skapa HTML för tulltabell
        let tullTabellHTML = `
            <h3>Tullavgifter mellan Sverige och ${relation.land}</h3>
            <div class="relation-details">
                <table class="tull-tabell">
                    <thead>
                        <tr>
                            <th>Vara</th>
                            <th>Sverige mot ${relation.land}</th>
                            <th>${relation.land} mot Sverige</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Lägg till rader för varje varukategori
        for (const [vara, sverigeTull] of Object.entries(relation.sverigeTullar)) {
            const motpartTull = relation.motpartTullar[vara];
            tullTabellHTML += `
                <tr>
                    <td>${vara}</td>
                    <td>${sverigeTull}%</td>
                    <td>${motpartTull}%</td>
                </tr>
            `;
        }
        
        tullTabellHTML += `
                    </tbody>
                </table>
            </div>
            <p class="relation-beskrivning">${relation.beskrivning}</p>
        `;
        
        tullDetails.innerHTML = tullTabellHTML;
    });
}); 
/**
 * Röda Korset - Utbildningsprogram
 * JavaScript för HTML/CSS/JS-versionen
 * 
 * Detta JavaScript-dokument hanterar funktionaliteten för hela applikationen inklusive:
 * - Fliknavigation
 * - Visualisering av flyktingdata
 * - Quiz-funktionalitet med rättningstjänst
 * - Hantering av modala fönster
 * - Animationer och användargränssnittsinteraktioner
 */

// Vänta tills dokumentet har laddats helt
document.addEventListener('DOMContentLoaded', function() {
    // Initiera alla funktioner när sidan laddats
    initTabNavigation();
    initMapVisualization();
    initQuizFunctionality();
    initModalSystem();
});

/**
 * Hantera fliknavigation
 * Växlar mellan olika innehållssektioner när användaren klickar på flikarna
 */
function initTabNavigation() {
    // Hämta alla flikar och innehållssektioner
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    
    // Lägg till klickhändelser för varje flik
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Ta bort active-klassen från alla flikar och innehåll
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Lägg till active-klassen på den klickade fliken
            this.classList.add('active');
            
            // Hämta flikens ID från data-attributet och aktivera motsvarande innehåll
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initierar och hanterar kartvisualiseringen över flyktingströmmar
 * Använder Leaflet.js för att visa en interaktiv karta med flyktingdata
 */
function initMapVisualization() {
    // Element för kartvisualisering
    const mapContainer = document.getElementById('map-visualization');
    const yearSlider = document.getElementById('year-slider');
    const yearDisplay = document.getElementById('year-display');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const statsYear = document.getElementById('stats-year');
    
    // Statistik-element
    const totalRefugees = document.getElementById('total-refugees');
    const topOrigin = document.getElementById('top-origin');
    const topDestination = document.getElementById('top-destination');
    const redcrossResponse = document.getElementById('redcross-response');
    
    // Simulerad data för flyktingströmmar (skulle hämtas från API/JSON i en riktig applikation)
    const refugeeData = {
        2015: {
            total: '65.3',
            origin: 'Syrien, Afghanistan, Somalia',
            destination: 'Turkiet, Pakistan, Libanon',
            redcross: 'Nödhjälp i Medelhavet, familjeåterföreningar'
        },
        2016: {
            total: '68.5',
            origin: 'Syrien, Afghanistan, Sydsudan',
            destination: 'Turkiet, Pakistan, Libanon',
            redcross: 'Läger i Grekland, sjukvårdsinsatser'
        },
        2017: {
            total: '71.4',
            origin: 'Syrien, Afghanistan, Sydsudan',
            destination: 'Turkiet, Uganda, Pakistan',
            redcross: 'Vatten och sanitet, traumabehandling'
        },
        2018: {
            total: '74.8',
            origin: 'Syrien, Venezuela, Afghanistan',
            destination: 'Turkiet, Uganda, Pakistan',
            redcross: 'Vaccination, matutdelning, skydd'
        },
        2019: {
            total: '79.5',
            origin: 'Syrien, Venezuela, Afghanistan',
            destination: 'Turkiet, Colombia, Pakistan',
            redcross: 'Rättshjälp, utbildningsinsatser, boenden'
        },
        2020: {
            total: '82.4',
            origin: 'Syrien, Venezuela, Afghanistan',
            destination: 'Turkiet, Colombia, Tyskland',
            redcross: 'Covid-19 respons, digitala utbildningar'
        },
        2021: {
            total: '89.3',
            origin: 'Syrien, Venezuela, Afghanistan',
            destination: 'Turkiet, Colombia, Uganda',
            redcross: 'Vaccinationsprogram, psykosocialt stöd'
        },
        2022: {
            total: '103.0',
            origin: 'Ukraina, Syrien, Venezuela',
            destination: 'Turkiet, Iran, Colombia',
            redcross: 'Ukraina-respons, vinterhjälp, återuppbyggnad'
        },
        2023: {
            total: '108.4',
            origin: 'Ukraina, Syrien, Afghanistan',
            destination: 'Turkiet, Iran, Colombia',
            redcross: 'Klimatanpassning, långsiktiga program, tekniska lösningar'
        }
    };
    
    // Initiera kartan om ett kartbibliotek är laddat
    let map = null;
    let playInterval = null;
    
    // Kontrollera om Leaflet är tillgängligt
    if (typeof L !== 'undefined') {
        // Skapa karta med Leaflet
        map = L.map(mapContainer).setView([30, 10], 2);
        
        // Lägg till OpenStreetMap kartlager
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Initial visualisering av data
        updateMapVisualization(2015);
    } else {
        // Fallback om Leaflet inte är tillgängligt
        mapContainer.innerHTML = '<div class="map-fallback"><i class="fas fa-map-marked-alt"></i><p>Kartdata laddas...</p><p>Om visualiseringen inte dyker upp, vänligen kontrollera internetanslutningen.</p></div>';
        
        // Uppdatera statistiken ändå
        updateStatistics(2015);
    }
    
    // Funktion för att uppdatera kartvisualisering
    function updateMapVisualization(year) {
        // Uppdatera statistik
        updateStatistics(year);
        
        // Om kartan är tillgänglig, uppdatera den
        if (map) {
            // Rensa befintliga lager
            map.eachLayer(layer => {
                if (layer._url !== 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') {
                    map.removeLayer(layer);
                }
            });
            
            // Här skulle kod för att rita flyktingströmmar på kartan läggas till
            // Detta är en förenklad demonstration
            
            // Lägg till några cirkelmarkörer för ursprungsländer (röda)
            addOriginMarkers(year);
            
            // Lägg till några cirkelmarkörer för destinationsländer (blå)
            addDestinationMarkers(year);
            
            // Lägg till flödeslinjer mellan ursprung och destination
            addFlowLines(year);
        }
    }
    
    // Funktion för att lägga till ursprungsmarkörer (förenklade för demonstration)
    function addOriginMarkers(year) {
        // Koordinater för de vanligaste ursprungsländerna (simpliferade)
        const originCoords = {
            'Syrien': [35, 38],
            'Afghanistan': [33, 65],
            'Somalia': [5, 46],
            'Sydsudan': [7, 30],
            'Venezuela': [8, -66],
            'Ukraina': [49, 32]
        };
        
        // Extrahera ursprungsländer från data
        const origins = refugeeData[year].origin.split(', ');
        
        // Lägg till markörer för varje ursprungsland
        origins.forEach(country => {
            if (originCoords[country]) {
                const marker = L.circleMarker(originCoords[country], {
                    radius: 8,
                    fillColor: '#ff6b6b',
                    color: '#d63031',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);
                
                marker.bindTooltip(`<strong>${country}</strong><br>Ursprungsland`, {
                    direction: 'top'
                });
            }
        });
    }
    
    // Funktion för att lägga till destinationsmarkörer (förenklade för demonstration)
    function addDestinationMarkers(year) {
        // Koordinater för de vanligaste destinationsländerna (simpliferade)
        const destCoords = {
            'Turkiet': [39, 35],
            'Pakistan': [30, 70],
            'Libanon': [33.8, 35.8],
            'Uganda': [1, 32],
            'Colombia': [4, -72],
            'Tyskland': [51, 10],
            'Iran': [32, 53]
        };
        
        // Extrahera destinationsländer från data
        const destinations = refugeeData[year].destination.split(', ');
        
        // Lägg till markörer för varje destinationsland
        destinations.forEach(country => {
            if (destCoords[country]) {
                const marker = L.circleMarker(destCoords[country], {
                    radius: 8,
                    fillColor: '#4ecdc4',
                    color: '#1d9a94',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);
                
                marker.bindTooltip(`<strong>${country}</strong><br>Mottagarland`, {
                    direction: 'top'
                });
            }
        });
    }
    
    // Funktion för att lägga till flödeslinjer (förenklade för demonstration)
    function addFlowLines(year) {
        // Koordinater för de vanligaste ursprungs- och destinationsländerna
        const originCoords = {
            'Syrien': [35, 38],
            'Afghanistan': [33, 65],
            'Somalia': [5, 46],
            'Sydsudan': [7, 30],
            'Venezuela': [8, -66],
            'Ukraina': [49, 32]
        };
        
        const destCoords = {
            'Turkiet': [39, 35],
            'Pakistan': [30, 70],
            'Libanon': [33.8, 35.8],
            'Uganda': [1, 32],
            'Colombia': [4, -72],
            'Tyskland': [51, 10],
            'Iran': [32, 53]
        };
        
        // Extrahera länder från data
        const origins = refugeeData[year].origin.split(', ');
        const destinations = refugeeData[year].destination.split(', ');
        
        // Definiera några linjer mellan ursprung och destination
        for (let i = 0; i < origins.length; i++) {
            if (originCoords[origins[i]] && destCoords[destinations[i]]) {
                const line = L.polyline([originCoords[origins[i]], destCoords[destinations[i]]], {
                    color: '#6c5ce7',
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '10, 10',
                    dashOffset: '0'
                }).addTo(map);
                
                line.bindTooltip(`Flöde: ${origins[i]} → ${destinations[i]}`, {
                    direction: 'center',
                    permanent: false
                });
            }
        }
        
        // Lägg till Röda Korset-markörer för insatser
        // Detta skulle vara mer detaljerat i en verklig applikation
        L.marker([36, 36], {
            icon: L.divIcon({
                html: '<i class="fas fa-first-aid" style="color: #e21815; font-size: 20px;"></i>',
                className: 'redcross-marker',
                iconSize: [20, 20]
            })
        }).addTo(map).bindTooltip('Röda Korset-insats: Nödhjälp', {
            direction: 'top'
        });
    }
    
    // Funktion för att uppdatera statistik
    function updateStatistics(year) {
        // Uppdatera årtal i statistikpanelen
        statsYear.textContent = year;
        
        // Uppdatera statistikvärdena
        totalRefugees.textContent = refugeeData[year].total + ' miljoner';
        topOrigin.textContent = refugeeData[year].origin;
        topDestination.textContent = refugeeData[year].destination;
        redcrossResponse.textContent = refugeeData[year].redcross;
    }
    
    // Händelselyssnare för år-slidern
    yearSlider.addEventListener('input', function() {
        const year = parseInt(this.value);
        yearDisplay.textContent = year;
        
        // Uppdatera visualiseringen med det nya året
        updateMapVisualization(year);
    });
    
    // Play-funktion för att animera genom åren
    playBtn.addEventListener('click', function() {
        // Stoppa befintlig animation om den körs
        if (playInterval) {
            clearInterval(playInterval);
        }
        
        // Starta animation
        playInterval = setInterval(function() {
            let currentYear = parseInt(yearSlider.value);
            
            // Öka året eller börja om från början
            if (currentYear < 2023) {
                currentYear++;
            } else {
                currentYear = 2015;
            }
            
            // Uppdatera slidern och visualiseringen
            yearSlider.value = currentYear;
            yearDisplay.textContent = currentYear;
            updateMapVisualization(currentYear);
        }, 2000); // Ändra år varannan sekund
    });
    
    // Pausknapp för att stoppa animationen
    pauseBtn.addEventListener('click', function() {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    });
}

/**
 * Hanterar quiz-funktionaliteten i applikationen
 * Kontrollerar svar, beräknar poäng och låser upp lösningsfliken om tillräckligt många svar är korrekta
 */
function initQuizFunctionality() {
    const quizForm = document.getElementById('quiz-form');
    const quizResult = document.getElementById('quiz-result');
    const solutionTab = document.querySelector('.tab[data-tab="losning"]');
    const lockedMessage = document.getElementById('locked-message');
    const solutionContent = document.getElementById('solution-content');
    
    // Rätta svar (facit)
    const correctAnswers = {
        'q1': 'b', // Genèvekonventionerna
        'q2': 'c', // Opportunism
        'q3': 'b', // Familjeåterförening
        'q4': 'c', // Mellanöstern och Nordafrika
        'q5': 'c'  // Arbetar med både akut hjälp och långsiktiga lösningar
    };
    
    // Lägg till händelselyssnare för quiz-formuläret
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Beräkna resultat
            let score = 0;
            let totalQuestions = Object.keys(correctAnswers).length;
            
            // Kontrollera varje svar
            for (let question in correctAnswers) {
                const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
                
                if (selectedOption) {
                    if (selectedOption.value === correctAnswers[question]) {
                        score++;
                    }
                }
            }
            
            // Visa resultat
            quizResult.classList.remove('hidden', 'success', 'error');
            
            if (score >= 4) { // Minst 4 av 5 korrekta svar krävs
                quizResult.textContent = `Du fick ${score} av ${totalQuestions} rätt! Lösningen är nu upplåst.`;
                quizResult.classList.add('success');
                
                // Lås upp lösningsfliken
                unlockSolution();
            } else {
                quizResult.textContent = `Du fick ${score} av ${totalQuestions} rätt. Du behöver minst 4 rätt för att låsa upp lösningen.`;
                quizResult.classList.add('error');
            }
        });
    }
    
    // Funktion för att låsa upp lösningssektion
    function unlockSolution() {
        // Ta bort låsklassen från lösningsfliken
        document.getElementById('losning').classList.remove('locked');
        
        // Dölj låsmeddelandet och visa innehållet
        if (lockedMessage && solutionContent) {
            lockedMessage.classList.add('hidden');
            solutionContent.classList.remove('hidden');
        }
        
        // Lagra i localStorage att quizet har klarats
        localStorage.setItem('rodaKorset_quizCompleted', 'true');
    }
    
    // Kontrollera om quizet redan har klarats (använd localStorage)
    if (localStorage.getItem('rodaKorset_quizCompleted') === 'true') {
        unlockSolution();
    }
}

/**
 * Hanterar systeminformationsmodalen och andra modala fönster
 */
function initModalSystem() {
    const systemInfoBtn = document.getElementById('system-info-btn');
    const systemModal = document.getElementById('system-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Öppna modalen när användaren klickar på systeminformationsknappen
    if (systemInfoBtn && systemModal) {
        systemInfoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            systemModal.style.display = 'flex';
        });
    }
    
    // Stäng modalen när användaren klickar på stängknappen
    if (closeBtn && systemModal) {
        closeBtn.addEventListener('click', function() {
            systemModal.style.display = 'none';
        });
    }
    
    // Stäng modalen när användaren klickar utanför innehållet
    if (systemModal) {
        systemModal.addEventListener('click', function(e) {
            if (e.target === systemModal) {
                systemModal.style.display = 'none';
            }
        });
    }
    
    // Stäng modalen när användaren trycker på Escape-tangenten
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && systemModal && systemModal.style.display === 'flex') {
            systemModal.style.display = 'none';
        }
    });
}

/**
 * Service Worker registrering för PWA-funktionalitet (offline-stöd)
 * Skulle implementeras i en produktionsmiljö
 */
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registrering lyckades
            console.log('ServiceWorker registrerad: ', registration.scope);
        }, function(err) {
            // Registrering misslyckades
            console.log('ServiceWorker registrering misslyckades: ', err);
        });
    });
}
*/ 
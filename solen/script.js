// Städernas koordinater
const cities = {
    'Malmö': { lat: 55.6050, lng: 13.0038 },
    'Stockholm': { lat: 59.3293, lng: 18.0686 },
    'Kiruna': { lat: 67.8558, lng: 20.2253 }
};

// Färger för olika städer i diagrammen
const cityColors = {
    'Malmö': 'rgb(65, 105, 225)',
    'Stockholm': 'rgb(34, 139, 34)',
    'Kiruna': 'rgb(220, 20, 60)'
};

// Funktion för att formatera tid
function formatTime(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        console.error('Ogiltigt datum:', date);
        return 'Ogiltig tid';
    }
    return date.toLocaleTimeString('sv-SE', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Funktion för att beräkna dagslängd i timmar
function calculateDayLength(sunrise, sunset) {
    if (!(sunrise instanceof Date) || !(sunset instanceof Date)) {
        console.error('Ogiltiga datum för dagslängdsberäkning:', { sunrise, sunset });
        return 0;
    }
    const diff = sunset - sunrise;
    return diff / (1000 * 60 * 60); // Konvertera från millisekunder till timmar
}

// Funktion för att generera datum för varje dag under året
function generateDates(year) {
    console.log('Genererar datum för år:', year);
    const dates = [];
    const startDate = new Date(year, 0, 1); // 1 januari
    const endDate = new Date(year, 11, 31); // 31 december
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    return dates;
}

// Funktion för att samla soldata för alla städer
function collectSunData() {
    console.log('Börjar samla soldata...');
    const dates = generateDates(new Date().getFullYear());
    const sunData = {};
    
    for (const city in cities) {
        console.log(`Beräknar data för ${city}...`);
        sunData[city] = dates.map(date => {
            try {
                const times = SunCalc.getTimes(date, cities[city].lat, cities[city].lng);
                const dayLength = calculateDayLength(times.sunrise, times.sunset);
                
                return {
                    date: date,
                    sunrise: times.sunrise,
                    sunset: times.sunset,
                    dayLength: dayLength
                };
            } catch (error) {
                console.error(`Fel vid beräkning för ${city} på datum ${date}:`, error);
                return null;
            }
        }).filter(data => data !== null);
    }
    
    return sunData;
}

// Funktion för att hitta perioder av midnattssol och polarnatt
function findSpecialPeriods(sunData, city) {
    let midnightSunStart = null;
    let midnightSunEnd = null;
    let polarNightStart = null;
    let polarNightEnd = null;
    
    // Gå igenom alla dagar
    sunData[city].forEach((data, index) => {
        const prevDay = index > 0 ? sunData[city][index - 1] : null;
        
        // Kolla efter start/slut på midnattssol
        if (data.sunset === null && (prevDay === null || prevDay.sunset !== null)) {
            midnightSunStart = data.date;
        }
        if (data.sunset !== null && prevDay !== null && prevDay.sunset === null) {
            midnightSunEnd = data.date;
        }
        
        // Kolla efter start/slut på polarnatt
        if (data.sunrise === null && (prevDay === null || prevDay.sunrise !== null)) {
            polarNightStart = data.date;
        }
        if (data.sunrise !== null && prevDay !== null && prevDay.sunrise === null) {
            polarNightEnd = data.date;
        }
    });
    
    return {
        midnightSun: midnightSunStart ? {
            start: midnightSunStart,
            end: midnightSunEnd
        } : null,
        polarNight: polarNightStart ? {
            start: polarNightStart,
            end: polarNightEnd
        } : null
    };
}

// Funktion för att formatera period
function formatPeriod(start, end) {
    if (!start || !end) return '';
    const startDate = start.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
    const endDate = end.toLocaleDateString('sv-SE', { day: 'numeric', month: 'long' });
    return `${startDate} - ${endDate}`;
}

// Funktion för att hitta extremvärden för soluppgång
function findSunriseExtremes(sunData) {
    const extremes = {};
    for (const city in sunData) {
        // Filtrera bort null-värden och samla giltiga soluppgångar
        const validSunrises = sunData[city]
            .filter(data => data.sunrise !== null)
            .map(data => ({
                date: data.date,
                time: data.sunrise.getHours() + data.sunrise.getMinutes() / 60,
                exactTime: data.sunrise
            }));
        
        if (validSunrises.length > 0) {
            const earliest = validSunrises.reduce((min, curr) => curr.time < min.time ? curr : min);
            const latest = validSunrises.reduce((max, curr) => curr.time > max.time ? curr : max);
            
            extremes[city] = {
                earliest: {
                    time: earliest.time,
                    date: earliest.date,
                    exactTime: earliest.exactTime
                },
                latest: {
                    time: latest.time,
                    date: latest.date,
                    exactTime: latest.exactTime
                }
            };
        }
        
        // Lägg till information om specialperioder
        const specialPeriods = findSpecialPeriods(sunData, city);
        if (specialPeriods.polarNight) {
            extremes[city].polarNight = specialPeriods.polarNight;
        }
    }
    return extremes;
}

// Funktion för att hitta extremvärden för solnedgång
function findSunsetExtremes(sunData) {
    const extremes = {};
    for (const city in sunData) {
        // Filtrera bort null-värden och samla giltiga solnedgångar
        const validSunsets = sunData[city]
            .filter(data => data.sunset !== null)
            .map(data => ({
                date: data.date,
                time: data.sunset.getHours() + data.sunset.getMinutes() / 60,
                exactTime: data.sunset
            }));
        
        if (validSunsets.length > 0) {
            const earliest = validSunsets.reduce((min, curr) => curr.time < min.time ? curr : min);
            const latest = validSunsets.reduce((max, curr) => curr.time > max.time ? curr : max);
            
            extremes[city] = {
                earliest: {
                    time: earliest.time,
                    date: earliest.date,
                    exactTime: earliest.exactTime
                },
                latest: {
                    time: latest.time,
                    date: latest.date,
                    exactTime: latest.exactTime
                }
            };
        }
        
        // Lägg till information om specialperioder
        const specialPeriods = findSpecialPeriods(sunData, city);
        if (specialPeriods.midnightSun) {
            extremes[city].midnightSun = specialPeriods.midnightSun;
        }
    }
    return extremes;
}

// Funktion för att konvertera timmar till formaterad tid (t.ex. "04:30")
function formatTimeFromHours(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Funktion för att skapa tidsdiagram
function createTimeChart(sunData) {
    console.log('Skapar tidsdiagram...');
    const canvas = document.getElementById('timeChart');
    if (!canvas) {
        console.error('Kunde inte hitta canvas för tidsdiagrammet');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const datasets = [];
    
    for (const city in sunData) {
        // Dataset för soluppgång
        datasets.push({
            label: `${city} - Uppgång`,
            data: sunData[city].map(data => ({
                x: data.date,
                y: data.sunrise.getHours() + data.sunrise.getMinutes() / 60
            })),
            borderColor: cityColors[city],
            backgroundColor: 'transparent',
            borderDash: [5, 5]
        });
        
        // Dataset för solnedgång
        datasets.push({
            label: `${city} - Nedgång`,
            data: sunData[city].map(data => ({
                x: data.date,
                y: data.sunset.getHours() + data.sunset.getMinutes() / 60
            })),
            borderColor: cityColors[city],
            backgroundColor: 'transparent'
        });
    }
    
    new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tid (timmar)'
                    }
                }
            }
        }
    });
}

// Funktion för att skapa dagslängdsdiagram
function createDaylengthChart(sunData) {
    console.log('Skapar dagslängdsdiagram...');
    const canvas = document.getElementById('daylengthChart');
    if (!canvas) {
        console.error('Kunde inte hitta canvas för dagslängdsdiagrammet');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const datasets = [];
    
    for (const city in sunData) {
        datasets.push({
            label: city,
            data: sunData[city].map(data => ({
                x: data.date,
                y: data.dayLength
            })),
            borderColor: cityColors[city],
            backgroundColor: 'transparent'
        });
    }
    
    new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    },
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Dagslängd (timmar)'
                    }
                }
            }
        }
    });
}

// Funktion för att skapa diagram över soluppgångsextremer
function createSunriseExtremesChart(sunData) {
    console.log('Skapar diagram för soluppgångsextremer...');
    const canvas = document.getElementById('sunriseExtremesChart');
    if (!canvas) {
        console.error('Kunde inte hitta canvas för soluppgångsextremdiagrammet');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const extremes = findSunriseExtremes(sunData);
    const labels = Object.keys(extremes);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tidigaste soluppgång',
                    data: labels.map(city => extremes[city]?.earliest?.time || null),
                    backgroundColor: 'rgba(255, 206, 86, 0.5)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Senaste soluppgång',
                    data: labels.map(city => extremes[city]?.latest?.time || null),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const city = context.label;
                            const isEarliest = context.datasetIndex === 0;
                            
                            // Visa polarnatt-information om det finns
                            if (extremes[city].polarNight && isEarliest) {
                                const period = formatPeriod(
                                    extremes[city].polarNight.start,
                                    extremes[city].polarNight.end
                                );
                                return [`Polarnatt: ${period}`, 'Solen går inte upp under denna period'];
                            }
                            
                            const extreme = extremes[city][isEarliest ? 'earliest' : 'latest'];
                            if (!extreme) return ['Data saknas'];
                            
                            const time = formatTime(extreme.exactTime);
                            const date = extreme.date.toLocaleDateString('sv-SE');
                            return [`${context.dataset.label}: ${time}`, `Datum: ${date}`];
                        }
                    }
                },
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    formatter: function(value, context) {
                        const city = context.chart.data.labels[context.dataIndex];
                        const isEarliest = context.datasetIndex === 0;
                        
                        // Visa "Polarnatt" för Kiruna under den perioden
                        if (extremes[city].polarNight && isEarliest) {
                            return 'Polarnatt';
                        }
                        
                        const extreme = extremes[city][isEarliest ? 'earliest' : 'latest'];
                        return extreme ? formatTime(extreme.exactTime) : 'N/A';
                    },
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Tid'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatTimeFromHours(value);
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// Funktion för att skapa diagram över solnedgångsextremer
function createSunsetExtremesChart(sunData) {
    console.log('Skapar diagram för solnedgångsextremer...');
    const canvas = document.getElementById('sunsetExtremesChart');
    if (!canvas) {
        console.error('Kunde inte hitta canvas för solnedgångsextremdiagrammet');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const extremes = findSunsetExtremes(sunData);
    const labels = Object.keys(extremes);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Tidigaste solnedgång',
                    data: labels.map(city => extremes[city]?.earliest?.time || null),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Senaste solnedgång',
                    data: labels.map(city => extremes[city]?.latest?.time || null),
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const city = context.label;
                            const isEarliest = context.datasetIndex === 0;
                            
                            // Visa midnattssol-information om det finns
                            if (extremes[city].midnightSun && !isEarliest) {
                                const period = formatPeriod(
                                    extremes[city].midnightSun.start,
                                    extremes[city].midnightSun.end
                                );
                                return [`Midnattssol: ${period}`, 'Solen går inte ner under denna period'];
                            }
                            
                            const extreme = extremes[city][isEarliest ? 'earliest' : 'latest'];
                            if (!extreme) return ['Data saknas'];
                            
                            const time = formatTime(extreme.exactTime);
                            const date = extreme.date.toLocaleDateString('sv-SE');
                            return [`${context.dataset.label}: ${time}`, `Datum: ${date}`];
                        }
                    }
                },
                datalabels: {
                    align: 'end',
                    anchor: 'end',
                    formatter: function(value, context) {
                        const city = context.chart.data.labels[context.dataIndex];
                        const isEarliest = context.datasetIndex === 0;
                        
                        // Visa "Midnattssol" för Kiruna under den perioden
                        if (extremes[city].midnightSun && !isEarliest) {
                            return 'Midnattssol';
                        }
                        
                        const extreme = extremes[city][isEarliest ? 'earliest' : 'latest'];
                        return extreme ? formatTime(extreme.exactTime) : 'N/A';
                    },
                    color: '#000',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Tid'
                    },
                    ticks: {
                        callback: function(value) {
                            return formatTimeFromHours(value);
                        }
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// Initialisera applikationen
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initialiserar applikation...');
    try {
        const sunData = collectSunData();
        createTimeChart(sunData);
        createDaylengthChart(sunData);
        createSunriseExtremesChart(sunData);
        createSunsetExtremesChart(sunData);
        console.log('Applikation initialiserad framgångsrikt!');
    } catch (error) {
        console.error('Ett fel uppstod vid initialisering:', error);
        alert('Ett fel uppstod vid laddning av applikationen. Se konsolen för mer information.');
    }
}); 
// Registrera Chart.js datalabels plugin
Chart.register(ChartDataLabels);

// Städernas koordinater
const cities = {
    'Malmö': { lat: 55.6050, lng: 13.0038 },
    'Stockholm': { lat: 59.3293, lng: 18.0686 },
    'Kiruna': { lat: 67.8558, lng: 20.2253 }
};

// Färger för varje stad
const cityColors = {
    'Malmö': 'rgb(65, 131, 196)',
    'Stockholm': 'rgb(251, 191, 36)',
    'Kiruna': 'rgb(220, 38, 38)'
};

// Gemensamma diagraminställningar
const commonChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    const hours = Math.floor(value);
                    const minutes = Math.round((value - hours) * 60);
                    return `${label}: ${hours}:${minutes.toString().padStart(2, '0')}`;
                }
            }
        },
        // Inaktivera datalabels som standard
        datalabels: {
            display: false
        }
    }
};

// Funktion för att generera datum för hela året
function generateDatesForYear() {
    const dates = [];
    const year = new Date().getFullYear();
    for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
            dates.push(new Date(year, month, day));
        }
    }
    return dates;
}

// Funktion för att beräkna soldata för en stad
function calculateSunData(city, dates) {
    const sunrises = [];
    const sunsets = [];
    const daylengths = [];

    dates.forEach(date => {
        const times = SunCalc.getTimes(date, cities[city].lat, cities[city].lng);
        sunrises.push({ x: date, y: times.sunrise.getHours() + times.sunrise.getMinutes() / 60 });
        sunsets.push({ x: date, y: times.sunset.getHours() + times.sunset.getMinutes() / 60 });
        
        const dayLength = (times.sunset - times.sunrise) / (1000 * 60 * 60); // Längd i timmar
        daylengths.push({ x: date, y: dayLength });
    });

    return { sunrises, sunsets, daylengths };
}

// Skapa diagram för solens upp- och nedgång
function createSunriseSunsetChart(dates, allCitiesData) {
    const ctx = document.getElementById('sunriseSunsetChart').getContext('2d');
    
    const datasets = [];
    Object.keys(cities).forEach(city => {
        datasets.push({
            label: `${city} (Uppgång)`,
            data: allCitiesData[city].sunrises,
            borderColor: cityColors[city],
            backgroundColor: 'transparent',
            borderWidth: 2
        });
        datasets.push({
            label: `${city} (Nedgång)`,
            data: allCitiesData[city].sunsets,
            borderColor: cityColors[city],
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5]
        });
    });

    new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            ...commonChartOptions,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Datum'
                    }
                },
                y: {
                    min: 0,
                    max: 24,
                    title: {
                        display: true,
                        text: 'Tid (timmar)'
                    }
                }
            }
        }
    });
}

// Skapa diagram för dagslängd
function createDaylengthChart(dates, allCitiesData) {
    const ctx = document.getElementById('daylengthChart').getContext('2d');
    
    const datasets = Object.keys(cities).map(city => ({
        label: city,
        data: allCitiesData[city].daylengths,
        borderColor: cityColors[city],
        backgroundColor: 'transparent',
        borderWidth: 2
    }));

    new Chart(ctx, {
        type: 'line',
        data: { datasets },
        options: {
            ...commonChartOptions,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM'
                        }
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

// Funktion för att formatera tid
function formatTime(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}:${minutes.toString().padStart(2, '0')}`;
}

// Funktion för att hitta extremvärden för soluppgång
function findSunriseExtremes(sunrises) {
    const times = sunrises.map(s => s.y);
    return {
        earliest: Math.min(...times),
        latest: Math.max(...times)
    };
}

// Funktion för att hitta extremvärden för solnedgång
function findSunsetExtremes(sunsets) {
    const times = sunsets.map(s => s.y);
    return {
        earliest: Math.min(...times),
        latest: Math.max(...times)
    };
}

// Skapa diagram för extrema soluppgångstider
function createSunriseExtremesChart(allCitiesData) {
    const ctx = document.getElementById('sunriseExtremesChart').getContext('2d');
    
    const data = Object.keys(cities).map(city => {
        const extremes = findSunriseExtremes(allCitiesData[city].sunrises);
        return {
            city,
            earliest: extremes.earliest,
            latest: extremes.latest
        };
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.city),
            datasets: [
                {
                    label: 'Tidigaste soluppgång',
                    data: data.map(d => d.earliest),
                    backgroundColor: Object.values(cityColors),
                },
                {
                    label: 'Senaste soluppgång',
                    data: data.map(d => d.latest),
                    backgroundColor: Object.values(cityColors).map(color => color.replace('rgb', 'rgba').replace(')', ', 0.5)')),
                }
            ]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                datalabels: {
                    display: true, // Aktivera datalabels för stapeldiagram
                    color: '#000',
                    anchor: 'end',
                    align: 'end',
                    offset: -4,
                    formatter: function(value) {
                        return formatTime(value);
                    },
                    font: {
                        weight: 'bold',
                        size: 11
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 24,
                    title: {
                        display: true,
                        text: 'Tid (timmar)'
                    }
                }
            }
        }
    });
}

// Skapa diagram för extrema solnedgångstider
function createSunsetExtremesChart(allCitiesData) {
    const ctx = document.getElementById('sunsetExtremesChart').getContext('2d');
    
    const data = Object.keys(cities).map(city => {
        const extremes = findSunsetExtremes(allCitiesData[city].sunsets);
        return {
            city,
            earliest: extremes.earliest,
            latest: extremes.latest
        };
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.city),
            datasets: [
                {
                    label: 'Tidigaste solnedgång',
                    data: data.map(d => d.earliest),
                    backgroundColor: Object.values(cityColors),
                },
                {
                    label: 'Senaste solnedgång',
                    data: data.map(d => d.latest),
                    backgroundColor: Object.values(cityColors).map(color => color.replace('rgb', 'rgba').replace(')', ', 0.5)')),
                }
            ]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                datalabels: {
                    display: true, // Aktivera datalabels för stapeldiagram
                    color: '#000',
                    anchor: 'end',
                    align: 'end',
                    offset: -4,
                    formatter: function(value) {
                        return formatTime(value);
                    },
                    font: {
                        weight: 'bold',
                        size: 11
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 24,
                    title: {
                        display: true,
                        text: 'Tid (timmar)'
                    }
                }
            }
        }
    });
}

// Initialisera alla diagram när sidan laddas
document.addEventListener('DOMContentLoaded', () => {
    const dates = generateDatesForYear();
    const allCitiesData = {};
    
    // Beräkna data för alla städer
    Object.keys(cities).forEach(city => {
        allCitiesData[city] = calculateSunData(city, dates);
    });
    
    // Skapa alla diagram
    createSunriseSunsetChart(dates, allCitiesData);
    createDaylengthChart(dates, allCitiesData);
    createSunriseExtremesChart(allCitiesData);
    createSunsetExtremesChart(allCitiesData);
}); 
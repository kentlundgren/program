/**
 * Charts-modulen hanterar skapande och uppdatering av diagram
 */

/**
 * Skapar ett stapeldiagram för företagets utsläpp
 * @param {Object} company - Företagsobjekt med utsläppsdata
 * @param {string} canvasId - ID för canvas-elementet där diagrammet ska visas
 */
function createEmissionsChart(company, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with ID ${canvasId} not found`);
        return;
    }
    
    // Skapa ett stapeldiagram med hjälp av Chart.js
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Scope 1', 'Scope 2', 'Scope 3'],
            datasets: [{
                label: 'Utsläpp (ton CO2e)',
                data: [company.scope1, company.scope2, company.scope3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ton CO2e'
                    }
                }
            }
        }
    });
}

/**
 * Skapar ett linjediagram för att visa utsläppstrender över tid
 * @param {Array} timeSeriesData - Array med tidsserieinformation
// Invänta att DOMen laddas
document.addEventListener('DOMContentLoaded', function() {
    // Beräkna parametrarna för de tre funktionerna baserat på f(0) = 4 och f(3) = 8
    
    // a) Linjär funktion: f(x) = kx + m
    // f(0) = k*0 + m = 4 => m = 4
    // f(3) = k*3 + m = 8 => k*3 + 4 = 8 => k*3 = 4 => k = 4/3
    const k = 4/3;
    const m = 4;
    
    // b) Andragradsfunktion: f(x) = ax² + b
    // f(0) = a*0² + b = 4 => b = 4
    // f(3) = a*3² + b = 8 => a*9 + 4 = 8 => a*9 = 4 => a = 4/9
    const a = 4/9;
    const b = 4;
    
    // c) Exponentialfunktion: f(x) = C · aˣ
    // f(0) = C · a⁰ = C · 1 = C = 4
    // f(3) = C · a³ = 4 · a³ = 8 => a³ = 2 => a = ∛2 ≈ 1.2599
    const C = 4;
    const exp_a = Math.pow(2, 1/3); // ∛2
    
    // Visa parametervärden på sidan
    document.getElementById('parameters').innerHTML = `
        <p>Linjär funktion (a): k = ${k.toFixed(4)}, m = ${m.toFixed(4)}</p>
        <p>Andragradsfunktion (b): a = ${a.toFixed(4)}, b = ${b.toFixed(4)}</p>
        <p>Exponentialfunktion (c): C = ${C.toFixed(4)}, a = ${exp_a.toFixed(4)}</p>
    `;
    
    // Hantera informationsknappen och modal
    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('.close');
    
    // Öppna modal när man klickar på "Om programmet"-knappen
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            infoModal.style.display = 'block';
        });
    }
    
    // Stäng modal när man klickar på X-knappen
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            infoModal.style.display = 'none';
        });
    }
    
    // Stäng modal när man klickar utanför innehållet
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
        }
    });
    
    // Stäng modal med ESC-tangenten
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && infoModal.style.display === 'block') {
            infoModal.style.display = 'none';
        }
    });
    
    // Håll referens till diagrammet
    let myChart = null;
    
    // Hantera fliknavigering
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Lägg till klickhändelse på flikknapparna
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Om knappen är inaktiverad, gör ingenting
            if (this.disabled) return;
            
            // Ta bort active-klassen från alla flikar
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Lägg till active-klassen på den valda fliken
            this.classList.add('active');
            const targetTab = this.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');
            
            // Rita diagrammet om diagram-fliken valdes
            if (targetTab === 'diagram') {
                // Här skapas diagrammet om diagram-fliken väljs
                ritaDiagram();
            }
        });
    });
    
    // Kontrollera quiz-svar
    const checkAnswersBtn = document.getElementById('check-answers');
    const correctAnswers = {
        'q1': 'c', // m = 4
        'q2': 'a', // a = 4/9
        'q3': 'c'  // a = ∛2
    };
    
    checkAnswersBtn.addEventListener('click', function() {
        let allCorrect = true;
        
        // Kontrollera varje fråga
        for (let question in correctAnswers) {
            const selectedOption = document.querySelector(`input[name="${question}"]:checked`);
            const feedbackElement = document.getElementById(`feedback-${question}`);
            
            // Om inget val gjorts
            if (!selectedOption) {
                feedbackElement.textContent = 'Välj ett alternativ.';
                feedbackElement.className = 'feedback incorrect';
                allCorrect = false;
                continue;
            }
            
            // Kontrollera om svaret är korrekt
            if (selectedOption.value === correctAnswers[question]) {
                feedbackElement.textContent = 'Rätt svar!';
                feedbackElement.className = 'feedback correct';
            } else {
                feedbackElement.textContent = 'Fel svar, försök igen.';
                feedbackElement.className = 'feedback incorrect';
                allCorrect = false;
            }
        }
        
        // Om alla svar är rätt, aktivera lösningsfliken
        if (allCorrect) {
            document.getElementById('losning-tab').disabled = false;
            alert('Grattis! Du har svarat rätt på alla frågor. Lösningsfliken har låsts upp.');
        }
    });
    
    // Funktion för att rita diagrammet - förenklad version
    function ritaDiagram() {
        // Om det redan finns ett diagram, förstör det
        if (myChart) {
            myChart.destroy();
        }
        
        // Skapa datapunkter för diagrammet
        const xValues = [];
        const yValuesLinear = [];
        const yValuesQuadratic = [];
        const yValuesExponential = [];
        
        // Generera datapunkter för x-värden från -2 till 6
        for (let x = -2; x <= 6; x += 0.1) {
            // Avrunda x till 1 decimal för att undvika avrundningsfel
            const roundedX = Math.round(x * 10) / 10;
            xValues.push(roundedX);
            
            // Beräkna y-värden för varje funktion
            yValuesLinear.push(k * roundedX + m);
            yValuesQuadratic.push(a * roundedX * roundedX + b);
            yValuesExponential.push(C * Math.pow(exp_a, roundedX));
        }
        
        // Leta efter canvas-elementet
        const canvas = document.getElementById('myChart');
        if (!canvas) {
            console.error('Kunde inte hitta canvas-elementet');
            return;
        }
        
        try {
            // Skapa diagrammet med Chart.js (samma kod som i original-versionen)
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Kunde inte få 2d-kontext från canvas');
                return;
            }
            
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: xValues,
                    datasets: [
                        {
                            label: 'a) f(x) = kx + m',
                            data: yValuesLinear,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            tension: 0.1
                        },
                        {
                            label: 'b) f(x) = ax² + b',
                            data: yValuesQuadratic,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderWidth: 2,
                            tension: 0.1
                        },
                        {
                            label: 'c) f(x) = C · aˣ',
                            data: yValuesExponential,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Jämförelse av funktioner som går genom punkterna f(0) = 4 och f(3) = 8'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'x'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            ticks: {
                                stepSize: 1
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'f(x)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
            console.log('Diagram ritat framgångsrikt');
        } catch (error) {
            console.error('Fel vid ritning av diagram:', error);
        }
    }
    
    // Visa diagrammet direkt om diagramfliken är aktiv vid sidladdning
    if (document.getElementById('diagram').classList.contains('active')) {
        // Vänta lite innan vi ritar diagrammet för att säkerställa att DOM är klar
        setTimeout(ritaDiagram, 100);
    }
    
    // Lägg till en direktlänk för att visa diagrammet
    document.getElementById('diagram-tab').addEventListener('click', ritaDiagram);
    
    // Lägger också till en klickhändelse på den nya knappen
    const visaDiagramBtn = document.getElementById('visaDiagram');
    if (visaDiagramBtn) {
        visaDiagramBtn.addEventListener('click', function() {
            ritaDiagram();
            this.textContent = 'Rita om diagrammet';
        });
    }
    
    // Lägger också till en onload-händelse direkt på fönstret som en sista utväg
    window.addEventListener('load', function() {
        if (document.getElementById('diagram').classList.contains('active')) {
            ritaDiagram();
        }
    });
}); 

// UI Interactions and Form Handling

class FormHandler {
    constructor(analyzer, amountHandler, smartSearch) {
        this.analyzer = analyzer;
        this.amountHandler = amountHandler;
        this.smartSearch = smartSearch;
        this.setupEventListeners();
        this.initializeDropdowns();
    }

    // Populate dropdowns for 'Ansvar' and 'Verksamhet'
    initializeDropdowns() {
        console.log("Initializing dropdowns...");

        // Populate 'Ansvar' dropdown
        const ansvarDropdown = document.getElementById('costAnsvar');
        const ansvarOptions = this.analyzer.getSortedAnsvar();
        ansvarDropdown.innerHTML = `
            <option value="">Välj ansvar...</option>
            ${ansvarOptions.map(option => `
                <option value="${option.code}">
                    ${option.code} - ${option.description} (${option.frequency} förekomster)
                </option>
            `).join('')}
        `;

        // Populate 'Verksamhet' dropdown
        const verksamhetDropdown = document.getElementById('costVerksamhet');
        const verksamhetOptions = this.analyzer.getSortedVerksamhet();
        verksamhetDropdown.innerHTML = `
            <option value="">Välj verksamhet...</option>
            ${verksamhetOptions.map(option => `
                <option value="${option.code}">
                    ${option.code} - ${option.description} (${option.frequency} förekomster)
                </option>
            `).join('')}
        `;
    }

    // Set up event listeners for the form and other interactions
    setupEventListeners() {
        console.log("Setting up event listeners...");

        // Handle reset button
        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.handleReset());
        }

        // Tooltip initialization
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseover', e => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = element.dataset.tooltip;
                document.body.appendChild(tooltip);

                // Position tooltip
                const rect = element.getBoundingClientRect();
                tooltip.style.top = rect.bottom + 5 + 'px';
                tooltip.style.left = rect.left + 'px';

                element.addEventListener('mouseout', () => tooltip.remove());
            });
        });
    }

    // Handle form reset
    handleReset() {
        if (confirm('Är du säker på att du vill återställa formuläret?')) {
            document.getElementById('contractForm').reset();
            console.log("Formuläret har återställts");
        }
    }
}

// Tooltip CSS logic for hover effects
document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded, initializing tooltips and dropdowns.");
});

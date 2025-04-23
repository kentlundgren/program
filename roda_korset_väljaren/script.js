/**
 * script.js för Röda Korset Väljaren
 * Skapad: 2023
 * Författare: AI-assistent
 * 
 * Denna fil innehåller JavaScript-funktionalitet för att visa prompts och hantera modal-fönstret.
 */

// Här deklareras de två olika promptarna som användes för att skapa versionerna
const prompt1 = `Skapa ett utbildningsprogram som utgår från Röda korsets verksamhet med flikar för en svensk gymnasie- eller universitetsuppgift. Programmet ska ha 5 flikar: uppgiftsbeskrivning, tips, visualisering, quiz (3 frågor med 4 alternativ vardera) och lösning (visas efter godkänt quiz).
 
Fråga mig om:
1. Projektets namn och lagringsplats
2. Vilken uppgift programmet ska hantera (ge 3 exempel på olika svårighetsnivåer)
 
Implementera med två tillvägagångssätt:
a) Enkel variant med HTML, CSS och JavaScript
b) Fullständig React-app med Vite
 
Förklara fördelar med båda tillvägagångssätten. Inkludera detaljerade kommentarer i koden, visuell mappstruktur och en beskrivningssida som förklarar hela systemet (tillgänglig via knapp).
Inkludera React- och Vite-logotyper i botten som klickbara länkar. 
Beskriv stegen för att bygga produktionsversionen och hur man hanterar bas-URL för deployment.`;

const prompt2 = `Skapa ett utbildningsprogram med flikar för en svensk gymnasie- eller universitetsuppgift baserat på en välgörenhetsorganisations arbete. Programmet ska ha 5 flikar: uppgiftsbeskrivning, tips, visualisering, quiz (3-5 frågor med 4 alternativ vardera) och lösning (visas efter godkänt quiz).
Fråga mig om:
1. Projektets namn och lagringsplats (inklusive bas-URL för deployment)
2. Vilken organisation programmet handlar om och vilken uppgift det ska hantera
3. Vilken typ av visualisering som är lämplig för ämnet (datagram, karta, infografik)

Implementera med två tillvägagångssätt och separata mappar:
a) Enkel variant med HTML, CSS och JavaScript (i en mapp)
b) Fullständig React-app med Vite och HashRouter (i en annan mapp)

För React-versionen:
1. Implementera navigationssystem med två valbara metoder:
   - Standard React state-baserad navigering
   - React Router-baserad navigering (med HashRouter för statisk hosting)
   - Synlig växlingsknapp i footern för att byta mellan metoderna
2. Skapa separata filer för React-komponenter och deras CSS
3. Använd modern JavaScript och React Hooks
4. Visa tydliga versionsmarkörer i komponenterna
5. Implementera korrekt felhantering för quiz-låsning
6. Använd semantisk HTML5 med aria-attribut för tillgänglighet

För UI/UX design:
1. Responsiv design med media queries för mobil, tablet och desktop
2. Konsekvent färgschema som matchar organisationens grafiska profil
3. Hover-effekter och animationer för bättre användarupplevelse
4. Tydlig visuell indikation av aktuell flik
5. Snygga knappar med tydlig kontrast och läsbarhet
6. Anpassade stilar för källhänvisningar i Harvardformat

Systembeskrivning:
1. Skapa en detaljerad modal-komponent för systembeskrivning som öppnas via en tydlig knapp i footer
2. Inkludera följande sektioner i systembeskrivningen:
   - Övergripande funktionalitet och syfte
   - Teknisk arkitektur med versionsnummer för alla ramverk och bibliotek
   - Beskrivning av komponenter och deras samverkan
   - Flödesschema för användarinteraktion och dataflöde
   - Detaljerad förklaring av navigationssystemen och fördelar med båda
   - PWA-funktionalitet, caching-strategier och offline-kapacitet
   - Noter om kompatibilitet och rekommenderade webbläsare
   - Källkodshänvisningar och utvecklingsprocess
3. Stilsätt systembeskrivningsmodalens innehåll tydligt med rubriker, tabeller och punktlistor
4. Lägg till en "stäng"-knapp som är tydligt synlig och fungerar både via klick och Escape-tangenten

Inkludera:
1. Detaljerade kommentarer i koden som markerar viktiga funktioner och uppdateringar
2. Korrekt refererade källor i Harvardformat för allt innehåll
3. Logotyper i footern (React, Vite, organisation) som klickbara länkar
4. PWA-funktionalitet med offline-stöd
5. README.md med detaljerade installations- och deployment-instruktioner

För Deployment:
1. Konfiguration av vite.config.js för korrekt bas-URL
2. Skapa scripts för både utveckling och produktion
3. Hantering av URL-ruttning via HashRouter för statisk hosting
4. Lösningar för att hantera relativa sökvägar till bilder och resurser
5. Visa faktiska URL-exempel för hur programmet kommer se ut på webbplatsen
6. Tydliga instruktioner för import av CSS-variabler och typsnitt

Ge mig hela kodbasen, inklusive:
1. Alla komponenter med kompletta props och deras typer
2. Optimerad CSS med variabel-definitioner
3. Komplett router-konfiguration
4. Quiz-funktionalitet med låst lösning
5. Versionsinformation i varje komponentfil
6. Komplett SystemDescription-komponent med all nödvändig kontext och stilar
7. En PromptDescription-komponent som visar denna prompt för framtida referens,`;

// DOM-element som används av skriptet
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close');
const showPrompt1Btn = document.getElementById('showPrompt1');
const showPrompt2Btn = document.getElementById('showPrompt2');

/**
 * Visar en prompt i modal-fönstret
 * @param {string} promptText - Promttexten som ska visas
 * @param {string} version - Versionen av prompten (för att sätta rätt titel)
 */
function showPrompt(promptText, version) {
    // Uppdatera modal-innehållet
    modalTitle.textContent = `Prompt ${version}`;
    modalBody.textContent = promptText;
    
    // Visa modal-fönstret
    modal.style.display = 'block';
    
    // Lägg till en event listener för Escape-tangenten
    document.addEventListener('keydown', handleEscapeKey);
}

/**
 * Stänger modal-fönstret
 */
function closeModal() {
    modal.style.display = 'none';
    
    // Ta bort event listener för Escape-tangenten
    document.removeEventListener('keydown', handleEscapeKey);
}

/**
 * Hanterar Escape-tangent för att stänga modal-fönstret
 * @param {KeyboardEvent} event - Tangentbordshändelsen
 */
function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

// Event listeners för knappar med preventDefault för länkar

// Version 1 har koppling till den kortare prompten (prompt1)
showPrompt1Btn.addEventListener('click', (e) => {
    e.preventDefault();
    showPrompt(prompt1, '1 (kortare variant)');
});

// Version 2 har koppling till den längre prompten (prompt2)
showPrompt2Btn.addEventListener('click', (e) => {
    e.preventDefault();
    showPrompt(prompt2, '2 (längre variant)');
});

closeBtn.addEventListener('click', closeModal);

// Stäng modal-fönstret om användaren klickar utanför innehållet
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Kontrollera bildlänkar och ersätt med fallback om de inte fungerar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Röda Korset Väljare har laddats');
    
    // Justera modal-innehåll för läsbarhet på mobila enheter
    if (window.innerWidth <= 768) {
        modalBody.style.fontSize = '0.9rem';
    }
}); 
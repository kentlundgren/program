import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../Modals/Modal.module.css';

/**
 * PromptModal-komponent för att visa den ursprungliga prompten
 * Version: 1.2.0
 * 
 * Denna komponent visar den prompt som användes för att skapa applikationen
 * 
 * Här skedde en uppdatering för att använda ReactMarkdown och samma stilar 
 * som DevelopedPromptModal för bättre konsistens och läsbarhet.
 */

const PromptModal = ({ isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    // Definiera prompten som markdown för att använda med ReactMarkdown
    const promptMarkdown = `
# Ursprunglig Prompt

## Fullständig prompt för projektet

Skapa ett utbildningsprogram med flikar för en svensk gymnasie- eller universitetsuppgift baserat på en välgörenhetsorganisations arbete. Programmet ska ha 5 flikar: uppgiftsbeskrivning, tips, visualisering, quiz (3-5 frågor med 4 alternativ vardera) och lösning (visas efter godkänt quiz).

**Fråga mig om:**

1. Projektets namn och lagringsplats (inklusive bas-URL för deployment)
2. Vilken organisation programmet handlar om och vilken uppgift det ska hantera
3. Vilken typ av visualisering som är lämplig för ämnet (datagram, karta, infografik)

**Implementera med två tillvägagångssätt och separata mappar:**

- Enkel variant med HTML, CSS och JavaScript (i en mapp)
- Fullständig React-app med Vite och HashRouter (i en annan mapp)

**För React-versionen:**

1. Implementera navigationssystem med två valbara metoder:
   - Standard React state-baserad navigering
   - React Router-baserad navigering (med HashRouter för statisk hosting)
   - Synlig växlingsknapp i footern för att byta mellan metoderna
2. Skapa separata filer för React-komponenter och deras CSS
3. Använd modern JavaScript och React Hooks
4. Visa tydliga versionsmarkörer i komponenterna
5. Implementera korrekt felhantering för quiz-låsning
6. Använd semantisk HTML5 med aria-attribut för tillgänglighet

**För UI/UX design:**

1. Responsiv design med media queries för mobil, tablet och desktop
2. Konsekvent färgschema som matchar organisationens grafiska profil
3. Hover-effekter och animationer för bättre användarupplevelse
4. Tydlig visuell indikation av aktuell flik
5. Snygga knappar med tydlig kontrast och läsbarhet
6. Anpassade stilar för källhänvisningar i Harvardformat
7. Undersök om det finns länkar till källor, applicera i så fall dessa.

## Systembeskrivning

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

## Promptbeskrivning

1. Skapa en detaljerad modal-komponent för promptbeskrivning som öppnas via en tydlig knapp i footer
2. Inkludera följande sektioner i systembeskrivningen:
   - Den prompt som startade programmeringen.
   - En utvecklad prompt, som du tar fram på slutet, som tar med lärdomar från projektet.

## Deployment och konfiguration

**Inkludera:**

1. Detaljerade kommentarer i koden som markerar viktiga funktioner och uppdateringar
2. Korrekt refererade källor i Harvardformat för allt innehåll
3. Logotyper i footern (React, Vite, organisation) som klickbara länkar
4. PWA-funktionalitet med offline-stöd
5. README.md med detaljerade installations- och deployment-instruktioner

**För Deployment:**

1. Konfiguration av vite.config.js för korrekt bas-URL
2. Skapa scripts för både utveckling och produktion
3. Hantering av URL-ruttning via HashRouter för statisk hosting
4. Lösningar för att hantera relativa sökvägar till bilder och resurser
5. Visa faktiska URL-exempel för hur programmet kommer se ut på webbplatsen
6. Tydliga instruktioner för import av CSS-variabler och typsnitt

## Kodbas och leverans

**Ge mig hela kodbasen, inklusive:**

1. Alla komponenter med kompletta props och deras typer
2. Optimerad CSS med variabel-definitioner
3. Komplett router-konfiguration
4. Quiz-funktionalitet med låst lösning
5. Versionsinformation i varje komponentfil
6. Komplett SystemDescription-komponent med all nödvändig kontext och stilar
`;

    setMarkdownContent(promptMarkdown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2>Ursprunglig Prompt</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Stäng modal">
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.markdownContainer}>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
            <div className={styles.noteContainer}>
              <p className={styles.note}>
                <strong>Notera:</strong> Detta är den ursprungliga prompten som användes för att skapa detta projekt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal; 
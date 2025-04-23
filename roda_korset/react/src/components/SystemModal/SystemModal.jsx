import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../Modals/Modal.module.css';

/**
 * SystemModal-komponent för att visa systeminformation
 * Version: 1.2.0
 * 
 * Denna komponent visar detaljerad information om:
 * - Övergripande funktionalitet och syfte
 * - Teknisk arkitektur
 * - Komponentstruktur
 * - Navigationsmetoder
 * - Kompatibilitet
 * 
 * Här skedde en uppdatering för att använda ReactMarkdown och samma stilar 
 * som de andra modalerna för bättre konsistens och läsbarhet.
 */

const SystemModal = ({ isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    // Definiera systeminfon som markdown för att använda med ReactMarkdown
    const systemMarkdown = `
# Systeminformation

## Övergripande funktionalitet
Detta är ett utbildningsprogram om Röda Korsets arbete med flyktingströmmar, utvecklat som en React-applikation. Programmet innehåller informationssektion, interaktiv visualisering, quiz och lösningsförslag.

## Teknisk arkitektur

| Komponent | Version/Beskrivning |
|-----------|---------------------|
| React | 18.2.0 |
| React Router | 6.22.0 |
| Vite | 5.0.8 |
| Leaflet | 1.9.4 |
| CSS-moduler | Komponentbaserad styling |
| React Markdown | 9.0.1 |

## Komponentstruktur
Applikationen följer en komponentbaserad arkitektur med:

- Layout-komponenter (Header, Footer, Navigation)
- Innehållskomponenter (Uppgift, Tips, Visualisering, Quiz, Lösning)
- Hjälpkomponenter (Modaler, Knappar, Interaktiva element)
- Context för tillståndshantering (NavigationContext)

## Navigationsmetoder
Programmet stödjer två olika navigationsmetoder som kan växlas via knappen i footern:

1. **Router-baserad navigering:** Använder React Router med HashRouter för att hantera navigering. Möjliggör direkt URL-åtkomst till innehåll och fungerar med webbläsarens historik.
2. **State-baserad navigering:** Använder React state och anpassade händelser för att visa/dölja innehåll. Enklare struktur men utan URL-fördelar.

Båda metoderna erbjuder samma funktionalitet, men är implementerade på olika sätt för att demonstrera olika tekniker.

### Viktigt att tänka på vid implementering av dubbla navigationssystem:

- **Hash vs URL:** Vid state-navigering döljs hash-tecknet (#) i URL:en genom att använda history API, vilket ger en renare URL.
- **Tillståndsseparation:** Håll navigeringslogiken separat från innehållslogiken genom att använda kontext.
- **Konsekvent API:** Skapa ett enhetligt navigations-API som fungerar med båda metoderna för att undvika duplicerad kod.
- **Tillgänglighet:** Säkerställ att båda navigationsmetoderna stödjer tillgänglighet och korrekt fokushantering.
- **Historikhantering:** Router-navigering stödjer naturligt webbläsarens historik, men med state-navigering måste historik hanteras manuellt om det behövs.
- **Delningsbara länkar:** Router-navigation tillåter delningsbara länkar, vilket inte är möjligt med ren state-baserad navigering.
- **Prestanda:** State-navigering kan vara något snabbare då den inte behöver hantera URL-ändringar, men skillnaden är oftast minimal.

## Dataflödesschema

1. Användarinteraktion
2. Navigeringsval (Router/State)
3. Innehållsrendering
4. Interaktiva element (Quiz, Karta)
5. Resultatvisning (lösning)

## Kompatibilitet
Programmet är optimerat för moderna webbläsare (Chrome, Firefox, Safari, Edge) och är responsivt för användning på både desktop och mobila enheter.

Applikationen kan distribueras som en statisk webbsida tack vare HashRouter-konfigurationen.

## Utvecklare
Detta utbildningsmaterial är framtaget som en del av ett pedagogiskt projekt för att demonstrera olika tekniker för webbutveckling med React.

© 2024 Svenska Röda Korset (för bildmaterial och varumärke).
`;

    setMarkdownContent(systemMarkdown);
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
          <h2>Systeminformation</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Stäng modal">
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.markdownContainer}>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemModal; 
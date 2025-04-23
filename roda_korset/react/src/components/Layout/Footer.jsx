import { useNavigation } from '../../context/NavigationContext';
import styles from './Footer.module.css';
import logo from '../../assets/redcross-logo.svg';
import reactLogo from '../../assets/logos/react-logo.svg';
import viteLogo from '../../assets/logos/vite-logo.svg';

/**
 * Footer-komponent för applikationens nedre del
 * Version: 1.5.1
 * 
 * Denna komponent visar:
 * - Copyright-information med länk till organisationen
 * - Programversion
 * - Utvecklingsverktygslogotyper (Vite och React) med förklarande text
 * - Knappar för systeminformation, ursprunglig prompt och utvecklad prompt
 * - Kontaktlänk
 * - Växlingsknapp för navigationsmetod
 * 
 * Här skedde en uppdatering för att lägga till en förklarande text innan utvecklingsverktygens
 * logotyper och ändra ordningen till Vite först, sedan React.
 */

const Footer = ({ onOpenSystemModal, onOpenPromptModal, onOpenDevelopedPromptModal }) => {
  const { useRouterNavigation, toggleNavigationType } = useNavigation();
  // Konstant för applikationens version från package.json
  const appVersion = "v1.0.0"; 

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <div className={styles.footerLogo}>
            <img 
              src={logo}
              alt="Röda Korset logotyp" 
              className={styles.smallLogo} 
            />
            <a 
              href="https://www.rodakorset.se/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              © 2005 Svenska Röda Korset
            </a>
            <span className={styles.versionText}>| {appVersion}</span>
          </div>
          
          <div className={styles.techLogosWrapper}>
            <span className={styles.techLabel}>Byggd med:</span>
            <div className={styles.techLogos}>
              <a 
                href="https://vitejs.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.logoLink}
                title="Vite - Snabbt byggverktyg"
              >
                <img 
                  src={viteLogo} 
                  alt="Vite logotyp" 
                  className={styles.techLogo} 
                />
              </a>
              <a 
                href="https://react.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.logoLink}
                title="React - JavaScript-bibliotek för användargränssnitt"
              >
                <img 
                  src={reactLogo} 
                  alt="React logotyp" 
                  className={styles.techLogo} 
                />
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerLinks}>
          <button 
            onClick={onOpenSystemModal}
            className={styles.footerButton}
          >
            Systeminformation
          </button>
          
          <button 
            onClick={onOpenPromptModal}
            className={styles.footerButton}
          >
            Ursprunglig prompt
          </button>
          
          <button 
            onClick={onOpenDevelopedPromptModal}
            className={styles.footerButton}
          >
            Utvecklad prompt
          </button>
          
          <a 
            href="https://www.rodakorset.se/om-oss/kontakta-oss/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Kontakt
          </a>
        </div>
      </div>
      
      <div className={styles.navigationToggle}>
        <button 
          onClick={toggleNavigationType}
          className={styles.toggleButton}
          aria-label="Byt navigationsmetod"
        >
          <i className="fas fa-exchange-alt"></i>
          {useRouterNavigation 
            ? 'Byt till state-navigering' 
            : 'Byt till router-navigering'
          }
        </button>
      </div>
    </footer>
  );
};

export default Footer; 
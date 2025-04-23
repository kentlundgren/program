import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigation } from '../../context/NavigationContext';
import styles from './Navigation.module.css';

/**
 * Navigation-komponent för applikationens meny
 * Version: 1.0.0
 * 
 * Denna komponent har två olika navigationsmetoder:
 * 1. Router-baserad (använder React Router)
 * 2. State-baserad (använder intern state för att visa/dölja innehåll)
 * 
 * Baserat på värdet i NavigationContext används rätt navigationsmetod.
 */

// Navigeringslänkar och deras metadata
const navLinks = [
  { id: 'uppgift', path: '/', label: 'Uppgiftsbeskrivning', icon: 'fas fa-tasks' },
  { id: 'tips', path: '/tips', label: 'Tips', icon: 'fas fa-lightbulb' },
  { id: 'visualisering', path: '/visualisering', label: 'Visualisering', icon: 'fas fa-chart-bar' },
  { id: 'quiz', path: '/quiz', label: 'Quiz', icon: 'fas fa-question-circle' },
  { id: 'losning', path: '/losning', label: 'Lösning', icon: 'fas fa-key' }
];

const Navigation = () => {
  // Hämta navigationsinställningar från context
  const { useRouterNavigation } = useNavigation();
  
  // State för aktiv flik (används endast i state-baserad navigering)
  const [activeTab, setActiveTab] = useState('uppgift');
  
  // Event handler för state-baserad navigering
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Utlös en anpassad händelse så att innehållet kan uppdateras
    window.dispatchEvent(new CustomEvent('tabChange', { 
      detail: { tabId } 
    }));
  };

  // Renderingsfunktion för router-baserad navigering
  const renderRouterNavigation = () => (
    <nav className={styles.navigation} aria-label="Huvudnavigering">
      <ul className={styles.tabs}>
        {navLinks.map(link => (
          <li key={link.id}>
            <NavLink 
              to={link.path} 
              className={({ isActive }) => 
                isActive ? `${styles.tab} ${styles.active}` : styles.tab
              }
              aria-current={({ isActive }) => isActive ? 'page' : undefined}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Renderingsfunktion för state-baserad navigering
  const renderStateNavigation = () => (
    <nav className={styles.navigation} aria-label="Huvudnavigering">
      <ul className={styles.tabs}>
        {navLinks.map(link => (
          <li key={link.id}>
            <button 
              className={activeTab === link.id ? `${styles.tab} ${styles.active}` : styles.tab}
              onClick={() => handleTabClick(link.id)}
              aria-current={activeTab === link.id ? 'page' : undefined}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Rendera rätt navigationstyp baserat på inställning
  return useRouterNavigation ? renderRouterNavigation() : renderStateNavigation();
};

export default Navigation; 
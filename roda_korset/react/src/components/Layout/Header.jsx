import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
import styles from './Header.module.css';
import logo from '../../assets/redcross-logo.svg';

/**
 * Header-komponent för applikationens övre del
 * Version: 1.0.0
 * 
 * Denna komponent visar:
 * - Röda Korsets logotyp
 * - Applikationens titel
 * - Navigationsmeny
 */

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logoLink}>
          <img 
            src={logo}
            alt="Röda Korset logotyp" 
            className={styles.logo} 
          />
          <h1>Röda Korset - Utbildningsmaterial</h1>
        </Link>
      </div>
      
      <Navigation />
    </header>
  );
};

export default Header; 
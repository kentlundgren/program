import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';
import './styles/PageStyles.css';
import { NavigationProvider } from './context/NavigationContext';

/**
 * Huvudingångspunkt för React-applikationen
 * Version: 1.2.0
 * 
 * Denna fil konfigurerar applikationen med:
 * - HashRouter för URL-routing (för statisk hosting)
 * - NavigationProvider för hantering av navigeringsmetoder
 * 
 * Här skedde en uppdatering för att återställa funktionaliteten efter problem
 * med routing-hanteringen.
 */

// Vi använder HashRouter för att vara kompatibla med statisk hosting
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </HashRouter>
  </React.StrictMode>,
); 
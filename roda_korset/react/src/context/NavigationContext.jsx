import { createContext, useContext, useState, useEffect } from 'react';

/**
 * NavigationContext
 * Version: 1.1.0
 * 
 * Denna kontext hanterar valet av navigationsmetod:
 * - Router-baserad navigation: Använder React Router och URL-baserad navigation
 * - State-baserad navigation: Använder React state för att visa/dölja komponenter
 * 
 * Här skedde en uppdatering för att dölja hash-tecknet (#) i URL:en vid state-navigering
 */

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  // Default är router-baserad navigation
  const [useRouterNavigation, setUseRouterNavigation] = useState(true);
  
  // Läs in navigationstyp från localStorage vid mount
  useEffect(() => {
    const savedNavType = localStorage.getItem('rodaKorset_useRouterNavigation');
    if (savedNavType !== null) {
      setUseRouterNavigation(savedNavType === 'true');
    }
  }, []);
  
  // Effekt som hanterar hash-tecknet i URL:en
  useEffect(() => {
    if (!useRouterNavigation) {
      // Om vi använder state-navigering, ta bort hash från URL:en
      if (window.location.hash) {
        // Använd history API för att dölja hash utan sidladdning
        window.history.pushState('', document.title, window.location.pathname);
      }
    }
  }, [useRouterNavigation]);
  
  // Växla mellan navigation-typerna
  const toggleNavigationType = () => {
    const newValue = !useRouterNavigation;
    setUseRouterNavigation(newValue);
    localStorage.setItem('rodaKorset_useRouterNavigation', String(newValue));
    
    if (!newValue) {
      // Om vi byter till state-navigering, ta bort hash från URL:en
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Om vi byter till router-navigering, lägg till hash för startsidan
      window.location.hash = '/';
    }
  };
  
  return (
    <NavigationContext.Provider value={{ useRouterNavigation, toggleNavigationType }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook för att använda navigationskontexten
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation måste användas inom en NavigationProvider');
  }
  return context;
};

export default NavigationContext; 
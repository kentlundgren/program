import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import SystemModal from '../SystemModal/SystemModal';
import PromptModal from '../PromptModal/PromptModal';
import DevelopedPromptModal from '../Modals/DevelopedPromptModal';
import styles from './Layout.module.css';

/**
 * Layout-komponent för att skapa en konsekvent layout för applikationen
 * Version: 1.3.0
 * 
 * Denna komponent hanterar:
 * - Header med navigation
 * - Main-innehåll
 * - Footer
 * - System-modal (öppnas/stängs via state)
 * - Ursprunglig prompt-modal (öppnas/stängs via state)
 * - Utvecklad prompt-modal (öppnas/stängs via state)
 * 
 * Här skedde en uppdatering för att göra modalhanteringen konsekvent genom att
 * skicka isOpen-prop till alla modaler, inklusive PromptModal.
 */

const Layout = ({ children }) => {
  // State för att hantera om system-modalen är öppen eller stängd
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  
  // State för att hantera om prompt-modalen är öppen eller stängd
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  
  // State för att hantera om den utvecklade prompt-modalen är öppen eller stängd
  const [isDevelopedPromptModalOpen, setIsDevelopedPromptModalOpen] = useState(false);

  // Handler för att öppna system-modalen
  const handleOpenSystemModal = () => {
    setIsSystemModalOpen(true);
  };

  // Handler för att stänga system-modalen
  const handleCloseSystemModal = () => {
    setIsSystemModalOpen(false);
  };
  
  // Handler för att öppna prompt-modalen
  const handleOpenPromptModal = () => {
    setIsPromptModalOpen(true);
  };

  // Handler för att stänga prompt-modalen
  const handleClosePromptModal = () => {
    setIsPromptModalOpen(false);
  };
  
  // Handler för att öppna utvecklad prompt-modal
  const handleOpenDevelopedPromptModal = () => {
    setIsDevelopedPromptModalOpen(true);
  };

  // Handler för att stänga utvecklad prompt-modal
  const handleCloseDevelopedPromptModal = () => {
    setIsDevelopedPromptModalOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Header />
      
      <main className={styles.main}>
        {children}
      </main>
      
      <Footer 
        onOpenSystemModal={handleOpenSystemModal}
        onOpenPromptModal={handleOpenPromptModal}
        onOpenDevelopedPromptModal={handleOpenDevelopedPromptModal}
      />
      
      {isSystemModalOpen && (
        <SystemModal 
          isOpen={isSystemModalOpen}
          onClose={handleCloseSystemModal}
        />
      )}
      
      {isPromptModalOpen && (
        <PromptModal 
          isOpen={isPromptModalOpen}
          onClose={handleClosePromptModal} 
        />
      )}
      
      {isDevelopedPromptModalOpen && (
        <DevelopedPromptModal 
          isOpen={isDevelopedPromptModalOpen}
          onClose={handleCloseDevelopedPromptModal} 
        />
      )}
    </div>
  );
};

export default Layout; 
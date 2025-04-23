import { useState, useEffect, useRef } from 'react';
import { developedPrompt } from '../../utils/developedPrompt';
import styles from './Modal.module.css';
import ReactMarkdown from 'react-markdown';

/**
 * Modal som visar den utvecklade prompten
 * Version: 1.1.0
 * 
 * Här skedde en uppdatering för att säkerställa att all information från developedPrompt.js 
 * visas korrekt, särskilt under rubrikerna "Sidstruktur och innehåll" och 
 * "Interaktiva element och funktioner".
 */
const DevelopedPromptModal = ({ isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    // Använd den exporterade developedPrompt direkt
    setMarkdownContent(developedPrompt);
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
          <h2>Utvecklad Prompt</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Stäng modal">
            &times;
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.markdownContainer}>
            <ReactMarkdown>{markdownContent}</ReactMarkdown>
            <div className={styles.noteContainer}>
              <p className={styles.note}>
                <strong>Notera:</strong> Detta är en mer strukturerad och detaljerad prompt som skulle kunna användas för att skapa detta projekt från början med tydliga krav och specifikationer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevelopedPromptModal; 
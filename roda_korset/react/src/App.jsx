import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigation } from './context/NavigationContext';
import Layout from './components/Layout/Layout';
import UppgiftPage from './pages/UppgiftPage';
import TipsPage from './pages/TipsPage';
import VisualiseringPage from './pages/VisualiseringPage';
import QuizPage from './pages/QuizPage';
import LosningPage from './pages/LosningPage';

/**
 * Huvudkomponent för applikationen
 * Version: 1.3.0
 * 
 * Denna komponent hanterar:
 * 1. Router-baserad navigering med React Router
 * 2. State-baserad navigering med visning av aktiv flik
 * 3. Quiz-status hantering inklusive återställning
 * 
 * Här skedde en uppdatering för att lägga till återställningsfunktion
 * för quiz-status som tillåter att lösningen döljs igen.
 */

const App = () => {
  // Hämta navigationsinställning från context
  const { useRouterNavigation } = useNavigation();
  
  // State för aktiv flik vid state-baserad navigering
  const [activeTab, setActiveTab] = useState('uppgift');
  
  // State för om quiz är godkänt
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Effekt för att lyssna på tab-ändringar från Navigation-komponenten
  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail.tabId);
    };
    
    window.addEventListener('tabChange', handleTabChange);
    
    // Ta bort event listener vid unmount
    return () => {
      window.removeEventListener('tabChange', handleTabChange);
    };
  }, []);
  
  // Kontrollera om quiz redan är avklarat vid laddning
  useEffect(() => {
    const isQuizCompleted = localStorage.getItem('rodaKorset_quizCompleted') === 'true';
    if (isQuizCompleted) {
      setQuizPassed(true);
    }
  }, []);
  
  // Lyssna på förändringar i localStorage för att hantera återställning
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'rodaKorset_quizCompleted' || event.key === null) {
        const isQuizCompleted = localStorage.getItem('rodaKorset_quizCompleted') === 'true';
        setQuizPassed(isQuizCompleted);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Funktion för att markera quiz som godkänt
  const handleQuizPassed = () => {
    setQuizPassed(true);
    localStorage.setItem('rodaKorset_quizCompleted', 'true');
  };
  
  // Funktion för att återställa quiz-status (används av LosningPage)
  const handleResetQuiz = () => {
    setQuizPassed(false);
    localStorage.removeItem('rodaKorset_quizCompleted');
  };

  // Renderingsfunktion för router-baserad navigering
  const renderRouterNavigation = () => (
    <Routes>
      <Route path="/" element={<UppgiftPage />} />
      <Route path="/tips" element={<TipsPage />} />
      <Route path="/visualisering" element={<VisualiseringPage />} />
      <Route path="/quiz" element={<QuizPage onQuizPassed={handleQuizPassed} />} />
      <Route path="/losning" element={<LosningPage quizPassed={quizPassed} onResetQuiz={handleResetQuiz} />} />
    </Routes>
  );

  // Renderingsfunktion för state-baserad navigering
  const renderStateNavigation = () => {
    switch (activeTab) {
      case 'uppgift':
        return <UppgiftPage />;
      case 'tips':
        return <TipsPage />;
      case 'visualisering':
        return <VisualiseringPage />;
      case 'quiz':
        return <QuizPage onQuizPassed={handleQuizPassed} />;
      case 'losning':
        return <LosningPage quizPassed={quizPassed} onResetQuiz={handleResetQuiz} />;
      default:
        return <UppgiftPage />;
    }
  };

  return (
    <Layout>
      {useRouterNavigation ? renderRouterNavigation() : renderStateNavigation()}
    </Layout>
  );
};

export default App; 
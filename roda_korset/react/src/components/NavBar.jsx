import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';
import logo from '../assets/redcross-logo.svg';
import '../styles/NavBar.css';

/**
 * NavBar - Huvudnavigeringskomponent
 * Version: 1.1.0
 * 
 * Denna komponent visar navigationsmenyn och hanterar både router-baserad
 * och state-baserad navigation beroende på inställningar från NavigationContext
 * 
 * Här används extern CSS-stilmall från ../styles/NavBar.css för styling
 */
const NavBar = ({ activeTab, onChangeTab, quizPassed }) => {
  const { useRouterNavigation, toggleNavigationType } = useNavigation();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Stänger mobil-menyn när en ny sida laddas
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Navigationslänkar som ska visas
  const navLinks = [
    { id: 'home', path: '/', label: 'Hem', requiresQuiz: false },
    { id: 'about', path: '/about', label: 'Om Röda Korset', requiresQuiz: false },
    { id: 'quiz', path: '/quiz', label: 'Quiz', requiresQuiz: false },
    { id: 'courses', path: '/courses', label: 'Kurser', requiresQuiz: true },
    { id: 'volunteer', path: '/volunteer', label: 'Bli volontär', requiresQuiz: true },
    { id: 'contact', path: '/contact', label: 'Kontakt', requiresQuiz: false },
  ];

  // Filtrera bort länkar som kräver quiz om användaren inte har klarat quizet
  const filteredLinks = navLinks.filter(link => !link.requiresQuiz || quizPassed);

  // Hantera klick på navigation vid state-baserad navigation
  const handleTabClick = (tabId) => {
    if (!useRouterNavigation) {
      onChangeTab(tabId);
      setMenuOpen(false);
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logotyp med länk till startsidan */}
        <div className="navbar-logo">
          {useRouterNavigation ? (
            <Link to="/" onClick={() => handleTabClick('home')}>
              <img src={logo} alt="Röda Korset Logo" />
            </Link>
          ) : (
            <a href="#" onClick={() => handleTabClick('home')}>
              <img src={logo} alt="Röda Korset Logo" />
            </a>
          )}
        </div>

        {/* Hamburgermenyn (för mobilenhet) */}
        <div 
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigationslänkar */}
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          {filteredLinks.map((link) => (
            <li key={link.id}>
              {useRouterNavigation ? (
                <NavLink 
                  to={link.path} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => handleTabClick(link.id)}
                >
                  {link.label}
                </NavLink>
              ) : (
                <a 
                  href="#" 
                  className={activeTab === link.id ? 'active' : ''}
                  onClick={() => handleTabClick(link.id)}
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
          
          {/* Utvecklarläge - växla mellan navigation-metoder */}
          <li className="nav-dev-mode">
            <button onClick={toggleNavigationType} className="nav-toggle-btn">
              {useRouterNavigation ? 'Använd State-nav' : 'Använd Router-nav'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar; 
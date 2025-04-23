// Header.jsx - Komponent för appens header
import React from 'react';

// Header tar emot en titel som prop och visar den
const Header = ({ title }) => {
  return (
    <header className="app-header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Här renderas React-appen till DOM:en
// ReactDOM.createRoot skapar en rot för React-appen i elementet med id 'root'
// Sedan renderas App-komponenten inom React.StrictMode för att upptäcka potentiella problem
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
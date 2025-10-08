import React from 'react';
import { updateFavicon } from './utils/favicon';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Set initial favicon based on saved theme or system preference
const savedTheme = localStorage.getItem('theme');
let initialTheme = 'light';
if (savedTheme) {
  initialTheme = savedTheme;
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  initialTheme = 'dark';
}
updateFavicon(initialTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider> {/* Add ThemeProvider */}
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
import React from 'react';
import { Layers, Moon, Sun } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <a href="#" className="brand-logo">
          <span className="logo-icon">
            <Layers size={22} />
          </span>
          <span className="logo-text">SIH<span>2026</span></span>
        </a>
        
        <nav className="nav-links">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#about" className="nav-link">About</a>
        </nav>
        
        <div className="nav-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="#dashboard" className="btn btn-primary">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}

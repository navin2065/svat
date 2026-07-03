import React, { useState, useEffect } from 'react';
import { Truck, Lock } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('svat_is_logged_in') === 'true';
  });
  const [page, setPage] = useState(() => {
    const loggedIn = localStorage.getItem('svat_is_logged_in') === 'true';
    return loggedIn ? 'dashboard' : 'home';
  });

  // Simple scroll helper
  const handleScrollTo = (id) => {
    setPage('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('svat_is_logged_in', 'true');
    setPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('svat_is_logged_in');
    setPage('home');
  };

  return (
    <>
      {/* Ambient Animated Background Blobs */}
      <div className="bg-blur-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main Top Header Navbar (Hidden in printable/dashboard states to maximize screen room) */}
      {page !== 'dashboard' && (
        <header className="navbar">
          <div className="logo-container" onClick={() => setPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              padding: '4px'
            }}>
              <img src="/logo.png" alt="SVAT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <ul className="nav-links">
            <li>
              <button
                onClick={() => setPage('home')}
                className={`sidebar-link ${page === 'home' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', padding: 0, fontWeight: 500, fontSize: '0.95rem' }}
              >
                Home
              </button>
            </li>
          </ul>

          <div className="nav-actions">
            {isLoggedIn ? (
              <button className="btn-primary" onClick={() => setPage('dashboard')}>
                Dashboard
              </button>
            ) : (
              <button className="btn-outline" onClick={() => setPage('login')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={14} />
                Client Login
              </button>
            )}
          </div>
        </header>
      )}

      {/* Pages Container */}
      {page === 'home' && <LandingPage onNavigate={setPage} />}
      {page === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {page === 'dashboard' && <Dashboard onLogout={handleLogout} />}

      {/* Footer (Hidden in Dashboard View for application-style layout) */}
      {page !== 'dashboard' && (
        <footer className="footer">
          <div>
            <div className="logo-container" style={{ display: 'flex', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '3px'
              }}>
                <img src="/logo.png" alt="SVAT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              © {new Date().getFullYear()} Sree Vaarahi Amman Transports.<br />All rights reserved.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>HQ Address</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              228/1, Amman Nagar,<br />
              Rakkiyapalayam, Avinashi,<br />
              Tirupur - 641 654, Tamil Nadu.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Contact Info</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span><strong>Phone:</strong> +91 96552 37104, +91 9655235088</span>
              <span><strong>Email:</strong> Vaarahitpt104@gmail.com</span>
              <span><strong>Website:</strong> www.sreevaarahiammantransports.com</span>
            </p>
          </div>
        </footer>
      )}
    </>
  );
}

export default App;

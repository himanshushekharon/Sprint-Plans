import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Menu, X, Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme, onLogin, onSignup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="container-full">
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <Layers className="logo-icon" size={28} />
          <span>Sprint Plans</span>
        </div>

        {/* Desktop Menu */}
        <div className="nav-main">
          <div className="nav-links">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="nav-item">
                {link.name}
                <motion.span
                  className="underline"
                  layoutId="underline"
                  initial={false}
                />
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-minimal" onClick={onLogin}>Log In</button>
            <button className="btn-gradient" onClick={onSignup}>Get Started</button>
          </div>
        </div>

        {/* Mobile Toggle & Actions */}
        <div className="navbar-right-mobile">
          <button className="theme-toggle mobile-only" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu glass"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                {link.name}
              </a>
            ))}
            <div className="mobile-btns">
              <button className="btn-minimal" onClick={() => { setIsOpen(false); onLogin(); }}>Log In</button>
              <button className="btn-gradient" onClick={() => { setIsOpen(false); onSignup(); }}>Get Started</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.25rem 0;
          transition: all 0.3s ease;
          background: transparent;
          border-bottom: 1px solid transparent;
        }

        .navbar.scrolled {
          padding: 0.75rem 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: var(--card-shadow);
        }

        html.light .navbar.scrolled {
          background: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .container-full {
          width: 100%;
          padding: 0 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          cursor: pointer;
        }

        .logo-icon {
          color: var(--primary);
          filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        .nav-main {
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .nav-item {
          text-decoration: none;
          color: var(--text-dim);
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          padding: 0.5rem 0;
          transition: var(--transition-smooth);
        }

        .nav-item:hover {
          color: var(--text-main);
        }

        .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--glass-bg);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .nav-item:hover .underline {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.3rem;
          border-radius: 50px;
          border: 1px solid var(--glass-border);
          transition: var(--transition-smooth);
        }

        html.light .nav-actions {
          background: rgba(0, 0, 0, 0.03);
        }

        .nav-actions:hover {
            border-color: rgba(99, 102, 241, 0.2);
        }

        .theme-toggle {
          background: transparent;
          border: none;
          color: var(--text-dim);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .theme-toggle:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.08);
          transform: rotate(15deg);
        }

        html.light .theme-toggle:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .btn-minimal {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-main);
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 50px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-minimal:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        html.light .btn-minimal:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .btn-gradient {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white !important;
          padding: 0.6rem 1.4rem;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
        }

        .btn-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
        }

        .navbar-right-mobile {
          display: none;
          align-items: center;
          gap: 1rem;
        }

        .mobile-only { display: none; }

        .mobile-toggle {
          cursor: pointer;
          color: var(--text-main);
          padding: 0.5rem;
        }

        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 5%;
          right: 5%;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          margin-top: 1rem;
          border-radius: var(--border-radius);
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          box-shadow: var(--card-shadow);
        }

        html.light .mobile-menu {
          background: rgba(255, 255, 255, 0.95);
        }

        .mobile-menu a {
          text-decoration: none;
          color: var(--text-main);
          font-size: 1.2rem;
          font-weight: 600;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--glass-border);
        }

        .mobile-btns {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (max-width: 992px) {
          .nav-main { display: none; }
          .navbar-right-mobile { display: flex; }
          .mobile-menu { display: flex; }
          .mobile-only { display: flex; }
          .navbar { padding: 1rem 0; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;

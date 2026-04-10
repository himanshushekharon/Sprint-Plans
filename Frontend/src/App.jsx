import React, { useEffect, useState, Suspense, lazy, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import { useData } from './context/DataContext';
import { useAuth, useUser } from '@clerk/clerk-react';

const Features = lazy(() => import('./components/Features'));
const About = lazy(() => import('./components/About'));
const Footer = lazy(() => import('./components/Footer'));
const Particles = lazy(() => import('./components/Particles'));

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('themePreference') || 'dark';
  });
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'login', 'signup', 'dashboard'
  const [user, setUser] = useState({ name: '' });
  const requestRef = useRef();
  const { loadUserData, clearUserData } = useData();

  const { isSignedIn, isLoaded } = useAuth();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Inside App Component:

  // Load user session using Clerk
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || 'user@example.com';
      const name = clerkUser.fullName || email.split('@')[0];
      
      setUser({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        imageUrl: clerkUser.imageUrl
      });
      
      loadUserData(email, name.charAt(0).toUpperCase() + name.slice(1));
      setCurrentPage('dashboard');
    } else if (isLoaded && !isSignedIn && currentPage === 'dashboard') {
      setCurrentPage('landing');
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themePreference', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    // Optimized Parallax effect on mouse move using requestAnimationFrame
    const handleMouseMove = (e) => {
      if (requestRef.current) return;

      requestRef.current = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const gradient = document.querySelector('.bg-gradient');
        if (gradient) {
          gradient.style.background = `
            radial-gradient(circle at ${20 + x * 10}% ${20 + y * 10}%, rgba(99, 102, 241, 0.15), transparent 40%),
            radial-gradient(circle at ${80 - x * 10}% ${80 - y * 10}%, rgba(168, 85, 247, 0.15), transparent 40%),
            var(--bg-dark)
          `;
        }
        requestRef.current = undefined;
      });
    };

    // Bubble Animation Click Effect
    const createBubble = (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const bubble = document.createElement('span');
      bubble.classList.add('bubble-effect');
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;

      btn.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', createBubble);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', createBubble);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Simple Page Navigation Helper
  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-wrapper">
      {/* Persistent global effects */}

      <div className="bg-grid"></div>

      {currentPage === 'landing' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <Suspense fallback={null}>
            <Particles
              particleColors={["#ffffff", "#6366f1", "#a855f7"]}
              particleCount={100}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
              pixelRatio={1}
            />
          </Suspense>
        </div>
      )}

      {currentPage === 'landing' && (
        <>
          <Navbar
            theme={theme}
            toggleTheme={toggleTheme}
            onLogin={() => navigateTo('login')}
            onSignup={() => navigateTo('signup')}
          />
          <main style={{ position: 'relative', zIndex: 1 }}>
            <Hero onGetStarted={() => navigateTo('signup')} />
            <Suspense fallback={<div style={{ height: '50vh' }}></div>}>
              <Features />
              <About />
            </Suspense>

            {/* Immersive CTA Section */}
            <section className="cta-section">
              <div className="container-immersive">
                <div className="cta-card glass">
                  <h2>Ready to transform your <span className="accent-text">workflow?</span></h2>
                  <p>Join thousands of high-performing teams that use Sprint Plans to ship faster, better, and with more joy.</p>
                  <div className="cta-btns">
                    <button className="btn-primary" onClick={() => navigateTo('signup')}>Get Started Now</button>
                  </div>
                  <div className="cta-glow-1"></div>
                  <div className="cta-glow-2"></div>
                </div>
              </div>
            </section>
          </main>
          <Suspense fallback={<div style={{ height: '300px' }}></div>}>
            <Footer onNavigate={navigateTo} />
          </Suspense>
        </>
      )}

      {currentPage === 'login' && (
        <Login
          onSignup={() => navigateTo('signup')}
          onHome={() => navigateTo('landing')}
          onSuccess={() => navigateTo('dashboard')}
          setUser={setUser}
        />
      )}

      {currentPage === 'signup' && (
        <Signup
          onLogin={() => navigateTo('login')}
          onHome={() => navigateTo('landing')}
          onSuccess={() => navigateTo('dashboard')}
          setUser={setUser}
        />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onLogout={() => {
            localStorage.removeItem('loggedInUser');
            clearUserData();
            navigateTo('landing');
          }}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
        />
      )}

      <style>{`
        .app-wrapper {
          overflow-x: hidden;
          transition: background-color 0.3s ease;
          width: 100vw;
        }
        main {
          min-height: 100vh;
          width: 100%;
        }
        
        .container-immersive {
            width: 100%;
            padding: 0 5%;
        }

        .cta-section {
          padding: 15vh 0;
          width: 100%;
        }
        .cta-card {
          width: 100%;
          padding: 8rem 4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
          border-radius: var(--border-radius);
        }
        .cta-card h2 { 
            font-size: clamp(2.5rem, 6vw, 5rem); 
            margin: 0; 
            color: var(--text-main); 
            line-height: 1.1;
        }
        .cta-card p { 
            font-size: 1.5rem; 
            max-width: 800px; 
            color: var(--text-dim); 
        }
        .cta-btns { display: flex; gap: 1rem; margin-top: 1rem; }
        
        .cta-glow-1 {
            position: absolute;
            top: -20%;
            left: -10%;
            width: 40%;
            height: 100%;
            background: transparent;
            pointer-events: none;
        }
        .cta-glow-2 {
            position: absolute;
            bottom: -20%;
            right: -10%;
            width: 40%;
            height: 100%;
            background: transparent;
            pointer-events: none;
        }

        @media (max-width: 768px) {
          .cta-card { padding: 4rem 2rem; border-radius: var(--border-radius); }
          .cta-card h2 { font-size: 2.5rem; }
          .cta-card p { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
}

export default App;

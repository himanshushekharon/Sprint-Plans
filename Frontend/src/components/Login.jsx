import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Layers, Github, Chrome } from 'lucide-react';
import { useData } from '../context/DataContext';

const Login = ({ onSignup, onHome, onSuccess, setUser }) => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { loadUserData } = useData();

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            // Save auth token and user
            localStorage.setItem('token', data.token);
            localStorage.setItem('loggedInUser', data.email);

            // Keep initializing empty arrays in localStorage if they don't exist for the DataContext
            if (!localStorage.getItem(data.email)) {
                localStorage.setItem(data.email, JSON.stringify({
                    email: data.email,
                    projects: [],
                    tasks: [],
                    teams: [],
                    members: []
                }));
            }

            const name = data.name || data.email.split('@')[0];

            if (setUser) {
                setUser({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    email: data.email
                });
            }

            loadUserData(data.email, name);

            // Trigger dashboard navigation on submit
            if (onSuccess) onSuccess();

        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="bg-grid"></div>

            <div className="login-container">
                {/* Left Side: Visual/Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="login-visual"
                >
                    <div className="logo-section" onClick={onHome} style={{ cursor: 'pointer' }}>
                        <Layers className="logo-icon" size={32} />
                        <h2>Sprint Plans</h2>
                    </div>

                    <div className="visual-content">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Welcome back to <br />
                            <span className="accent-text">the future of work.</span>
                        </motion.h1>
                        <p className="visual-desc">Access your dashboard, manage your team, and accelerate your productivity in one place.</p>
                    </div>

                    <div className="visual-footer">
                        <p>© 2026 Sprint Plans Inc. All rights reserved.</p>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="login-form-section"
                >
                    <div className="glass-card login-card">
                        <div className="form-header">
                            <h3>Welcome back</h3>
                            <p>Enter your credentials to access your account.</p>
                        </div>

                        {errorMsg && (
                            <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '10px', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '14px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                {errorMsg}
                            </div>
                        )}

                        <div className="social-login">
                            <button className="social-btn"><Chrome size={18} /> Google</button>
                            <button className="social-btn"><Github size={18} /> GitHub</button>
                        </div>

                        <div className="divider"><span>Or continue with email</span></div>

                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john@example.com"
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>
                                    <div className="label-row">
                                        <div className="label-left"><Lock size={16} /> Password</div>
                                        <a href="#" className="forgot-link">Forgot?</a>
                                    </div>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    onChange={handleInput}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary login-btn" disabled={loading}>
                                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                                {!loading && <ArrowRight size={18} />}
                            </button>
                        </form>

                        <div className="form-footer">
                            <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSignup(); }}>Create one free</a></p>
                            <button
                                className="back-link"
                                onClick={onHome}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-dim)',
                                    marginTop: '1.5rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style>{`
                .login-page {
                    min-height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background: var(--bg-dark);
                    color: var(--text-main);
                }

                .login-container {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                    z-index: 10;
                }

                .login-visual {
                    flex: 1;
                    padding: 4rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: var(--glass-bg);
                    border-right: 1px solid var(--glass-border);
                }

                .logo-section { display: flex; align-items: center; gap: 1rem; }
                .logo-section h2 { font-size: 1.5rem; margin: 0; }
                .logo-icon { color: var(--primary); }

                .visual-content h1 {
                    font-size: 3.5rem;
                    line-height: 1.2;
                    margin-bottom: 1.5rem;
                }
                .visual-desc {
                    color: var(--text-dim);
                    font-size: 1.2rem;
                    max-width: 500px;
                    line-height: 1.6;
                }

                .visual-footer p { font-size: 0.9rem; color: rgba(148, 163, 184, 0.5); }

                .login-form-section {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: var(--bg-dark);
                }

                .login-card {
                    width: 100%;
                    max-width: 480px;
                    padding: 3.5rem 3rem;
                    background: rgba(var(--bg-rgb), 0.5);
                    
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius);
                }

                .form-header { text-align: center; margin-bottom: 2.5rem; }
                .form-header h3 { font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; }
                .form-header p { color: var(--text-dim); }

                .social-login {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }
                .social-btn {
                    padding: 0.8rem;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    font-weight: 600;
                    transition: var(--transition-smooth);
                }
                .social-btn:hover {
                    background: var(--glass-hover);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                }

                .divider {
                    text-align: center;
                    border-bottom: 1px solid var(--glass-border);
                    line-height: 0.1em;
                    margin: 2rem 0;
                    color: var(--text-dim);
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 700;
                }
                .divider span { background: var(--bg-dark); padding: 0 1.5rem; }

                .login-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .input-group { display: flex; flex-direction: column; gap: 0.6rem; }
                .label-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
                .forgot-link { font-size: 0.8rem; color: var(--primary); text-decoration: none; }
                .forgot-link:hover { text-decoration: underline; }

                .input-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-dim);
                }
                .input-group input {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    padding: 1.1rem;
                    border-radius: var(--border-radius);
                    color: var(--text-main);
                    font-family: inherit;
                    transition: all 0.3s ease;
                }
                [data-theme='light'] .input-group input {
                    background: rgba(0, 0, 0, 0.03);
                }
                .input-group input::placeholder {
                    color: var(--text-dim);
                    opacity: 0.5;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(99, 102, 241, 0.05);
                    box-shadow: 0 0 0 4px var(--primary-glow);
                    transform: translateY(-2px);
                }

                .login-btn {
                    width: 100%;
                    justify-content: center;
                    padding: 1.1rem;
                    font-size: 1rem;
                    border-radius: var(--border-radius);
                    margin-top: 1rem;
                    margin-bottom: 1.5rem;
                }

                .form-footer { text-align: center; color: var(--text-dim); font-size: 0.95rem; }
                .form-footer a { color: var(--primary); text-decoration: none; font-weight: 600; }
                .form-footer a:hover { text-decoration: underline; }

                @media (max-width: 1100px) { .login-visual { display: none; } }
                @media (max-width: 600px) { .login-card { padding: 2.5rem 1.5rem; } }
            `}</style>
        </div>
    );
};

export default Login;

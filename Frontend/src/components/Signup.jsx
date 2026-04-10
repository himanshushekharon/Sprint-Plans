import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Layers, Users } from 'lucide-react';
import { SignUp } from '@clerk/clerk-react';

const Signup = ({ onLogin, onHome }) => {
    return (
        <div className="signup-page">

            <div className="bg-grid"></div>

            <div className="signup-container">
                {/* Left Side: Visual/Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="signup-visual"
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
                            Build the future <br />
                            <span className="accent-text">faster than ever.</span>
                        </motion.h1>
                        <ul className="benefits-list">
                            <li><Zap size={20} /> Real-time collaboration</li>
                            <li><ShieldCheck size={20} /> Enterprise-grade security</li>
                            <li><Users size={20} /> Advanced team management</li>
                        </ul>
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
                    className="signup-form-section"
                >
                    <SignUp routing="hash" />
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
                </motion.div>
            </div>

            <style>{`
                .signup-page {
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

                .signup-container {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                    z-index: 10;
                }

                /* Visual Side */
                .signup-visual {
                    flex: 1;
                    padding: 4rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background: var(--glass-bg);
                    border-right: 1px solid var(--glass-border);
                }

                .logo-section {
                    display: flex;
                    align-items: center; gap: 1rem;
                }
                .logo-section h2 { font-size: 1.5rem; margin: 0; }
                .logo-icon { color: var(--primary); }

                .visual-content h1 {
                    font-size: 3.5rem;
                    line-height: 1.2;
                    margin-bottom: 2rem;
                }

                .benefits-list {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .benefits-list li {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 1.1rem;
                    color: var(--text-dim);
                }
                .benefits-list li svg { color: var(--primary); }

                .visual-footer p {
                    font-size: 0.9rem;
                    color: rgba(148, 163, 184, 0.5);
                }

                /* Form Section */
                .signup-form-section {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    background: var(--bg-dark);
                }

                .signup-card {
                    width: 100%;
                    max-width: 550px;
                    padding: 3rem;
                    background: rgba(var(--bg-rgb), 0.5);
                    
                    border: 1px solid var(--glass-border);
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }
                .form-header h3 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
                .form-header p { color: var(--text-dim); }

                /* Role Selector */


                /* Form Inputs */
                .input-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                }
                .input-group.full-width { grid-column: span 2; }
                
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
                    padding: 1rem;
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

                .signup-btn {
                    width: 100%;
                    justify-content: center;
                    padding: 1.1rem;
                    font-size: 1rem;
                    border-radius: var(--border-radius);
                    margin-bottom: 1.5rem;
                }

                .form-footer {
                    text-align: center;
                    color: var(--text-dim);
                    font-size: 0.95rem;
                }
                .form-footer a {
                    color: var(--primary);
                    text-decoration: none;
                    font-weight: 600;
                }
                .form-footer a:hover { text-decoration: underline; }

                @media (max-width: 1100px) {
                    .signup-visual { display: none; }
                }
                @media (max-width: 600px) {
                    .input-grid { grid-template-columns: 1fr; }
                    .input-group.full-width { grid-column: span 1; }
                    .signup-card { padding: 2rem 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default Signup;

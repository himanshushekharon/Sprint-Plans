import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Heart } from 'lucide-react';

const About = () => {
    const cards = [
        {
            icon: <Rocket size={32} />,
            title: "Our Mission",
            desc: "To provide professionals with the tools they need to achieve velocity without friction, bridging the gap between design and delivery.",
            delay: 0.2
        },
        {
            icon: <Target size={32} />,
            title: "Our Vision",
            desc: "A world where every idea can be executed seamlessly from inception to deployment, empowering you to build the future.",
            delay: 0.4,
            highlight: true
        },
        {
            icon: <Heart size={32} />,
            title: "Our Values",
            desc: "Transparency, efficiency, and a relentless focus on the user experience. We build for the people behind the projects.",
            delay: 0.6
        }
    ];

    return (
        <section id="about" className="about-section">
            <div className="container-immersive">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="section-header"
                >
                    <h2>About <span className="accent-text">Sprint Plans</span></h2>
                    <p>We are on a mission to redefine how professionals manage projects and build the next generation of digital products with unparalleled speed and elegance.</p>
                </motion.div>

                <div className="about-horizontal-container">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: card.delay, ease: "easeOut" }}
                            className={`glass-card about-card ${card.highlight ? 'highlighted' : ''}`}
                        >
                            <div className="about-icon">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>

                            {/* Decorative Glow */}
                            <div className="card-glow"></div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                .about-section {
                    padding: 15vh 0;
                    position: relative;
                    width: 100vw;
                    left: 50%;
                    right: 50%;
                    margin-left: -50vw;
                    margin-right: -50vw;
                }
                .container-immersive {
                    width: 100%;
                    padding: 0 5%;
                }
                .section-header {
                    text-align: center;
                    margin-bottom: 6rem;
                }
                .section-header h2 {
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.04em;
                    color: var(--text-main);
                }
                .section-header .accent-text {
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.2));
                }
                .section-header p {
                    font-size: clamp(1rem, 2vw, 1.25rem);
                    max-width: 800px;
                    margin: 0 auto;
                }
                .about-horizontal-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 3rem;
                    width: 100%;
                }
                .about-card {
                    padding: 4rem 3rem;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2rem;
                    position: relative;
                    overflow: hidden;
                    border-radius: var(--border-radius); /* Added curves for a more attractive look */
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .about-card:hover {
                    transform: translateY(-2px) scale(1.02);
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow: var(--card-shadow);
                }
                .about-card.highlighted {
                    border-color: var(--primary);
                    background: var(--glass-bg);
                    box-shadow: var(--card-shadow);
                }
                .about-icon {
                    width: 80px;
                    height: 80px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius); /* Slightly softer corners for icons */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    transition: all 0.5s ease;
                }
                .about-card:hover .about-icon {
                    transform: rotate(15deg) scale(1.1);
                    color: white;
                    background: var(--primary);
                }
                .about-card h3 {
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-main);
                }
                .about-card p {
                    font-size: 1.15rem;
                    line-height: 1.7;
                    color: var(--text-dim);
                }
                
                .card-glow {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    pointer-events: none;
                    z-index: 0;
                }
                .about-card:hover .card-glow {
                    opacity: 1;
                }

                @media (max-width: 1200px) {
                    .about-horizontal-container {
                        grid-template-columns: 1fr;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .about-card {
                        padding: 3rem 2rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default About;

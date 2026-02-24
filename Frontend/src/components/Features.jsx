import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, BarChart3, Users, Clock, Globe } from 'lucide-react';

const featureList = [
    {
        icon: <Zap size={28} />,
        title: "Instant Collaboration",
        desc: "Work with your team in real-time with zero latency."
    },
    {
        icon: <Shield size={28} />,
        title: "Enterprise Security",
        desc: "Your data is encrypted with military-grade security."
    },
    {
        icon: <BarChart3 size={28} />,
        title: "Deep Insights",
        desc: "Visualize your progress with advanced charts."
    },
    {
        icon: <Users size={28} />,
        title: "Workload Management",
        desc: "Manage projects and tasks with just a few clicks."
    },
    {
        icon: <Clock size={28} />,
        title: "Time Tracking",
        desc: "Automatically track time spent on tasks easily."
    },
    {
        icon: <Globe size={28} />,
        title: "Global Sync",
        desc: "Access your projects from anywhere in the world."
    }
];

// Duplicate list for infinite scroll effect
const fullFeatureList = [...featureList, ...featureList, ...featureList];

const Features = () => {
    return (
        <section id="features" className="features">
            <div className="section-header-immersive">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2>Everything you need to <span className="accent-text">scale</span></h2>
                    <p>Powerful features to help your team achieve more in less time, without the complexity of traditional tools.</p>
                </motion.div>
            </div>

            <div className="marquee-container-immersive">
                <motion.div
                    className="marquee-content"
                    animate={{ x: ["0%", "-33.33%"] }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    whileHover={{ transition: { duration: 80 } }}
                >
                    {fullFeatureList.map((feature, index) => (
                        <div key={index} className="glass-card feature-card-immersive">
                            <div className="feature-icon-immersive">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Immersive Edge Masks */}
                <div className="mask-left"></div>
                <div className="mask-right"></div>
            </div>

            <style>{`
                .features {
                    padding: 15vh 0;
                    overflow: hidden;
                    position: relative;
                    width: 100vw;
                    left: 50%;
                    right: 50%;
                    margin-left: -50vw;
                    margin-right: -50vw;
                }
                .section-header-immersive {
                    text-align: center;
                    margin-bottom: 6rem;
                    padding: 0 5%;
                }
                .section-header-immersive h2 {
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    font-weight: 800;
                    margin-bottom: 1.5rem;
                    letter-spacing: -0.04em;
                    color: var(--text-main);
                }
                .section-header-immersive .accent-text {
                    background: linear-gradient(135deg, #6366f1, #a855f7);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.2));
                }
                .section-header-immersive p {
                    font-size: clamp(1rem, 2vw, 1.25rem);
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .marquee-container-immersive {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    padding: 4rem 0;
                }
                
                .marquee-content {
                    display: flex;
                    gap: 3rem;
                    width: max-content;
                }
                
                .feature-card-immersive {
                    width: 400px;
                    padding: 4rem 3rem;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .feature-card-immersive:hover {
                    border-color: var(--primary);
                    transform: translateY(-2px) scale(1.05);
                    box-shadow: var(--card-shadow);
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .feature-icon-immersive {
                    width: 65px;
                    height: 65px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    margin-bottom: 0.5rem;
                }
                
                .feature-card-immersive h3 {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-main);
                }
                
                .feature-card-immersive p {
                    font-size: 1.1rem;
                    line-height: 1.7;
                    color: var(--text-dim);
                }
                
                .mask-left, .mask-right {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 20%; /* Wider masks for immersive feel */
                    z-index: 2;
                    pointer-events: none;
                }
                
                .mask-left {
                    left: 0;
                    background: linear-gradient(to right, var(--bg-dark), transparent);
                }
                
                .mask-right {
                    right: 0;
                    background: linear-gradient(to left, var(--bg-dark), transparent);
                }

                @media (max-width: 768px) {
                    .feature-card-immersive { width: 300px; padding: 2.5rem; }
                    .mask-left, .mask-right { width: 15%; }
                    .marquee-content { gap: 1.5rem; }
                }
            `}</style>
        </section>
    );
};

export default Features;

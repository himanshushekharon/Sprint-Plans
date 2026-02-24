import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, Play, Activity, CheckCircle2, Users, Search,
    Bell, ChevronDown, Rocket, Sparkles, LayoutDashboard,
    FolderKanban, MessageSquare, TrendingUp
} from 'lucide-react';

const Hero = ({ onGetStarted }) => {
    const [isDemoActive, setIsDemoActive] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroVisualRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!isDemoActive) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / 50;
        const y = (clientY - innerHeight / 2) / 50;
        setMousePos({ x, y });
    };

    const handleWatchDemo = () => {
        setIsDemoActive(true);
        heroVisualRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    return (
        <section className="hero" onMouseMove={handleMouseMove}>


            <div className="container-immersive">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="hero-content"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="badge-neon"
                    >
                        <span>✨ Sprint v2.0 - Built for the Future</span>
                    </motion.div>

                    <h1>The Next Generation<br />of <span className="accent-text">Productivity</span></h1>
                    <p>
                        Streamline your workflow with AI-powered task management, real-time collaboration,
                        and futuristic data visualization. Built for teams that move at the speed of light.
                    </p>

                    <div className="hero-btns">
                        <button className="btn-neon-glow" onClick={onGetStarted}>
                            Start Building Free <ChevronRight size={18} />
                        </button>
                        <button className="btn-dark-glass" onClick={handleWatchDemo}>
                            <Play size={18} fill="currentColor" /> Watch Demo
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    ref={heroVisualRef}
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    animate={{
                        opacity: 1,
                        y: isDemoActive ? mousePos.y : 0,
                        x: isDemoActive ? mousePos.x : 0,
                        scale: isDemoActive ? 1 : 0.98,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                        scale: { duration: 0.6, ease: "easeOut" }
                    }}
                    style={{ perspective: 2000 }}
                    className={`hero-visual ${isDemoActive ? 'demo-active' : ''}`}
                >
                    <div className={`neon-border-wrapper ${isDemoActive ? 'active reveal-glow' : 'idle'}`}>
                        <div className="dashboard-mockup">
                            {/* Sidebar Mockup */}
                            <div className="mockup-sidebar">
                                <div className="mockup-logo">
                                    <div className="logo-sq"></div>
                                    <span>Sprint</span>
                                </div>
                                <div className="mockup-menu">
                                    <div className="menu-item active"><LayoutDashboard size={14} /> Overview</div>
                                    <div className="menu-item"><FolderKanban size={14} /> Projects</div>
                                    <div className="menu-item"><Activity size={14} /> Analytics</div>
                                    <div className="menu-item"><Users size={14} /> Team</div>
                                    <div className="menu-item"><MessageSquare size={14} /> Messages</div>
                                </div>
                                <div className="sidebar-footer">
                                    <div className="menu-item"><Bell size={14} /> Notifications</div>
                                </div>
                            </div>

                            {/* Main Content Mockup */}
                            <div className="mockup-main">
                                <div className="mockup-topbar">
                                    <span className="page-title">{isDemoActive ? 'Project Analytics' : 'Untitled Dashboard'}</span>
                                    <div className="topbar-right">
                                        <div className="search-pill"><Search size={12} /> Search...</div>
                                        <div className="profile-sq"></div>
                                    </div>
                                </div>

                                <div className="mockup-body-content">
                                    <div className="demo-bg-glow"></div>
                                    <motion.div
                                        key="active-demo"
                                        initial="hidden"
                                        animate={isDemoActive ? "visible" : "hidden"}
                                        variants={{
                                            visible: { transition: { staggerChildren: 0.1 } }
                                        }}
                                        className="mockup-grid"
                                    >
                                        <div className="grid-left">
                                            <div className="status-row">
                                                {[
                                                    { label: 'Efficiency', val: '94%', trend: '+12%', color: '#6366f1', icon: <TrendingUp size={16} />, progress: 94 },
                                                    { label: 'Completed', val: '128', trend: '+8%', color: '#a855f7', icon: <CheckCircle2 size={16} />, progress: 82 },
                                                    { label: 'Active Teams', val: '12', trend: '+2', color: '#10b981', icon: <Users size={16} />, progress: 65 }
                                                ].map((stat, i) => (
                                                    <motion.div
                                                        key={i}
                                                        variants={{
                                                            hidden: { opacity: 0, x: -20 },
                                                            visible: { opacity: 1, x: 0 }
                                                        }}
                                                        className="status-card h-glow"
                                                    >
                                                        <div className="status-top">
                                                            <div className="status-icon-box" style={{ background: `${stat.color}15`, color: stat.color }}>
                                                                {stat.icon}
                                                            </div>
                                                            <div className="mini-trend" style={{ color: stat.color }}>{stat.trend}</div>
                                                        </div>
                                                        <div className="status-info">
                                                            <span>{stat.label}</span>
                                                            <h3>{stat.val}</h3>
                                                        </div>
                                                        <div className="mock-progress-bar">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={isDemoActive ? { width: `${stat.progress}%` } : { width: 0 }}
                                                                transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "easeOut" }}
                                                                className="fill"
                                                                style={{ background: stat.color }}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <motion.div
                                                variants={{
                                                    hidden: { opacity: 0, y: 30 },
                                                    visible: { opacity: 1, y: 0 }
                                                }}
                                                className="chart-section-mockup"
                                            >
                                                <div className="section-header-mock">
                                                    <div className="title-group">
                                                        <div className="live-dot"></div>
                                                        <span>Velocity Matrix</span>
                                                    </div>
                                                    <div className="dropdown-pill">Last 7 Days <ChevronDown size={12} /></div>
                                                </div>
                                                <div className="mock-bars">
                                                    {[
                                                        { h: 50, c: '#6366f1' }, { h: 70, c: '#a855f7' },
                                                        { h: 40, c: '#10b981' }, { h: 90, c: '#eff6ff' },
                                                        { h: 60, c: '#6366f1' }, { h: 80, c: '#f59e0b' },
                                                        { h: 55, c: '#a855f7' }, { h: 75, c: '#10b981' },
                                                        { h: 45, c: '#6366f1' }, { h: 85, c: '#eff6ff' },
                                                        { h: 65, c: '#a855f7' }, { h: 95, c: '#f59e0b' }
                                                    ].map((bar, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ height: 0 }}
                                                            animate={isDemoActive ? { height: `${bar.h}%` } : { height: 0 }}
                                                            transition={{ delay: 0.8 + (i * 0.05), duration: 0.8, type: "spring", stiffness: 100 }}
                                                            className="mock-bar"
                                                            style={{ background: bar.c, boxShadow: `0 0 15px ${bar.c}33` }}
                                                        />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            variants={{
                                                hidden: { opacity: 0, x: 30 },
                                                visible: { opacity: 1, x: 0 }
                                            }}
                                            className="grid-right"
                                        >
                                            <div className="right-card-mockup">
                                                <div className="card-header-mock">Global Activity</div>
                                                <div className="mini-activity-list">
                                                    {[
                                                        { u: 'AR', n: 'Alex Rivera', a: 'Pushed v2.4.9', t: 'Just now', c: '#6366f1' },
                                                        { u: 'SM', n: 'Sarah Miller', a: 'Updated UI', t: '5m ago', c: '#a855f7' },
                                                        { u: 'JD', n: 'John Doe', a: 'New Milestone', t: '1h ago', c: '#10b981' },
                                                        { u: 'KB', n: 'Kate Bell', a: 'Task Finished', t: '3h ago', c: '#f59e0b' }
                                                    ].map((m, i) => (
                                                        <motion.div
                                                            key={i}
                                                            variants={{
                                                                hidden: { opacity: 0, y: 10 },
                                                                visible: { opacity: 1, y: 0 }
                                                            }}
                                                            className="mini-activity-item"
                                                        >
                                                            <div className="user-avatar-sq" style={{ background: `${m.c}20`, color: m.c, border: `1px solid ${m.c}30` }}>{m.u}</div>
                                                            <div className="activity-info">
                                                                <span className="user-n">{m.n}</span>
                                                                <span className="user-a dim">{m.a}</span>
                                                            </div>
                                                            <span className="activity-t dim">{m.t}</span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                <div className="mock-summary-line">
                                                    <div className="summary-point"><span>Stability</span> <strong>99.9%</strong></div>
                                                    <div className="summary-point"><span>Uptime</span> <strong>24/7</strong></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating elements */}
                    <div className="float-elements-container">
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="floating-glass-card float-top-right"
                        >
                            <Rocket size={16} className="color-rocket" />
                            <span>Faster Deployments</span>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="floating-glass-card float-bottom-left"
                        >
                            <Sparkles size={16} className="color-sparkles" />
                            <span>AI Suggestions</span>
                        </motion.div>
                        <motion.div
                            animate={{ x: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="floating-glass-card float-mid-left"
                        >
                            <Activity size={16} className="color-analytics" />
                            <span>Real-time Stats</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 130px;
          padding-bottom: 10vh;
          position: relative;
          text-align: center;
          overflow: hidden;
        }

        .container-immersive {
          width: 100%;
          padding: 0 5%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6vh;
          perspective: 2000px;
        }

        .hero-content {
          max-width: 900px;
          z-index: 5;
          position: relative;
        }

        .badge-neon {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 100px;
          color: #818cf8;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 2rem;
          box-shadow: var(--card-shadow);
        }

        html.light .badge-neon {
          color: #4f46e5;
          border-color: rgba(99, 102, 241, 0.3);
        }

        h1 {
          font-size: clamp(2.5rem, 8vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
          color: var(--text-main);
        }

        .accent-text {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.2));
        }

        p {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--text-dim);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
        }

        .hero-btns {
          display: flex;
          gap: 1.25rem;
          justify-content: center;
          align-items: center;
        }

        .btn-neon-glow {
          padding: 14px 28px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border: none;
          border-radius: 50px;
          color: white;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
        }

        .btn-neon-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 rgba(99, 102, 241, 0.5);
        }

        .btn-dark-glass {
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          color: #ffffff;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-dark-glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        html.light .btn-dark-glass {
          border-color: rgba(0, 0, 0, 0.2);
          background: transparent;
          color: #0f172a;
        }
        
        html.light .btn-dark-glass:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .hero-visual {
          width: 100%;
          max-width: 1050px;
          position: relative;
          z-index: 10;
          transition: transform 0.1s ease-out;
          margin-top: 80px;
          margin-bottom: 120px;
          display: flex;
          justify-content: center;
        }
        
        .hero-visual.cinematic-reveal {
            z-index: 20;
        }

        .neon-border-wrapper {
            padding: 1px;
            border-radius: var(--border-radius);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            width: 100%;
            position: relative;
        }

        .neon-border-wrapper.idle {
            background: rgba(255, 255, 255, 0.05);
        }

        .neon-border-wrapper.active {
            background: var(--glass-bg);
            background-size: 200% 200%;
            animation: borderRotate 4s linear infinite;
        }

        .neon-border-wrapper.reveal-glow {
            box-shadow: var(--card-shadow);
        }

        @keyframes borderRotate {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        .dashboard-mockup {
            background: var(--bg-darker);
            border-radius: var(--border-radius);
            aspect-ratio: 16/10;
            max-height: 65vh;
            display: flex;
            overflow: hidden;
            border: 1px solid var(--glass-border);
            box-shadow: var(--card-shadow);
            width: 100%;
            transition: all 0.4s ease;
        }

        .mockup-sidebar {
            width: 200px;
            background: var(--glass-bg);
            border-right: 1px solid var(--glass-border);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .mockup-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; color: var(--text-main); font-size: 0.9rem; }
        .logo-sq { width: 24px; height: 24px; background: #6366f1; border-radius: 6px; }

        .mockup-menu { display: flex; flex-direction: column; gap: 0.5rem; }
        .menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            color: #71717a;
            font-size: 0.8rem;
            font-weight: 500;
            border-radius: 8px;
            transition: 0.2s;
        }
        .menu-item.active { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .sidebar-footer { margin-top: auto; border-top: 1px solid var(--glass-border); padding-top: 1rem; }

        .mockup-main { flex: 1; display: flex; flex-direction: column; }
        .mockup-topbar {
            height: 60px;
            border-bottom: 1px solid var(--glass-border);
            padding: 0 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .page-title { font-weight: 600; color: var(--text-main); font-size: 0.85rem; }
        .topbar-right { display: flex; align-items: center; gap: 1rem; }
        .search-pill { background: var(--glass-bg); padding: 5px 12px; border-radius: var(--border-radius); font-size: 0.7rem; color: var(--text-dim); border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 6px; }
        .profile-sq { width: 28px; height: 28px; background: var(--glass-border); border-radius: 6px; }

        .mockup-body-content { flex: 1; position: relative; overflow: hidden; }
        
        .demo-bg-glow {
            position: absolute;
            top: 40%;
            left: 60%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, transparent 60%);
            animation: drift 15s ease-in-out infinite alternate;
            pointer-events: none;
            z-index: 0;
        }

        @keyframes drift {
            from { transform: translate(-55%, -45%) scale(1); }
            to { transform: translate(-45%, -55%) scale(1.1); }
        }

        .mockup-idle-grid { 
            height: 100%; 
            display: flex; 
            flex-direction: column; 
            gap: 1.5rem; 
            position: relative;
        }
        .idle-overlay {
            position: absolute;
            inset: 0;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.1);
            
            border-radius: var(--border-radius);
        }
        .play-hint {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
            cursor: pointer;
            transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .play-hint:hover { transform: scale(1.1); }
        .play-hint:hover .pulse-circle { box-shadow: var(--card-shadow); }
        .play-hint span { font-weight: 700; color: white; letter-spacing: 2px; font-size: 0.9rem; text-transform: uppercase; }
        
        .pulse-circle {
            width: 70px;
            height: 70px;
            background: #6366f1;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-left: 4px;
            box-shadow: var(--card-shadow);
            animation: pulse-glow 2.5s infinite;
        }
        @keyframes pulse-glow {
            0% { transform: scale(0.95); box-shadow: var(--card-shadow); }
            70% { transform: scale(1); box-shadow: var(--card-shadow); }
            100% { transform: scale(0.95); box-shadow: var(--card-shadow); }
        }

        .status-card.placeholder {
            background: rgba(255,255,255,0.02);
            border: 1px dashed rgba(255,255,255,0.1);
            animation: cardSkeleton 2s infinite linear;
            height: 80px;
            border-radius: var(--border-radius);
        }
        .chart-section-mockup.placeholder {
            background: rgba(255,255,255,0.02);
            border: 1px dashed rgba(255,255,255,0.1);
            animation: cardSkeleton 2s infinite linear;
            min-height: 180px;
            border-radius: var(--border-radius);
        }
        @keyframes cardSkeleton {
            0% { opacity: 0.3; }
            50% { opacity: 0.6; }
            100% { opacity: 0.3; }
        }

        .mockup-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1.5rem; flex: 1; height: 100%; padding: 1.5rem; }
        .grid-left { display: flex; flex-direction: column; gap: 1.5rem; }
        .status-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        
        .status-card { 
            background: var(--glass-bg); 
            border: 1px solid var(--glass-border); 
            border-radius: var(--border-radius); 
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .status-card.h-glow:hover {
            border-color: rgba(99, 102, 241, 0.4);
            background: rgba(99, 102, 241, 0.05);
            transform: translateY(-2px);
        }

        .status-top { display: flex; justify-content: space-between; align-items: center; }
        .status-icon-box {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
        }
        .mini-trend { font-size: 0.75rem; font-weight: 700; }

        .status-info span { font-size: 0.7rem; color: var(--text-dim); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-info h3 { font-size: 1.5rem; margin-top: 4px; font-weight: 700; color: var(--text-main); }

        .mock-progress-bar {
            width: 100%;
            height: 4px;
            background: var(--glass-border);
            border-radius: 10px;
            overflow: hidden;
            margin-top: 4px;
        }
        .mock-progress-bar .fill {
            height: 100%;
            border-radius: 10px;
        }

        .chart-section-mockup { 
            background: var(--glass-bg); 
            border: 1px solid var(--glass-border); 
            border-radius: var(--border-radius); 
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .section-header-mock { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .title-group { display: flex; align-items: center; gap: 10px; }
        .title-group span { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
        
        .live-dot {
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            box-shadow: 0 0 10px #10b981;
            animation: blink 1.5s infinite;
        }
        @keyframes blink {
            50% { opacity: 0.4; transform: scale(0.8); }
        }

        .dropdown-pill { 
            background: rgba(255,255,255,0.05); 
            padding: 6px 12px; 
            border-radius: 8px; 
            font-size: 0.75rem; 
            color: #a1a1aa; 
            display: flex; 
            align-items: center; 
            gap: 6px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        
        .mock-bars { flex: 1; display: flex; align-items: flex-end; justify-content: space-around; gap: 8px; padding: 10px 0; }
        .mock-bar { width: 100%; border-radius: 4px 4px 0 0; }

        .right-card-mockup { 
            background: var(--glass-bg); 
            border: 1px solid var(--glass-border); 
            border-radius: var(--border-radius); 
            padding: 1.5rem;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .card-header-mock { font-weight: 700; font-size: 0.9rem; margin-bottom: 1.5rem; color: var(--text-main); }
        .mini-activity-list { display: flex; flex-direction: column; gap: 1.25rem; flex: 1; }
        .mini-activity-item { display: flex; align-items: center; gap: 12px; }
        .user-avatar-sq { 
            width: 36px; 
            height: 36px; 
            border-radius: 10px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 0.75rem; 
            font-weight: 800; 
        }
        .activity-info { display: flex; flex-direction: column; gap: 2px; }
        .user-n { font-size: 0.8rem; font-weight: 600; color: var(--text-main); }
        .user-a { font-size: 0.7rem; color: var(--text-dim); }
        .activity-t { margin-left: auto; font-size: 0.7rem; font-weight: 500; color: var(--text-dim); }

        .mock-summary-line {
            border-top: 1px solid var(--glass-border);
            margin-top: 1.5rem;
            padding-top: 1.25rem;
            display: flex;
            justify-content: space-between;
        }
        .summary-point { display: flex; flex-direction: column; gap: 2px; }
        .summary-point span { font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600; }
        .summary-point strong { font-size: 0.9rem; color: var(--text-main); }

        .float-elements-container { position: absolute; inset: 0; pointer-events: none; z-index: 20; }
        .floating-glass-card {
            position: absolute;
            background: var(--glass-bg);
            
            border: 1px solid var(--glass-border);
            padding: 14px 24px;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-main);
            font-weight: 700;
            font-size: 0.85rem;
            box-shadow: var(--card-shadow);
            white-space: nowrap;
        }
        
        .float-top-right { top: 12%; right: -6%; }
        .float-bottom-left { bottom: 12%; left: -6%; }
        .float-mid-left { top: 45%; left: -10%; }

        .color-rocket { color: #f43f5e;  }
        .color-sparkles { color: #00d2ff;  }
        .color-analytics { color: #a855f7;  }

        .dim { color: #71717a; }

        @media (max-width: 992px) {
          .hero-visual { width: 100%; margin-top: 2rem; }
          .dashboard-mockup { aspect-ratio: 4/3; }
          .mockup-sidebar { display: none; }
          .floating-glass-card { display: none; }
          .mockup-grid { grid-template-columns: 1fr; }
          .grid-right { display: none; }
        }
      `}</style>
        </section>
    );
};

export default Hero;

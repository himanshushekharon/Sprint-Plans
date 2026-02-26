import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Settings,
    FolderKanban,
    MessageSquare,
    Bell,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    LogOut,
    Layers,
    Plus,
    MoreVertical,
    TrendingUp,
    Calendar,
    Clock,
    CheckCircle2,
    Activity,
    Briefcase,
    ExternalLink,
    UserPlus,
    UserMinus,
    Filter,
    List,
    LayoutGrid,
    X,
    TrendingDown,
    AlertCircle,
    GripVertical,
    Clock3,
    Check,
    CheckCircle,
    Sun,
    Moon,
    BarChart2,
    PieChart,
    Paperclip,
    Send,
    Edit2,
    Trash2,
    User,
    Lock,
    Shield,
    Palette,
    CreditCard,
    Globe,
    Camera,
    Mail,
    Phone,
    ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import AnimatedCounter from './AnimatedCounter';
import AnalyticsSection from './AnalyticsSection';
import Projects from './Projects';
import Teams from './Teams';
import Tasks from './Tasks';

// --- Overview Component ---
const Overview = ({ projects, teams, tasks, onNavigateToProjects, onCreateProject, globalSearch = '' }) => {
    const stats = [
        { label: 'Total Teams', value: teams.length.toString(), change: '+2', icon: <Users />, color: '#6366f1' },
        { label: 'Total Projects', value: projects.length.toString(), change: `${projects.length > 0 ? '+12%' : '0%'}`, icon: <Briefcase />, color: '#a855f7' },
        { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'Completed').length.toString(), change: '+8%', icon: <Activity />, color: '#ec4899' },
        { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'Completed').length.toString(), icon: <CheckCircle2 />, color: '#10b981' }
    ];

    // Derive System Activity from real data
    const generateActivity = () => {
        const activities = [];

        // Project creations
        projects.forEach(p => {
            activities.push({
                msg: 'Project Created',
                sub: `${p.name} was added to safe`,
                time: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recently',
                timestamp: p.createdAt ? new Date(p.createdAt).getTime() : 0,
                type: 'info'
            });
        });

        // Task completions and creations
        tasks.forEach(t => {
            if (t.status === 'Completed') {
                activities.push({
                    msg: 'Task Completed',
                    sub: t.title,
                    time: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : 'Just now',
                    timestamp: t.updatedAt ? new Date(t.updatedAt).getTime() : 0,
                    type: 'success'
                });
            } else {
                activities.push({
                    msg: 'New Task',
                    sub: t.title,
                    time: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recently',
                    timestamp: t.createdAt ? new Date(t.createdAt).getTime() : 0,
                    type: 'warning'
                });
            }
        });

        return activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 5);
    };

    const realActivities = generateActivity();

    const getProjectStats = (project) => {
        const projectTasks = tasks.filter(t =>
            t.projectId === (project._id || project.id) ||
            t.project === project.name
        );

        if (projectTasks.length === 0) {
            return { progress: 0, status: 'Just Started' };
        }

        const completed = projectTasks.filter(t => t.status === 'Completed').length;
        const progress = Math.round((completed / projectTasks.length) * 100);

        let status = 'Just Started';
        if (progress === 100) status = 'Completed';
        else if (progress > 75) status = 'Nearly Done';
        else if (progress > 0) status = 'On Track';

        return { progress, status };
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.team.toLowerCase().includes(globalSearch.toLowerCase())
    ).map(p => {
        const stats = getProjectStats(p);
        return { ...p, ...stats };
    });

    const recentProjects = filteredProjects.slice(0, 4);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content overview-tab">
            <motion.div
                className="premium-hero-header glass hover-glow-card"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
                <div className="hero-bg-fx"></div>

                <div className="hero-content">
                    <motion.div
                        className="live-badge"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <Activity size={12} className="pulse-icon" />
                        <span>Live Sync Active</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="hero-title"
                    >
                        Dashboard <span className="accent-text text-glow">Overview</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="hero-subtitle"
                    >
                        Real-time analytics and activities for Sprint Plans.
                    </motion.p>
                </div>

                <div className="hero-decorations">
                    <motion.div
                        className="decor-blob blob-1"
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 90, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="decor-blob blob-2"
                        animate={{
                            y: [0, 20, 0],
                            rotate: [0, -90, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>
            </motion.div>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                        className="stat-card glass hover-lift"
                    >
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <div className="stat-value">
                                <AnimatedCounter value={stat.value} />
                                {stat.valueLabel}
                            </div>
                            <span className="stat-change" style={{ color: stat.change?.startsWith('+') ? '#10b981' : '#f43f5e' }}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="soft-glow" style={{ background: `radial-gradient(circle at center, ${stat.color}20, transparent 70%)` }}></div>
                    </motion.div>
                ))}
            </div>

            <AnalyticsSection projects={projects} tasks={tasks} />

            <div className="dashboard-grid">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid-card table-card glass hover-glow-card"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                    <div className="card-bg-glow" style={{ background: 'radial-gradient(circle at 100% 0%, rgba(99,102,241,0.08), transparent 50%)' }}></div>
                    <div className="card-header">
                        <h3>Recent Projects</h3>
                        <motion.button
                            className="btn-secondary-sm"
                            onClick={onNavigateToProjects}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View All
                        </motion.button>
                    </div>
                    <div className="table-responsive">
                        <table className="projects-table">
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Team</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {recentProjects.map((project, i) => (
                                        <motion.tr
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
                                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', scale: 1.01 }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="project-name" style={{ fontWeight: 600 }}>{project.name}</td>
                                            <td className="team-cell">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div className="avatar-circle" style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '13px',
                                                        fontWeight: 700,
                                                        background: `${project.color || 'var(--primary)'}20`,
                                                        color: project.color || 'var(--primary)',
                                                        border: `1px solid ${project.color || 'var(--primary)'}40`
                                                    }}>
                                                        {project.team.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{project.team}</span>
                                                </div>
                                            </td>
                                            <td className="progress-cell">
                                                <div className="progress-wrapper" style={{ gap: '1rem' }}>
                                                    <div className="progress-bar-bg" style={{ height: '6px', backgroundColor: 'var(--glass-border)' }}>
                                                        <motion.div
                                                            className="progress-bar-fill"
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${project.progress}%` }}
                                                            style={{ background: project.color || 'var(--primary)', boxShadow: `0 0 10px ${project.color || 'var(--primary)'}` }}
                                                            transition={{ duration: 1.5, delay: 0.2 + (i * 0.1), ease: "circOut" }}
                                                        />
                                                    </div>
                                                    <span className="percent" style={{ fontWeight: 700, minWidth: '35px' }}>{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`status-tag ${project.status.toLowerCase().replace(' ', '-')}`}
                                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.75rem' }}
                                                >
                                                    {project.status === 'Completed' && <CheckCircle size={12} />}
                                                    {project.status === 'On Track' && <Activity size={12} />}
                                                    {project.status === 'Nearly Done' && <Clock size={12} />}
                                                    {project.status === 'Just Started' && <TrendingUp size={12} />}
                                                    {project.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.2 }}
                    className="grid-card timeline-card glass hover-glow-card"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                    <div className="card-bg-glow" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(168,85,247,0.08), transparent 60%)' }}></div>
                    <div className="card-header">
                        <h3>System Activity</h3>
                        <Activity size={18} className="dim" />
                    </div>
                    <div className="timeline-container">
                        {realActivities.length > 0 ? realActivities.map((item, i) => (
                            <motion.div
                                key={i}
                                className="timeline-item premium-timeline-item"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * i, type: "spring" }}
                                whileHover={{ x: -5, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}
                            >
                                <div className={`timeline-dot animated-dot ${item.type}`}>
                                    <div className="pulse-ring"></div>
                                </div>
                                <div className="timeline-content">
                                    <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.15rem' }}>{item.msg}</p>
                                    <span className="subtext" style={{ fontSize: '0.85rem' }}>{item.sub}</span>
                                    <span className="time" style={{
                                        position: 'absolute', right: '1rem', top: '1rem', fontSize: '0.75rem',
                                        fontWeight: 600, background: 'var(--bg-dark)', padding: '0.2rem 0.5rem',
                                        borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--text-dim)'
                                    }}>{item.time}</span>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="empty-tasks-state">
                                <p>No recent activity recorded.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <style>{`
                .premium-timeline-item {
                    position: relative;
                    padding: 1rem 1rem 1rem 2.5rem;
                    transition: all 0.3s ease;
                    border: 1px solid transparent;
                    margin-left: -1rem;
                    width: calc(100% + 2rem);
                }
                .premium-timeline-item:hover {
                    border-color: rgba(255,255,255,0.05);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }
                .animated-dot {
                    position: absolute !important;
                    left: 0.5rem !important;
                    top: 1.25rem !important;
                    box-shadow: 0 0 10px currentColor;
                }
                .pulse-ring {
                    position: absolute;
                    inset: -4px;
                    border: 1px solid currentColor;
                    border-radius: 50%;
                    animation: radar-pulse 2s infinite ease-out;
                }
                @keyframes radar-pulse {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .premium-hero-header {
                    position: relative;
                    padding: 2.5rem 3rem;
                    border-radius: 20px;
                    margin-bottom: 2.5rem;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .hero-bg-fx {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.02) 100%);
                    z-index: 0;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    flex: 1;
                }

                .live-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #10b981;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1.25rem;
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.1);
                }

                .pulse-icon {
                    animation: pulse-op 2s infinite;
                }

                @keyframes pulse-op {
                    0% { opacity: 0.4; }
                    50% { opacity: 1; filter: drop-shadow(0 0 5px #10b981); }
                    100% { opacity: 0.4; }
                }

                .hero-title {
                    font-size: 2.8rem;
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    margin-bottom: 0.5rem;
                    line-height: 1.2;
                }

                .hero-subtitle {
                    font-size: 1.15rem;
                    color: var(--text-dim);
                    max-width: 600px;
                    line-height: 1.5;
                }

                html[data-theme='light'] .premium-hero-header {
                    background: white;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
                    border: 1px solid rgba(0,0,0,0.05);
                }
                
                html[data-theme='light'] .hero-bg-fx {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%);
                }

                .hero-decorations {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 300px;
                    z-index: 1;
                    pointer-events: none;
                }

                .decor-blob {
                    position: absolute;
                    filter: blur(40px);
                    opacity: 0.4;
                    border-radius: 50%;
                }

                .blob-1 {
                    top: -20%;
                    right: 10%;
                    width: 150px;
                    height: 150px;
                    background: var(--primary);
                }

                .blob-2 {
                    bottom: -30%;
                    right: 30%;
                    width: 200px;
                    height: 200px;
                    background: #a855f7;
                }
            `}</style>
        </motion.div>
    );
};

export default Overview;

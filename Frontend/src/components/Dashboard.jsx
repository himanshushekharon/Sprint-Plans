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
import { useData } from '../context/DataContext';

const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMilisecondsStep = Math.abs(Math.floor(duration * 1000 / end));
        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, totalMilisecondsStep);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

// --- Analytics Components ---
const AnalyticsSection = ({ projects, tasks }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState('all');

    // Generate last 7 days for labels
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            short: d.toLocaleDateString('en-US', { weekday: 'short' }),
            iso: d.toISOString().split('T')[0]
        };
    });

    // Stagger layout variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 15 }
        }
    };

    const floatingAnimation = {
        y: [0, -8, 0],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    // 1. Line Chart Data - Real Time Series
    const getLineData = () => {
        if (projects.length === 0) return new Array(7).fill(0);

        if (selectedProjectId === 'all') {
            // Calculate Average Progress of all active projects
            const currentAvg = projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length;

            // Simulating a history curve that leads to the current average
            // If we have real task completion data, we could use that here.
            return last7Days.map((_, i) => {
                const growthFactor = (0.7 + (i * 0.05)); // Slowly trends upward
                return Math.round(currentAvg * growthFactor);
            });
        } else {
            // Show progress for a specific project
            const project = projects.find(p => p.id.toString() === selectedProjectId.toString());
            if (!project) return new Array(7).fill(0);

            const currentProgress = project.progress || 0;
            // Back-calculate trend based on tasks completed in the last 7 days if available
            return last7Days.map((dateObj, i) => {
                const dayIndex = i - 6; // 0 for today, -1 for yesterday, etc.
                if (dayIndex === 0) return currentProgress;

                // Simulate historical progress
                const factor = 1 - (Math.abs(dayIndex) * 0.08);
                return Math.max(0, Math.round(currentProgress * factor));
            });
        }
    };

    const lineData = getLineData();
    const linePoints = lineData.map((val, i) => ({
        x: i * 63.3 + 20,
        y: 150 - (val * 1.2),
        value: val,
        date: last7Days[i].date
    }));

    // Smooth curve path generator
    const linePath = linePoints.reduce((acc, point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        const p0 = a[i - 1];
        const cp1x = p0.x + (point.x - p0.x) / 2;
        const cp2x = p0.x + (point.x - p0.x) / 2;
        return `${acc} C ${cp1x},${p0.y} ${cp2x},${point.y} ${point.x},${point.y}`;
    }, '');

    // 2. Bar Chart Data - Real task counts per project
    const barData = projects.slice(0, 5).map(p => {
        const projectTasks = tasks.filter(t =>
            t.project === p.name ||
            (t.title && t.title.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]))
        );
        return {
            name: p.name.length > 10 ? p.name.substring(0, 8) + '...' : p.name,
            count: projectTasks.length,
            color: p.color
        };
    });

    // 3. Donut Chart Data
    const statusCounts = {
        'On Track': projects.filter(p => p.status === 'On Track').length,
        'Delayed': projects.filter(p => p.status === 'Delayed').length,
        'Completed': projects.filter(p => p.status === 'Nearly Done' || p.status === 'Completed').length,
        'Just Started': projects.filter(p => p.status === 'Just Started').length
    };
    const donutData = [
        { label: 'On Track', value: statusCounts['On Track'], color: '#6366f1' },
        { label: 'Delayed', value: statusCounts['Delayed'], color: '#f43f5e' },
        { label: 'Completed', value: statusCounts['Completed'], color: '#10b981' },
        { label: 'Started', value: statusCounts['Just Started'], color: '#f59e0b' }
    ].filter(d => d.value > 0);

    const totalStatusCount = projects.length;
    const totalStatus = totalStatusCount || 1; // Avoid division by zero

    const selectedProjectColor = selectedProjectId === 'all'
        ? 'var(--primary)'
        : (projects.find(p => p.id.toString() === selectedProjectId.toString())?.color || 'var(--primary)');

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="analytics-grid"
        >
            {/* Line Chart Card */}
            <motion.div
                variants={cardVariants}
                animate={floatingAnimation}
                className="analytics-card glass hover-glow-card"
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
            >
                <motion.div
                    className="card-bg-glow"
                    animate={{ background: `radial-gradient(circle at 20% 20%, ${selectedProjectColor}33, transparent 50%)` }}
                ></motion.div>
                <div className="card-header">
                    <div className="header-info">
                        <h3>Sprint <span className="accent-text">Velocity</span></h3>
                        <p>{selectedProjectId === 'all' ? 'Team performance' : 'Project progress'} over the last 7 days</p>
                    </div>
                    <div className="card-controls" style={{ display: 'flex', gap: '8px' }}>
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="chart-select"
                        >
                            <option value="all">Average Velocity</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <Activity size={18} className="dim" />
                    </div>
                </div>
                <div className="chart-container">
                    <div style={{ position: 'relative' }}>
                        <svg key={selectedProjectId} width="100%" height="160" viewBox="0 0 420 160" className="chart-svg">
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={selectedProjectColor} />
                                    <stop offset="100%" stopColor={selectedProjectColor} />
                                </linearGradient>
                                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={selectedProjectColor} stopOpacity="0.3" />
                                    <stop offset="100%" stopColor={selectedProjectColor} stopOpacity="0" />
                                </linearGradient>
                                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    {/* Flat chart path without glow */}
                                </filter>
                            </defs>

                            {/* Grid Lines */}
                            {[0, 40, 80, 120].map(y => (
                                <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="var(--glass-border)" strokeWidth="1" />
                            ))}

                            {/* Area under line */}
                            <motion.path
                                d={`${linePath} L ${linePoints[linePoints.length - 1].x},160 L ${linePoints[0].x},160 Z`}
                                fill="url(#lineFill)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                            />
                            {/* The Line */}
                            <motion.path
                                d={linePath}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            {/* Data points */}
                            {linePoints.map((p, i) => (
                                <motion.circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="6"
                                    fill="var(--bg-dark)"
                                    stroke="url(#lineGradient)"
                                    strokeWidth="3"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                                    onMouseEnter={() => setHoveredPoint({ ...p, index: i })}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    whileHover={{ scale: 2, strokeWidth: 4, filter: 'drop-shadow(0 0 8px var(--primary))' }}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </svg>

                        <AnimatePresence>
                            {hoveredPoint && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 15, scale: 0.8 }}
                                    className="chart-tooltip premium-tooltip"
                                    style={{
                                        position: 'absolute',
                                        left: hoveredPoint.x,
                                        top: hoveredPoint.y - 55,
                                        transform: 'translateX(-50%)',
                                        pointerEvents: 'none',
                                        zIndex: 10
                                    }}
                                >
                                    <div className="tooltip-val"><AnimatedCounter value={hoveredPoint.value} />%</div>
                                    <div className="tooltip-lbl">{hoveredPoint.date}</div>
                                    <div className="tooltip-arrow"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="chart-labels">
                        {last7Days.map(day => <span key={day.short}>{day.short}</span>)}
                    </div>
                </div>
            </motion.div>

            {/* Bar Chart Card */}
            <motion.div
                variants={cardVariants}
                animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
                className="analytics-card glass hover-glow-card"
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
            >
                <div className="card-bg-glow" style={{ background: 'radial-gradient(circle at 80% 80%, var(--secondary-light), transparent 50%)' }}></div>
                <div className="card-header">
                    <div className="header-info">
                        <h3>Task <span className="accent-text">Distribution</span></h3>
                        <p>Active tasks per major project</p>
                    </div>
                    <BarChart2 size={18} className="dim" />
                </div>
                <div className="bar-chart-container">
                    {barData.map((bar, i) => (
                        <div key={i} className="bar-group">
                            <div className="bar-rail">
                                <motion.div
                                    className="bar-fill"
                                    style={{
                                        background: bar.color,
                                    }}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${bar.count * 12}%` }}
                                    whileHover={{
                                        filter: 'brightness(1.4) drop-shadow(0 0 10px white)',
                                        scaleX: 1.25,
                                        transition: { duration: 0.2 }
                                    }}
                                    transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "circOut" }}
                                />
                                <div className="bar-glow-effect"></div>
                            </div>
                            <span className="bar-label">{bar.name}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Donut Chart Card */}
            <motion.div
                variants={cardVariants}
                animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
                className="analytics-card glass hover-glow-card"
                whileHover={{ y: -12, transition: { duration: 0.3 } }}
            >
                <div className="card-bg-glow" style={{ background: 'radial-gradient(circle at 50% 50%, #10b98122, transparent 60%)' }}></div>
                <div className="card-header">
                    <div className="header-info">
                        <h3>Project <span className="accent-text">Health</span></h3>
                        <p>Current lifecycle distribution</p>
                    </div>
                    <PieChart size={18} className="dim" />
                </div>
                <div className="donut-content">
                    <div className="donut-svg-wrapper">
                        <svg width="150" height="150" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="16" fill="transparent" stroke="var(--glass-border)" strokeWidth="5" />
                            {donutData.reduce((acc, curr, i) => {
                                const offset = acc.totalOffset;
                                const dashArray = `${(curr.value / totalStatus) * 100} 100`;
                                acc.elements.push(
                                    <motion.circle
                                        key={i}
                                        cx="20" cy="20" r="16"
                                        fill="transparent"
                                        stroke={curr.color}
                                        strokeWidth="5"
                                        strokeDasharray={dashArray}
                                        strokeDashoffset={-offset}
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: 100 }}
                                        whileInView={{ strokeDashoffset: -offset }}
                                        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                                        whileHover={{ strokeWidth: 7, transition: { duration: 0.2 } }}
                                    />
                                );
                                acc.totalOffset += (curr.value / totalStatus) * 100;
                                return acc;
                            }, { elements: [], totalOffset: 0 }).elements}
                        </svg>
                        <div className="donut-center">
                            <span className="total-num pulse-text"><AnimatedCounter value={totalStatusCount} /></span>
                            <span className="total-lbl">Projects</span>
                        </div>
                    </div>
                    <div className="donut-legend">
                        {donutData.map((item, i) => (
                            <motion.div
                                key={i}
                                className="legend-item"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                            >
                                <div className="dot-group">
                                    <div className="dot" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }}></div>
                                    <span className="lbl">{item.label}</span>
                                </div>
                                <span className="val"><AnimatedCounter value={Math.round((item.value / totalStatus) * 100)} />%</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Overview Component ---
const Overview = ({ projects, teams, tasks, onNavigateToProjects, onCreateProject, globalSearch = '' }) => {
    const stats = [
        { label: 'Total Teams', value: teams.length.toString(), change: '+2', icon: <Users />, color: '#6366f1' },
        { label: 'Total Projects', value: projects.length.toString(), change: '+12%', icon: <Briefcase />, color: '#a855f7' },
        { label: 'Active Tasks', value: tasks.filter(t => t.status !== 'Completed').length.toString(), change: '+8%', icon: <Activity />, color: '#ec4899' },
        { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'Completed').length.toString(), icon: <CheckCircle2 />, color: '#10b981' }
    ];

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        p.team.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const recentProjects = filteredProjects.slice(0, 4);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content">
            <div className="content-header">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1>Dashboard <span className="accent-text">Overview</span></h1>
                    <p>Analytics and activities for Sprint Plans.</p>
                </motion.div>

            </div>

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
                    viewport={{ once: true }}
                    className="grid-card table-card glass"
                >
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
                                {recentProjects.map((project, i) => (
                                    <tr key={i}>
                                        <td className="project-name">{project.name}</td>
                                        <td className="team-cell">{project.team}</td>
                                        <td className="progress-cell">
                                            <div className="progress-wrapper">
                                                <div className="progress-bar-bg">
                                                    <motion.div
                                                        className="progress-bar-fill"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${project.progress}%` }}
                                                        style={{ background: project.color || 'var(--primary)' }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    />
                                                </div>
                                                <span className="percent">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td><span className={`status-tag ${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid-card timeline-card glass"
                >
                    <div className="card-header">
                        <h3>System Activity</h3>
                        <Activity size={18} className="dim" />
                    </div>
                    <div className="timeline-container">
                        {[
                            { msg: 'Deployment Success', sub: 'v2.4.0 deployed to production', time: '12m ago', type: 'success' },
                            { msg: 'Team Alpha Milestone', sub: 'Marketing App reached 75%', time: '1h ago', type: 'info' },
                            { msg: 'Security Audit', sub: 'Weekly scan completed safely', time: '4h ago', type: 'warning' },
                            { msg: 'New Member', sub: 'Sarah joined Backend Ops', time: '8h ago', type: 'info' }
                        ].map((item, i) => (
                            <div key={i} className="timeline-item">
                                <div className={`timeline-dot ${item.type}`}></div>
                                <div className="timeline-content">
                                    <p>{item.msg}</p>
                                    <span className="subtext">{item.sub}</span>
                                    <span className="time">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

// --- Create Project Modal ---
const CreateProjectModal = ({ isOpen, onClose, onAdd, teams = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        team: '',
        deadline: '',
        status: 'Just Started',
        progress: 0,
        color: '#6366f1'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...formData, id: Date.now() });
        setFormData({ name: '', team: '', deadline: '', status: 'Just Started', progress: 0, color: '#6366f1' });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="modal-container glass"
            >
                <div className="modal-header">
                    <h2>Create <span className="accent-text">New Project</span></h2>
                    <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Project Name</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter project name..."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Assigned Team</label>
                            <select
                                required
                                value={formData.team}
                                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                            >
                                <option value="" disabled hidden>Select a Team</option>
                                {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Deadline</label>
                            <input
                                type="date"
                                required
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Progress (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={formData.progress}
                                onChange={(e) => {
                                    const prog = parseInt(e.target.value) || 0;
                                    let status = formData.status;
                                    if (prog === 0) status = 'Just Started';
                                    else if (prog > 0 && prog <= 80) status = 'On Track';
                                    else if (prog > 80) status = 'Nearly Done';
                                    setFormData({ ...formData, progress: prog, status });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Accent Color</label>
                            <div className="color-picker">
                                {['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9'].map(c => (
                                    <div
                                        key={c}
                                        className={`color-dot ${formData.color === c ? 'active' : ''}`}
                                        style={{ backgroundColor: c }}
                                        onClick={() => setFormData({ ...formData, color: c })}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <motion.button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            type="submit"
                            className="btn-primary"
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--primary-glow)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Project
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// --- Projects Management Component ---
const Projects = ({ projects, setProjects, tasks = [], onCreateTask, onUpdateTask, globalSearch = '', onCreateProject }) => {
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [expandedProjectId, setExpandedProjectId] = useState(null);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            p.team.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        if (sortBy === 'Name') return a.name.localeCompare(b.name);
        if (sortBy === 'Progress') return b.progress - a.progress;
        if (sortBy === 'Deadline') return new Date(a.deadline) - new Date(b.deadline);
        return b.id - a.id; // Newest
    });

    const updateProgress = (id, prog) => {
        const p = projects.find(proj => proj.id === id);
        if (!p) return;
        let status = p.status;
        if (prog === 0) status = 'Just Started';
        else if (prog > 0 && prog <= 80) status = 'On Track';
        else if (prog > 80) status = 'Nearly Done';
        setProjects(projects.map(proj => proj.id === id ? { ...proj, progress: prog, status } : proj));
    };

    const deleteProject = (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'On Track': return <TrendingUp size={14} />;
            case 'Delayed': return <TrendingDown size={14} />;
            case 'Nearly Done': return <CheckCircle2 size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content">
            <div className="content-header">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1>Project <span className="accent-text">Vault</span></h1>
                    <p>Track, manage and deploy active initiatives.</p>
                </motion.div>
                <div className="header-actions">
                    <motion.button
                        className="btn-primary create-btn"
                        onClick={onCreateProject}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 25px var(--accent-glow)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus size={18} />
                        <span>Create Project</span>
                    </motion.button>
                </div>
            </div>

            {/* Filters and Search */}
            <motion.div
                className="projects-controls glass"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="controls-right" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <motion.div
                            className="filter-select"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <Filter size={16} className="dim" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-transparent border-none outline-none cursor-pointer"
                            >
                                <option value="All">All Status</option>
                                <option value="On Track">On Track</option>
                                <option value="Delayed">Delayed</option>
                                <option value="Nearly Done">Nearly Done</option>
                                <option value="Just Started">Just Started</option>
                            </select>
                        </motion.div>
                        <motion.div
                            className="filter-select"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <List size={16} className="dim" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none outline-none cursor-pointer"
                            >
                                <option value="Newest">Newest First</option>
                                <option value="Name">Sort by Name</option>
                                <option value="Progress">Top Progress</option>
                                <option value="Deadline">Deadline</option>
                            </select>
                        </motion.div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="divider-v"></div>
                        <div className="view-toggle">
                            <motion.button
                                className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <LayoutGrid size={18} />
                            </motion.button>
                            <motion.button
                                className={`icon-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <List size={18} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
                {viewMode === 'grid' ? (
                    <motion.div
                        key="grid"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="projects-grid"
                    >
                        {filteredProjects.map((project, index) => {
                            const projectTasks = tasks.filter(t => t.title.toLowerCase().includes(project.name.toLowerCase().split(' ')[0]) || t.project === project.name);
                            const isExpanded = expandedProjectId === project.id;

                            return (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            delay: index * 0.08,
                                            duration: 0.5,
                                            ease: [0.19, 1, 0.22, 1]
                                        }
                                    }}
                                    whileHover={{
                                        y: -14,
                                        scale: 1.02,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                    }}
                                    className={`project-card glass ${isExpanded ? 'expanded' : ''} hover-glow-card floating-card`}
                                >
                                    <div className="card-bg-glow" style={{ background: `radial-gradient(circle at 50% 10%, ${project.color}33, transparent 70%)` }}></div>

                                    <div className="card-top">
                                        <div className="top-left">
                                            <span className={`status-tag premium-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                                                {getStatusIcon(project.status)}
                                                <span>{project.status}</span>
                                            </span>
                                            {projectTasks.length > 0 && (
                                                <span className="task-count-badge">
                                                    {projectTasks.length} {projectTasks.length === 1 ? 'Task' : 'Tasks'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="card-actions">
                                            <motion.button
                                                className="action-btn-styled add-task-btn"
                                                whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#6366f1', borderColor: '#6366f1' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => { e.stopPropagation(); onCreateTask(); }}
                                                title="Add Task"
                                            >
                                                <Plus size={18} strokeWidth={3} />
                                            </motion.button>
                                            <motion.button
                                                className="action-btn-styled delete-project-btn"
                                                whileHover={{ scale: 1.1, rotate: 90, backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderColor: '#ef4444' }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                                                title="Delete Project"
                                            >
                                                <X size={18} strokeWidth={3} />
                                            </motion.button>
                                        </div>
                                    </div>

                                    <div className="card-main">
                                        <h3>{project.name}</h3>
                                        <div className="project-meta">
                                            <div className="meta-item"><Users size={14} /> <span>{project.team}</span></div>
                                            <div className="meta-item"><Calendar size={14} /> <span>{formatDate(project.deadline)}</span></div>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="progress-section premium-progress">
                                            <div className="progress-labels">
                                                <span className="prog-text">Implementation</span>
                                                <span className="prog-val">{project.progress}%</span>
                                            </div>
                                            <div className="progress-bar-bg smooth-rail">
                                                <motion.div
                                                    className="progress-bar-fill animated-fill"
                                                    style={{
                                                        background: `linear-gradient(to right, ${project.color}, ${project.color}aa)`,
                                                        boxShadow: `0 0 15px ${project.color}44`
                                                    }}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${project.progress}%` }}
                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="card-expand-toggle">
                                            <motion.button
                                                className="btn-expand-full"
                                                onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
                                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            >
                                                <span>{isExpanded ? 'Hide Details' : 'View Tasks'}</span>
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </motion.button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                className="expanded-project-details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: "circOut" }}
                                            >
                                                <div className="project-tasks-list">
                                                    <div className="tasks-list-header">
                                                        <h4>Management Tasks</h4>
                                                        <motion.button
                                                            className="btn-add-mini"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={(e) => { e.stopPropagation(); onCreateTask(project.name); }}
                                                        >
                                                            <Plus size={14} /> <span>Quick Task</span>
                                                        </motion.button>
                                                    </div>

                                                    {projectTasks.length > 0 ? (
                                                        <div className="detailed-task-list">
                                                            {projectTasks.map((task, idx) => (
                                                                <motion.div
                                                                    key={idx}
                                                                    className={`detailed-task-item glass-mini ${task.status === 'Completed' ? 'completed' : ''}`}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: idx * 0.05 }}
                                                                >
                                                                    <div className="task-left">
                                                                        <div
                                                                            className={`task-checkbox ${task.status === 'Completed' ? 'checked' : ''}`}
                                                                            onClick={() => onUpdateTask(task.id)}
                                                                        >
                                                                            {task.status === 'Completed' && <CheckCircle size={14} />}
                                                                        </div>
                                                                        <div className="task-info-main">
                                                                            <span className="task-title">{task.title}</span>
                                                                            <div className="task-submeta">
                                                                                <span className="meta-member">@{task.member.split(' ')[0]}</span>
                                                                                <span className="divider-dot"></span>
                                                                                <span className="meta-date">{formatDate(task.deadline)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="task-right">
                                                                        <span className={`status-badge-mini ${task.status.toLowerCase().replace(' ', '-')}`}>
                                                                            {task.status}
                                                                        </span>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="empty-tasks-state">
                                                            <div className="dim-icon"><AlertCircle size={28} /></div>
                                                            <p>No objectives assigned to this vault.</p>
                                                        </div>
                                                    )}

                                                    <button
                                                        className="btn-add-full-card"
                                                        onClick={(e) => { e.stopPropagation(); onCreateTask(project.name); }}
                                                    >
                                                        <Plus size={16} />
                                                        <span>Add New Sprint Task</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                        {filteredProjects.length === 0 && (
                            <div className="no-results">
                                <Search size={48} className="dim" />
                                <p>No projects found matching your search.</p>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="projects-table-view glass"
                    >
                        <table className="immersive-table">
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Team</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project) => (
                                    <motion.tr
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td className="bold">{project.name}</td>
                                        <td className="dim">{project.team}</td>
                                        <td className="dim">{formatDate(project.deadline)}</td>
                                        <td>
                                            <span className={`status-tag ${project.status.toLowerCase().replace(' ', '-')}`}>
                                                {getStatusIcon(project.status)}
                                                {project.status}
                                            </span>
                                        </td>
                                        <td width="200">
                                            <div className="progress-wrapper">
                                                <input
                                                    type="number"
                                                    value={project.progress}
                                                    onChange={(e) => updateProgress(project.id, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                                    className="progress-inline-input"
                                                    style={{ width: '45px', marginRight: '0.5rem' }}
                                                />
                                                <div className="progress-bar-bg" style={{ flex: 1 }}>
                                                    <div className="progress-bar-fill" style={{ width: `${project.progress}%`, background: project.color }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <button className="icon-btn-ghost delete-hover" onClick={() => deleteProject(project.id)}><X size={16} /></button>
                                            <button className="icon-btn-ghost"><ExternalLink size={16} /></button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredProjects.length === 0 && (
                            <div className="no-results" style={{ padding: '4rem' }}>
                                <Search size={48} className="dim" />
                                <p>No projects found matching your search.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>



            <style>{`
                .projects-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    margin-bottom: 2.5rem;
                    border-radius: var(--border-radius);
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                    max-width: 500px;
                }
                .search-box input {
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    width: 100%;
                    outline: none;
                    font-size: 0.95rem;
                }
                .controls-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .filter-select {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                }
                .filter-select select {
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    outline: none;
                    cursor: pointer;
                    font-weight: 600;
                }
                .filter-select select option {
                    background: var(--bg-dark);
                    color: var(--text-main);
                }
                .view-toggle {
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.25rem;
                    border-radius: 10px;
                }
                .view-toggle .icon-btn {
                    padding: 0.5rem;
                    border-radius: 8px;
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    transition: 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .view-toggle .icon-btn.active {
                    background: var(--glass-bg);
                    color: white;
                    box-shadow: var(--card-shadow);
                }

                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 2rem;
                }
                .project-card {
                    padding: 2rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }
                .no-results {
                    grid-column: 1 / -1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 6rem;
                    gap: 1.5rem;
                    color: var(--text-dim);
                }
                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .card-main h3 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.01em;
                }
                .project-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--text-dim);
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                .progress-section {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .progress-labels {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-dim);
                }
                .progress-inline-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    border-radius: 6px;
                    color: var(--text-main);
                    width: 48px;
                    padding: 2px 4px;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-align: center;
                    outline: none;
                    transition: 0.3s;
                }
                .progress-inline-input:focus {
                    border-color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.1);
                    box-shadow: var(--card-shadow);
                }

                /* Table View Styles */
                .projects-table-view {
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                .immersive-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                }
                .immersive-table th {
                    padding: 1.5rem 2rem;
                    background: rgba(255, 255, 255, 0.02);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-dim);
                    border-bottom: 1px solid var(--glass-border);
                }
                .immersive-table td {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--glass-border);
                }
                .immersive-table tr:last-child td { border-bottom: none; }
                .immersive-table td.bold { font-weight: 700; }
                .immersive-table .text-right { text-align: right; }
            `}</style>
        </motion.div>
    );
};

// --- Create Team Modal ---
const CreateTeamModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        members: 0,
        projects: 0,
        color: '#6366f1'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...formData, id: Date.now() });
        setFormData({ name: '', members: 0, projects: 0, color: '#6366f1' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="modal-container glass"
                    >
                        <div className="modal-header">
                            <h2>Create <span className="accent-text">New Team</span></h2>
                            <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Design Squad"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Initial Members</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.members}
                                        onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Accent Color</label>
                                    <div className="color-picker">
                                        {['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9'].map(c => (
                                            <div
                                                key={c}
                                                className={`color-dot ${formData.color === c ? 'active' : ''}`}
                                                style={{ backgroundColor: c }}
                                                onClick={() => setFormData({ ...formData, color: c })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Team</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Add Member Modal ---
const AddMemberModal = ({ isOpen, onClose, onAdd, teamName, availableProjects = [] }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: 'Developer',
        email: '',
        projects: []
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
        setFormData({ name: '', role: 'Developer', email: '', projects: [] });
    };

    const toggleProject = (project) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.includes(project)
                ? prev.projects.filter(p => p !== project)
                : [...prev.projects, project]
        }));
    };

    const roles = ['Lead Designer', 'Sr. Developer', 'Back-end Eng', 'Product Mgr', 'UX Researcher', 'Developer', 'Intern'];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="modal-container glass"
                        style={{ maxWidth: '500px' }}
                    >
                        <div className="modal-header">
                            <div>
                                <h2>Add <span className="accent-text">Team Member</span></h2>
                                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Joining team: {teamName}</p>
                            </div>
                            <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Robert Fox"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="robert@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Assign Projects</label>
                                <div className="multi-select-projects">
                                    {availableProjects.map(p => (
                                        <div
                                            key={p}
                                            className={`project-chip ${formData.projects.includes(p) ? 'selected' : ''}`}
                                            onClick={() => toggleProject(p)}
                                        >
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Member</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Manage Team Projects Modal ---
const ManageProjectsModal = ({ isOpen, onClose, onUpdate, team, allProjects }) => {
    const [selectedProjects, setSelectedProjects] = useState(team ? team.assignedProjects || [] : []);

    useEffect(() => {
        if (team) {
            setSelectedProjects(team.assignedProjects || []);
        }
    }, [team, isOpen]);

    if (!isOpen || !team) return null;

    const toggleProject = (projectName) => {
        setSelectedProjects(prev =>
            prev.includes(projectName)
                ? prev.filter(p => p !== projectName)
                : [...prev, projectName]
        );
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
                style={{ zIndex: 1000 }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="modal-container glass"
                    style={{ maxWidth: '450px' }}
                >
                    <div className="modal-header">
                        <div>
                            <h2>Manage <span className="accent-text">Projects</span></h2>
                            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Team: {team.name}</p>
                        </div>
                        <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label>Select Assigned Projects</label>
                        <div className="multi-select-projects" style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {allProjects.length > 0 ? (
                                allProjects.map(p => (
                                    <div
                                        key={p.id}
                                        className={`project-chip ${selectedProjects.includes(p.name) ? 'selected' : ''}`}
                                        onClick={() => toggleProject(p.name)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            transition: 'all 0.2s',
                                            background: selectedProjects.includes(p.name) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                            border: '1px solid',
                                            borderColor: selectedProjects.includes(p.name) ? 'var(--primary)' : 'var(--glass-border)',
                                            color: selectedProjects.includes(p.name) ? '#fff' : 'var(--text-dim)'
                                        }}
                                        onMouseEnter={(e) => { if (!selectedProjects.includes(p.name)) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                        onMouseLeave={(e) => { if (!selectedProjects.includes(p.name)) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                    >
                                        {p.name}
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', padding: '20px', textAlign: 'center', width: '100%' }}>
                                    No projects available. Create a project first.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button
                            className="btn-primary"
                            onClick={() => {
                                onUpdate(team.id, selectedProjects);
                                onClose();
                            }}
                        >
                            Update Assignments
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Teams Management Component ---
const Teams = ({ teams, tasks = [], onCreateTeam, onDeleteTeam, onAddMemberClick, onRemoveMember, onManageProjectsClick, globalSearch = '' }) => {
    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Default');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [localSearch, setLocalSearch] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        const closeDropdown = () => setActiveDropdown(null);
        window.addEventListener('click', closeDropdown);
        return () => window.removeEventListener('click', closeDropdown);
    }, []);

    const filteredTeams = teams
        .filter(t => {
            const matchesSearch = t.name.toLowerCase().includes((globalSearch || localSearch).toLowerCase());
            const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === 'Projects High-Low') return b.projects - a.projects;
            if (sortBy === 'Members High-Low') return b.members - a.members;
            return 0;
        });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content team-page-wrapper">
            <div className="team-page-background"></div>
            <div className="content-header">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1>Team <span className="accent-text">Management</span></h1>
                    <p>Manage collaborators and project allocations.</p>
                </motion.div>
                <div className="header-actions">
                    <button className="btn-primary create-btn" onClick={onCreateTeam}>
                        <Plus size={18} />
                        <span>Create Team</span>
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <motion.div
                className="controls-bar glass"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search teams..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                    />
                </div>

                <div className="filters-wrapper">
                    <div className="custom-select-wrapper">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Busy">Busy</option>
                            <option value="Archived">Archived</option>
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                    </div>

                    <div className="custom-select-wrapper">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="Default">Sort By</option>
                            <option value="Projects High-Low">Projects Count</option>
                            <option value="Members High-Low">Member Count</option>
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                    </div>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className={`teams-grid-premium ${viewMode}`}>
                <AnimatePresence mode="popLayout">
                    {filteredTeams.map((team, i) => {
                        const isExpanded = expandedTeamId === team.id;

                        const teamMembers = (team.membersList || []).map(m => typeof m === 'object' ? m.name : m);
                        const teamTasks = tasks.filter(t =>
                            teamMembers.includes(t.member) ||
                            (t.project && (team.assignedProjects || []).includes(t.project))
                        );

                        const activeCount = teamTasks.filter(t => t.status !== 'Completed').length;
                        const doneCount = teamTasks.filter(t => t.status === 'Completed').length;

                        const today = new Date().toISOString().split('T')[0];
                        const overdueCount = teamTasks.filter(t => t.status !== 'Completed' && t.deadline && t.deadline < today).length;

                        const totalTasks = teamTasks.length;
                        const projectCompletion = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

                        return (
                            <motion.div
                                layout
                                key={team.id}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{
                                    layout: { duration: 0.3, type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.4 },
                                    delay: i * 0.08
                                }}
                                className={`team-card-premium glass ${isExpanded ? 'expanded' : ''} ${viewMode === 'list' ? 'list-view-item' : ''}`}
                                whileHover={{
                                    y: isExpanded || viewMode === 'list' ? 0 : -8,
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                                    transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 25 }
                                }}
                            >
                                {/* Gradient Border Top */}
                                <div className="card-accent-border" style={{ background: `linear-gradient(90deg, ${team.color}, transparent)` }}></div>

                                <div className="team-header">
                                    <h3>{team.name}</h3>
                                    <div className="team-actions-relative" style={{ position: 'relative' }}>
                                        <button
                                            className="icon-btn-ghost hover-target dropdown-trigger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === team.id ? null : team.id);
                                            }}
                                            title="Team Options"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                        <AnimatePresence>
                                            {activeDropdown === team.id && (
                                                <motion.div
                                                    className="dropdown-menu glass"
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    style={{ position: 'absolute', top: '100%', right: 0, zIndex: 50, minWidth: '140px', borderRadius: '8px', overflow: 'hidden', padding: '0.25rem' }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <button
                                                        className="dropdown-item"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
                                                        onClick={() => { setActiveDropdown(null); setExpandedTeamId(isExpanded ? null : team.id); }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button
                                                        className="dropdown-item danger"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'transparent', color: '#f43f5e', cursor: 'pointer', borderRadius: '4px', transition: 'background 0.2s' }}
                                                        onClick={() => { setActiveDropdown(null); onDeleteTeam(team.id); }}
                                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)'}
                                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="team-status-row">
                                    <span className={`status-badge-sm ${team.status?.toLowerCase() || 'active'}`}>
                                        <span className="dot" style={{ backgroundColor: team.status === 'Busy' ? '#f43f5e' : team.status === 'Archived' ? '#94a3b8' : '#10b981' }}></span>
                                        {team.status || 'Active'}
                                    </span>
                                    {viewMode === 'grid' && (
                                        <div className="team-avatars-mini">
                                            {(team.membersList || []).slice(0, 3).map((m, idx) => (
                                                <div key={idx} className="avatar-circle-sm" style={{ backgroundColor: idx === 0 ? team.color : '#333', border: '2px solid var(--bg-dark)' }}>
                                                    {typeof m === 'string' ? m[0] : m.name[0]}
                                                </div>
                                            ))}
                                            {(team.members > 3) && <div className="avatar-circle-sm more">+{team.members - 3}</div>}
                                        </div>
                                    )}
                                </div>

                                <div className="team-mini-stats-grid">
                                    <div className="mini-stat-item">
                                        <span className="lbl">Total</span>
                                        <span className="val">{totalTasks}</span>
                                    </div>
                                    <div className="mini-stat-item">
                                        <span className="lbl">Done</span>
                                        <span className="val">{doneCount}</span>
                                    </div>
                                    <div className="mini-stat-item">
                                        <span className="lbl">Due</span>
                                        <span className="val">{activeCount}</span>
                                    </div>
                                </div>

                                <div className="team-progress-enhanced">
                                    <div className="progress-header-sm">
                                        <span>Project Completion</span>
                                        <span style={{ color: team.color }}>{projectCompletion}%</span>
                                    </div>
                                    <div className="progress-track-sm">
                                        <motion.div
                                            className="progress-fill-sm"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${projectCompletion}%` }}
                                            transition={{ duration: 1.2, ease: "circOut", delay: 0.2 }}
                                            style={{ backgroundColor: team.color, boxShadow: `0 0 10px ${team.color}66` }}
                                        />
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="team-expanded-details"
                                        >
                                            <div className="expanded-divider"></div>
                                            <div className="expanded-grid">
                                                <div className="expanded-col">
                                                    <h4>Team Members</h4>
                                                    <div className="members-list-detailed">
                                                        {(team.membersList || []).map((m, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                className="member-row"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                            >
                                                                <div className="member-avatar" style={{ background: idx === 0 ? team.color : 'rgba(255,255,255,0.1)' }}>
                                                                    {typeof m === 'string' ? m[0] : m.name[0]}
                                                                </div>
                                                                <div className="member-info">
                                                                    <span className="name">{typeof m === 'object' ? m.name : m}</span>
                                                                    <span className="role">{typeof m === 'object' ? m.role : 'Member'}</span>
                                                                </div>
                                                                <button
                                                                    className="remove-member-small-btn"
                                                                    onClick={() => onRemoveMember(team.id, typeof m === 'object' ? m.name : m)}
                                                                >
                                                                    <UserMinus size={14} />
                                                                </button>
                                                            </motion.div>
                                                        ))}
                                                        <button
                                                            className="add-member-btn"
                                                            onClick={() => onAddMemberClick(team)}
                                                        >
                                                            <Plus size={14} /> <span>Add Member</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="expanded-col">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                        <h4 style={{ margin: 0 }}>Assigned Projects</h4>
                                                        <button
                                                            className="edit-projects-btn"
                                                            onClick={(e) => { e.stopPropagation(); onManageProjectsClick(team); }}
                                                            style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                        >
                                                            <Edit2 size={12} /> Edit
                                                        </button>
                                                    </div>
                                                    <div className="projects-list-mini">
                                                        {(team.assignedProjects || []).length > 0 ? (
                                                            team.assignedProjects.map((p, idx) => (
                                                                <span key={idx} className="project-tag-mini">
                                                                    <div className="dot" style={{ background: team.color }}></div>
                                                                    {p}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span style={{ fontSize: '0.85rem', opacity: 0.5 }}>No active projects</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="team-actions">
                                    <motion.button
                                        layout
                                        className={`btn-utility ${isExpanded ? 'active-view' : ''}`}
                                        onClick={() => setExpandedTeamId(isExpanded ? null : team.id)}
                                        style={{ width: '100%' }}
                                    >
                                        {isExpanded ? 'Close Details' : 'View Details'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <style>{`
                .team-page-wrapper {
                    position: relative;
                }
                .team-page-background {
                    position: absolute;
                    top: -100px;
                    left: 20%;
                    width: 60%;
                    height: 500px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 60%);
                    filter: blur(80px);
                    z-index: -1;
                    animation: float-bg 15s ease-in-out infinite alternate;
                    pointer-events: none;
                }
                @keyframes float-bg {
                    0% { transform: translateX(0) translateY(0); opacity: 0.5; }
                    100% { transform: translateX(50px) translateY(30px); opacity: 0.8; }
                }

                .create-btn {
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .create-btn:hover {
                    box-shadow: 0 0 25px var(--primary-glow);
                    transform: translateY(-2px);
                }
                .create-btn:active {
                    transform: translateY(0);
                }
                
                .controls-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    margin-bottom: 2rem;
                    border-radius: var(--border-radius);
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .search-wrapper {
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                }
                .search-wrapper input {
                    width: 100%;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--glass-border);
                    padding: 0.6rem 0.6rem 0.6rem 2.5rem;
                    border-radius: 10px;
                    color: var(--text-main);
                    font-size: 0.9rem;
                    transition: 0.2s;
                }
                .search-wrapper input:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(0,0,0,0.3);
                }
                .search-wrapper .search-icon {
                    position: absolute;
                    left: 0.8rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-dim);
                }
                
                .filters-wrapper {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                .custom-select-wrapper {
                    position: relative;
                }
                .custom-select-wrapper select {
                    appearance: none;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--glass-border);
                    padding: 0.6rem 2rem 0.6rem 1rem;
                    border-radius: 10px;
                    color: var(--text-main);
                    font-size: 0.9rem;
                    cursor: pointer;
                    min-width: 130px;
                    transition: 0.2s;
                }
                .custom-select-wrapper select:hover {
                    border-color: rgba(255,255,255,0.2);
                }
                .custom-select-wrapper select:focus {
                    outline: none;
                    border-color: var(--primary);
                }
                .custom-select-wrapper .select-arrow {
                    position: absolute;
                    right: 0.8rem;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: var(--text-dim);
                }
                
                .view-toggle {
                    display: flex;
                    background: rgba(0,0,0,0.2);
                    padding: 0.25rem;
                    border-radius: 10px;
                    border: 1px solid var(--glass-border);
                }
                .view-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    padding: 0.4rem;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.2s;
                }
                .view-btn:hover { color: var(--text-main); }
                .view-btn.active {
                    background: rgba(255,255,255,0.1);
                    color: var(--primary);
                }

                .teams-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                    gap: 2rem;
                    padding: 0.5rem 0;
                    align-items: start;
                }
                .teams-grid-premium.list {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .team-card-premium {
                    position: relative;
                    padding: 2rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    overflow: hidden;
                    transition: box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
                    background: var(--glass-bg);
                    z-index: 1;
                }
                /* List View Overrides */
                .team-card-premium.list-view-item {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 2fr 1.5fr 1fr;
                    padding: 1rem 2rem;
                    align-items: center;
                    gap: 2rem;
                    border-radius: var(--border-radius);
                }
                .team-card-premium.list-view-item .team-header { margin: 0; }
                .team-card-premium.list-view-item .team-header h3 { font-size: 1.1rem; }
                .team-card-premium.list-view-item .icon-btn-ghost { display: none; }
                .team-card-premium.list-view-item .card-accent-border { width: 4px; height: 100%; top: 0; left: 0; }
                .team-card-premium.list-view-item .team-status-row { justify-content: flex-start; gap: 2rem; }
                .team-card-premium.list-view-item .team-mini-stats-grid { display: flex; gap: 2rem; padding: 0.5rem 1rem; background: transparent; border: none; }
                .team-card-premium.list-view-item .mini-stat-item { flex-direction: row; gap: 0.5rem; }
                .team-card-premium.list-view-item .mini-stat-item .lbl { display: none; }
                .team-card-premium.list-view-item .mini-stat-item .val { font-size: 0.9rem; }
                .team-card-premium.list-view-item .team-progress-enhanced { display: flex; flex-direction: column; width: 100%; max-width: 200px; }
                .team-card-premium.list-view-item .team-progress-enhanced .progress-header-sm { font-size: 0.75rem; }
                .team-card-premium.list-view-item .team-actions { margin: 0; padding: 0; display: flex; justify-content: center; }
                .team-card-premium.list-view-item .btn-utility { padding: 0.4rem 0.8rem; font-size: 0.8rem; }
                .team-card-premium.list-view-item.expanded {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                .team-card-premium.expanded {
                    background: var(--bg-dark);
                    border-color: var(--primary-glow);
                    box-shadow: var(--card-shadow);
                    z-index: 10;
                    grid-row: span 2;
                }
                .team-card-premium:hover {
                    box-shadow: var(--card-shadow);
                    background: var(--glass-bg);
                }
                .card-accent-border {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                }
                .team-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: -0.5rem;
                }
                .team-header h3 {
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -0.01em;
                }
                
                .team-status-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .status-badge-sm {
                   display: inline-flex;
                   align-items: center;
                   gap: 0.5rem;
                   padding: 0.25rem 0.75rem;
                   border-radius: var(--border-radius);
                   background: rgba(255,255,255,0.05);
                   font-size: 0.8rem;
                   font-weight: 600;
                   color: var(--text-dim);
                }
                .status-badge-sm .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }
                .status-badge-sm.busy .dot { background-color: #f43f5e; }
                .status-badge-sm.archived .dot { background-color: #94a3b8; }
                
                .team-avatars-mini {
                    display: flex;
                }
                .avatar-circle-sm {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-left: -10px;
                    color: white;
                    box-shadow: var(--card-shadow);
                    border: 2px solid var(--bg-dark);
                }
                .avatar-circle-sm:first-child { margin-left: 0; }
                .avatar-circle-sm.more {
                    background: var(--glass-hover);
                    color: var(--text-dim);
                }
                
                .team-mini-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1rem;
                    padding: 1rem;
                    background: rgba(0,0,0,0.2);
                    border-radius: var(--border-radius);
                    border: 1px solid var(--glass-border);
                }
                .mini-stat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                }
                .mini-stat-item .lbl {
                    font-size: 0.75rem;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .mini-stat-item .val {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
                 .mini-stat-item.overdue .val {
                    color: #f43f5e;
                }

                .team-progress-enhanced {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .progress-header-sm {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-dim);
                }
                .progress-track-sm {
                    height: 6px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                    overflow: hidden;
                }
                .progress-fill-sm {
                    height: 100%;
                    border-radius: 10px;
                }

                /* Expanded Details Styles */
                .team-expanded-details {
                    overflow: hidden;
                }
                .expanded-divider {
                    height: 1px;
                    background: var(--glass-border);
                    margin: 1rem 0;
                    width: 100%;
                }
                .expanded-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 2rem;
                    padding-bottom: 1rem;
                }
                .expanded-col h4 {
                    font-size: 0.9rem;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1rem;
                }
                .members-list-detailed {
                    display: flex;
                    flex-direction: column;
                    gap: 0.8rem;
                }
                .member-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .member-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: 700;
                }
                .member-info {
                    display: flex;
                    flex-direction: column;
                }
                .member-info .name {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .member-info .role {
                    font-size: 0.75rem;
                    color: var(--text-dim);
                }
                .add-member-btn {
                    margin-top: 0.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: transparent;
                    border: 1px dashed var(--glass-border);
                    color: var(--text-dim);
                    padding: 0.5rem;
                    border-radius: 8px;
                    font-size: 0.8rem;
                    cursor: pointer;
                    width: 100%;
                    justify-content: center;
                    transition: 0.2s;
                }
                .add-member-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.05);
                }
                
                .projects-list-mini {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .project-tag-mini {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: rgba(255,255,255,0.03);
                    border-radius: 8px;
                    font-size: 0.85rem;
                    color: var(--text-main);
                }
                .project-tag-mini .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }

                .team-actions {
                    display: flex;
                    justify-content: center;
                    margin-top: auto;
                    padding-top: 0.5rem;
                }
                .btn-utility {
                    padding: 0.6rem;
                    border-radius: var(--border-radius);
                    background: rgba(255,255,255,0.03);
                    border: 1px solid transparent;
                    color: var(--text-dim);
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.85rem;
                    transition: 0.2s;
                }
                .btn-utility:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border-color: rgba(255,255,255,0.1);
                }
                .btn-utility.active-view {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 0 15px var(--primary-glow);
                }
                .btn-utility.delete:hover {
                    background: rgba(244, 63, 94, 0.1);
                    color: #f43f5e;
                    border-color: rgba(244, 63, 94, 0.2);
                }
                
                @media (max-width: 768px) {
                    .expanded-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </motion.div>
    );
};

// --- Create Task Modal ---
const CreateTaskModal = ({ isOpen, onClose, onAdd, initialProject = null, projects = [], teams = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pending',
        deadline: '',
        member: 'Alex Rivera',
        priority: 'Medium',
        project: initialProject || ''
    });

    useEffect(() => {
        if (initialProject) {
            setFormData(prev => ({ ...prev, project: initialProject }));
        }
    }, [initialProject]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...formData, id: Date.now() });
        setFormData({ title: '', description: '', status: 'Pending', deadline: '', member: 'Alex Rivera', priority: 'Medium', project: '' });
    };

    // Dynamically filter members based on the selected project's team
    const projectObj = projects.find(p => p.name === formData.project);
    const teamObj = projectObj ? teams.find(t => t.name === projectObj.team) : null;

    let members = [];
    if (teamObj) {
        members = (teamObj.membersList || []).map(m => typeof m === 'object' ? m.name : m);
    } else if (!formData.project) {
        // Optional: show all unique members if no project is selected yet, 
        // but the user's request suggests they want it restricted.
        // Let's show empty or a prompt unless we have no teams at all (demo mode)
        const allMembers = Array.from(new Set(
            teams.flatMap(t => t.membersList || []).map(m => typeof m === 'object' ? m.name : m)
        ));
        if (allMembers.length === 0) {
            members = ['Alex Rivera', 'Sarah Connor', 'John Doe', 'Marcus Wright', 'Elena Vance'];
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal-overlay"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 30, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="modal-container glass"
                    >
                        <div className="modal-header">
                            <h2>Create <span className="accent-text">New Task</span></h2>
                            <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="What needs to be done?"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Project</label>
                                    <select
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        className={initialProject ? 'prefilled-input' : ''}
                                        required
                                    >
                                        <option value="" disabled hidden>Select a Project</option>
                                        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Add some details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Deadline</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Assigned To</label>
                                    <select
                                        value={formData.member}
                                        onChange={(e) => setFormData({ ...formData, member: e.target.value })}
                                        required
                                    >
                                        {!formData.project && <option value="" disabled hidden>Select Project First</option>}
                                        {formData.project && members.length === 0 && <option value="" disabled hidden>No members in team</option>}
                                        {formData.project && members.length > 0 && <option value="" disabled hidden>Assign to...</option>}
                                        {members.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Pending</option>
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Task</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Task Management Component ---
const Tasks = ({ tasks, onCreateTask, onMoveTask, onDeleteTask, globalSearch = '' }) => {
    const columns = ['Pending', 'In Progress', 'Completed'];

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(globalSearch.toLowerCase())
    );

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return '#f43f5e';
            case 'Medium': return '#f59e0b';
            case 'Low': return '#10b981';
            default: return '#94a3b8';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="tab-content task-board-container"
        >
            {/* Subtle Background Gradient */}


            <div className="content-header">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <h1>Task <span className="accent-text">Board</span></h1>
                    <p>Organize, track, and ship tasks with efficiency.</p>
                </motion.div>
                <motion.div
                    className="header-actions"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.button
                        className="btn-primary create-btn premium-add-btn"
                        onClick={onCreateTask}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 8px 24px rgba(var(--primary-rgb), 0.35), 0 0 20px rgba(var(--primary-rgb), 0.2)'
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Plus size={18} />
                        <span>Add Task</span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Task Analytics Summary */}
            <motion.div
                className="task-analytics-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <motion.div
                    className="analytics-stat-card glass"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                    <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                        <CheckCircle size={20} style={{ color: '#6366f1' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Total Tasks</span>
                        <motion.span
                            className="stat-value"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                        >
                            {filteredTasks.length}
                        </motion.span>
                    </div>
                </motion.div>

                <motion.div
                    className="analytics-stat-card glass"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Completed</span>
                        <motion.span
                            className="stat-value"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                        >
                            {filteredTasks.filter(t => t.status === 'Completed').length}
                        </motion.span>
                    </div>
                </motion.div>

                <motion.div
                    className="analytics-stat-card glass"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                    <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)' }}>
                        <AlertCircle size={20} style={{ color: '#f43f5e' }} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Overdue</span>
                        <motion.span
                            className="stat-value"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                        >
                            {filteredTasks.filter(t => new Date(t.deadline) < new Date() && t.status !== 'Completed').length}
                        </motion.span>
                    </div>
                </motion.div>

                <motion.div
                    className="analytics-stat-card glass progress-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                    <div className="stat-content-full">
                        <div className="progress-header">
                            <span className="stat-label">Overall Progress</span>
                            <motion.span
                                className="stat-value-small"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.3 }}
                            >
                                {filteredTasks.length > 0
                                    ? Math.round((filteredTasks.filter(t => t.status === 'Completed').length / filteredTasks.length) * 100)
                                    : 0}%
                            </motion.span>
                        </div>
                        <div className="analytics-progress-bar">
                            <motion.div
                                className="analytics-progress-fill"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${filteredTasks.length > 0
                                        ? (filteredTasks.filter(t => t.status === 'Completed').length / filteredTasks.length) * 100
                                        : 0}%`
                                }}
                                transition={{ duration: 1.2, delay: 0.9, ease: [0.19, 1, 0.22, 1] }}
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <div className="kanban-board">
                {columns.map((column, index) => (
                    <motion.div
                        key={column}
                        className="kanban-column"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                delay: index * 0.15,
                                duration: 0.6,
                                ease: [0.19, 1, 0.22, 1]
                            }
                        }}
                    >
                        <div className="column-header">
                            <h3>{column}</h3>
                            <span className="task-count">{filteredTasks.filter(t => t.status === column).length}</span>
                        </div>
                        <div className="column-content">
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.filter(t => t.status === column).map((task, taskIndex) => {
                                    const isOverdue = new Date(task.deadline) < new Date();
                                    const daysUntil = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                                    return (
                                        <motion.div
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                transition: {
                                                    delay: taskIndex * 0.05,
                                                    duration: 0.3
                                                }
                                            }}
                                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                            whileHover={{
                                                y: -8,
                                                scale: 1.02,
                                                transition: { duration: 0.2, ease: "easeOut" }
                                            }}
                                            className="task-card glass premium-task-card"
                                        >
                                            {/* Priority Indicator Bar */}
                                            <div
                                                className="priority-indicator-bar"
                                                style={{ backgroundColor: getPriorityColor(task.priority) }}
                                            ></div>

                                            {/* Card Header with Priority and Actions */}
                                            <div className="task-card-header">
                                                <div className="priority-badge-wrapper">
                                                    <span
                                                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                                                        style={{
                                                            '--priority-color': getPriorityColor(task.priority)
                                                        }}
                                                    >
                                                        <span className="priority-dot" style={{ backgroundColor: getPriorityColor(task.priority) }}></span>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                <div className="task-actions">
                                                    <motion.button
                                                        className="move-btn hover-danger"
                                                        onClick={() => onDeleteTask(task.id)}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        title="Delete Task"
                                                    >
                                                        <Trash2 size={14} className="text-dim hover-red" />
                                                    </motion.button>
                                                    {column !== 'Pending' && (
                                                        <motion.button
                                                            className="move-btn"
                                                            onClick={() => onMoveTask(task.id, columns[columns.indexOf(column) - 1])}
                                                            whileHover={{ scale: 1.2, rotate: -5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <ChevronLeft size={14} />
                                                        </motion.button>
                                                    )}
                                                    {column !== 'Completed' && (
                                                        <motion.button
                                                            className="move-btn"
                                                            onClick={() => onMoveTask(task.id, columns[columns.indexOf(column) + 1])}
                                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <ChevronRight size={14} />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="task-card-body">
                                                <h4>{task.title}</h4>
                                                <p>{task.description}</p>

                                                {/* Tag Labels */}
                                                <div className="task-tags">
                                                    {task.priority === 'High' && <span className="task-tag tag-urgent">Urgent</span>}
                                                    {task.title.toLowerCase().includes('design') && <span className="task-tag tag-ui">UI</span>}
                                                    {task.title.toLowerCase().includes('api') && <span className="task-tag tag-backend">Backend</span>}
                                                    {task.title.toLowerCase().includes('bug') && <span className="task-tag tag-bug">Bug</span>}
                                                </div>
                                            </div>

                                            {/* Progress Bar (for In Progress tasks) */}
                                            {task.status === 'In Progress' && (
                                                <div className="task-progress-container">
                                                    <div className="task-progress-bar">
                                                        <motion.div
                                                            className="task-progress-fill"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: '60%' }}
                                                            transition={{ duration: 1, delay: 0.3 }}
                                                            style={{
                                                                background: `linear-gradient(90deg, ${getPriorityColor(task.priority)}, ${getPriorityColor(task.priority)}dd)`
                                                            }}
                                                        ></motion.div>
                                                    </div>
                                                    <span className="progress-label">60%</span>
                                                </div>
                                            )}

                                            {/* Card Footer */}
                                            <div className="task-card-footer">
                                                <div
                                                    className={`deadline-badge ${isOverdue ? 'overdue' : daysUntil <= 3 ? 'urgent' : 'normal'}`}
                                                >
                                                    <Clock3 size={12} />
                                                    <span>{new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <motion.div
                                                    className="member-avatar-circle"
                                                    title={task.member}
                                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    {task.member.split(' ').map(n => n[0]).join('')}
                                                </motion.div>
                                            </div>

                                            <GripVertical className="grip-icon dim" size={16} />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ))}
            </div>




        </motion.div>
    );
};

// --- Messages Component ---
const Messages = ({ teams, globalSearch = '' }) => {
    // 1. Conversations list state
    const [conversations, setConversations] = useState(teams.map(t => ({
        ...t,
        lastMessage: "No messages yet",
        time: "Just now",
        unread: 0,
        messages: []
    })));

    // 2. Selected chat state
    const [selectedTeam, setSelectedTeam] = useState(conversations.length > 0 ? conversations[0] : null);

    // 3. Messages array state (specifically for the active chat)
    const [messages, setMessages] = useState(conversations.length > 0 ? conversations[0].messages : []);

    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showAddConvModal, setShowAddConvModal] = useState(false);
    const [newConvName, setNewConvName] = useState('');
    const [newConvDesc, setNewConvDesc] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showNotification, setShowNotification] = useState(null);
    const messagesEndRef = useRef(null);

    // Mock members list for the dropdown
    const availableMembers = [];

    const triggerNotification = (msg) => {
        setShowNotification(msg);
        setTimeout(() => setShowNotification(null), 3000);
    };

    // Sync messages and selectedTeam when selection changes or conversations update
    useEffect(() => {
        if (!selectedTeam) return;
        const activeConv = conversations.find(c => c.id === selectedTeam.id);
        if (activeConv) {
            setMessages(activeConv.messages);
        }
    }, [selectedTeam?.id, conversations]);

    // Handle auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSelectConversation = (convId) => {
        const conv = conversations.find(c => c.id === convId);
        if (conv) {
            setSelectedTeam(conv);
            setConversations(prev => prev.map(c =>
                c.id === convId ? { ...c, unread: 0 } : c
            ));
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "You",
            content: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            avatar: 'Y'
        };

        // Update local messages for instant UI feedback
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Sync back to conversations list
        setConversations(prev => prev.map(c =>
            c.id === selectedTeam.id
                ? { ...c, messages: updatedMessages, lastMessage: messageText, time: newMessage.time }
                : c
        ));

        setMessageText('');

        // Mock typing indicator
        setTimeout(() => setIsTyping(true), 1000);
        setTimeout(() => setIsTyping(false), 4000);
    };

    const handleCreateConversation = (e) => {
        e.preventDefault();
        if (!newConvName.trim()) return;

        const newConv = {
            id: Date.now(),
            name: newConvName,
            description: newConvDesc,
            members: selectedMembers.length + 1, // +1 for "You"
            color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
            lastMessage: "Conversation started",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            messages: []
        };

        setConversations([newConv, ...conversations]);
        setSelectedTeam(newConv);
        setMessages([]);

        // Reset and close
        setNewConvName('');
        setNewConvDesc('');
        setSelectedMembers([]);
        setShowAddConvModal(false);
        triggerNotification('New conversation created!');
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(globalSearch.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content messages-tab">
            <div className="content-header">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1>Team <span className="accent-text">Chat</span></h1>
                    <p>Real-time collaboration across your workspaces.</p>
                </motion.div>
            </div>

            <div className="messages-container glass">
                {/* Left Panel: Conversation List */}
                <div className="messages-sidebar">
                    <div className="sidebar-chat-header">
                        <h3>Conversations</h3>
                        <motion.button
                            className="icon-btn-ghost active"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="New Chat"
                            onClick={() => setShowAddConvModal(true)}
                        >
                            <Plus size={20} />
                        </motion.button>
                    </div>
                    <div className="chat-search">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search chats..." />
                    </div>
                    <div className="conversations-list custom-scrollbar">
                        {filteredConversations.map(conv => (
                            <motion.div
                                key={conv.id}
                                className={`conversation-item ${selectedTeam?.id === conv.id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(conv.id)}
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="conv-avatar" style={{ background: `linear-gradient(135deg, ${conv.color || '#6366f1'}, ${conv.color || '#6366f1'}88)` }}>
                                    {conv.name[0]}
                                    <div className="status-dot online"></div>
                                </div>
                                <div className="conv-info">
                                    <div className="conv-top">
                                        <span className="conv-name">{conv.name}</span>
                                        <span className="conv-time">{conv.time}</span>
                                    </div>
                                    <div className="conv-bottom">
                                        <p className="conv-preview">{conv.lastMessage}</p>
                                        {conv.unread > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="unread-badge"
                                            >
                                                {conv.unread}
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Chat Window */}
                <div className="chat-window">
                    {!selectedTeam ? (
                        <div className="empty-chat-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h3>No conversations selected</h3>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header-main">
                                <div className="header-left">
                                    <div className="active-chat-avatar-wrapper">
                                        <div className="active-chat-avatar" style={{ background: `linear-gradient(135deg, ${selectedTeam.color}, ${selectedTeam.color}88)` }}>
                                            {selectedTeam.name[0]}
                                        </div>
                                        <motion.div
                                            className="sound-cue-ring"
                                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                    <div className="chat-meta">
                                        <h4>{selectedTeam.name}</h4>
                                        <div className="member-status">
                                            <span className="dot online"></span>
                                            <p>{selectedTeam.members || 0} members • Online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-area custom-scrollbar">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {messages.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="empty-chat-state"
                                        >
                                            <div className="empty-chat-icon glass-dark">
                                                <MessageSquare size={32} />
                                            </div>
                                            <h3>No messages yet</h3>
                                            <p>Start the conversation with {selectedTeam.name}!</p>
                                        </motion.div>
                                    ) : (
                                        messages.map((msg, i) => (
                                            <motion.div
                                                key={msg.id}
                                                layout
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className={`message-bubble-wrapper ${msg.isMe ? 'mine' : 'theirs'}`}
                                            >
                                                {!msg.isMe && (
                                                    <div className="message-header-theirs">
                                                        <div className="msg-avatar-sm" style={{ backgroundColor: selectedTeam.color }}>{msg.avatar}</div>
                                                        <span className="sender-name">{msg.sender}</span>
                                                    </div>
                                                )}
                                                <div className="message-bubble-group">
                                                    <div className={`message-bubble ${msg.isMe ? 'primary-gradient' : 'glass-dark'}`}>
                                                        <p>{msg.content}</p>
                                                        <span className="message-time">{msg.time}</span>

                                                        {/* Hover Actions */}
                                                        <div className="message-actions-overlay glass-dark">
                                                            <button className="action-btn-sm" title="Edit"><Edit2 size={12} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="typing-indicator theirs"
                                        >
                                            <div className="msg-avatar-sm" style={{ backgroundColor: selectedTeam.color }}>{selectedTeam.name[0]}</div>
                                            <div className="typing-dots glass-dark">
                                                <span></span><span></span><span></span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-row" onSubmit={handleSendMessage}>
                                <div className="input-wrapper glass">
                                    <input
                                        type="text"
                                        placeholder={`Message #${selectedTeam.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <motion.button
                                        type="submit"
                                        className={`send-btn ${messageText.trim() ? 'active' : ''}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        disabled={!messageText.trim()}
                                    >
                                        <Send size={18} />
                                    </motion.button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
            {/* Add Conversation Modal */}
            <AnimatePresence>
                {showAddConvModal && (
                    <div className="modal-overlay">
                        <motion.div
                            className="add-conv-modal glass"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h2>Add <span className="accent-text">Conversation</span></h2>
                                <button className="close-btn" onClick={() => setShowAddConvModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateConversation}>
                                <div className="form-group">
                                    <label>Conversation Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Project X Sync"
                                        value={newConvName}
                                        onChange={(e) => setNewConvName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        placeholder="What's this chat about?"
                                        value={newConvDesc}
                                        onChange={(e) => setNewConvDesc(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Select Members</label>
                                    <div className="member-select-grid custom-scrollbar">
                                        {availableMembers.map(member => (
                                            <div
                                                key={member.id}
                                                className={`member-select-card ${selectedMembers.includes(member.id) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    if (selectedMembers.includes(member.id)) {
                                                        setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                                                    } else {
                                                        setSelectedMembers([...selectedMembers, member.id]);
                                                    }
                                                }}
                                            >
                                                <div className="member-avatar-mini">{member.avatar}</div>
                                                <span>{member.name}</span>
                                                {selectedMembers.includes(member.id) && <Check size={14} className="check-icon" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddConvModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Create Conversation</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        className="chat-notification-toast glass"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <Check size={18} className="success-icon" />
                        <span>{showNotification}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const SettingsPage = ({ theme, toggleTheme, onNotify, onLogout, activeSettingTab, setActiveSettingTab }) => {
    const { userProfile, setUserProfile } = useData();

    // Local states for form editing, initialized from global userProfile
    const [profileData, setProfileData] = useState({
        name: userProfile.name,
        username: userProfile.username,
        email: userProfile.email,
        jobTitle: userProfile.jobTitle,
        bio: userProfile.bio
    });
    const [profileImage, setProfileImage] = useState(userProfile.profileImage);
    const fileInputRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [contactData, setContactData] = useState({
        email: userProfile.email,
        phone: userProfile.phone,
        altEmail: userProfile.altEmail,
        location: userProfile.location
    });
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactErrors, setContactErrors] = useState({});

    // Sync local state when userProfile changes
    useEffect(() => {
        setProfileData({
            name: userProfile.name,
            username: userProfile.username,
            email: userProfile.email,
            jobTitle: userProfile.jobTitle,
            bio: userProfile.bio
        });
        setContactData({
            email: userProfile.email,
            phone: userProfile.phone,
            altEmail: userProfile.altEmail,
            location: userProfile.location
        });
        setProfileImage(userProfile.profileImage);
    }, [userProfile]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                // Also update global immediately for avatar in topbar
                setUserProfile(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setUserProfile(prev => ({
            ...prev,
            ...profileData,
            profileImage: profileImage
        }));
        onNotify("Profile updated successfully!");
    };

    const handleSaveContact = (e) => {
        e.preventDefault();
        const errors = {};
        if (!contactData.email.includes('@')) errors.email = true;
        if (contactData.phone.length < 10) errors.phone = true;

        if (Object.keys(errors).length > 0) {
            setContactErrors(errors);
            onNotify("Please fix the validation errors.");
            return;
        }

        setContactErrors({});
        setIsEditingContact(false);
        setUserProfile(prev => ({
            ...prev,
            ...contactData
        }));
        onNotify("Contact information updated!");
    };

    const toggleNotification = (key) => {
        const newSettings = {
            ...userProfile.notificationSettings,
            [key]: !userProfile.notificationSettings[key]
        };
        setUserProfile(prev => ({
            ...prev,
            notificationSettings: newSettings
        }));
    };

    const toggleTwoFactor = () => {
        setUserProfile(prev => ({
            ...prev,
            twoFactorEnabled: !prev.twoFactorEnabled
        }));
    };

    const settingMenu = [
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'Contact', label: 'Contact Info', icon: <Mail size={18} /> },
        { id: 'Notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'Account', label: 'Account', icon: <ShieldCheck size={18} /> }
    ];

    const renderSettingContent = () => {
        switch (activeSettingTab) {
            case 'Profile':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h3>Profile Settings</h3>
                            <p>Manage your public identity and personal details.</p>
                        </div>
                        <form className="profile-edit-card glass-dark" onSubmit={handleSaveProfile}>
                            <div className="profile-setup">
                                <div className="profile-avatar-large">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="avatar-preview-img" />
                                    ) : (
                                        profileData.name.split(' ').map(n => n[0]).join('')
                                    )}
                                    <button
                                        type="button"
                                        className="avatar-edit-badge"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div className="profile-actions">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <button type="button" className="btn-primary-sm" onClick={() => fileInputRef.current.click()}>
                                        Change Avatar
                                    </button>
                                    <button type="button" className="btn-secondary-sm" onClick={() => {
                                        setProfileImage(null);
                                        setUserProfile(prev => ({ ...prev, profileImage: null }));
                                    }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className="settings-form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        placeholder="@username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Job Title</label>
                                    <input
                                        type="text"
                                        value={profileData.jobTitle}
                                        onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                                        placeholder="e.g. Product Designer"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>About You (Bio)</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                            <div className="section-footer">
                                <button type="submit" className="save-btn primary-gradient">Save Changes</button>
                            </div>
                        </form>
                    </div>
                );
            case 'Contact':
                return (
                    <div className="settings-section">
                        <div className="section-header split">
                            <div>
                                <h3>Contact Info</h3>
                                <p>Configure how you want to be reached.</p>
                            </div>
                            <button
                                className={`btn-secondary-sm ${isEditingContact ? 'active' : ''}`}
                                onClick={() => {
                                    if (isEditingContact) setIsEditingContact(false);
                                    else setIsEditingContact(true);
                                }}
                            >
                                {isEditingContact ? 'Cancel' : 'Edit Info'}
                            </button>
                        </div>
                        <form className={`profile-edit-card glass-dark ${isEditingContact ? 'editing' : ''}`} onSubmit={handleSaveContact}>
                            <div className="settings-form-grid">
                                <div className={`form-group ${contactErrors.email ? 'has-error' : ''}`}>
                                    <label>Primary Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            value={contactData.email}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                        />
                                    </div>
                                    {contactErrors.email && <span className="error-text">Invalid email address</span>}
                                </div>
                                <div className={`form-group ${contactErrors.phone ? 'has-error' : ''}`}>
                                    <label>Phone Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            value={contactData.phone}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                                        />
                                    </div>
                                    {contactErrors.phone && <span className="error-text">Invalid phone number</span>}
                                </div>
                                <div className="form-group">
                                    <label>Alternate Email</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            value={contactData.altEmail}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, altEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="input-with-icon">
                                        <Globe size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            value={contactData.location}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {isEditingContact && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="section-footer overflow-hidden"
                                    >
                                        <button type="submit" className="save-btn primary-gradient">Save Contact Info</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            <p>Control where and when you receive updates.</p>
                        </div>
                        <div className="appearance-card glass-dark">
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Task Updates</h4>
                                    <p>Get notified when a task is assigned, moved, or commented on.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.taskUpdates ? 'active' : ''}`}
                                    onClick={() => toggleNotification('taskUpdates')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.taskUpdates ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.taskUpdates && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Project Updates</h4>
                                    <p>Receive alerts for project milestones and status changes.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.projectUpdates ? 'active' : ''}`}
                                    onClick={() => toggleNotification('projectUpdates')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.projectUpdates ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.projectUpdates && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Message Alerts</h4>
                                    <p>Instant notifications for direct messages and team chats.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.messageAlerts ? 'active' : ''}`}
                                    onClick={() => toggleNotification('messageAlerts')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.messageAlerts ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.messageAlerts && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive a daily digest of your activity via email.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.emailNotifications ? 'active' : ''}`}
                                    onClick={() => toggleNotification('emailNotifications')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.emailNotifications ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.emailNotifications && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Weekly Summary</h4>
                                    <p>A comprehensive report of your team's weekly progress.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.weeklySummary ? 'active' : ''}`}
                                    onClick={() => toggleNotification('weeklySummary')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.weeklySummary ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.weeklySummary && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Account':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h3>Account Security</h3>
                            <p>Manage your password and authentication settings.</p>
                        </div>

                        <div className="profile-edit-card glass-dark">
                            <h4 className="setting-sub-title">Change Password</h4>
                            <div className="settings-form-grid">
                                <div className="form-group full-width">
                                    <label>Current Password</label>
                                    <div className="input-with-icon">
                                        <Lock size={16} className="input-icon" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={passwordData.current}
                                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Min. 8 characters"
                                        value={passwordData.new}
                                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Repeat password"
                                        value={passwordData.confirm}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="section-footer">
                                <button className="save-btn primary-gradient" onClick={() => {
                                    if (passwordData.new !== passwordData.confirm) {
                                        onNotify("Passwords do not match!");
                                        return;
                                    }
                                    if (passwordData.new.length < 8) {
                                        onNotify("Password too short!");
                                        return;
                                    }
                                    setPasswordData({ current: '', new: '', confirm: '' });
                                    onNotify("Password updated successfully!");
                                }}>Update Password</button>
                            </div>
                        </div>

                        <div className="appearance-card glass-dark mt-2">
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Two-Factor Authentication</h4>
                                    <p>Add an extra layer of security to your account.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.twoFactorEnabled ? 'active' : ''}`}
                                    onClick={toggleTwoFactor}
                                >
                                    <div className={`switch-track ${userProfile.twoFactorEnabled ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.twoFactorEnabled && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="appearance-card glass-dark mt-2">
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Logout</h4>
                                    <p>Sign out of your account on this device.</p>
                                </div>
                                <button className="btn-secondary-sm" onClick={onLogout}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4 className="text-red">Delete Account</h4>
                                    <p>Permanently delete your account and all associated data.</p>
                                </div>
                                <button className="btn-outline-red" onClick={() => setShowDeleteModal(true)}>
                                    Delete Account
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showDeleteModal && (
                                <div className="modal-overlay">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="add-conv-modal glass-dark text-center"
                                    >
                                        <div className="delete-warning-icon">
                                            <AlertCircle size={48} color="#f43f5e" />
                                        </div>
                                        <h2>Are you sure?</h2>
                                        <p className="text-dim mt-1">This action is permanent and cannot be undone. All your projects, tasks, and data will be lost forever.</p>

                                        <div className="modal-actions mt-2">
                                            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                            <button className="btn-danger-gradient" onClick={() => {
                                                const email = localStorage.getItem('loggedInUser');
                                                if (email) localStorage.removeItem(email);
                                                onLogout();
                                            }}>Yes, Delete My Account</button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-dashboard-container">
            <div className="settings-sidebar glass-dark">
                <div className="settings-sidebar-header">
                    <h4>Settings</h4>
                </div>
                <div className="settings-nav">
                    {settingMenu.map(item => (
                        <button
                            key={item.id}
                            className={`setting-nav-item ${activeSettingTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSettingTab(item.id)}
                        >
                            <span className="setting-icon">{item.icon}</span>
                            <span className="setting-label">{item.label}</span>
                            {activeSettingTab === item.id && (
                                <motion.div layoutId="active-setting-pill" className="active-setting-pill" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                            )}
                        </button>
                    ))}
                </div>
            </div>
            <div className="settings-main-panel">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSettingTab}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="setting-content-viewport"
                    >
                        {renderSettingContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---
const Dashboard = ({ onLogout, theme, toggleTheme, user = { name: 'Alex Rivera' } }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');
    const [activeSettingTab, setActiveSettingTab] = useState('Profile');
    const [searchQuery, setSearchQuery] = useState('');

    const navigateToSettings = (subTab) => {
        setActiveSettingTab(subTab);
        setActiveTab('Settings');
    };

    // Grab state from unified Data context
    const { projects, setProjects, teams, setTeams, tasks, setTasks, userProfile, setUserProfile } = useData();

    const [activeModal, setActiveModal] = useState(null); // 'project', 'team', 'task', 'addMember'
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [prefilledProject, setPrefilledProject] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const addProject = (p) => {
        setProjects([p, ...projects]);
        setActiveModal(null);
        showNotification("Project created successfully!");
    };

    const addTeam = (t) => {
        setTeams([t, ...teams]);
        setActiveModal(null);
        showNotification("Team created successfully!");
    };

    const handleAddMember = (memberData) => {
        if (!selectedTeam) return;

        const newMember = { name: memberData.name, role: memberData.role };

        setTeams(teams.map(t => {
            if (t.id === selectedTeam.id) {
                // Merge projects without duplicates
                const uniqueProjects = Array.from(new Set([...(t.assignedProjects || []), ...memberData.projects]));
                return {
                    ...t,
                    members: t.members + 1,
                    membersList: [...(t.membersList || []), newMember],
                    assignedProjects: uniqueProjects
                };
            }
            return t;
        }));

        showNotification(`${memberData.name} added to ${selectedTeam.name}`);
    };

    const handleRemoveMember = (teamId, memberName) => {
        setTeams(teams.map(t => {
            if (t.id === teamId) {
                return {
                    ...t,
                    members: Math.max(0, t.members - 1),
                    membersList: (t.membersList || []).filter(m => (typeof m === 'object' ? m.name : m) !== memberName)
                };
            }
            return t;
        }));
        showNotification(`${memberName} removed from team`);
    };

    const handleUpdateTeamProjects = (teamId, updatedProjects) => {
        setTeams(teams.map(t => t.id === teamId ? { ...t, assignedProjects: updatedProjects } : t));
        showNotification("Team projects updated successfully");
    };
    const addTask = (ta) => { setTasks([ta, ...tasks]); setActiveModal(null); setPrefilledProject(null); };
    const moveTask = (id, newStatus) => setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
                return {
                    ...t,
                    status: newStatus,
                    completedAt: newStatus === 'Completed' ? new Date().toISOString() : null
                };
            }
            return t;
        }));
    };

    const handleDeleteTask = (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setTasks(tasks.filter(t => t.id !== id));
            showNotification("Task deleted successfully");
        }
    };

    const handleDeleteTeam = (id) => {
        const teamToDelete = teams.find(t => t.id === id);
        if (teamToDelete) {
            if (window.confirm(`Are you sure you want to delete the team "${teamToDelete.name}"? Associated tasks will also be removed.`)) {

                // 1. Remove team from state
                setTeams(teams.filter(t => t.id !== id));

                // 2. Remove associated tasks if linked (by team member name, or team name)
                const teamMemberNames = (teamToDelete.membersList || []).map(m => typeof m === 'object' ? m.name : m);
                setTasks(tasks.filter(t => !teamMemberNames.includes(t.member) && t.team !== teamToDelete.name));

                showNotification("Team deleted successfully");
            }
        }
    };

    const menuItems = [
        { name: 'Overview', icon: <LayoutDashboard size={20} /> },
        { name: 'Projects', icon: <FolderKanban size={20} /> },
        { name: 'Tasks', icon: <CheckCircle size={20} /> },
        { name: 'Team', icon: <Users size={20} /> },
        { name: 'Messages', icon: <MessageSquare size={20} /> },
        { name: 'Settings', icon: <Settings size={20} /> }
    ];

    const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="dashboard-layout">


            {/* Sidebar */}
            <motion.aside
                className={`sidebar glass ${isCollapsed ? 'collapsed' : ''}`}
                initial="expanded"
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={{
                    expanded: {
                        width: '280px',
                        transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 25,
                            staggerChildren: 0.05,
                            delayChildren: 0.1
                        }
                    },
                    collapsed: {
                        width: '80px',
                        transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 25
                        }
                    }
                }}
            >
                <div className="sidebar-header">
                    <motion.div
                        className="logo-section"
                        onClick={() => setActiveTab('Overview')}
                        style={{ cursor: 'pointer' }}
                        whileHover="hover"
                    >
                        <motion.div
                            variants={{
                                hover: { rotate: 360, scale: 1.2, filter: "drop-shadow(0 0 8px var(--primary))" }
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            <Layers className="logo-icon" size={28} />
                        </motion.div>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                Sprint Plans
                            </motion.span>
                        )}
                    </motion.div>
                    <motion.button
                        className="collapse-btn"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)', rotate: isCollapsed ? 0 : 180 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </motion.button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.name}
                            className={`nav-link ${activeTab === item.name ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(item.name);
                                if (item.name === 'Settings') setActiveSettingTab('Profile');
                            }}
                            variants={{
                                expanded: { opacity: 1, x: 0 },
                                collapsed: { opacity: 1, x: 0 }
                            }}
                            whileHover={{
                                x: isCollapsed ? 0 : 8,
                                backgroundColor: 'var(--glass-hover)',
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.span
                                className="nav-icon"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {item.icon}
                            </motion.span>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="nav-label"
                                >
                                    {item.name}
                                </motion.span>
                            )}
                            {activeTab === item.name && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="active-pill"
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 25,
                                        mass: 0.8
                                    }}
                                />
                            )}
                        </motion.button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <motion.button
                        className="logout-btn"
                        onClick={onLogout}
                        title="Logout"
                        animate={{
                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                            padding: isCollapsed ? '1rem 0' : '1rem 1.25rem'
                        }}
                        whileHover={{
                            scale: 1.05,
                            backgroundColor: 'rgba(248, 113, 113, 0.12)',
                            x: isCollapsed ? 0 : 4
                        }}
                        whileTap={{ scale: 0.95 }}
                        style={{ width: '100%' }}
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                        {!isCollapsed && <span>Logout</span>}
                    </motion.button>
                </div>
            </motion.aside>

            {/* Main Wrapper */}
            <div className="main-wrapper">
                {/* Topbar */}
                <header className="topbar glass">
                    <div className="topbar-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="topbar-actions">
                        <motion.button
                            className="action-icon-btn"
                            onClick={toggleTheme}
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>

                        <motion.button
                            className="action-icon-btn badge-container"
                            onClick={() => navigateToSettings('Notifications')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Notifications"
                        >
                            <Bell size={20} />
                            <span className="badge"></span>
                        </motion.button>

                        <motion.div
                            className="profile-group"
                            onClick={() => navigateToSettings('Profile')}
                            style={{ cursor: 'pointer' }}
                            whileHover={{ scale: 1.02, backgroundColor: 'var(--glass-hover)' }}
                        >
                            <div className="profile-info">
                                <span className="profile-name">{userProfile.name}</span>
                            </div>
                            <motion.div
                                className="profile-avatar"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                            >
                                {userProfile.profileImage ? (
                                    <img src={userProfile.profileImage} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="dashboard-content">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <Overview
                                    projects={projects}
                                    teams={teams}
                                    tasks={tasks}
                                    onNavigateToProjects={() => setActiveTab('Projects')}
                                    onCreateProject={() => setActiveModal('project')}
                                    globalSearch={searchQuery}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'Projects' && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <Projects
                                    projects={projects}
                                    setProjects={setProjects}
                                    tasks={tasks}
                                    onUpdateTask={toggleTaskCompletion}
                                    onCreateTask={(projectName) => {
                                        setPrefilledProject(projectName);
                                        setActiveModal('task');
                                    }}
                                    globalSearch={searchQuery}
                                    onCreateProject={() => setActiveModal('project')}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'Tasks' && (
                            <motion.div
                                key="tasks"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <Tasks
                                    tasks={tasks}
                                    onMoveTask={moveTask}
                                    onCreateTask={() => setActiveModal('task')}
                                    onDeleteTask={handleDeleteTask}
                                    globalSearch={searchQuery}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'Team' && (
                            <motion.div
                                key="teams"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <Teams
                                    teams={teams}
                                    tasks={tasks}
                                    onCreateTeam={() => setActiveModal('team')}
                                    onDeleteTeam={handleDeleteTeam}
                                    onAddMemberClick={(team) => {
                                        setSelectedTeam(team);
                                        setActiveModal('addMember');
                                    }}
                                    onManageProjectsClick={(team) => {
                                        setSelectedTeam(team);
                                        setActiveModal('manageProjects');
                                    }}
                                    onRemoveMember={handleRemoveMember}
                                    globalSearch={searchQuery}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'Messages' && (
                            <motion.div
                                key="messages"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <Messages teams={teams} globalSearch={searchQuery} />
                            </motion.div>
                        )}
                        {activeTab === 'Settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <SettingsPage
                                    theme={theme}
                                    toggleTheme={toggleTheme}
                                    onNotify={showNotification}
                                    onLogout={onLogout}
                                    activeSettingTab={activeSettingTab}
                                    setActiveSettingTab={setActiveSettingTab}
                                />
                            </motion.div>
                        )}
                        {activeTab !== 'Overview' && activeTab !== 'Projects' && activeTab !== 'Team' && activeTab !== 'Tasks' && activeTab !== 'Messages' && activeTab !== 'Settings' && (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                className="placeholder-view"
                                transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                            >
                                <h2>{activeTab} <span className="accent-text">Module</span></h2>
                                <p>This section is currently being futuristicized. Stay tuned!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <CreateProjectModal
                isOpen={activeModal === 'project'}
                onClose={() => setActiveModal(null)}
                onAdd={addProject}
                teams={teams}
            />
            <CreateTeamModal
                isOpen={activeModal === 'team'}
                onClose={() => setActiveModal(null)}
                onAdd={addTeam}
            />
            <AddMemberModal
                isOpen={activeModal === 'addMember'}
                onClose={() => setActiveModal(null)}
                onAdd={handleAddMember}
                teamName={selectedTeam?.name}
                availableProjects={projects.map(p => p.name)}
            />

            <ManageProjectsModal
                isOpen={activeModal === 'manageProjects'}
                onClose={() => setActiveModal(null)}
                onUpdate={handleUpdateTeamProjects}
                team={selectedTeam}
                allProjects={projects}
            />

            <CreateTaskModal
                isOpen={activeModal === 'task'}
                onClose={() => { setActiveModal(null); setPrefilledProject(null); }}
                onAdd={addTask}
                initialProject={prefilledProject}
                projects={projects}
                teams={teams}
            />

            <style>{`
                .dashboard-layout {
                    display: flex;
                    min-height: 100vh;
                    width: 100vw;
                    background: var(--bg-dark);
                    color: var(--text-main);
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-inter);
                }

                /* Sidebar Styles */
                .sidebar {
                    height: 100vh;
                    border-right: 1px solid var(--glass-border);
                    display: flex;
                    flex-direction: column;
                    z-index: 100;
                    background: rgba(var(--bg-rgb), 0.5);
                    padding: 2.5rem 1.25rem;
                    user-select: none;
                }

                .sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4rem;
                }
                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-weight: 800;
                    font-size: 1.25rem;
                    letter-spacing: -0.02em;
                }
                .logo-icon { color: var(--primary); filter: drop-shadow(0 0 10px var(--primary-glow)); }
                
                .collapse-btn {
                    background: transparent;
                    border: 1px solid var(--glass-border);
                    color: var(--text-main);
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .collapse-btn:hover { border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    flex: 1;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1rem 1.25rem;
                    border-radius: var(--border-radius);
                    border: none;
                    background: transparent;
                    color: var(--text-dim);
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    font-weight: 600;
                }
                .nav-link:hover {
                    color: var(--text-main);
                    background: var(--glass-hover);
                }
                .nav-link.active {
                    color: var(--text-main);
                    background: rgba(var(--primary-rgb), 0.1);
                }
                .active-pill {
                    position: absolute;
                    left: 0;
                    width: 4px;
                    height: 60%;
                    background: var(--primary);
                    border-radius: 0 4px 4px 0;
                    box-shadow: 0 0 15px var(--primary-glow);
                }

                .sidebar-footer { padding-top: 2rem; border-top: 1px solid var(--glass-border); }
                .logout-btn {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    width: 100%;
                    padding: 1rem 1.25rem;
                    background: transparent;
                    border: none;
                    color: #f87171;
                    cursor: pointer;
                    font-weight: 600;
                    transition: 0.3s;
                }
                .logout-btn:hover { background: rgba(248, 113, 113, 0.08); border-radius: var(--border-radius); }

                /* Main Wrapper */
                .main-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .topbar {
                    height: 90px;
                    padding: 0 4rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--glass-border);
                    position: sticky;
                    top: 0;
                    background: var(--glass-bg);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    z-index: 90;
                }

                .topbar-search {
                    display: flex;
                    align-items: center;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    padding: 0.75rem 1.5rem;
                    border-radius: 50px;
                    width: 400px;
                    gap: 1.25rem;
                    transition: 0.3s;
                }
                
                html.light .topbar-search {
                    background: rgba(0, 0, 0, 0.03);
                }

                .topbar-search:focus-within { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
                .topbar-search input {
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    width: 100%;
                    outline: none;
                    font-size: 0.95rem;
                }
                .topbar-search input::placeholder {
                    color: var(--text-dim);
                    opacity: 0.6;
                }

                .topbar-actions { display: flex; align-items: center; gap: 2rem; }
                .action-icon-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    position: relative;
                    transition: 0.3s;
                }
                .action-icon-btn:hover { color: var(--text-main); transform: translateY(-2px); }
                .badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: var(--primary);
                    border-radius: 50%;
                    border: 2px solid var(--bg-dark);
                }

                .profile-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: var(--glass-bg);
                    padding: 0.35rem 0.35rem 0.35rem 1.25rem;
                    border-radius: 50px;
                    border: 1px solid var(--glass-border);
                    cursor: pointer;
                    transition: 0.3s;
                }
                .profile-info { display: flex; flex-direction: column; text-align: right; }
                .profile-name { font-weight: 700; font-size: 0.9rem; color: var(--text-main); }
                .profile-role { font-size: 0.75rem; color: var(--text-dim); }
                .profile-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #a855f7, #6366f1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 0.9rem;
                    color: white;
                    border: none;
                }

                /* Dashboard Content */
                .dashboard-content { padding: 4rem; }
                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 4rem;
                }
                .content-header h1 { font-size: 3rem; font-weight: 800; margin-bottom: 0.5rem; letter-spacing: -0.03em; }
                .content-header p { color: var(--text-dim); font-size: 1.2rem; }
                .create-btn { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.75rem; border-radius: var(--border-radius); font-weight: 700; }

                /* Stats Section */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                    margin-bottom: 4rem;
                }
                .stat-card {
                    padding: 2.5rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-lift:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.25);
                    box-shadow: var(--card-shadow);
                }
                .stat-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                }
                .stat-info { display: flex; flex-direction: column; gap: 0.5rem; z-index: 2; }
                .stat-label { font-size: 0.9rem; color: var(--text-dim); font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
                .stat-value { font-size: 2rem; font-weight: 800; display: flex; align-items: baseline; gap: 4px; }
                .stat-change { font-size: 0.9rem; font-weight: 700; }
                
                .soft-glow {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    opacity: 0.5;
                    pointer-events: none;
                    animation: pulse-glow 8s infinite alternate ease-in-out;
                }
                @keyframes pulse-glow {
                    0% { transform: scale(1); opacity: 0.3; }
                    100% { transform: scale(1.1); opacity: 0.6; }
                }

                /* Grid Content */
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 3rem;
                }
                .grid-card { padding: 3rem; border-radius: var(--border-radius); min-height: 550px; }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
                .card-header h3 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; }

                /* Table Styles */
                .table-responsive { overflow-x: auto; }
                .projects-table { width: 100%; border-collapse: collapse; text-align: left; }
                /* Table Styles */
                .table-responsive { overflow-x: auto; }
                .projects-table { width: 100%; border-collapse: collapse; text-align: left; }
                .projects-table th { 
                    padding: 1.5rem 1rem; 
                    font-size: 0.85rem; 
                    text-transform: uppercase; 
                    letter-spacing: 0.06em; 
                    color: rgba(148, 163, 184, 0.4); 
                    border-bottom: 1px solid var(--glass-border); 
                }
                .projects-table td { padding: 2rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.03); }
                .project-name { font-weight: 800; font-size: 1.1rem; }
                .team-cell { color: var(--text-dim); font-size: 1rem; font-weight: 500; }
                
                .progress-wrapper { display: flex; align-items: center; gap: 1.5rem; width: 100%; }
                .progress-bar-bg { flex: 1; height: 8px; background: var(--glass-border); border-radius: var(--border-radius); overflow: hidden; }
                .progress-bar-fill { height: 100%; background: var(--primary); border-radius: var(--border-radius); }
                .percent { font-size: 0.9rem; font-weight: 800; width: 45px; }

                .status-tag { 
                    padding: 0.5rem 1rem; 
                    border-radius: 10px; 
                    font-size: 0.8rem; 
                    font-weight: 800; 
                    display: flex; 
                    align-items: center;
                    gap: 0.5rem;
                    width: fit-content;
                }
                .on-track { background: rgba(16, 185, 129, 0.1); color: #10b981; }
                .delayed { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
                .nearly-done { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
                .just-started { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }

                .btn-secondary-sm {
                    padding: 0.5rem 1.25rem;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-main);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .btn-secondary-sm:hover { background: var(--glass-hover); border-color: var(--primary); }

                .delete-hover:hover { color: #f43f5e !important; background: rgba(244, 63, 94, 0.1) !important; }

                /* Timeline Styles */
                .timeline-container { display: flex; flex-direction: column; gap: 2.5rem; position: relative; }
                .timeline-container::before {
                    content: '';
                    position: absolute;
                    left: 7px;
                    top: 15px;
                    bottom: 15px;
                    width: 2px;
                    background: var(--glass-border);
                }
                .timeline-item { display: flex; gap: 2.5rem; position: relative; }
                .timeline-dot {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: var(--glass-bg);
                    border: 4px solid var(--bg-dark);
                    z-index: 2;
                    margin-top: 6px;
                }
                .timeline-dot.success { background: #10b981; box-shadow: var(--card-shadow); }
                .timeline-dot.info { background: #6366f1; box-shadow: var(--card-shadow); }
                .timeline-dot.warning { background: #f59e0b; box-shadow: var(--card-shadow); }
                
                .timeline-content { display: flex; flex-direction: column; gap: 0.4rem; }
                .timeline-content p { font-weight: 800; font-size: 1.05rem; letter-spacing: -0.01em; }
                .timeline-content .subtext { font-size: 0.9rem; color: var(--text-dim); line-height: 1.5; font-weight: 500; }
                .timeline-content .time { font-size: 0.8rem; color: rgba(148, 163, 184, 0.5); margin-top: 0.4rem; font-weight: 700; }

                .placeholder-view {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    text-align: center;
                    gap: 1.5rem;
                }
                .placeholder-view h2 { font-size: 3rem; font-weight: 800; }

                @media (max-width: 1550px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                /* --- Analytics Section Styles --- */
                .analytics-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 1fr;
                    gap: 2rem;
                    margin: 3rem 0;
                }
                .analytics-card {
                    padding: 2.5rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    position: relative;
                    overflow: hidden;
                    background: var(--glass-bg);
                }
                
                .hover-glow-card:hover {
                    box-shadow: var(--card-shadow);
                    border-color: rgba(var(--primary-rgb), 0.4);
                }
                 .premium-tooltip {
                    background: var(--bg-darker);
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--card-shadow);
                    padding: 0.85rem 1.25rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 2px;
                }
                .tooltip-val {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--primary);
                }
                .tooltip-lbl {
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .tooltip-arrow {
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%) rotate(45deg);
                    width: 12px;
                    height: 12px;
                    background: var(--bg-darker);
                    border-right: 1px solid var(--glass-border);
                    border-bottom: 1px solid var(--glass-border);
                }
                .pulse-text {
                    animation: textPulse 2s infinite ease-in-out;
                }
                @keyframes textPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .bar-chart-container { 
                    display: flex; 
                    align-items: flex-end; 
                    justify-content: space-around; 
                    height: 180px; 
                    padding: 0 5px;
                    gap: 0.5rem;
                }
                .bar-group { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    gap: 0.75rem; 
                    flex: 1;
                    min-width: 0;
                }
                .bar-rail { width: 14px; height: 140px; background: var(--glass-border); border-radius: var(--border-radius); position: relative; overflow: visible; }
                
                .bar-fill { position: absolute; bottom: 0; left: 0; width: 100%; border-radius: 10px; box-shadow: var(--card-shadow); }
                .bar-label { font-size: 0.7rem; color: var(--text-dim); font-weight: 700; white-space: nowrap; transform: rotate(-25deg); }

                .donut-content { display: flex; align-items: center; gap: 1.5rem; width: 100%; }
                .donut-svg-wrapper { position: relative; flex-shrink: 0; }
                .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; }
                .total-num { font-size: 1.5rem; font-weight: 800; color: var(--text-main); line-height: 1; }
                .total-lbl { font-size: 0.65rem; text-transform: uppercase; color: var(--text-dim); font-weight: 700; margin-top: 4px; }
                .donut-legend { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; min-width: 0; }
                .legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; padding: 0.4rem 0.5rem; border-radius: 8px; transition: 0.3s; min-width: 0; }
                .legend-item:hover { background: var(--glass-hover); }
                .dot-group { display: flex; align-items: center; gap: 0.5rem; min-width: 0; overflow: hidden; }
                .legend-item .dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
                .legend-item .lbl { color: var(--text-dim); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .legend-item .val { font-weight: 800; color: var(--text-main); background: var(--glass-bg); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; flex-shrink: 0; }

                .chart-labels {
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    margin-top: 1rem;
                    color: var(--text-dim);
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                }
                .chart-labels span {
                    width: 30px;
                    text-align: center;
                }

                /* --- Project Vault Premium Styles --- */
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
                    gap: 3rem;
                    margin-top: 2.5rem;
                    padding: 0.5rem;
                }
                .project-card {
                    padding: 2.5rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    flex-direction: column;
                    gap: 1.75rem;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 1px solid var(--glass-border);
                    position: relative;
                    min-height: 280px;
                    background: var(--glass-bg);
                    box-shadow: var(--card-shadow);
                    
                }
                .project-card.expanded { grid-row: span 2; }
                .project-card:hover { 
                    border-color: rgba(var(--primary-rgb), 0.4);
                    box-shadow: var(--card-shadow);
                }

                .floating-card {
                    animation: float-subtle 6s ease-in-out infinite;
                }
                .floating-card:nth-child(2n) {
                    animation-delay: 1s;
                }
                .floating-card:nth-child(3n) {
                    animation-delay: 2s;
                }
                @keyframes float-subtle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-2px); }
                }

                .projects-controls {
                    padding: 1.5rem 2rem;
                    border-radius: var(--border-radius);
                    margin-bottom: 2rem;
                    background: var(--glass-bg);
                    box-shadow: var(--card-shadow);
                    
                }

                .filter-select {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                .filter-select:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(var(--primary-rgb), 0.3);
                    box-shadow: var(--card-shadow);
                }
                .filter-select select {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: var(--text-main);
                }

                .premium-badge {
                    padding: 0.4rem 0.8rem;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    letter-spacing: 0.02em;
                    border: 1px solid transparent;
                    box-shadow: var(--card-shadow);
                }
                .premium-badge.on-track { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
                .premium-badge.delayed { background: rgba(244, 63, 94, 0.1); color: #f43f5e; border-color: rgba(244, 63, 94, 0.2); }
                .premium-badge.nearly-done { background: rgba(99, 102, 241, 0.1); color: #6366f1; border-color: rgba(99, 102, 241, 0.2); }
                
                .task-count-badge {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.4rem 0.8rem;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-dim);
                    border: 1px solid var(--glass-border);
                }

                .top-left { display: flex; align-items: center; gap: 0.75rem; }
                .card-actions { display: flex; align-items: center; gap: 0.5rem; }
                .action-btn-styled {
                    width: 38px;
                    height: 38px;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    outline: none;
                    box-shadow: var(--card-shadow);
                }
                .action-mini-btn { width: 34px; height: 34px; border-radius: 10px; }

                .premium-progress { margin: 1rem 0; }
                .prog-text { font-size: 0.85rem; font-weight: 700; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }
                .prog-val { font-size: 0.95rem; font-weight: 800; color: var(--text-main); }
                .smooth-rail { height: 10px; background: var(--glass-border); border-radius: var(--border-radius); margin-top: 0.75rem; }
                .animated-fill { height: 100%; border-radius: var(--border-radius); position: relative; }
                .animated-fill::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: var(--glass-bg);
                    animation: prog-shimmer 2s infinite;
                }
                @keyframes prog-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .btn-expand-full {
                    width: 100%;
                    padding: 0.85rem;
                    border-top: 1px solid var(--glass-border);
                    background: transparent;
                    border-bottom: none; border-left: none; border-right: none;
                    color: var(--text-dim);
                    font-weight: 700;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: 0.3s;
                    margin-top: 1.5rem;
                }
                .btn-expand-full:hover { color: var(--text-main); }

                .expanded-project-details { 
                    margin-top: 1rem; 
                    padding: 1.5rem; 
                    background: rgba(255,255,255,0.02); 
                    border-radius: var(--border-radius); 
                    border: 1px solid var(--glass-border);
                    overflow: hidden;
                }

                .tasks-list-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .tasks-list-header h4 { 
                    font-size: 0.85rem; 
                    text-transform: uppercase; 
                    color: var(--text-dim); 
                    letter-spacing: 0.05em;
                    margin: 0;
                }

                .btn-add-mini {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: rgba(var(--primary-rgb), 0.1);
                    border: 1px solid rgba(var(--primary-rgb), 0.3);
                    border-radius: 10px;
                    color: var(--primary);
                    font-size: 0.8rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .btn-add-mini:hover {
                    background: rgba(var(--primary-rgb), 0.2);
                    transform: translateY(-2px);
                }

                .detailed-task-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                }

                .detailed-task-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.25rem;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius);
                    transition: all 0.3s;
                }
                .detailed-task-item:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(var(--primary-rgb), 0.2);
                    transform: translateX(4px);
                }
                .detailed-task-item.completed {
                    opacity: 0.6;
                }
                .detailed-task-item.completed .task-title {
                    text-decoration: line-through;
                    color: var(--text-dim);
                }

                .task-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }

                .task-checkbox {
                    width: 22px;
                    height: 22px;
                    border: 2px solid var(--glass-border);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    flex-shrink: 0;
                }
                .task-checkbox:hover {
                    border-color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.1);
                }
                .task-checkbox.checked {
                    background: var(--primary);
                    border-color: var(--primary);
                    color: white;
                }

                .task-info-main {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    flex: 1;
                }
                .task-title {
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: var(--text-main);
                }
                .task-submeta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    color: var(--text-dim);
                }
                .meta-member {
                    font-weight: 600;
                }
                .divider-dot {
                    width: 3px;
                    height: 3px;
                    background: var(--text-dim);
                    border-radius: 50%;
                    opacity: 0.5;
                }
                .meta-date {
                    font-weight: 500;
                }

                .task-right {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .status-badge-mini {
                    padding: 0.35rem 0.75rem;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }
                .status-badge-mini.pending {
                    background: rgba(148, 163, 184, 0.1);
                    color: #94a3b8;
                }
                .status-badge-mini.in-progress {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b;
                }
                .status-badge-mini.completed {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                .empty-tasks-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1rem;
                    gap: 1rem;
                }
                .dim-icon {
                    color: var(--text-dim);
                    opacity: 0.3;
                }
                .empty-tasks-state p {
                    font-size: 0.9rem;
                    color: var(--text-dim);
                    font-style: italic;
                }

                .btn-add-full-card {
                    width: 100%;
                    padding: 1rem;
                    background: rgba(var(--primary-rgb), 0.05);
                    border: 1px dashed rgba(var(--primary-rgb), 0.3);
                    border-radius: var(--border-radius);
                    color: var(--primary);
                    font-size: 0.85rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-top: 1rem;
                }
                .btn-add-full-card:hover {
                    background: rgba(var(--primary-rgb), 0.1);
                    border-style: solid;
                    transform: translateY(-2px);
                }

                .prefilled-input {
                    background: rgba(var(--primary-rgb), 0.05) !important;
                    border-color: rgba(var(--primary-rgb), 0.3) !important;
                }

                /* --- Task Analytics Summary --- */
                .task-analytics-summary {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .analytics-stat-card {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1.5rem;
                    border-radius: var(--border-radius);
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--card-shadow);
                    
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .analytics-stat-card:hover {
                    box-shadow: var(--card-shadow);
                    border-color: rgba(var(--primary-rgb), 0.2);
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: var(--card-shadow);
                }

                .stat-content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .stat-label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .stat-value {
                    font-size: 2rem;
                    font-weight: 900;
                    color: var(--text-main);
                    line-height: 1;
                }
                .stat-value-small {
                    font-size: 1.5rem;
                    font-weight: 900;
                    color: var(--text-main);
                    line-height: 1;
                }

                .progress-card {
                    grid-column: span 1;
                }
                .stat-content-full {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                }
                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .analytics-progress-bar {
                    height: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 100px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: var(--card-shadow);
                }
                .analytics-progress-fill {
                    height: 100%;
                    background: var(--glass-bg);
                    border-radius: 100px;
                    position: relative;
                    box-shadow: var(--card-shadow);
                }
                .analytics-progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--glass-bg);
                    animation: shimmer-analytics 2.5s infinite;
                }
                @keyframes shimmer-analytics {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @media (max-width: 1400px) {
                    .analytics-grid { grid-template-columns: 1fr 1fr; }
                    .analytics-card:first-child { grid-column: span 2; }
                    .task-analytics-summary { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 900px) {
                    .analytics-grid { grid-template-columns: 1fr; }
                    .analytics-card:first-child { grid-column: span 1; }
                    .donut-content { flex-direction: column; }
                    .task-analytics-summary { grid-template-columns: 1fr; }
                    .kanban-board { grid-template-columns: 1fr; gap: 2rem; }
                }

                @media (max-width: 1100px) { 
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .dashboard-content { padding: 2rem; }
                }

                /* --- Modal Styles --- */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 1.5rem;
                }
                .modal-container {
                    width: 100%;
                    max-width: 580px;
                    background: var(--bg-darker);
                    padding: 2.5rem;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--glass-border);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    max-height: 85vh;
                    overflow-y: auto;
                }
                
                .modal-container::-webkit-scrollbar {
                    width: 6px;
                }
                .modal-container::-webkit-scrollbar-track {
                    background: transparent;
                }
                .modal-container::-webkit-scrollbar-thumb {
                    background: var(--glass-border);
                    border-radius: 10px;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 {
                    font-size: 1.75rem !important;
                    font-weight: 800;
                    margin-bottom: 0 !important;
                    background: none !important;
                    -webkit-text-fill-color: initial !important;
                    color: var(--text-main) !important;
                }
                .modal-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .form-group label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-dim);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .form-group input, .form-group select, .form-group textarea {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    padding: 0.75rem 1rem;
                    border-radius: var(--border-radius);
                    color: var(--text-main);
                    outline: none;
                    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    font-family: inherit;
                    width: 100%;
                    font-size: 0.95rem;
                    color-scheme: dark;
                }
                html.light .form-group input, html.light .form-group select, html.light .form-group textarea {
                    color-scheme: light;
                }
                .form-group select option {
                    background: var(--bg-darker);
                    color: var(--text-main);
                }
                html.light .form-group select option {
                    background: #ffffff;
                    color: #0f172a;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.02);
                    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1.25rem;
                    margin-top: 1rem;
                }
                .color-picker { display: flex; gap: 0.75rem; padding: 0.5rem 0; }
                .color-dot { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: 0.3s; }
                .color-dot:hover { transform: scale(1.1); }
                .color-dot.active { border-color: white; transform: scale(1.1); box-shadow: var(--card-shadow); }

                /* --- Premium Kanban Board Styles --- */
                .task-board-container {
                    position: relative;
                    overflow: visible;
                }
                @keyframes gradient-shift {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }

                .premium-add-btn {
                    position: relative;
                    overflow: hidden;
                    background: var(--glass-bg);
                    box-shadow: var(--card-shadow);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-add-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: var(--glass-bg);
                    transition: left 0.5s;
                }
                .premium-add-btn:hover::before {
                    left: 100%;
                }
                .premium-add-btn:active {
                    transform: scale(0.95);
                }

                .kanban-board { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 3rem; 
                    min-height: 600px;
                    padding: 0.5rem;
                    position: relative;
                    z-index: 1;
                }
                
                .kanban-column { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 1.5rem; 
                    background: var(--glass-bg);
                    padding: 2rem; 
                    border-radius: var(--border-radius);
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--card-shadow);
                    
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .kanban-column::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: var(--border-radius);
                    background: rgba(99, 102, 241, 0.03);
                    opacity: 0;
                    transition: opacity 0.4s;
                    pointer-events: none;
                }
                .kanban-column:hover {
                    box-shadow: var(--card-shadow);
                    transform: translateY(-2px);
                }
                .kanban-column:hover::before {
                    opacity: 1;
                }

                .column-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 1.25rem;
                    border-bottom: 2px solid var(--glass-border);
                    margin-bottom: 0.5rem;
                    position: relative;
                }
                .column-header::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 40px;
                    height: 2px;
                    background: var(--primary);
                    border-radius: 2px;
                    box-shadow: var(--card-shadow);
                    transition: width 0.3s;
                }
                .kanban-column:hover .column-header::after {
                    width: 80px;
                }
                .column-header h3 { 
                    font-size: 1.2rem; 
                    font-weight: 900; 
                    letter-spacing: -0.01em; 
                    color: var(--text-main);
                    text-transform: uppercase;
                    font-size: 0.95rem;
                    transition: color 0.3s;
                }
                .kanban-column:hover .column-header h3 {
                    color: var(--primary);
                }
                
                .task-count { 
                    background: rgba(var(--primary-rgb), 0.15);
                    border: 1px solid rgba(var(--primary-rgb), 0.3);
                    padding: 0.35rem 0.85rem; 
                    border-radius: 100px; 
                    font-size: 0.8rem; 
                    font-weight: 800; 
                    color: var(--primary);
                    box-shadow: var(--card-shadow);
                    min-width: 32px;
                    text-align: center;
                    transition: all 0.3s;
                }
                .kanban-column:hover .task-count {
                    background: rgba(var(--primary-rgb), 0.25);
                    box-shadow: var(--card-shadow);
                    transform: scale(1.05);
                }

                .column-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    flex: 1;
                }
                
                .task-card { 
                    padding: 0;
                    border-radius: var(--border-radius); 
                    position: relative;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--card-shadow);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }
                .task-card:hover {
                    box-shadow: var(--card-shadow);
                    border-color: rgba(var(--primary-rgb), 0.35);
                }

                /* Priority Indicator Bar */
                .priority-indicator-bar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    border-radius: 22px 22px 0 0;
                    box-shadow: var(--card-shadow);
                }

                /* Task Card Header */
                .task-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                /* Priority Badge */
                .priority-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 0.85rem;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    background: rgba(var(--priority-color), 0.12);
                    border: 1px solid rgba(var(--priority-color), 0.25);
                    color: var(--priority-color);
                    box-shadow: var(--card-shadow);
                }
                .priority-badge .priority-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    box-shadow: 0 0 8px currentColor;
                    animation: pulse-dot 2s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.2); }
                }

                /* Task Actions */
                .task-actions {
                    display: flex;
                    gap: 0.5rem;
                }
                .move-btn {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .move-btn:hover {
                    background: rgba(var(--primary-rgb), 0.15);
                    border-color: rgba(var(--primary-rgb), 0.3);
                    color: var(--primary);
                }

                /* Task Card Body */
                .task-card-body {
                    padding: 0 1.5rem 1rem;
                }
                .task-card-body h4 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                    line-height: 1.4;
                }
                .task-card-body p {
                    font-size: 0.85rem;
                    color: var(--text-dim);
                    line-height: 1.5;
                    margin-bottom: 0.75rem;
                }

                /* Task Tags */
                .task-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }
                .task-tag {
                    padding: 0.3rem 0.7rem;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                    border: 1px solid transparent;
                }
                .task-tag.tag-urgent {
                    background: rgba(244, 63, 94, 0.12);
                    color: #f43f5e;
                    border-color: rgba(244, 63, 94, 0.2);
                }
                .task-tag.tag-ui {
                    background: rgba(139, 92, 246, 0.12);
                    color: #8b5cf6;
                    border-color: rgba(139, 92, 246, 0.2);
                }
                .task-tag.tag-backend {
                    background: rgba(59, 130, 246, 0.12);
                    color: #3b82f6;
                    border-color: rgba(59, 130, 246, 0.2);
                }
                .task-tag.tag-bug {
                    background: rgba(245, 158, 11, 0.12);
                    color: #f59e0b;
                    border-color: rgba(245, 158, 11, 0.2);
                }

                /* Progress Bar */
                .task-progress-container {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0 1.5rem 1rem;
                }
                .task-progress-bar {
                    flex: 1;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 100px;
                    overflow: hidden;
                    position: relative;
                }
                .task-progress-fill {
                    height: 100%;
                    border-radius: 100px;
                    position: relative;
                    box-shadow: var(--card-shadow);
                }
                .task-progress-fill::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--glass-bg);
                    animation: shimmer-progress 2s infinite;
                }
                @keyframes shimmer-progress {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .progress-label {
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-dim);
                    min-width: 35px;
                }

                /* Task Card Footer */
                .task-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(0, 0, 0, 0.1);
                }

                /* Deadline Badge */
                .deadline-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem 0.75rem;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    transition: all 0.3s;
                }
                .deadline-badge.normal {
                    background: rgba(148, 163, 184, 0.12);
                    color: #94a3b8;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                }
                .deadline-badge.urgent {
                    background: rgba(245, 158, 11, 0.12);
                    color: #f59e0b;
                    border: 1px solid rgba(245, 158, 11, 0.25);
                    animation: pulse-urgent 2s ease-in-out infinite;
                }
                .deadline-badge.overdue {
                    background: rgba(244, 63, 94, 0.12);
                    color: #f43f5e;
                    border: 1px solid rgba(244, 63, 94, 0.25);
                    animation: pulse-overdue 1.5s ease-in-out infinite;
                }
                @keyframes pulse-urgent {
                    0%, 100% { box-shadow: var(--card-shadow); }
                    50% { box-shadow: var(--card-shadow); }
                }
                @keyframes pulse-overdue {
                    0%, 100% { box-shadow: var(--card-shadow); }
                    50% { box-shadow: var(--card-shadow); }
                }

                /* Member Avatar Circle */
                .member-avatar-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: var(--glass-bg);
                    border: 2px solid rgba(255, 255, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: white;
                    cursor: pointer;
                    box-shadow: var(--card-shadow);
                    transition: all 0.3s;
                }
                .member-avatar-circle:hover {
                    box-shadow: var(--card-shadow);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                /* Grip Icon */
                .grip-icon {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .task-card:hover .grip-icon {
                    opacity: 0.3;
                }
            `}</style>
            <AddMemberModal
                isOpen={activeModal === 'addMember'}
                onClose={() => { setActiveModal(null); setSelectedTeam(null); }}
                onAdd={handleAddMember}
                teamName={selectedTeam?.name}
                availableProjects={projects.map(p => p.name)}
            />

            {/* Success Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="success-toast glass"
                    >
                        <Check size={18} className="success-icon" />
                        <span>{notification}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .multi-select-projects {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    background: rgba(0,0,0,0.2);
                    padding: 0.8rem;
                    border-radius: 10px;
                    border: 1px solid var(--glass-border);
                }
                .project-chip {
                    padding: 0.4rem 0.8rem;
                    border-radius: var(--border-radius);
                    font-size: 0.8rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    cursor: pointer;
                    transition: all 0.2s;
                    color: var(--text-dim);
                }
                .project-chip:hover {
                    background: rgba(99, 102, 241, 0.1);
                    border-color: var(--primary);
                }
                .project-chip.selected {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    box-shadow: 0 0 10px var(--primary-glow);
                }
                
                .success-toast {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    padding: 1rem 1.5rem;
                    border-radius: var(--border-radius);
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    color: #10b981;
                    z-index: 1000;
                    
                    box-shadow: var(--card-shadow);
                }
                .success-icon {
                    background: #10b981;
                    color: white;
                    border-radius: 50%;
                    padding: 2px;
                }

                .remove-member-small-btn {
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(244, 63, 94, 0.05);
                    border: 1px solid rgba(244, 63, 94, 0.1);
                    color: #f43f5e;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-left: auto;
                    opacity: 0;
                }
                .member-row:hover .remove-member-small-btn {
                    opacity: 1;
                }
                .remove-member-small-btn:hover {
                    background: #f43f5e;
                    color: white;
                    box-shadow: var(--card-shadow);
                    transform: scale(1.1);
                }

                /* Messages & Chat Styling */
                .messages-tab {
                    height: calc(100vh - 120px);
                    display: flex;
                    flex-direction: column;
                }

                .messages-container {
                    display: flex;
                    flex: 1;
                    min-height: 0;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    background: rgba(255,255,255,0.02);
                }

                .messages-sidebar {
                    width: 320px;
                    border-right: 1px solid var(--glass-border);
                    display: flex;
                    flex-direction: column;
                    background: rgba(0,0,0,0.1);
                }

                .sidebar-chat-header {
                    padding: 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .sidebar-chat-header h3 {
                    font-size: 1.2rem;
                    font-weight: 800;
                }

                .chat-search {
                    padding: 0 1.5rem 1rem;
                    position: relative;
                }

                .chat-search input {
                    width: 100%;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid var(--glass-border);
                    padding: 0.6rem 1rem 0.6rem 2.5rem;
                    border-radius: var(--border-radius);
                    color: var(--text-main);
                    font-size: 0.9rem;
                }

                .chat-search .search-icon {
                    position: absolute;
                    left: 2.2rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-dim);
                    opacity: 0.5;
                }

                .conversations-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                }

                .conversation-item {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 0.25rem;
                }

                .conversation-item:hover {
                    background: rgba(255,255,255,0.03);
                }

                .conversation-item.active {
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }

                .conv-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                    position: relative;
                    flex-shrink: 0;
                }

                .status-dot {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2.5px solid var(--bg-dark);
                }

                .status-dot.online { background: #10b981; }

                .conv-info {
                    flex: 1;
                    min-width: 0;
                }

                .conv-top {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.25rem;
                }

                .conv-name {
                    font-weight: 700;
                    font-size: 0.95rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .conv-time {
                    font-size: 0.75rem;
                    color: var(--text-dim);
                }

                .conv-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .conv-preview {
                    font-size: 0.85rem;
                    color: var(--text-dim);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 160px;
                }

                .unread-badge {
                    background: var(--primary);
                    color: white;
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: var(--border-radius);
                    box-shadow: 0 0 10px var(--primary-glow);
                }

                /* Chat Window Styling */
                .chat-window {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: rgba(0,0,0,0.05);
                }

                .chat-header-main {
                    padding: 1.25rem 2rem;
                    border-bottom: 1px solid var(--glass-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: rgba(255,255,255,0.01);
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .active-chat-avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    color: white;
                }

                .chat-meta h4 {
                    font-size: 1.1rem;
                    font-weight: 800;
                }

                .member-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .member-status p {
                    font-size: 0.75rem;
                    color: var(--text-dim);
                }

                .member-status .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }

                .dot.online { background: #10b981; }

                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .message-bubble-wrapper {
                    display: flex;
                    flex-direction: column;
                    max-width: 70%;
                }

                .message-bubble-wrapper.mine {
                    align-self: flex-end;
                    align-items: flex-end;
                }

                .message-bubble-wrapper.theirs {
                    align-self: flex-start;
                    align-items: flex-start;
                }

                .sender-name {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-dim);
                    margin-left: 0.5rem;
                }

                .message-header-theirs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.4rem;
                }

                .msg-avatar-sm {
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: var(--card-shadow);
                }

                .message-bubble {
                    padding: 1rem 1.25rem;
                    border-radius: var(--border-radius);
                    font-size: 0.95rem;
                    position: relative;
                }

                .message-bubble.glass-dark {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    border-bottom-left-radius: 4px;
                }

                .message-bubble.primary-gradient {
                    background: var(--glass-bg);
                    color: white;
                    border-bottom-right-radius: 4px;
                    box-shadow: var(--card-shadow);
                }

                .message-time {
                    font-size: 0.65rem;
                    margin-top: 0.5rem;
                    display: block;
                    opacity: 0.6;
                    text-align: right;
                }

                .chat-input-row {
                    padding: 1.5rem 2rem;
                }

                .input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.75rem 1.25rem;
                    border-radius: var(--border-radius);
                    background: rgba(0,0,0,0.2) !important;
                    border: 1px solid var(--glass-border);
                    transition: all 0.3s ease;
                }

                .input-wrapper:focus-within {
                    border-color: var(--primary);
                    box-shadow: var(--card-shadow);
                    background: rgba(0,0,0,0.3) !important;
                }

                .input-wrapper input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    font-size: 0.95rem;
                    outline: none;
                }

                .send-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.05);
                    color: var(--text-dim);
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: none;
                }

                .send-btn.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 0 15px var(--primary-glow);
                }

                .send-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    filter: grayscale(0.5);
                    transform: none !important;
                }

                /* Custom Scrollbar for Chat */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Premium Chat Additions */
                .active-chat-avatar-wrapper {
                    position: relative;
                }
                .sound-cue-ring {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    border: 2px solid var(--primary);
                    border-radius: var(--border-radius);
                    pointer-events: none;
                }

                .message-bubble-group {
                    position: relative;
                }

                .message-actions-overlay {
                    position: absolute;
                    top: -15px;
                    display: flex;
                    gap: 0.25rem;
                    padding: 0.25rem;
                    border-radius: 8px;
                    opacity: 0;
                    transition: all 0.2s;
                    z-index: 10;
                    pointer-events: none;
                }
                .mine .message-actions-overlay { right: 0; }
                .theirs .message-actions-overlay { left: 0; }

                .message-bubble:hover .message-actions-overlay {
                    opacity: 1;
                    top: -25px;
                    pointer-events: auto;
                }

                .action-btn-sm {
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    border: none;
                    background: rgba(255,255,255,0.05);
                    color: var(--text-dim);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .action-btn-sm:hover {
                    background: var(--primary);
                    color: white;
                }
                .action-btn-sm.text-red:hover {
                    background: #f43f5e;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-top: 1rem;
                }
                .typing-dots {
                    padding: 0.75rem 1rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    gap: 4px;
                }
                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: var(--text-dim);
                    border-radius: 50%;
                    display: inline-block;
                    animation: typing 1.4s infinite ease-in-out both;
                }
                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

                @keyframes typing {
                    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
                    40% { transform: scale(1); opacity: 1; }
                }

                /* Settings Dashboard Styles */
                .settings-dashboard-container {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 3.5rem;
                    min-height: 800px;
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    background: var(--bg-dark);
                    color: var(--text-main);
                }

                .settings-sidebar {
                    background: var(--glass-bg);
                    
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius);
                    padding: 2.5rem 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: fit-content;
                    position: sticky;
                    top: 2rem;
                    box-shadow: var(--card-shadow);
                }

                .settings-sidebar-header h4 {
                    font-size: 1.25rem;
                    padding: 0 1rem;
                    color: var(--text-main);
                    margin-bottom: 1rem;
                }

                .settings-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .setting-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: var(--border-radius);
                    border: none;
                    background: transparent;
                    color: var(--text-dim);
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s ease;
                    text-align: left;
                    font-weight: 600;
                    width: 100%;
                }

                .setting-nav-item:hover {
                    color: var(--text-main);
                    background: rgba(255, 255, 255, 0.05);
                }

                .setting-nav-item.active {
                    color: var(--text-main);
                }

                .active-setting-pill {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(var(--primary-rgb), 0.1);
                    border-left: 3px solid var(--primary);
                    border-radius: var(--border-radius);
                    z-index: -1;
                }

                .settings-main-panel {
                    flex: 1;
                    height: 100%;
                }

                .setting-content-viewport {
                    height: 100%;
                }

                .settings-section {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    padding-bottom: 4rem;
                }

                .section-header h3 {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.03em;
                    color: var(--text-main) !important;
                    background: none !important;
                    -webkit-text-fill-color: initial !important;
                }

                .section-header p {
                    color: var(--text-dim);
                    font-size: 1.1rem;
                    max-width: 600px;
                }

                /* Profile Card */
                .profile-edit-card, .appearance-card {
                    padding: 3.5rem;
                    border-radius: var(--border-radius);
                    background: var(--glass-bg);
                    
                    border: 1px solid var(--glass-border);
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    box-shadow: var(--card-shadow);
                    position: relative;
                }

                .profile-setup {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }

                .profile-avatar-large {
                    width: 120px;
                    height: 120px;
                    background: var(--primary);
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    font-weight: 800;
                    color: white;
                    box-shadow: 0 15px 35px var(--primary-glow);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }

                .profile-avatar-large::after {
                    content: 'Edit Photo';
                    position: absolute;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    
                }

                .profile-avatar-large:hover::after {
                    opacity: 1;
                }

                .avatar-preview-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: var(--border-radius);
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .profile-avatar-large:hover .avatar-preview-img {
                    transform: scale(1.1);
                }

                .avatar-edit-badge {
                    position: absolute;
                    bottom: -8px;
                    right: -8px;
                    width: 32px;
                    height: 32px;
                    background: var(--primary);
                    border: 3px solid var(--glass-bg);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: var(--card-shadow);
                    z-index: 5;
                }

                .avatar-edit-badge:hover {
                    transform: scale(1.1) rotate(15deg);
                    background: var(--accent);
                }

                .profile-actions {
                    display: flex;
                    gap: 1rem;
                }

                .settings-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-group.full-width {
                    grid-column: span 2;
                }

                .settings-form-grid .form-group label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--text-main);
                    opacity: 0.8;
                    margin-bottom: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .settings-form-grid .form-group input, 
                .settings-form-grid .form-group textarea {
                    width: 100%;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: var(--border-radius);
                    padding: 0.85rem 1rem;
                    color: var(--text-main);
                    outline: none;
                    transition: 0.3s;
                }

                .settings-form-grid .form-group input:focus, 
                .settings-form-grid .form-group textarea:focus {
                    border-color: var(--primary);
                    background: var(--glass-hover);
                    box-shadow: 0 0 15px var(--primary-glow);
                }

                .settings-form-grid .form-group textarea {
                    height: 120px;
                    resize: none;
                }

                .section-footer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 2rem 3.5rem;
                    border-top: 1px solid var(--glass-border);
                    position: sticky;
                    bottom: 0;
                    background: var(--bg-dark);
                    
                    margin: 2rem -3.5rem -3.5rem -3.5rem;
                    border-radius: 0 0 40px 40px;
                    z-index: 20;
                    box-shadow: var(--card-shadow);
                }

                .save-btn {
                    padding: 1.25rem 3.5rem;
                    border-radius: var(--border-radius);
                    border: none;
                    background: var(--primary) !important;
                    color: white !important;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .save-btn:hover {
                    transform: translateY(-2px);
                    background: var(--primary-hover) !important;
                    box-shadow: 0 8px 20px var(--primary-glow);
                }

                /* Appearance Styles */
                .setting-control-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .control-info h4 {
                    font-size: 1.1rem;
                    margin-bottom: 0.25rem;
                }

                .control-info p {
                    font-size: 0.9rem;
                    color: var(--text-dim);
                }

                .theme-toggle-switch {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: var(--glass-bg);
                    padding: 0.5rem 1rem;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    border: 1px solid var(--glass-border);
                }

                .switch-track {
                    width: 44px;
                    height: 24px;
                    background: var(--glass-border);
                    border-radius: var(--border-radius);
                    position: relative;
                    transition: 0.3s;
                }

                .switch-track.dark { background: var(--primary); }

                .switch-thumb {
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary);
                    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .switch-track.dark .switch-thumb {
                    transform: translateX(20px);
                }

                .input-with-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    color: var(--text-dim);
                    pointer-events: none;
                }

                .input-with-icon input {
                    padding-left: 3rem !important;
                }

                .section-footer.split {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .btn-outline-red {
                    padding: 0.85rem 1.5rem;
                    border-radius: var(--border-radius);
                    border: 1px solid rgba(244, 63, 94, 0.3);
                    background: transparent;
                    color: #f43f5e;
                    font-weight: 600;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .btn-outline-red:hover {
                    background: rgba(244, 63, 94, 0.1);
                    border-color: #f43f5e;
                }

                .section-header.split {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }

                .profile-edit-card.editing {
                    border-color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.03);
                }

                .form-group.has-error input {
                    border-color: #f43f5e !important;
                    background: rgba(244, 63, 94, 0.05) !important;
                }

                .error-text {
                    color: #f43f5e;
                    font-size: 0.75rem;
                    margin-top: 0.5rem;
                    display: block;
                }

                .overflow-hidden { overflow: hidden; }

                .divider {
                    height: 1px;
                    background: var(--glass-border);
                    width: 100%;
                }

                .accent-grid {
                    display: flex;
                    gap: 1rem;
                }

                .accent-dot {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: 0.3s;
                    border: 3px solid transparent;
                }

                .accent-dot.active {
                    border-color: white;
                    transform: scale(1.1);
                    box-shadow: 0 0 15px currentColor;
                }

                .mt-2 { margin-top: 2rem; }
                .text-red { color: #f43f5e; }
                .text-center { text-align: center; }
                
                .setting-sub-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    color: var(--text-main) !important;
                }

                .delete-warning-icon {
                    margin-bottom: 1.5rem;
                    display: flex;
                    justify-content: center;
                }

                .btn-danger-gradient {
                    padding: 0.85rem 1.5rem;
                    border-radius: var(--border-radius);
                    border: none;
                    background: #f43f5e;
                    color: white;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .btn-danger-gradient:hover {
                    box-shadow: var(--card-shadow);
                    transform: translateY(-2px);
                }

                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                /* Placeholder Styles */
                .settings-section.placeholder {
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    padding: 4rem 0;
                }

                .placeholder-content {
                    padding: 4rem;
                    border-radius: var(--border-radius);
                    max-width: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                }

                .placeholder-icon-ring {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: rgba(var(--primary-rgb), 0.05);
                    border: 2px dashed var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1rem;
                    color: var(--primary);
                }

                .pulse-icon {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }



                .input-wrapper input {
                    padding: 0 0.5rem;
                }
                /* Add Conversation Modal Styling */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.6);
                    
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .add-conv-modal {
                    width: 450px;
                    padding: 2.5rem;
                    border-radius: var(--border-radius);
                    border: 1px solid var(--glass-border);
                }
                .add-conv-modal h2 {
                    margin-bottom: 0.5rem;
                    font-size: 1.5rem;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .close-btn:hover { color: var(--primary); transform: scale(1.1); }
                
                .form-group {
                    margin-bottom: 1.5rem;
                }
                .form-group label {
                    display: block;
                    font-size: 0.85rem;
                    color: var(--text-dim);
                    margin-bottom: 0.6rem;
                    font-weight: 600;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: var(--border-radius);
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    color: var(--text-main);
                    outline: none;
                    transition: all 0.2s;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: var(--primary);
                    background: var(--glass-hover);
                }
                .form-group textarea { height: 100px; resize: none; }

                .member-select-grid {
                    max-height: 180px;
                    overflow-y: auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                    padding-right: 0.5rem;
                }
                .member-select-card {
                    padding: 0.6rem 0.8rem;
                    border-radius: var(--border-radius);
                    background: rgba(255,255,255,0.03);
                    border: 1px solid transparent;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .member-select-card:hover { background: rgba(255,255,255,0.08); }
                .member-select-card.selected {
                    background: rgba(99, 102, 241, 0.15);
                    border-color: var(--primary);
                }
                .member-avatar-mini {
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    background: var(--primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.6rem;
                    font-weight: 800;
                }
                .member-select-card span { font-size: 0.8rem; }
                .check-icon { color: var(--primary); margin-left: auto; }

                .modal-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2.5rem;
                }
                .btn-primary, .btn-secondary {
                    flex: 1;
                    padding: 0.8rem;
                    border-radius: var(--border-radius);
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }
                .btn-primary { background: var(--primary); color: white; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px var(--primary-glow); }
                .btn-secondary { background: rgba(255,255,255,0.05); color: var(--text-dim); }
                .btn-secondary:hover { background: rgba(255,255,255,0.1); color: white; }

                .chat-notification-toast {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 2000;
                    border: 1px solid var(--glass-border);
                }
                .success-icon { color: #10b981; }

                .empty-chat-state {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-dim);
                    text-align: center;
                    padding-bottom: 2rem;
                }
                .empty-chat-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: var(--border-radius);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    color: var(--primary);
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid var(--glass-border);
                    box-shadow: var(--card-shadow);
                }
                .empty-chat-state h3 {
                    margin-bottom: 0.5rem;
                    font-size: 1.4rem;
                    color: var(--text-main);
                    font-weight: 700;
                }
                .empty-chat-state p {
                    font-size: 0.95rem;
                    max-width: 250px;
                    line-height: 1.6;
                    opacity: 0.7;
                }

                .chart-select {
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    color: var(--text-main);
                    border-radius: 8px;
                    padding: 6px 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    padding-right: 32px;
                    outline: none;
                }

                .chart-select:hover {
                    background-color: var(--glass-hover);
                    border-color: var(--primary);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                }

                .chart-select option {
                    background-color: #1a1b2e;
                    color: white;
                    padding: 10px;
                }

                .premium-tooltip {
                    background: rgba(15, 17, 26, 0.95);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 12px 16px;
                    border-radius: 14px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
                    text-align: center;
                    min-width: 100px;
                }

                .premium-tooltip .tooltip-val {
                    font-size: 1.4rem;
                    font-weight: 900;
                    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    line-height: 1;
                    margin-bottom: 4px;
                }

                .premium-tooltip .tooltip-lbl {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.6);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .premium-tooltip .tooltip-arrow {
                    position: absolute;
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid rgba(15, 17, 26, 0.95);
                }

                [data-theme='light'] .chart-select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234b5563' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                }

                [data-theme='light'] .chart-select option {
                    background-color: white;
                    color: #1f2937;
                }
                
                [data-theme='light'] .premium-tooltip {
                    background: rgba(255, 255, 255, 0.98);
                    border-color: rgba(0, 0, 0, 0.1);
                }

                [data-theme='light'] .premium-tooltip .tooltip-val {
                    background: linear-gradient(135deg, #1f2937 0%, #6366f1 100%);
                    -webkit-background-clip: text;
                }

                [data-theme='light'] .premium-tooltip .tooltip-lbl {
                    color: #6b7280;
                }
                
                [data-theme='light'] .premium-tooltip .tooltip-arrow {
                    border-top-color: white;
                }

                .chart-svg {
                    overflow: visible;
                }

                .chart-labels span {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-dim);
                    opacity: 0.8;
                }

            `}</style>
        </div>
    );
};

export default Dashboard;

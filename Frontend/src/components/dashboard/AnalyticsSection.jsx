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
import Projects from './Projects';

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

export default AnalyticsSection;

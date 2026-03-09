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
import AnimatedSelect from './AnimatedSelect';

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

        return last7Days.map((day) => {
            const dayStartTime = new Date(day.iso).getTime();
            const dayEndTime = dayStartTime + 86400000;

            if (selectedProjectId === 'all') {
                // Average daily completion across all projects
                const projectDailyShares = projects.map(p => {
                    const projectTasks = tasks.filter(t =>
                        t.projectId === (p._id || p.id) ||
                        t.project === p.name ||
                        t.project === p.title
                    );

                    if (projectTasks.length === 0) return 0;

                    const completedTodayCount = projectTasks.filter(t => {
                        if (t.status !== 'Completed') return false;
                        const completionTime = new Date(t.completedAt || t.updatedAt || t.createdAt).getTime();
                        return completionTime >= dayStartTime && completionTime < dayEndTime;
                    }).length;

                    return (completedTodayCount / projectTasks.length) * 100;
                });

                const totalDailyAvg = projectDailyShares.reduce((acc, val) => acc + val, 0) / (projects.length || 1);
                // Return a boosted value for visual zig-zag if there's activity
                return Math.round(totalDailyAvg * 5);
            } else {
                const project = projects.find(p => p.id === selectedProjectId || p._id === selectedProjectId);
                if (!project) return 0;

                const projectTasks = tasks.filter(t =>
                    t.projectId === (project._id || project.id) ||
                    t.project === project.name ||
                    t.project === project.title
                );

                if (projectTasks.length === 0) return 0;

                const completedTodayCount = projectTasks.filter(t => {
                    if (t.status !== 'Completed') return false;
                    const completionTime = new Date(t.completedAt || t.updatedAt || t.createdAt).getTime();
                    return completionTime >= dayStartTime && completionTime < dayEndTime;
                }).length;

                // Daily contribution to project progress
                return Math.round((completedTodayCount / projectTasks.length) * 100 * 5); // Multiplier for visual zig-zag
            }
        });
    };

    const lineData = getLineData();
    const linePoints = lineData.map((val, i) => ({
        x: i * 63.3 + 20,
        y: 150 - (Math.min(100, val) * 1.3),
        value: val,
        date: last7Days[i].date
    }));

    // Sharp zig-zag path generator
    const linePath = linePoints.reduce((acc, point, i) => {
        return i === 0 ? `M ${point.x},${point.y}` : `${acc} L ${point.x},${point.y}`;
    }, '');

    // 2. Bar Chart Data - Real task counts per project
    const barData = projects.slice(0, 5).map(p => {
        const projectTasks = tasks.filter(t =>
            t.projectId === (p._id || p.id) ||
            t.project === p.name
        );
        return {
            name: p.name.length > 10 ? p.name.substring(0, 8) + '...' : p.name,
            count: projectTasks.length,
            color: p.color
        };
    });

    // 3. Donut Chart Data
    const donutData = projects.slice(0, 5).map(p => {
        const projectTasks = tasks.filter(t => t.projectId === (p._id || p.id) || t.project === p.name);
        const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
        const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : (p.progress || 0);

        return {
            label: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
            value: progress === 0 ? 2 : progress, // Minimum value of 2 so a 0% progress project still visually shows a tiny empty slice
            realProgress: progress,
            color: p.color || 'var(--primary)'
        };
    }).filter(d => d.value > 0);

    const totalStatusCount = projects.length;
    const totalStatus = donutData.reduce((acc, curr) => acc + curr.value, 0) || 1; // Avoid division by zero

    const isAll = selectedProjectId === 'all';

    // Primary fallback color matching our app
    const primaryFallback = 'var(--primary)';
    const selectedProjectColor = isAll
        ? primaryFallback
        : (projects.find(p => p.id.toString() === selectedProjectId.toString())?.color || primaryFallback);

    // Gorgeous gradient colors just for "Average Velocity" chart
    const gradientStart = isAll ? '#6366f1' : selectedProjectColor; // Primary Indigo
    const gradientMid = isAll ? '#818cf8' : selectedProjectColor;   // Lighter Indigo
    const gradientEnd = isAll ? '#4f46e5' : selectedProjectColor;   // Deep Indigo

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
                style={{ position: 'relative', zIndex: 50 }}
            >
                <motion.div
                    className="card-bg-glow"
                    animate={{
                        background: isAll
                            ? `radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15), rgba(129,140,248,0.10), transparent 70%)`
                            : `radial-gradient(circle at 20% 20%, ${selectedProjectColor}33, transparent 50%)`
                    }}
                ></motion.div>
                <div className="card-header">
                    <div className="header-info" style={{ flex: 1, paddingRight: '1rem' }}>
                        <h3>Sprint <span className="accent-text">Velocity</span></h3>
                        <p style={{ margin: 0, lineHeight: 1.4 }}>{selectedProjectId === 'all' ? 'Team performance' : 'Project progress'} over the last 7 days</p>
                    </div>
                    <div className="card-controls" style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ minWidth: '180px' }}>
                            <AnimatedSelect
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                options={[
                                    { value: 'all', label: 'Average Velocity' },
                                    ...projects.map(p => ({ value: p.id, label: p.name }))
                                ]}
                            />
                        </div>
                        <Activity size={18} className="dim" />
                    </div>
                </div>
                <div className="chart-container">
                    <div style={{ position: 'relative' }}>
                        <svg key={selectedProjectId} width="100%" height="160" viewBox="0 0 420 160" className="chart-svg">
                            <defs>
                                <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse" x1="20" y1="0" x2="400" y2="0">
                                    <stop offset="0%" stopColor={gradientStart} />
                                    {isAll && <stop offset="50%" stopColor={gradientMid} />}
                                    <stop offset="100%" stopColor={gradientEnd} />
                                </linearGradient>
                                <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isAll ? gradientMid : selectedProjectColor} stopOpacity="0.35" />
                                    <stop offset="100%" stopColor={gradientStart} stopOpacity="0" />
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
                                stroke={isAll ? "url(#lineGradient)" : selectedProjectColor}
                                strokeWidth={isAll ? 4 : 3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    pathLength: 1,
                                    opacity: 1,
                                    ...(isAll ? {
                                        filter: [
                                            'drop-shadow(0 0 6px #6366f1)',
                                            'drop-shadow(0 0 12px #818cf8)',
                                            'drop-shadow(0 0 6px #6366f1)'
                                        ]
                                    } : {})
                                }}
                                transition={{
                                    pathLength: { duration: 2, ease: "easeInOut" },
                                    opacity: { duration: 1, delay: 0.5 },
                                    filter: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                            />
                            {/* Data points */}
                            {linePoints.map((p, i) => (
                                <motion.circle
                                    key={i}
                                    cx={p.x}
                                    cy={p.y}
                                    r="6"
                                    fill="var(--bg-dark)"
                                    stroke={isAll ? "url(#lineGradient)" : selectedProjectColor}
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
                <div className="bar-chart-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px', padding: '1rem', marginTop: '1.5rem' }}>
                    {barData.map((bar, i) => (
                        <div key={i} className="bar-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div className="bar-rail" style={{
                                height: '130px',
                                width: '12px',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'flex-end',
                                overflow: 'hidden',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                <motion.div
                                    className="bar-fill"
                                    style={{
                                        width: '100%',
                                        background: bar.color || 'var(--primary)',
                                        borderRadius: '20px',
                                        boxShadow: `0 0 12px ${bar.color || 'var(--primary)'}`
                                    }}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${Math.min(100, Math.max(15, bar.count * 15))}%` }}
                                    whileHover={{
                                        filter: 'brightness(1.5)',
                                        transition: { duration: 0.2 }
                                    }}
                                    transition={{ duration: 1.5, delay: 0.3 + i * 0.1, type: "spring", stiffness: 60 }}
                                />
                            </div>
                            <span className="bar-label" style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-dim)',
                                transform: 'rotate(-25deg)',
                                whiteSpace: 'nowrap',
                                fontWeight: 700,
                                letterSpacing: '0.05em'
                            }}>{bar.name}</span>
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
                <div className="card-bg-glow" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03), transparent 70%)' }}></div>
                <div className="card-header">
                    <div className="header-info">
                        <h3>Project <span className="accent-text">Progress</span></h3>
                        <p>Progress by active project</p>
                    </div>
                    <PieChart size={18} className="dim" />
                </div>
                <div className="donut-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', marginTop: '1.5rem' }}>
                    <div className="donut-svg-wrapper" style={{ position: 'relative', width: '220px', height: '220px' }}>
                        <svg width="220" height="220" viewBox="-12 -12 64 64" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0px 8px 15px rgba(0,0,0,0.4))', display: 'block' }}>
                            <circle cx="20" cy="20" r="18" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                            {donutData.reduce((acc, curr, i) => {
                                const offset = acc.totalOffset;
                                const strokeDasharray = `${(curr.value / totalStatus) * 113.097} 113.097`;
                                acc.elements.push(
                                    <motion.circle
                                        key={i}
                                        cx="20" cy="20" r="18"
                                        fill="transparent"
                                        stroke={curr.color}
                                        strokeWidth="6"
                                        strokeDasharray={strokeDasharray}
                                        strokeDashoffset={-offset}
                                        strokeLinecap="round"
                                        initial={{ strokeDashoffset: 113.097 }}
                                        whileInView={{ strokeDashoffset: -offset }}
                                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), ease: "circOut" }}
                                        whileHover={{ scale: 1.08, strokeWidth: 8, transition: { duration: 0.2, type: "spring", stiffness: 300 } }}
                                        style={{ transformOrigin: '20px 20px', filter: `drop-shadow(0 0 4px ${curr.color}) drop-shadow(0 0 12px ${curr.color}60)`, cursor: 'pointer' }}
                                    />
                                );
                                acc.totalOffset += (curr.value / totalStatus) * 113.097;
                                return acc;
                            }, { elements: [], totalOffset: 0 }).elements}
                        </svg>
                        <div className="donut-center" style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                            zIndex: 2, width: '100%'
                        }}>
                            <span className="total-num pulse-text" style={{ fontSize: '3.5rem', fontWeight: 600, lineHeight: 1, color: 'var(--text-main)' }}><AnimatedCounter value={totalStatusCount} /></span>
                            <span className="total-lbl" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', fontWeight: 600, marginTop: '8px' }}>Total Projects</span>
                        </div>
                    </div>
                    <div className="donut-legend" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                        {donutData.map((item, i) => (
                            <motion.div
                                key={i}
                                className="legend-item"
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                                <div className="dot-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="dot" style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                                    <span className="lbl" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                                        {item.label}
                                    </span>
                                </div>
                                <span className="val" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.realProgress}%</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AnalyticsSection;

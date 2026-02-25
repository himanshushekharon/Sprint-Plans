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

export default Overview;

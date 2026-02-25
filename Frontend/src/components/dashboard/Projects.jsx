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
import Tasks from './Tasks';

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

export default Projects;

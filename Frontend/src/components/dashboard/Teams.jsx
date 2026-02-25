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
import Projects from './Projects';

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

export default Teams;

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
import AnimatedCounter from './dashboard/AnimatedCounter';
import AnalyticsSection from './dashboard/AnalyticsSection';
import Overview from './dashboard/Overview';
import CreateProjectModal from './dashboard/CreateProjectModal';
import Projects from './dashboard/Projects';
import CreateTeamModal from './dashboard/CreateTeamModal';
import AddMemberModal from './dashboard/AddMemberModal';
import ManageProjectsModal from './dashboard/ManageProjectsModal';
import Teams from './dashboard/Teams';
import CreateTaskModal from './dashboard/CreateTaskModal';
import Tasks from './dashboard/Tasks';
import Messages from './dashboard/Messages';
import SettingsPage from './dashboard/SettingsPage';
import { createProject, createTeam, createTask, addTeamMember, removeTeamMember, updateProject, deleteProject, updateTask, deleteTask } from '../services/api';

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

    const addProject = async (p) => {
        try {
            const newProject = await createProject({
                name: p.name,
                team: p.team,
                deadline: p.deadline,
                progress: p.progress,
                status: p.status,
                color: p.color
            });
            setProjects([{ ...newProject, id: newProject._id }, ...projects]);
            setActiveModal(null);
            showNotification("Project created successfully!");
            return true;
        } catch (error) {
            console.error("Error creating project:", error);
            showNotification("Failed to create project");
            return false;
        }
    };

    const addTeam = async (t) => {
        try {
            const newTeam = await createTeam({
                name: t.name,
                membersList: [],
                assignedProjects: [],
                color: t.color,
                status: 'Active'
            });
            setTeams([{ ...newTeam, id: newTeam._id }, ...teams]);
            setActiveModal(null);
            showNotification("Team created successfully!");
            return true;
        } catch (error) {
            console.error("Error creating team:", error);
            showNotification("Failed to create team");
            return false;
        }
    };

    const handleAddMember = async (memberData) => {
        if (!selectedTeam) return;

        try {
            const updatedTeam = await addTeamMember(selectedTeam._id || selectedTeam.id, memberData);

            // For optimistic UI or if you get back the full team, you can update local state
            // Let's assume the backend correctly adds it or we reload team on next fetch.
            // For now, let's update it locally immediately so it's smooth
            const newMember = { name: memberData.name, role: memberData.role, email: memberData.email };

            setTeams(teams.map(t => {
                if (t.id === selectedTeam.id || t._id === selectedTeam._id) {
                    const uniqueProjects = Array.from(new Set([...(t.assignedProjects || []), ...memberData.projects]));
                    return {
                        ...t,
                        members: (t.membersList?.length || 0) + 1,
                        membersList: [...(t.membersList || []), newMember],
                        assignedProjects: uniqueProjects
                    };
                }
                return t;
            }));

            showNotification(`${memberData.name} added to ${selectedTeam.name}`);
            return true;
        } catch (error) {
            console.error("Error adding member:", error);
            showNotification("Failed to add member");
            return false;
        }
    };

    const handleRemoveMember = async (teamId, memberName) => {
        try {
            const t = teams.find(team => team._id === teamId || team.id === teamId);
            const memberObj = t?.membersList?.find(m => m.name === memberName || m === memberName);
            const identifier = memberObj?._id || memberObj?.email || memberName;

            if (identifier) {
                await removeTeamMember(teamId, identifier);
            }

            setTeams(teams.map(t => {
                if (t.id === teamId || t._id === teamId) {
                    return {
                        ...t,
                        members: Math.max(0, (t.membersList?.length || 1) - 1),
                        membersList: (t.membersList || []).filter(m => (typeof m === 'object' ? m.name : m) !== memberName)
                    };
                }
                return t;
            }));
            showNotification(`${memberName} removed from team`);
        } catch (error) {
            console.error("Error removing member:", error);
            showNotification("Failed to remove member");
        }
    };

    const handleUpdateTeamProjects = async (teamId, updatedProjects) => {
        setTeams(teams.map(t => (t.id === teamId || t._id === teamId) ? { ...t, assignedProjects: updatedProjects } : t));
        showNotification("Team projects updated successfully");
        // TODO: Backend API for updating team projects
    };

    const addTask = async (ta) => {
        try {
            // Need the project ID from its name to associate in DB
            const projectObj = projects.find(p => p.name === ta.project);
            if (!projectObj) throw new Error("Project not found");

            const newTask = await createTask({
                title: ta.title,
                description: ta.description,
                status: ta.status,
                deadline: ta.deadline,
                priority: ta.priority,
                project: projectObj._id,
                assignedTo: ta.member // assuming assignedTo is needed by backend or we wait for backend updates mapped to member
            });
            // We append the project name for frontend display since backend might return ID
            setTasks([{ ...newTask, id: newTask._id, project: ta.project, member: ta.member }, ...tasks]);
            setActiveModal(null);
            setPrefilledProject(null);
            showNotification("Task created successfully!");
            return true;
        } catch (error) {
            console.error("Error creating task:", error);
            showNotification("Failed to create task");
            return false;
        }
    };

    const moveTask = async (id, newStatus) => {
        const oldTasks = [...tasks];
        try {
            const progress = newStatus === 'Completed' ? 100 : (newStatus === 'In Progress' ? 50 : 0);
            setTasks(tasks.map(t => (t.id === id || t._id === id) ? { ...t, status: newStatus, progress } : t));
            await updateTask(id, { status: newStatus, progress });
        } catch (error) {
            console.error("Error updating task status", error);
            showNotification("Failed to update task status");
            setTasks(oldTasks);
        }
    };

    const toggleTaskCompletion = async (id) => {
        const taskToUpdate = tasks.find(t => t.id === id || t._id === id);
        if (!taskToUpdate) return;

        const newStatus = taskToUpdate.status === 'Completed' ? 'Pending' : 'Completed';

        try {
            const progress = newStatus === 'Completed' ? 100 : 0;
            setTasks(tasks.map(t => {
                if (t.id === id || t._id === id) {
                    return {
                        ...t,
                        status: newStatus,
                        progress,
                        completedAt: newStatus === 'Completed' ? new Date().toISOString() : null
                    };
                }
                return t;
            }));
            await updateTask(id, { status: newStatus, progress, completedAt: newStatus === 'Completed' ? new Date().toISOString() : null });
        } catch (error) {
            console.error("Error updating task completion", error);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
                setTasks(tasks.filter(t => t.id !== id && t._id !== id));
                showNotification("Task deleted successfully");
            } catch (error) {
                console.error("Error deleting task", error);
                showNotification("Failed to delete task");
            }
        }
    };

    const handleDeleteTeam = (id) => {
        const teamToDelete = teams.find(t => t.id === id || t._id === id);
        if (teamToDelete) {
            if (window.confirm(`Are you sure you want to delete the team "${teamToDelete.name}"? Associated tasks will also be removed.`)) {

                // 1. Remove team from state
                setTeams(teams.filter(t => t.id !== id && t._id !== id));

                // 2. Remove associated tasks if linked (by team member name, or team name)
                const teamMemberNames = (teamToDelete.membersList || []).map(m => typeof m === 'object' ? m.name : m);
                setTasks(tasks.filter(t => !teamMemberNames.includes(t.member) && t.team !== teamToDelete.name));

                showNotification("Team deleted successfully");
                // TODO: Delete team API
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
                    color: var(--text-dim); 
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

                .btn-primary-sm {
                    padding: 0.6rem 1.25rem;
                    background: var(--primary);
                    border: 1px solid var(--primary);
                    border-radius: 10px;
                    color: white;
                    font-size: 0.85rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .btn-primary-sm:hover { 
                    background: var(--primary-hover); 
                    border-color: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
                }

                .btn-secondary-sm {
                    padding: 0.6rem 1.25rem;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    color: var(--text-main);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-secondary-sm:hover { 
                    background: var(--glass-hover); 
                    border-color: var(--primary);
                    color: var(--primary);
                }

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
                .timeline-content .time { font-size: 0.8rem; color: var(--text-dim); margin-top: 0.4rem; font-weight: 700; }

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
                    overflow: visible;
                }
                .task-card:hover {
                    box-shadow: var(--card-shadow);
                    border-color: rgba(var(--primary-rgb), 0.35);
                    z-index: 10;
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
                    background: var(--glass-border);
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
                    border-bottom-left-radius: var(--border-radius);
                    border-bottom-right-radius: var(--border-radius);
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
                    border: 2px solid var(--glass-border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: var(--text-main);
                    cursor: pointer;
                    box-shadow: var(--card-shadow);
                    transition: all 0.3s;
                    position: relative;
                }
                .member-avatar-circle:hover {
                    box-shadow: var(--card-shadow);
                    border-color: var(--primary);
                    color: var(--primary);
                }
                
                .avatar-tooltip {
                    position: absolute;
                    bottom: 125%;
                    left: 50%;
                    transform: translateX(-50%) translateY(10px) scale(0.9);
                    background: var(--bg-dark);
                    border: 1px solid var(--glass-border);
                    color: #fff;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    white-space: nowrap;
                    pointer-events: none;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    z-index: 50;
                    letter-spacing: 0.02em;
                }
                html[data-theme='light'] .avatar-tooltip {
                    background: white;
                    color: #0f172a;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                }
                .avatar-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 5px;
                    border-style: solid;
                    border-color: var(--bg-dark) transparent transparent transparent;
                }
                html[data-theme='light'] .avatar-tooltip::after {
                    border-color: white transparent transparent transparent;
                }
                .member-avatar-circle:hover .avatar-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(0) scale(1);
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

                .password-toggle-btn {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                    z-index: 5;
                }

                .password-toggle-btn:hover {
                    color: var(--primary);
                    background: rgba(var(--primary-rgb), 0.1);
                }

                .input-with-icon.no-prefix {
                    padding-left: 0;
                }

                .input-with-icon.no-prefix input {
                    padding-left: 1rem;
                    padding-right: 2.5rem;
                }

            `}</style>
        </div>
    );
};

export default Dashboard;

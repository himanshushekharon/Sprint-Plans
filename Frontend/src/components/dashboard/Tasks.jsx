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


// --- Task Management Component ---
const Tasks = ({ tasks, onCreateTask, onMoveTask, onDeleteTask, globalSearch = '' }) => {
    const columns = ['Pending', 'In Progress', 'Completed'];

    const filteredTasks = tasks.filter(t =>
        (t.title || '').toLowerCase().includes((globalSearch || '').toLowerCase()) ||
        (t.description || '').toLowerCase().includes((globalSearch || '').toLowerCase())
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
                                            {(task.status === 'In Progress' || task.status === 'Completed') && (
                                                <div className="task-progress-container">
                                                    <div className="task-progress-bar">
                                                        <motion.div
                                                            className="task-progress-fill"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${task.status === 'Completed' ? 100 : (task.progress || (task.status === 'In Progress' ? 50 : 0))}%` }}
                                                            transition={{ duration: 1, delay: 0.3 }}
                                                            style={{
                                                                background: `linear-gradient(90deg, ${getPriorityColor(task.priority)}, ${getPriorityColor(task.priority)}dd)`
                                                            }}
                                                        ></motion.div>
                                                    </div>
                                                    <span className="progress-label">{task.status === 'Completed' ? 100 : (task.progress || (task.status === 'In Progress' ? 50 : 0))}%</span>
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
                                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                                    transition={{ type: "spring", stiffness: 400 }}
                                                >
                                                    {(task.member || 'Unassigned Member').split(' ').map(n => n[0]).join('')}
                                                    <span className="avatar-tooltip">{task.member || 'Unassigned Member'}</span>
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

export default Tasks;

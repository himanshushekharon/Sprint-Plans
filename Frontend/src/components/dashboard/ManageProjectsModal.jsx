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

export default ManageProjectsModal;

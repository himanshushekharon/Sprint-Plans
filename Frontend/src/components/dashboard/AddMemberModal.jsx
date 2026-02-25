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

export default AddMemberModal;

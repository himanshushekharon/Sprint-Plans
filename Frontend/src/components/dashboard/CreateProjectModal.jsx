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
import AnimatedSelect from './AnimatedSelect';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onAdd({ ...formData, id: Date.now() });
        if (success !== false) {
            setFormData({ name: '', team: '', deadline: '', status: 'Just Started', progress: 0, color: '#6366f1' });
        }
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
                            <AnimatedSelect
                                value={formData.team}
                                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                placeholder="Select a Team"
                                options={[
                                    ...teams.map(t => ({ value: t.name, label: t.name }))
                                ]}
                            />
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

export default CreateProjectModal;

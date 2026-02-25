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


// --- Create Team Modal ---
const CreateTeamModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        members: 0,
        projects: 0,
        color: '#6366f1'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ ...formData, id: Date.now() });
        setFormData({ name: '', members: 0, projects: 0, color: '#6366f1' });
    };

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
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="modal-container glass"
                    >
                        <div className="modal-header">
                            <h2>Create <span className="accent-text">New Team</span></h2>
                            <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Design Squad"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Initial Members</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.members}
                                        onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) || 0 })}
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
                                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Create Team</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateTeamModal;

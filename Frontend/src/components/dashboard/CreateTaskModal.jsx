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

// --- Create Task Modal ---
const CreateTaskModal = ({ isOpen, onClose, onAdd, initialProject = null, projects = [], teams = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pending',
        deadline: '',
        member: '',
        priority: 'Medium',
        project: initialProject || ''
    });

    useEffect(() => {
        if (initialProject) {
            setFormData(prev => ({ ...prev, project: initialProject }));
        }
    }, [initialProject]);

    if (!isOpen) return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onAdd({ ...formData, id: Date.now() });
        if (success !== false) {
            setFormData({ title: '', description: '', status: 'Pending', deadline: '', member: '', priority: 'Medium', project: '' });
        }
    };

    // Dynamically filter members based on the selected project's team
    const projectObj = projects.find(p => p.name === formData.project);
    const teamObj = projectObj ? teams.find(t => t.name === projectObj.team) : null;

    let members = [];
    if (teamObj) {
        members = (teamObj.membersList || []).map(m => typeof m === 'object' ? m.name : m);
    } else if (!formData.project) {
        // Optional: show all unique members if no project is selected yet, 
        // but the user's request suggests they want it restricted.
        // Let's show empty or a prompt unless we have no teams at all (demo mode)
        const allMembers = Array.from(new Set(
            teams.flatMap(t => t.membersList || []).map(m => typeof m === 'object' ? m.name : m)
        ));
        if (allMembers.length === 0) {
            members = ['Alex Rivera', 'Sarah Connor', 'John Doe', 'Marcus Wright', 'Elena Vance'];
        }
    }

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
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 30, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="modal-container glass"
                    >
                        <div className="modal-header">
                            <h2>Create <span className="accent-text">New Task</span></h2>
                            <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="What needs to be done?"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Project</label>
                                    <AnimatedSelect
                                        value={formData.project}
                                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                        className={initialProject ? 'prefilled-input' : ''}
                                        placeholder="Select a Project"
                                        options={[
                                            ...projects.map(p => ({ value: p.name, label: p.name }))
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Add some details..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Deadline</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Assigned To</label>
                                    <AnimatedSelect
                                        value={formData.member}
                                        onChange={(e) => setFormData({ ...formData, member: e.target.value })}
                                        placeholder={!formData.project ? "Select Project First" : (formData.project && members.length === 0 ? "No members in team" : "Assign to...")}
                                        options={[
                                            ...members.map(m => ({ value: m, label: m }))
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Status</label>
                                    <AnimatedSelect
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        options={[
                                            { value: 'Pending', label: 'Pending' },
                                            { value: 'In Progress', label: 'In Progress' },
                                            { value: 'Completed', label: 'Completed' }
                                        ]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <AnimatedSelect
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        options={[
                                            { value: 'Low', label: 'Low' },
                                            { value: 'Medium', label: 'Medium' },
                                            { value: 'High', label: 'High' }
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                                <button type="submit" className="btn-primary">Add Task</button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;

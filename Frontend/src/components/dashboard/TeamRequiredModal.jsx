import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, AlertCircle, Plus } from 'lucide-react';

const TeamRequiredModal = ({ isOpen, onClose, onCreateTeam }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{ zIndex: 1100 }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="modal-container glass"
                style={{ maxWidth: '450px', padding: '2.5rem' }}
            >
                <div className="modal-header" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="alert-icon-container" style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            padding: '12px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AlertCircle size={24} />
                        </div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Team <span className="accent-text">Required</span></h2>
                    </div>
                    <button onClick={onClose} className="icon-btn-ghost"><X size={24} /></button>
                </div>

                <div className="modal-body" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                        You need to create at least one <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>team</span> before you can start a new project.
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                        Projects are assigned to teams to help organize your workflow.
                    </p>
                </div>

                <div className="modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <motion.button
                        className="btn-primary"
                        style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px var(--primary-glow)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            onClose();
                            onCreateTeam();
                        }}
                    >
                        <Plus size={20} />
                        <span>Create Your First Team</span>
                    </motion.button>
                    <motion.button
                        className="btn-secondary"
                        style={{ width: '100%', padding: '1rem' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                    >
                        Maybe Later
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeamRequiredModal;

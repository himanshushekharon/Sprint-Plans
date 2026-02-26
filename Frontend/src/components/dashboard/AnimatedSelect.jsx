import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

const AnimatedSelect = ({ value, onChange, options, className = '', placeholder = 'Select an option', icon: Icon = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper functions to safely extract value and label
    const getValue = (opt) => typeof opt === 'object' && opt !== null ? opt.value : opt;
    const getLabel = (opt) => typeof opt === 'object' && opt !== null ? opt.label : opt;

    const selectedOption = options?.find(opt => getValue(opt) === value);
    const displayLabel = selectedOption ? getLabel(selectedOption) : placeholder;

    return (
        <div ref={dropdownRef} className={`custom-select-container ${className}`} style={{ position: 'relative', width: '100%', cursor: 'pointer' }}>
            <motion.div
                className={`custom-select-trigger ${isOpen ? 'open' : ''} glass`}
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
                style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.45rem 0.8rem', borderRadius: '8px',
                    border: isOpen ? '1px solid var(--primary)' : '1px solid var(--glass-border)', color: 'var(--text-main)',
                    boxShadow: isOpen ? 'var(--card-shadow), 0 0 0 2px rgba(99, 102, 241, 0.2)' : 'var(--card-shadow)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    gap: '0.5rem',
                    background: isOpen ? 'var(--glass-bg)' : 'transparent',
                    opacity: (!selectedOption && !isOpen) ? 0.7 : 1
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {Icon && <Icon size={14} className="dim" />}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{displayLabel}</span>
                </div>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.4, type: "spring", stiffness: 300 }}>
                    <ChevronDown size={14} className="dim" />
                </motion.div>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="custom-select-dropdown glass premium-dropdown"
                        style={{
                            position: 'absolute', top: '100%', left: 0, right: 0,
                            background: 'var(--bg-dark)', border: '1px solid var(--glass-border)',
                            borderRadius: '8px', overflow: 'hidden', zIndex: 100,
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)', padding: '0.35rem',
                            display: 'flex', flexDirection: 'column', gap: '0.15rem',
                            maxHeight: '220px', overflowY: 'auto',
                            marginTop: '0.25rem'
                        }}
                    >
                        {(!options || options.length === 0) ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                                No options available
                            </div>
                        ) : (
                            options.map((opt, idx) => {
                                const val = getValue(opt);
                                const label = getLabel(opt);
                                const disabled = typeof opt === 'object' && opt !== null ? opt.disabled : false;
                                const isSelected = val === value;

                                if (disabled) {
                                    return (
                                        <div key={`disabled-${idx}`} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: 'var(--text-dim)', opacity: 0.5 }}>
                                            {label}
                                        </div>
                                    )
                                }

                                return (
                                    <motion.div
                                        key={idx}
                                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onChange) onChange({ target: { value: val } });
                                            setIsOpen(false);
                                        }}
                                        style={{
                                            padding: '0.45rem 0.75rem', borderRadius: '6px',
                                            color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                                            background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            fontWeight: isSelected ? 700 : 500, fontSize: '0.85rem',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}
                                    >
                                        <span>{label}</span>
                                        {isSelected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                                <Check size={12} color="var(--primary)" strokeWidth={3} />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <style>{`
                html[data-theme='light'] .premium-dropdown {
                    background: white !important;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default AnimatedSelect;

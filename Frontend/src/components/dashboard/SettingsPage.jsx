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
    ShieldCheck,
    Eye,
    EyeOff
} from 'lucide-react';
import { useData } from '../../context/DataContext';


const SettingsPage = ({ theme, toggleTheme, onNotify, onLogout, activeSettingTab, setActiveSettingTab }) => {
    const { userProfile, setUserProfile } = useData();

    // Local states for form editing, initialized from global userProfile
    const [profileData, setProfileData] = useState({
        name: userProfile.name,
        username: userProfile.username,
        email: userProfile.email,
        jobTitle: userProfile.jobTitle,
        bio: userProfile.bio
    });
    const [profileImage, setProfileImage] = useState(userProfile.profileImage);
    const fileInputRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [contactData, setContactData] = useState({
        email: userProfile.email,
        phone: userProfile.phone,
        altEmail: userProfile.altEmail,
        location: userProfile.location
    });
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactErrors, setContactErrors] = useState({});

    // Sync local state when userProfile changes
    useEffect(() => {
        setProfileData({
            name: userProfile.name,
            username: userProfile.username,
            email: userProfile.email,
            jobTitle: userProfile.jobTitle,
            bio: userProfile.bio
        });
        setContactData({
            email: userProfile.email,
            phone: userProfile.phone,
            altEmail: userProfile.altEmail,
            location: userProfile.location
        });
        setProfileImage(userProfile.profileImage);
    }, [userProfile]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                // Also update global immediately for avatar in topbar
                setUserProfile(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setUserProfile(prev => ({
            ...prev,
            ...profileData,
            profileImage: profileImage
        }));
        onNotify("Profile updated successfully!");
    };

    const handleSaveContact = (e) => {
        e.preventDefault();
        const errors = {};
        if (!contactData.email.includes('@')) errors.email = true;
        if (contactData.phone.length < 10) errors.phone = true;

        if (Object.keys(errors).length > 0) {
            setContactErrors(errors);
            onNotify("Please fix the validation errors.");
            return;
        }

        setContactErrors({});
        setIsEditingContact(false);
        setUserProfile(prev => ({
            ...prev,
            ...contactData
        }));
        onNotify("Contact information updated!");
    };

    const toggleNotification = (key) => {
        const newSettings = {
            ...userProfile.notificationSettings,
            [key]: !userProfile.notificationSettings[key]
        };
        setUserProfile(prev => ({
            ...prev,
            notificationSettings: newSettings
        }));
    };

    const toggleTwoFactor = () => {
        setUserProfile(prev => ({
            ...prev,
            twoFactorEnabled: !prev.twoFactorEnabled
        }));
    };

    const settingMenu = [
        { id: 'Profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'Contact', label: 'Contact Info', icon: <Mail size={18} /> },
        { id: 'Notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'Account', label: 'Account', icon: <ShieldCheck size={18} /> }
    ];

    const renderSettingContent = () => {
        switch (activeSettingTab) {
            case 'Profile':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h3>Profile Settings</h3>
                            <p>Manage your public identity and personal details.</p>
                        </div>
                        <form className="profile-edit-card glass-dark" onSubmit={handleSaveProfile}>
                            <div className="profile-setup">
                                <div className="profile-avatar-large">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="avatar-preview-img" />
                                    ) : (
                                        profileData.name.split(' ').map(n => n[0]).join('')
                                    )}
                                    <button
                                        type="button"
                                        className="avatar-edit-badge"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div className="profile-actions">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <motion.button
                                        type="button"
                                        className="btn-primary-sm"
                                        whileHover={{ scale: 1.05, translateY: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        Change Avatar
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        className="btn-secondary-sm"
                                        whileHover={{ scale: 1.05, translateY: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setProfileImage(null);
                                            setUserProfile(prev => ({ ...prev, profileImage: null }));
                                        }}
                                    >
                                        Remove
                                    </motion.button>
                                </div>
                            </div>
                            <div className="settings-form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        placeholder="@username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Job Title</label>
                                    <input
                                        type="text"
                                        value={profileData.jobTitle}
                                        onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                                        placeholder="e.g. Product Designer"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>About You (Bio)</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>
                            <div className="section-footer">
                                <button type="submit" className="save-btn primary-gradient">Save Changes</button>
                            </div>
                        </form>
                    </div>
                );
            case 'Contact':
                return (
                    <div className="settings-section">
                        <div className="section-header split">
                            <div>
                                <h3>Contact Info</h3>
                                <p>Configure how you want to be reached.</p>
                            </div>
                            <button
                                className={`btn-secondary-sm ${isEditingContact ? 'active' : ''}`}
                                onClick={() => {
                                    if (isEditingContact) setIsEditingContact(false);
                                    else setIsEditingContact(true);
                                }}
                            >
                                {isEditingContact ? 'Cancel' : 'Edit Info'}
                            </button>
                        </div>
                        <form className={`profile-edit-card glass-dark ${isEditingContact ? 'editing' : ''}`} onSubmit={handleSaveContact}>
                            <div className="settings-form-grid">
                                <div className={`form-group ${contactErrors.email ? 'has-error' : ''}`}>
                                    <label>Primary Email Address</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            value={contactData.email}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                                        />
                                    </div>
                                    {contactErrors.email && <span className="error-text">Invalid email address</span>}
                                </div>
                                <div className={`form-group ${contactErrors.phone ? 'has-error' : ''}`}>
                                    <label>Phone Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            value={contactData.phone}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                                        />
                                    </div>
                                    {contactErrors.phone && <span className="error-text">Invalid phone number</span>}
                                </div>
                                <div className="form-group">
                                    <label>Alternate Email</label>
                                    <div className="input-with-icon">
                                        <Mail size={16} className="input-icon" />
                                        <input
                                            type="email"
                                            value={contactData.altEmail}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, altEmail: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <div className="input-with-icon">
                                        <Globe size={16} className="input-icon" />
                                        <input
                                            type="text"
                                            value={contactData.location}
                                            disabled={!isEditingContact}
                                            onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <AnimatePresence>
                                {isEditingContact && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="section-footer overflow-hidden"
                                    >
                                        <button type="submit" className="save-btn primary-gradient">Save Contact Info</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h3>Notifications</h3>
                            <p>Control where and when you receive updates.</p>
                        </div>
                        <div className="appearance-card glass-dark">
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Task Updates</h4>
                                    <p>Get notified when a task is assigned, moved, or commented on.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.taskUpdates ? 'active' : ''}`}
                                    onClick={() => toggleNotification('taskUpdates')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.taskUpdates ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.taskUpdates && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Project Updates</h4>
                                    <p>Receive alerts for project milestones and status changes.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.projectUpdates ? 'active' : ''}`}
                                    onClick={() => toggleNotification('projectUpdates')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.projectUpdates ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.projectUpdates && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Message Alerts</h4>
                                    <p>Instant notifications for direct messages and team chats.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.messageAlerts ? 'active' : ''}`}
                                    onClick={() => toggleNotification('messageAlerts')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.messageAlerts ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.messageAlerts && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive a daily digest of your activity via email.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.emailNotifications ? 'active' : ''}`}
                                    onClick={() => toggleNotification('emailNotifications')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.emailNotifications ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.emailNotifications && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Weekly Summary</h4>
                                    <p>A comprehensive report of your team's weekly progress.</p>
                                </div>
                                <div
                                    className={`theme-toggle-switch ${userProfile.notificationSettings.weeklySummary ? 'active' : ''}`}
                                    onClick={() => toggleNotification('weeklySummary')}
                                >
                                    <div className={`switch-track ${userProfile.notificationSettings.weeklySummary ? 'dark' : ''}`}>
                                        <div className="switch-thumb">{userProfile.notificationSettings.weeklySummary && <Check size={12} />}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Account':
                return (
                    <div className="settings-section">
                        <div className="section-header">
                            <h3>Account Security</h3>
                            <p>Manage your password and authentication settings.</p>
                        </div>

                        <div className="profile-edit-card glass-dark">
                            <h4 className="setting-sub-title">Change Password</h4>
                            <div className="settings-form-grid">
                                <div className="form-group full-width">
                                    <label>Current Password</label>
                                    <div className="input-with-icon">
                                        <Lock size={16} className="input-icon" />
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={passwordData.current}
                                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        >
                                            {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <div className="input-with-icon no-prefix">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            placeholder="Min. 8 characters"
                                            value={passwordData.new}
                                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        >
                                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <div className="input-with-icon no-prefix">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            placeholder="Repeat password"
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        >
                                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="section-footer">
                                <button className="save-btn primary-gradient" onClick={() => {
                                    if (passwordData.new !== passwordData.confirm) {
                                        onNotify("Passwords do not match!");
                                        return;
                                    }
                                    if (passwordData.new.length < 8) {
                                        onNotify("Password too short!");
                                        return;
                                    }
                                    setPasswordData({ current: '', new: '', confirm: '' });
                                    onNotify("Password updated successfully!");
                                }}>Update Password</button>
                            </div>
                        </div>



                        <div className="appearance-card glass-dark mt-2">
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4>Logout</h4>
                                    <p>Sign out of your account on this device.</p>
                                </div>
                                <button className="btn-secondary-sm" onClick={onLogout}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                            <div className="divider" />
                            <div className="setting-control-row">
                                <div className="control-info">
                                    <h4 className="text-red">Delete Account</h4>
                                    <p>Permanently delete your account and all associated data.</p>
                                </div>
                                <button className="btn-outline-red" onClick={() => setShowDeleteModal(true)}>
                                    Delete Account
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showDeleteModal && (
                                <div className="modal-overlay">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        className="add-conv-modal glass-dark text-center"
                                    >
                                        <div className="delete-warning-icon">
                                            <AlertCircle size={48} color="#f43f5e" />
                                        </div>
                                        <h2>Are you sure?</h2>
                                        <p className="text-dim mt-1">This action is permanent and cannot be undone. All your projects, tasks, and data will be lost forever.</p>

                                        <div className="modal-actions mt-2">
                                            <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                                            <button className="btn-danger-gradient" onClick={() => {
                                                const email = localStorage.getItem('loggedInUser');
                                                if (email) localStorage.removeItem(email);
                                                onLogout();
                                            }}>Yes, Delete My Account</button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-dashboard-container">
            <div className="settings-sidebar glass-dark">
                <div className="settings-sidebar-header">
                    <h4>Settings</h4>
                </div>
                <div className="settings-nav">
                    {settingMenu.map(item => (
                        <button
                            key={item.id}
                            className={`setting-nav-item ${activeSettingTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveSettingTab(item.id)}
                        >
                            <span className="setting-icon">{item.icon}</span>
                            <span className="setting-label">{item.label}</span>
                            {activeSettingTab === item.id && (
                                <motion.div layoutId="active-setting-pill" className="active-setting-pill" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                            )}
                        </button>
                    ))}
                </div>
            </div>
            <div className="settings-main-panel">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSettingTab}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="setting-content-viewport"
                    >
                        {renderSettingContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SettingsPage;

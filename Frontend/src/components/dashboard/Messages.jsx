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


// --- Messages Component ---
const Messages = ({ teams, globalSearch = '' }) => {
    // 1. Conversations list state
    const [conversations, setConversations] = useState(teams.map(t => ({
        ...t,
        lastMessage: "No messages yet",
        time: "Just now",
        unread: 0,
        messages: []
    })));

    // 2. Selected chat state
    const [selectedTeam, setSelectedTeam] = useState(conversations.length > 0 ? conversations[0] : null);

    // 3. Messages array state (specifically for the active chat)
    const [messages, setMessages] = useState(conversations.length > 0 ? conversations[0].messages : []);

    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showAddConvModal, setShowAddConvModal] = useState(false);
    const [newConvName, setNewConvName] = useState('');
    const [newConvDesc, setNewConvDesc] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [showNotification, setShowNotification] = useState(null);
    const messagesEndRef = useRef(null);

    // Mock members list for the dropdown
    const availableMembers = [];

    const triggerNotification = (msg) => {
        setShowNotification(msg);
        setTimeout(() => setShowNotification(null), 3000);
    };

    // Sync messages and selectedTeam when selection changes or conversations update
    useEffect(() => {
        if (!selectedTeam) return;
        const activeConv = conversations.find(c => c.id === selectedTeam.id);
        if (activeConv) {
            setMessages(activeConv.messages);
        }
    }, [selectedTeam?.id, conversations]);

    // Handle auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSelectConversation = (convId) => {
        const conv = conversations.find(c => c.id === convId);
        if (conv) {
            setSelectedTeam(conv);
            setConversations(prev => prev.map(c =>
                c.id === convId ? { ...c, unread: 0 } : c
            ));
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "You",
            content: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            avatar: 'Y'
        };

        // Update local messages for instant UI feedback
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Sync back to conversations list
        setConversations(prev => prev.map(c =>
            c.id === selectedTeam.id
                ? { ...c, messages: updatedMessages, lastMessage: messageText, time: newMessage.time }
                : c
        ));

        setMessageText('');

        // Mock typing indicator
        setTimeout(() => setIsTyping(true), 1000);
        setTimeout(() => setIsTyping(false), 4000);
    };

    const handleCreateConversation = (e) => {
        e.preventDefault();
        if (!newConvName.trim()) return;

        const newConv = {
            id: Date.now(),
            name: newConvName,
            description: newConvDesc,
            members: selectedMembers.length + 1, // +1 for "You"
            color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
            lastMessage: "Conversation started",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0,
            messages: []
        };

        setConversations([newConv, ...conversations]);
        setSelectedTeam(newConv);
        setMessages([]);

        // Reset and close
        setNewConvName('');
        setNewConvDesc('');
        setSelectedMembers([]);
        setShowAddConvModal(false);
        triggerNotification('New conversation created!');
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(globalSearch.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-content messages-tab">
            <div className="content-header">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1>Team <span className="accent-text">Chat</span></h1>
                    <p>Real-time collaboration across your workspaces.</p>
                </motion.div>
            </div>

            <div className="messages-container glass">
                {/* Left Panel: Conversation List */}
                <div className="messages-sidebar">
                    <div className="sidebar-chat-header">
                        <h3>Conversations</h3>
                        <motion.button
                            className="icon-btn-ghost active"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="New Chat"
                            onClick={() => setShowAddConvModal(true)}
                        >
                            <Plus size={20} />
                        </motion.button>
                    </div>
                    <div className="chat-search">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search chats..." />
                    </div>
                    <div className="conversations-list custom-scrollbar">
                        {filteredConversations.map(conv => (
                            <motion.div
                                key={conv.id}
                                className={`conversation-item ${selectedTeam?.id === conv.id ? 'active' : ''}`}
                                onClick={() => handleSelectConversation(conv.id)}
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <div className="conv-avatar" style={{ background: `linear-gradient(135deg, ${conv.color || '#6366f1'}, ${conv.color || '#6366f1'}88)` }}>
                                    {conv.name[0]}
                                    <div className="status-dot online"></div>
                                </div>
                                <div className="conv-info">
                                    <div className="conv-top">
                                        <span className="conv-name">{conv.name}</span>
                                        <span className="conv-time">{conv.time}</span>
                                    </div>
                                    <div className="conv-bottom">
                                        <p className="conv-preview">{conv.lastMessage}</p>
                                        {conv.unread > 0 && (
                                            <motion.span
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="unread-badge"
                                            >
                                                {conv.unread}
                                            </motion.span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Chat Window */}
                <div className="chat-window">
                    {!selectedTeam ? (
                        <div className="empty-chat-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h3>No conversations selected</h3>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header-main">
                                <div className="header-left">
                                    <div className="active-chat-avatar-wrapper">
                                        <div className="active-chat-avatar" style={{ background: `linear-gradient(135deg, ${selectedTeam.color}, ${selectedTeam.color}88)` }}>
                                            {selectedTeam.name[0]}
                                        </div>
                                        <motion.div
                                            className="sound-cue-ring"
                                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                    <div className="chat-meta">
                                        <h4>{selectedTeam.name}</h4>
                                        <div className="member-status">
                                            <span className="dot online"></span>
                                            <p>{selectedTeam.members || 0} members • Online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-area custom-scrollbar">
                                <AnimatePresence mode="popLayout" initial={false}>
                                    {messages.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="empty-chat-state"
                                        >
                                            <div className="empty-chat-icon glass-dark">
                                                <MessageSquare size={32} />
                                            </div>
                                            <h3>No messages yet</h3>
                                            <p>Start the conversation with {selectedTeam.name}!</p>
                                        </motion.div>
                                    ) : (
                                        messages.map((msg, i) => (
                                            <motion.div
                                                key={msg.id}
                                                layout
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className={`message-bubble-wrapper ${msg.isMe ? 'mine' : 'theirs'}`}
                                            >
                                                {!msg.isMe && (
                                                    <div className="message-header-theirs">
                                                        <div className="msg-avatar-sm" style={{ backgroundColor: selectedTeam.color }}>{msg.avatar}</div>
                                                        <span className="sender-name">{msg.sender}</span>
                                                    </div>
                                                )}
                                                <div className="message-bubble-group">
                                                    <div className={`message-bubble ${msg.isMe ? 'primary-gradient' : 'glass-dark'}`}>
                                                        <p>{msg.content}</p>
                                                        <span className="message-time">{msg.time}</span>

                                                        {/* Hover Actions */}
                                                        <div className="message-actions-overlay glass-dark">
                                                            <button className="action-btn-sm" title="Edit"><Edit2 size={12} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="typing-indicator theirs"
                                        >
                                            <div className="msg-avatar-sm" style={{ backgroundColor: selectedTeam.color }}>{selectedTeam.name[0]}</div>
                                            <div className="typing-dots glass-dark">
                                                <span></span><span></span><span></span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-row" onSubmit={handleSendMessage}>
                                <div className="input-wrapper glass">
                                    <input
                                        type="text"
                                        placeholder={`Message #${selectedTeam.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                    />
                                    <motion.button
                                        type="submit"
                                        className={`send-btn ${messageText.trim() ? 'active' : ''}`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        disabled={!messageText.trim()}
                                    >
                                        <Send size={18} />
                                    </motion.button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
            {/* Add Conversation Modal */}
            <AnimatePresence>
                {showAddConvModal && (
                    <div className="modal-overlay">
                        <motion.div
                            className="add-conv-modal glass"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h2>Add <span className="accent-text">Conversation</span></h2>
                                <button className="close-btn" onClick={() => setShowAddConvModal(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleCreateConversation}>
                                <div className="form-group">
                                    <label>Conversation Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Project X Sync"
                                        value={newConvName}
                                        onChange={(e) => setNewConvName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        placeholder="What's this chat about?"
                                        value={newConvDesc}
                                        onChange={(e) => setNewConvDesc(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Select Members</label>
                                    <div className="member-select-grid custom-scrollbar">
                                        {availableMembers.map(member => (
                                            <div
                                                key={member.id}
                                                className={`member-select-card ${selectedMembers.includes(member.id) ? 'selected' : ''}`}
                                                onClick={() => {
                                                    if (selectedMembers.includes(member.id)) {
                                                        setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                                                    } else {
                                                        setSelectedMembers([...selectedMembers, member.id]);
                                                    }
                                                }}
                                            >
                                                <div className="member-avatar-mini">{member.avatar}</div>
                                                <span>{member.name}</span>
                                                {selectedMembers.includes(member.id) && <Check size={14} className="check-icon" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddConvModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary">Create Conversation</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        className="chat-notification-toast glass"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <Check size={18} className="success-icon" />
                        <span>{showNotification}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Messages;

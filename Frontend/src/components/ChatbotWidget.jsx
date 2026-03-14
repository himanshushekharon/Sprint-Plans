import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, MessageSquare, X } from 'lucide-react';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial welcome message
    useEffect(() => {
        const welcomeMessage = {
            id: 'welcome',
            sender: 'Sprint AI',
            content: (
                <div>
                    <p>Hello 👋</p>
                    <p>I'm Sprint AI, your assistant for managing projects and tasks.</p>
                    <br />
                    <p>You can ask things like:</p>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.5rem' }}>
                        <li>• Show my active projects</li>
                        <li>• What tasks are due today?</li>
                        <li>• Show sprint progress</li>
                        <li>• List pending tasks</li>
                    </ul>
                </div>
            ),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isBot: true,
        };
        setMessages([welcomeMessage]);
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const quickActions = [
        "Show my tasks",
        "Show project progress",
        "Upcoming deadlines",
        "Team workload",
        "Sprint analytics"
    ];

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        const newUserMessage = {
            id: Date.now(),
            sender: 'You',
            content: <p>{text}</p>,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isBot: false,
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setMessageText('');
        setIsTyping(true);

        // Simulated AI Logic
        setTimeout(() => {
            let replyText = "I'm here to help with your Sprint Plans workspace.";
            const lowerText = text.toLowerCase();

            if (lowerText.includes("tasks") || lowerText.includes("task")) {
                replyText = "You currently have several tasks pending.";
            } else if (lowerText.includes("projects") || lowerText.includes("project")) {
                replyText = "You are managing multiple active projects.";
            } else if (lowerText.includes("deadline") || lowerText.includes("deadlines")) {
                replyText = "Your nearest deadline is approaching soon.";
            } else if (lowerText.includes("team") || lowerText.includes("teams")) {
                replyText = "Your team members are collaborating across projects.";
            }

            const botReply = {
                id: Date.now() + 1,
                sender: 'Sprint AI',
                content: <p>{replyText}</p>,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isBot: true,
            };

            setMessages((prev) => [...prev, botReply]);
            setIsTyping(false);
        }, 1000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSendMessage(messageText);
    };

    return (
        <div className="chatbot-widget-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window glass"
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <div className="chatbot-header">
                            <div className="chatbot-header-info">
                                <Bot size={20} className="header-icon" />
                                <h3>Sprint AI Assistant</h3>
                            </div>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="chatbot-messages-area custom-scrollbar">
                            <AnimatePresence mode="popLayout" initial={false}>
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        layout
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className={`chatbot-bubble-wrapper ${!msg.isBot ? 'mine' : 'theirs'}`}
                                    >
                                        {msg.isBot && (
                                            <div className="message-header-theirs">
                                                <div className="msg-avatar-sm bot-avatar glass">
                                                    <Bot size={14} color="var(--primary)" />
                                                </div>
                                                <span className="sender-name">{msg.sender}</span>
                                            </div>
                                        )}
                                        <div className="message-bubble-group">
                                            <div className={`chatbot-bubble ${!msg.isBot ? 'primary-gradient' : 'glass'}`}>
                                                {msg.content}
                                                <span className="chatbot-time">{msg.time}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {messages.length === 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="chatbot-quick-actions"
                                >
                                    {quickActions.map((action, idx) => (
                                        <motion.button
                                            key={idx}
                                            className="quick-action-pill glass"
                                            whileHover={{ scale: 1.02, backgroundColor: 'var(--glass-hover)' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleSendMessage(action)}
                                        >
                                            <MessageSquare size={12} className="action-icon" />
                                            {action}
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="typing-indicator theirs"
                                    style={{ marginLeft: '2.5rem' }}
                                >
                                    <div className="msg-avatar-sm bot-avatar glass" style={{ position: 'absolute', left: '-2.5rem', top: '0' }}>
                                        <Bot size={14} color="var(--primary)" />
                                    </div>
                                    <div className="typing-dots glass">
                                        <span></span><span></span><span></span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} style={{ height: '10px' }} />
                        </div>

                        <div className="chatbot-input-area glass">
                            <form className="chatbot-form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Ask Sprint AI anything..."
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
                                    <Send size={16} />
                                </motion.button>
                            </form>
                            <div className="input-footer">
                                <p>Sprint AI can make mistakes.</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className="chatbot-toggle-btn primary-gradient"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={28} color="white" /> : <Bot size={28} color="white" />}
            </motion.button>

            <style>{`
                .chatbot-widget-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 1rem;
                }

                .chatbot-toggle-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 14px 0 rgba(99, 102, 241, 0.39);
                    color: white;
                    outline: none;
                }

                .chatbot-window {
                    width: 350px;
                    height: 500px;
                    display: flex;
                    flex-direction: column;
                    border-radius: var(--border-radius);
                    overflow: hidden;
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                }

                .chatbot-header {
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--glass-border);
                    background: transparent;
                    backdrop-filter: blur(12px);
                }

                .chatbot-header-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .chatbot-header-info h3 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .header-icon {
                    color: var(--primary);
                }

                .close-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.25rem;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }

                .close-btn:hover {
                    color: var(--text-main);
                    background: var(--glass-hover);
                }

                .chatbot-messages-area {
                    flex: 1;
                    padding: 1.25rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .chatbot-bubble-wrapper {
                    display: flex;
                    flex-direction: column;
                    max-width: 85%;
                    position: relative;
                }

                .chatbot-bubble-wrapper.mine {
                    align-self: flex-end;
                    align-items: flex-end;
                }

                .chatbot-bubble-wrapper.theirs {
                    align-self: flex-start;
                    align-items: flex-start;
                }

                .message-header-theirs {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                }

                .sender-name {
                    font-size: 0.75rem;
                    color: var(--text-main);
                    font-weight: 500;
                    opacity: 0.8;
                }

                .msg-avatar-sm.bot-avatar {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .chatbot-bubble {
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    font-size: 0.85rem;
                    line-height: 1.5;
                    color: var(--text-main);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .chatbot-bubble p {
                    margin: 0;
                    font-size: 0.85rem;
                    color: inherit;
                }

                .chatbot-bubble-wrapper.theirs .chatbot-bubble {
                    border-top-left-radius: 0.25rem;
                }

                .chatbot-bubble-wrapper.mine .chatbot-bubble {
                    border-top-right-radius: 0.25rem;
                    color: white;
                }

                .chatbot-time {
                    display: block;
                    font-size: 0.65rem;
                    margin-top: 0.5rem;
                    opacity: 0.7;
                    text-align: right;
                }

                .primary-gradient {
                    background: linear-gradient(135deg, var(--primary), var(--secondary, var(--accent)));
                }

                .chatbot-quick-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    padding-left: 2.5rem;
                }

                .quick-action-pill {
                    padding: 0.5rem 0.75rem;
                    border-radius: 1rem;
                    border: 1px solid var(--glass-border);
                    color: var(--text-main);
                    font-size: 0.75rem;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .quick-action-pill:hover {
                    border-color: var(--primary);
                    background: var(--glass-hover);
                }

                .chatbot-input-area {
                    padding: 1rem;
                    border-top: 1px solid var(--glass-border);
                    background: transparent;
                    backdrop-filter: blur(12px);
                }

                .chatbot-form {
                    display: flex;
                    align-items: center;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 2rem;
                    padding: 0.5rem 0.75rem;
                    transition: all 0.3s ease;
                }

                .chatbot-form:focus-within {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }

                .chatbot-form input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: var(--text-main);
                    font-size: 0.85rem;
                    padding: 0 0.5rem;
                    outline: none;
                }

                .chatbot-form input::placeholder {
                    color: var(--text-dim);
                }

                .send-btn {
                    background: transparent;
                    border: none;
                    color: var(--text-dim);
                    cursor: pointer;
                    padding: 0.4rem;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .send-btn.active {
                    color: white;
                    background: var(--primary);
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .typing-dots {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 0.6rem 0.8rem;
                    border-radius: 1rem;
                    border-top-left-radius: 0.25rem;
                }

                .typing-dots span {
                    width: 5px;
                    height: 5px;
                    background-color: var(--text-main);
                    opacity: 0.6;
                    border-radius: 50%;
                    animation: typing 1.4s infinite ease-in-out both;
                }

                .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
                .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

                .input-footer {
                    text-align: center;
                    margin-top: 0.5rem;
                }

                .input-footer p {
                    font-size: 0.65rem;
                    color: var(--text-dim);
                    margin: 0;
                }

                @media (max-width: 480px) {
                    .chatbot-window {
                        width: calc(100vw - 48px);
                        height: 60vh;
                        max-height: 500px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ChatbotWidget;

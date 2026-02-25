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


const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let totalMilisecondsStep = Math.abs(Math.floor(duration * 1000 / end));
        let timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, totalMilisecondsStep);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

export default AnimatedCounter;

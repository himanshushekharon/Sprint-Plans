import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);

    const [userProfile, setUserProfile] = useState({
        name: 'Alex Rivera',
        username: 'arivera_ux',
        email: '',
        jobTitle: 'Product Designer',
        bio: 'Product Designer & Motion Enthusiast. Currently building the future of work at Sprint Plans.',
        phone: '+1 (555) 000-0000',
        altEmail: 'alex.rivera@personal.me',
        location: 'San Francisco, CA',
        profileImage: null,
        notificationSettings: {
            taskUpdates: true,
            projectUpdates: true,
            messageAlerts: true,
            emailNotifications: false,
            weeklySummary: true
        },
        twoFactorEnabled: false
    });

    // Use a ref to prevent saving on initial load before loadUserData completes
    const isLoaded = useRef(false);

    const loadUserData = (email, name) => {
        setUserEmail(email);
        const storedData = localStorage.getItem(email);
        const data = storedData ? JSON.parse(storedData) : { projects: [], teams: [], tasks: [], members: [], userProfile: null };

        setProjects(data.projects || []);
        setTeams(data.teams || []);
        setTasks(data.tasks || []);
        setMembers(data.members || []);

        if (data.userProfile) {
            setUserProfile(data.userProfile);
        } else {
            setUserProfile(prev => {
                const displayName = name || prev.name;
                return {
                    ...prev,
                    email: email,
                    name: displayName,
                    username: displayName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 900 + 100)
                };
            });
        }

        isLoaded.current = true;
    };

    const clearUserData = () => {
        setUserEmail(null);
        setProjects([]);
        setTeams([]);
        setTasks([]);
        setMembers([]);
        setUserProfile({
            name: 'Alex Rivera',
            username: 'arivera_ux',
            email: '',
            jobTitle: 'Product Designer',
            bio: 'Product Designer & Motion Enthusiast. Currently building the future of work at Sprint Plans.',
            phone: '+1 (555) 000-0000',
            altEmail: 'alex.rivera@personal.me',
            location: 'San Francisco, CA',
            profileImage: null,
            notificationSettings: {
                taskUpdates: true,
                projectUpdates: true,
                messageAlerts: true,
                emailNotifications: false,
                weeklySummary: true
            },
            twoFactorEnabled: false
        });
        isLoaded.current = false;
    };

    // Auto-save changes to localStorage whenever data shifts
    useEffect(() => {
        if (userEmail && isLoaded.current) {
            const existingDataRaw = localStorage.getItem(userEmail);
            const existingData = existingDataRaw ? JSON.parse(existingDataRaw) : {};
            localStorage.setItem(userEmail, JSON.stringify({
                ...existingData,
                email: userEmail,
                projects,
                teams,
                tasks,
                members,
                userProfile
            }));
        }
    }, [projects, teams, tasks, members, userProfile, userEmail]);

    return (
        <DataContext.Provider value={{
            userEmail,
            projects, setProjects,
            teams, setTeams,
            tasks, setTasks,
            members, setMembers,
            userProfile, setUserProfile,
            loadUserData,
            clearUserData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

import { getProjects, getTeams, getTasksByProject } from '../services/api';

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

    const loadUserData = async (email, name) => {
        setUserEmail(email);

        try {
            // Check if there's cached data from local login logic, but fetch fresh data
            const fetchedProjects = await getProjects();
            const fetchedTeams = await getTeams();

            // To fetch all tasks, we need to iterate over projects, or we could add a `getTasks` for user.
            // For now, let's fetch active tasks by projects. Wait, backend taskRoutes has getting tasks by project.
            // Let's create a combined tasks array
            let allTasks = [];
            for (const project of fetchedProjects) {
                try {
                    const projectTasks = await getTasksByProject(project._id);
                    allTasks = [...allTasks, ...projectTasks];
                } catch (err) {
                    console.error(`Failed to load tasks for project ${project.name}:`, err);
                }
            }

            const mapId = doc => ({ ...doc, id: doc._id || doc.id });
            const mappedProjects = (fetchedProjects || []).map(mapId);
            const mappedTeams = (fetchedTeams || []).map(t => ({
                ...t,
                id: t._id || t.id,
                membersList: t.membersList || [],
                members: t.members || 0
            }));
            const mappedTasks = allTasks.map(t => ({
                ...t,
                id: t._id || t.id,
                status: t.status === 'todo' ? 'Pending' : (t.status === 'done' ? 'Completed' : t.status)
            }));

            setProjects(mappedProjects);
            setTeams(mappedTeams);
            setTasks(mappedTasks);

            // ALWAYS update profile from the verified Clerk data passed in via 'name' and 'email'
            // We ignore local storage for profile to avoid stale data (like 'Tom')
            setUserProfile(prev => {
                const displayName = name || prev.name || 'User';
                return {
                    ...prev,
                    email: email,
                    name: displayName,
                    username: displayName.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 900 + 100)
                };
            });
        } catch (error) {
            console.error("Error loading data from API:", error);
            // Fallback to local storage if API fails
            const storedData = localStorage.getItem(email);
            const data = storedData ? JSON.parse(storedData) : { projects: [], teams: [], tasks: [], members: [], userProfile: null };

            setProjects(data.projects || []);
            setTeams(data.teams || []);
            setTasks(data.tasks || []);
            setMembers(data.members || []);

            setUserProfile(prev => {
                const displayName = name || prev.name || 'User';
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

    // Keeping profile caching for fast startup, while other data is handled via component-level CRUD over API
    useEffect(() => {
        if (userEmail && isLoaded.current) {
            const existingDataRaw = localStorage.getItem(userEmail);
            const existingData = existingDataRaw ? JSON.parse(existingDataRaw) : {};
            localStorage.setItem(userEmail, JSON.stringify({
                ...existingData,
                email: userEmail,
                userProfile
            }));
        }
    }, [userProfile, userEmail]);

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

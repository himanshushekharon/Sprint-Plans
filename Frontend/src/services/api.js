import api from '../config/axios';

// Users
export const registerUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post('/users/login', userData);
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

// Projects
export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

export const updateProject = async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
};

export const deleteProject = async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

// Teams
export const getTeams = async () => {
    const response = await api.get('/teams');
    return response.data;
};

export const createTeam = async (teamData) => {
    const response = await api.post('/teams', teamData);
    return response.data;
};

export const getTeamById = async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
};

export const addTeamMember = async (id, memberData) => {
    const response = await api.put(`/teams/${id}/add`, memberData);
    return response.data;
};

export const removeTeamMember = async (id, memberId) => {
    const response = await api.put(`/teams/${id}/remove`, { userId: memberId });
    return response.data;
};

export const deleteTeam = async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response.data;
};

// Tasks
export const getTasksByProject = async (projectId) => {
    const response = await api.get(`/tasks/project/${projectId}`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://sprint-plans-backend.onrender.com/api',
});

// Add a request interceptor to inject the live Clerk token
api.interceptors.request.use(
    async (config) => {
        // Dynamically get the latest secure token directly from Clerk!
        if (window.Clerk && window.Clerk.session) {
            try {
                const token = await window.Clerk.session.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (err) {
                console.error("Could not get Clerk token", err);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

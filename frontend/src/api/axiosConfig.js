// frontend/src/api/axiosConfig.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Portable default for SSR/Node. localStorage is only read later, and only when available.
let authToken = null;

const getStoredAuthToken = () => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem('jwt_token');
        }
    } catch {
        // Private browsing and other restricted contexts can throw on localStorage access.
    }
    return null;
};

// Este objeto exportado se usará para actualizar dinámicamente el token desde el AuthContext
export const setAuthToken = (token) => {
    authToken = token;
};

// Interceptor de solicitudes de Axios
apiClient.interceptors.request.use(
    (config) => {
        const token = authToken ?? getStoredAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    // Si hay un error, lo rechazamos
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
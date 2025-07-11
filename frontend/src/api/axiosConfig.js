// frontend/src/api/axiosConfig.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Este objeto exportado se usará para inyectar dinámicamente el token
// desde el AuthContext en la configuración de Axios.
// Es un patrón común para manejar tokens JWT en interceptores
// cuando el token vive en un contexto de React o en localStorage.
let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

// Interceptor de solicitudes de Axios
apiClient.interceptors.request.use(
    (config) => {
        if (authToken) {
            // Si authToken está definido, lo añadimos al encabezado de autorización
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
// frontend/src/api/axiosConfig.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// RED DE SEGURIDAD: Inicializamos la variable interna directamente con lo que haya en localStorage.
// Así, el interceptor tendrá acceso al token desde el milisegundo cero, incluso antes de que React cargue.
let authToken = localStorage.getItem('jwt_token');

// Este objeto exportado se usará para actualizar dinámicamente el token desde el AuthContext
export const setAuthToken = (token) => {
    authToken = token;
};

// Interceptor de solicitudes de Axios
apiClient.interceptors.request.use(
    (config) => {
        // Ahora, si authToken existe (ya sea por el localStorage inicial o por setAuthToken), se inyecta siempre de forma limpia
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    // Si hay un error, lo rechazamos
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
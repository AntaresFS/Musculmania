// frontend/src/api/axiosConfig.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Añade un interceptor de petición
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token'); // Obtén el token del localStorage
        if (token) {
            // Si el token existe, añádelo al encabezado de autorización
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
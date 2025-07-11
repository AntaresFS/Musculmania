// Ejemplo: frontend/src/components/SomeProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import apiClient from '../api/axiosConfig'; // <-- ¡IMPORTA TU INSTANCIA CONFIGURADA DE AXIOS!

function SomeProtectedRoute() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Usamos apiClient para que el token se añada automáticamente
                const response = await apiClient.get('/api/protected'); // Ruta protegida
                setData(response.data);
            } catch (err) {
                console.error("Error al acceder a la ruta protegida:", err);
                if (err.response && err.response.status === 401) {
                    setError("No autorizado. Por favor, inicia sesión.");
                    // Opcional: borrar token si no es válido y redirigir al login
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_data');
                } else {
                    setError("Error al obtener datos protegidos.");
                }
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!data) {
        return <div>Cargando datos protegidos...</div>;
    }

    return (
        <div>
            <h2>Datos de Ruta Protegida</h2>
            <p>Mensaje del servidor: {data.message}</p>
            <p>Logueado como: {data.logged_in_as}</p>
        </div>
    );
}

export default SomeProtectedRoute;
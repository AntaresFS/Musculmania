// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth(); // Importa isLoading  del contexto de autenticación

    if (isLoading) {
        return <div>Verificando autenticación...</div>; // Muestra un mensaje mientras se verifica la autenticación
    }

    if (!isAuthenticated) {
        // Si el usuario no está autenticado, redirige a la página de inicio
        return <Navigate to="/" replace />;
    }

    return children; // Si está autenticado, renderiza los componentes hijos (el Dashboard)
};

export default ProtectedRoute;
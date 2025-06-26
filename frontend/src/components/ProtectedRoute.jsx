// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Asegúrate de que la ruta sea correcta

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Si el usuario no está autenticado, redirige a la página principal
        return <Navigate to="/" replace />;
    }

    return children; // Si está autenticado, renderiza los componentes hijos (el Dashboard)
};

export default ProtectedRoute;
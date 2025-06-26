import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './authContext'; // Importamos el contexto desde el nuevo archivo
import { setAuthToken } from '../api/axiosConfig'; // Importamos la función para establecer el token en Axios

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenInternal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Función setter personalizada para el token que también actualiza el interceptor de Axios
    const setToken = (newToken) => {
        setTokenInternal(newToken);
        setAuthToken(newToken); // Actualiza el token en Axios
    };

    // Función interna para manejar el estado del token
    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        const storedUser = localStorage.getItem('user_data');

        console.log("AuthProvider useEffect - storedToken:", storedToken ? "Presente" : "Ausente");
        console.log("AuthProvider useEffect - storedUser:", storedUser ? "Presente" : "Ausente");

        // Si hay un token y datos de usuario almacenados, los usamos para inicializar el estado
        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
                console.log("AuthProvider useEffect - User loaded:", JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing stored user data:", e);
                localStorage.removeItem('user_data');
                localStorage.removeItem('jwt_token');
                setUser(null);
                setToken(null); // Usa el setter personalizado para actualizar el token
            }
        } else {
            setToken(null); // Asegura que el token sea null si no hay datos en el localStorage
        }
        setIsLoading(false); // Marca que la carga ha terminado
    }, []);

    // Función para iniciar sesión y actualizar el token y los datos del usuario
    const login = (newToken, userData) => {
        localStorage.setItem('jwt_token', newToken);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        console.log("AuthContext login - User set:", userData);
    };

    // Función para cerrar sesión y limpiar el estado
    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        setToken(null); // Usa el setter personalizado para actualizar el token
        setUser(null);
        console.log("AuthContext logout - User and toen cleared");
    };

    const isAuthenticated = !!token;

    if (isLoading) {
        return <div>Cargando autenticación...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
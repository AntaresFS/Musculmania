import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppNavbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import AppFooter from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import { AuthProvider } from './context/AuthContext.jsx';

import './App.css'; // Para estilos globales o de reinicio

function App() {
  // Estado para controlar la visibilidad del modal de autenticación
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleShowAuthModal = () => setShowAuthModal(true);
    const handleCloseAuthModal = () => setShowAuthModal(false);

  return (
    // El AuthProvider envuelve toda tu aplicación para que todos los componentes
    // dentro de él puedan acceder al contexto de autenticación
    <AuthProvider>
        <Router>
            <div className="App">

                {/* Renderizamos el Navbar y pasamos la función para mostrar el modal de autenticación */}
                <AppNavbar onShowAuthModal={handleShowAuthModal} />

                {/* Definimos las rutas de la aplicación */}
                <Routes>
                    <Route path="/" element={
                        <>
                        <HeroSection />
                        <FeaturesSection />
                        <TestimonialsSection />
                        <CTASection />
                        </>
                    } />
                    {/* Ruta protegida para el Dashboard */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>

                {/* Renderizamos el pie de página */}
                <AppFooter />
            </div>

            {/* Renderizamos el AuthModal fuera del Navbar, pero controlado por App.jsx */}
            <AuthModal show={showAuthModal} handleClose={handleCloseAuthModal} />
        </Router>
      </AuthProvider>
  );
}

export default App;
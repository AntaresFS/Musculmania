import React, { useState } from 'react';
import AppNavbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import AppFooter from './components/Footer';
import AuthModal from './components/AuthModal';
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
            <div className="App">
                {/* Pasamos la función para abrir el modal al Navbar */}
                <AppNavbar onShowAuthModal={handleShowAuthModal} />
                <HeroSection />
                <FeaturesSection />
                <TestimonialsSection />
                <CTASection />
                <AppFooter />
            </div>

            {/* Renderizamos el AuthModal fuera del Navbar, pero controlado por App.jsx */}
            <AuthModal show={showAuthModal} handleClose={handleCloseAuthModal} />
        </AuthProvider>
  );
}

export default App;
import React from 'react';
import AppNavbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import AppFooter from './components/Footer';
import './App.css'; // Para estilos globales o de reinicio

function App() {
  return (
    <div className="App">
      <AppNavbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <AppFooter />
    </div>
  );
}

export default App;
import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

// El Navbar ahora recibe 'onShowAuthModal' como una prop
const AppNavbar = ({ onShowAuthModal }) => {
  // Usamos el hook useAuth para acceder al contexto de autenticación
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/'); // Redirige al usuario a la página principal después de cerrar sesión
  };

  const handleDashboardRedirect = () => {
    navigate('/dashboard'); // Redirige al Dashboard si el usuario está autenticado
  };

  const handleProfileRedirect = () => {
    // Lógica para redirigir al perfil del usuario
    console.log("Redirigiendo al perfil del usuario");
    navigate('/profile'); // ¡¡¡¡¡¡ Asegúrate de que esta ruta exista en tu aplicación !!!!!!
  };

  const handleRoutineRedirect = () => {
    console.log("Redirigiendo a la rutina de entrenamiento del usuario");
    navigate('/routine'); // ¡¡¡¡¡¡ Asegúrate de que esta ruta exista en tu aplicación !!!!!!
  };

  const handleDietRedirect = () => {
    console.log("Redirigiendo a la dieta personalizada del usuario");
    navigate('/diet'); // ¡¡¡¡¡¡ Asegúrate de que esta ruta exista en tu aplicación !!!!!!
  };    
  
  return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                <Navbar.Brand href="#home" className="text-white fs-4 fw-bold">
                    <img
                        src="/logo-placeholder.png"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                        alt="Logo"
                    />
                    Musculmania
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="#home" className="text-white mx-2">Inicio</Nav.Link>
                        <Nav.Link href="#suplementos" className="text-white mx-2">Suplementos</Nav.Link>
                        <Nav.Link href="#entrenamiento" className="text-white mx-2">Entrenamiento & Dieta</Nav.Link>
                        <Nav.Link href="#nosotros" className="text-white mx-2">Nosotros</Nav.Link>
                        <Nav.Link href="#contacto" className="text-white mx-2">Contacto</Nav.Link>
                        
                        {/* Renderizado condicional del botón de acceso/cierre de sesión */}
                        {isAuthenticated ? (
                            // Menú desplegable para usuarios autenticados
                            <NavDropdown 
                                title={`Hola, ${user?.first_name || 'Cliente'}`} 
                                id="basic-nav-dropdown" 
                                align="end" // Alinea el menú a la derecha
                                className="text-white mx-2"
                            >
                                <NavDropdown.Item onClick={handleProfileRedirect}>Mi Perfil</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleRoutineRedirect}>Rutina de Entrenamiento</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleDietRedirect}>Dieta Personalizada</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            // Botón "Acceso Clientes" para usuarios no autenticados
                            <Button 
                                variant="outline-light" 
                                className="ms-lg-3 my-2 my-lg-0" 
                                onClick={onShowAuthModal} 
                            >
                                Acceso Clientes
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
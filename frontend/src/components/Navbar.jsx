import React, { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import AuthModal from './AuthModal'; 

const AppNavbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCloseLoginModal = () => setShowLoginModal(false);
  const handleShowLoginModal = () => setShowLoginModal(true);



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
            <Button 
              variant="outline-light" 
              className="ms-lg-3 my-2 my-lg-0" 
              onClick={handleShowLoginModal}>
              Acceso Clientes
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <AuthModal 
        show={showLoginModal} 
        handleClose={handleCloseLoginModal} />
    </Navbar>
  );
};

export default AppNavbar;
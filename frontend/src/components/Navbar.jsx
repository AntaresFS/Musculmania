import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="#home" className="text-white fs-4 fw-bold">
          <img
            src="/logo-placeholder.png" // Reemplaza con la ruta de tu logo
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
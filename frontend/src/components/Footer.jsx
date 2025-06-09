import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AppFooter = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Musculmania</h5>
            <p className="text-secondary">
              Tu aliado para un estilo de vida saludable y tus metas de fitness.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>Enlaces Rápidos</h5>
            <ul className="list-unstyled">
              <li><a href="#home" className="text-secondary text-decoration-none">Inicio</a></li>
              <li><a href="#suplementos" className="text-secondary text-decoration-none">Suplementos</a></li>
              <li><a href="#entrenamiento" className="text-secondary text-decoration-none">Entrenamiento & Dieta</a></li>
              <li><a href="#contacto" className="text-secondary text-decoration-none">Contacto</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contacto</h5>
            <p className="text-secondary">
              Email: info@tutienda.com<br />
              Teléfono: +34 123 456 789<br />
              Dirección: Calle Falsa 123, Madrid, España
            </p>
            <div className="d-flex mt-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <i className="bi bi-facebook fs-4"></i> {/* Icono de Facebook */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <i className="bi bi-instagram fs-4"></i> {/* Icono de Instagram */}
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <i className="bi bi-twitter fs-4"></i> {/* Icono de Twitter */}
              </a>
            </div>
          </Col>
        </Row>
        <hr className="bg-secondary" />
        <Row>
          <Col className="text-center text-secondary">
            <p>&copy; {new Date().getFullYear()} Musculmania. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
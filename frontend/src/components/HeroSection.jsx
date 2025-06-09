import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './HeroSection.css'; // Para estilos personalizados

const HeroSection = () => {
  return (
    <div className="hero-section text-white d-flex align-items-center justify-content-center text-center">
      <Container>
        <Row>
          <Col md={8} className="mx-auto">
            <h1 className="display-3 fw-bold mb-4">
              Desbloquea tu Potencial: Suplementación y Rutinas Personalizadas
            </h1>
            <p className="lead mb-5">
              Obtén tu plan de entrenamiento y dieta a medida con el seguimiento de un entrenador experto.
              ¡Ideal para musculación, fitness funcional y un estilo de vida saludable!
            </p>
            <Button variant="outline-light" size="lg" href="#form-contacto" className="me-3">
              ¡Quiero mi Rutina Personalizada!
            </Button>
            <Button variant="light" size="lg" href="#suplementos">
              Ver Suplementos
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
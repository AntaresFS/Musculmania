import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const FeaturesSection = () => {
  return (
    <section id="entrenamiento" className="py-5 bg-light">
      <Container>
        <h2 className="text-center text-dark mb-5 display-4 fw-bold">
          Tu Camino hacia el Éxito
        </h2>
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4 text-center">
                <i className="bi bi-person-check-fill text-dark mb-3" style={{ fontSize: '3rem' }}></i>
                <Card.Title className="h4 text-dark fw-bold">Entrenador Experto</Card.Title>
                <Card.Text className="text-secondary">
                  Trabaja con un profesional certificado en musculación, fitness funcional y nutrición.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4 text-center">
                <i className="bi bi-journal-check text-dark mb-3" style={{ fontSize: '3rem' }}></i>
                <Card.Title className="h4 text-dark fw-bold">Planes 100% Personalizados</Card.Title>
                <Card.Text className="text-secondary">
                  Rutinas de entrenamiento y dietas diseñadas exclusivamente para tus objetivos y nivel.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4 text-center">
                <i className="bi bi-chat-dots-fill text-dark mb-3" style={{ fontSize: '3rem' }}></i>
                <Card.Title className="h4 text-dark fw-bold">Seguimiento Continuo</Card.Title>
                <Card.Text className="text-secondary">
                  Recibe feedback constante y ajusta tu plan para optimizar tus resultados.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4 text-center">
                <i className="bi bi-box-seam-fill text-dark mb-3" style={{ fontSize: '3rem' }}></i>
                <Card.Title className="h4 text-dark fw-bold">Suplementación de Calidad</Card.Title>
                <Card.Text className="text-secondary">
                  Acceso a los mejores suplementos para complementar tu dieta y entrenamiento.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4 text-center">
                <i className="bi bi-activity text-dark mb-3" style={{ fontSize: '3rem' }}></i>
                <Card.Title className="h4 text-dark fw-bold">Salud y Bienestar</Card.Title>
                <Card.Text className="text-secondary">
                  Enfoque integral para un estilo de vida más activo, saludable y duradero.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="p-4 text-center">
                <i className="bi bi-graph-up-arrow text-dark mb-3" style={{ fontSize: '3rem' }}></i>
                <Card.Title className="h4 text-dark fw-bold">Resultados Reales</Card.Title>
                <Card.Text className="text-secondary">
                  Alcanza tus metas con un enfoque científico y probado.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FeaturesSection;
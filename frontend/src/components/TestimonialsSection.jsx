import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Laura G.',
      text: 'Gracias a su rutina y seguimiento, he logrado transformar mi cuerpo y sentirme más fuerte que nunca. ¡Totalmente recomendado!',
      avatar: '/avatar1.jpg' // Reemplaza con imágenes de avatar
    },
    {
      name: 'Carlos P.',
      text: 'Los suplementos son de primera calidad y el plan de entrenamiento funcional me ha ayudado a mejorar mi rendimiento diario.',
      avatar: '/avatar2.jpg'
    },
    {
      name: 'Sofía R.',
      text: 'Nunca pensé que una dieta personalizada podría ser tan fácil de seguir. El apoyo del entrenador es increíble.',
      avatar: '/avatar3.jpg'
    }
  ];

  return (
    <section className="py-5 bg-dark text-white">
      <Container>
        <h2 className="text-center mb-5 display-4 fw-bold">
          Lo que dicen nuestros clientes
        </h2>
        <Row className="g-4 justify-content-center">
          {testimonials.map((testimonial, index) => (
            <Col md={6} lg={4} key={index}>
              <Card className="h-100 bg-white text-dark shadow-sm border-0">
                <Card.Body className="p-4 text-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="rounded-circle mb-3"
                    width="80"
                    height="80"
                    style={{ objectFit: 'cover' }}
                  />
                  <Card.Text className="fst-italic">"{testimonial.text}"</Card.Text>
                  <p className="fw-bold mt-3">- {testimonial.name}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
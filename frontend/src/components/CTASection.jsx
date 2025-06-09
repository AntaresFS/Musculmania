import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const CTASection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: '',
    level: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes añadir la lógica para enviar el formulario.
    // Por ejemplo, una llamada a una API o un servicio de correo.
    console.log('Datos del formulario:', formData);

    // Simulación de envío exitoso
    if (formData.name && formData.email && formData.goals && formData.level) {
      setShowSuccess(true);
      setShowError(false);
      setFormData({ name: '', email: '', goals: '', level: '' }); // Limpiar formulario
    } else {
      setShowError(true);
      setShowSuccess(false);
    }
    setTimeout(() => {
      setShowSuccess(false);
      setShowError(false);
    }, 5000);
  };

  return (
    <section id="form-contacto" className="py-5 bg-light">
      <Container>
        <h2 className="text-center text-dark mb-5 display-4 fw-bold">
          ¡Consigue tu Rutina y Dieta Personalizada!
        </h2>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-lg border-0 bg-white">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  {showSuccess && (
                    <Alert variant="success" className="mb-3">
                      ¡Gracias! Tu solicitud ha sido enviada. Nos pondremos en contacto contigo pronto.
                    </Alert>
                  )}
                  {showError && (
                    <Alert variant="danger" className="mb-3">
                      Por favor, completa todos los campos.
                    </Alert>
                  )}
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label className="text-dark">Nombre Completo</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Introduce tu nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-dark">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Introduce tu email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGoals">
                    <Form.Label className="text-dark">Tus Objetivos Principales</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Ej: Ganar masa muscular, perder peso, mejorar resistencia, vida más saludable..."
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formLevel">
                    <Form.Label className="text-dark">Tu Nivel Actual</Form.Label>
                    <Form.Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona tu nivel...</option>
                      <option value="principiante">Principiante</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </Form.Select>
                  </Form.Group>

                  <Button variant="dark" type="submit" size="lg" className="w-100 py-3">
                    Solicitar Mi Plan Personalizado
                  </Button>
                  <small className="text-center d-block mt-3 text-secondary">
                    Nos pondremos en contacto contigo en las próximas 24-48 horas para iniciar el proceso.
                  </small>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;
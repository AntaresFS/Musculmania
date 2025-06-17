import React, { useState } from 'react';
import { Modal, Button, Form, Nav } from 'react-bootstrap'; // Importa Nav también

const AuthModal = ({ show, handleClose }) => {
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre login y registro

  // Funciones para manejar el envío del formulario
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar los datos de login al backend
    console.log('Login Form Submitted');
    // Después de un login exitoso, podrías cerrar el modal: handleClose();
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar los datos de registro al backend
    console.log('Register Form Submitted');
    // Después de un registro exitoso, podrías cerrar el modal o redirigir: handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isRegistering ? 'Registro de Clientes' : 'Acceso Clientes'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isRegistering ? ( // Contenido del formulario de inicio de sesión
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" placeholder="Introduce tu correo electrónico" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Contraseña" required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Iniciar Sesión
            </Button>

            <div className="text-center">
              <Nav.Link onClick={() => console.log('Recuperar contraseña')} className="text-info">
                ¿Olvidaste tu contraseña?
              </Nav.Link>
              <p className="mt-3">
                ¿No tienes cuenta?{' '}
                <Nav.Link onClick={() => setIsRegistering(true)} className="text-info d-inline-block">
                  Regístrate aquí
                </Nav.Link>
              </p>
            </div>
          </Form>
        ) : ( // Contenido del formulario de registro
          <Form onSubmit={handleRegisterSubmit}>
            <Form.Group className="mb-3" controlId="formRegisterName">
              <Form.Label>Nombre y Apellidos</Form.Label>
              <Form.Control type="text" placeholder="Introduce tu nombre y apellidos" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
              <Form.Label>Correo electrónico (para iniciar sesión)</Form.Label>
              <Form.Control type="email" placeholder="Introduce tu correo electrónico" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPhone">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control type="tel" placeholder="Ej: 600123456" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" placeholder="Tu dirección completa" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterLevel">
              <Form.Label>Nivel</Form.Label>
              <Form.Select required>
                <option value="">Selecciona tu nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterAllergies">
              <Form.Label>Alergias alimenticias e intolerancias</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Ej: Gluten, lactosa, frutos secos..." />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterDietPrefs">
              <Form.Label>Preferencias en la dieta</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Ej: Vegana, vegetariana, sin carnes rojas..." />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Crea tu contraseña" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control type="password" placeholder="Confirma tu contraseña" required />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mb-3">
              Registrarse
            </Button>

            <div className="text-center">
              <p className="mt-3">
                ¿Ya tienes cuenta?{' '}
                <Nav.Link onClick={() => setIsRegistering(false)} className="text-info d-inline-block">
                  Inicia Sesión
                </Nav.Link>
              </p>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
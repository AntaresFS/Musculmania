import React, { useState } from 'react';
import { Modal, Button, Form, Nav, Alert } from 'react-bootstrap'; // Importa Alert

const AuthModal = ({ show, handleClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estados para las contraseñas y sus errores
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');

  // Estado para el mensaje de error general del formulario de registro
  const [formError, setFormError] = useState('');

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Lógica para enviar los datos de login al backend
    console.log('Login Form Submitted');
    // Después de un login exitoso, podrías cerrar el modal: handleClose();
  };

  // Función para manejar el envío del formulario de registro
  const handleRegisterSubmit = (event) => {
    event.preventDefault(); // Evita el recargado de la página

    setFormError(''); // Limpia cualquier error anterior
    setPasswordMatchError(''); // Limpia el error de contraseña anterior

    // 1. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setPasswordMatchError('Las contraseñas no coinciden.');
      setFormError('Por favor, corrige los errores del formulario.');
      return; // Detener el envío si las contraseñas no coinciden
    } else {
      setPasswordMatchError('');
    }

    // 2. Validar campos obligatorios (nativa de HTML5 con `required`)
    // Si usas 'required' en Form.Control, el navegador ya hace una validación básica.
    // Sin embargo, podemos añadir una verificación explícita para un mensaje general.
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation(); // Previene la propagación del evento
      setFormError('Por favor, rellena todos los campos obligatorios.');
      // Bootstrap añadirá clases de validación (is-invalid) si el formulario está configurado para eso.
    } else {
      // Si todo es válido, procede con el envío al backend
      console.log('Register Form Submitted:', {
        // Aquí recopilarías todos los valores de los campos
        // Idealmente, usarías estados para cada campo de input para acceder a sus valores
        // Por ahora, solo un placeholder:
        name: form.formRegisterFirstName.value,
        lastName: form.formRegisterLastName.value,
        gender: form.gender.value, // Los radios comparten el mismo name
        email: form.formRegisterEmail.value,
        phone: form.formRegisterPhone.value,
        address: form.formRegisterAddress.value,
        level: form.formRegisterLevel.value,
        allergies: form.formRegisterAllergies.value,
        dietPrefs: form.formRegisterDietPrefs.value,
        password: password, // Usamos el estado de la contraseña
      });
      // Después de un registro exitoso, podrías cerrar el modal o redirigir: handleClose();
    }
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
          <Form noValidate onSubmit={handleRegisterSubmit}> {/* Añade noValidate para controlar la validación */}
            {/* Campo de Nombre */}
            <Form.Group className="mb-3" controlId="formRegisterFirstName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Introduce tu nombre" required />
            </Form.Group>

            {/* Campo de Apellidos */}
            <Form.Group className="mb-3" controlId="formRegisterLastName">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control type="text" placeholder="Introduce tus apellidos" required />
            </Form.Group>

            {/* Campo de Sexo (Radio Buttons) */}
            <Form.Group className="mb-3" controlId="formRegisterGender">
              <Form.Label>Sexo</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Hombre"
                  name="gender"
                  id="genderMale"
                  value="male"
                  required
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Mujer"
                  name="gender"
                  id="genderFemale"
                  value="female"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
              <Form.Label>Correo electrónico (para iniciar sesión)</Form.Label>
              <Form.Control type="email" placeholder="Introduce tu correo electrónico" required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPhone">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control type="tel" placeholder="Ej: +34 600123456" />
            </Form.Group>

            {/* Campo de Dirección simple */}
            <Form.Group className="mb-3" controlId="formRegisterAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" placeholder="Tu dirección completa (Calle, Nº, CP, Localidad)" required /> {/* Ahora es obligatorio */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterLevel">
              <Form.Label>Nivel del Cliente</Form.Label>
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

            {/* Campo de Contraseña */}
            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Crea tu contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </Form.Group>

            {/* Campo de Confirmar Contraseña */}
            <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Confirma tu contraseña" 
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  // Limpiar el error de coincidencia al escribir
                  if (passwordMatchError && password === e.target.value) {
                    setPasswordMatchError('');
                  }
                }}
                required 
                // Añade la clase 'is-invalid' si hay un error de coincidencia
                className={passwordMatchError ? 'is-invalid' : ''}
              />
              {/* Mensaje de error si las contraseñas no coinciden */}
              {passwordMatchError && (
                <Form.Text className="text-danger">
                  {passwordMatchError}
                </Form.Text>
              )}
            </Form.Group>

            {/* Mensaje de error general del formulario */}
            {formError && (
              <Alert variant="danger" className="mt-3">
                {formError}
              </Alert>
            )}

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
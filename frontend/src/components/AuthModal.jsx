import React, { useState } from 'react';
import { Modal, Button, Form, Nav, Alert } from 'react-bootstrap';

const AuthModal = ({ show, handleClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  // --- Estados para los campos del formulario de registro ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(''); // 'male' o 'female'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [level, setLevel] = useState('');
  const [allergies, setAllergies] = useState('');
  const [dietPrefs, setDietPrefs] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // --- Fin de estados para los campos ---

  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [formError, setFormError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Nuevo estado para mensaje de éxito

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log('Login Form Submitted');
    // Lógica para enviar los datos de login al backend
  };

  // Función para manejar el envío del formulario de registro
  const handleRegisterSubmit = async (event) => { // Marcamos como async para await el fetch
    event.preventDefault();

    setFormError(''); // Limpia cualquier error anterior del formulario
    setPasswordMatchError(''); // Limpia el error de contraseña anterior
    setRegistrationSuccess(false); // Limpia el mensaje de éxito

    // 1. Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setPasswordMatchError('Las contraseñas no coinciden.');
      setFormError('Por favor, corrige los errores del formulario.');
      return;
    }

    // 2. Validar campos obligatorios (controlado por `required` y `checkValidity`)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setFormError('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    // Si todo es válido, procede con el envío al backend
    const userData = {
      firstName,
      lastName,
      gender,
      email,
      phone,
      address,
      level,
      allergies,
      dietPrefs,
      password, // Es importante no enviar confirmPassword al backend
    };

    console.log('Datos a enviar al backend:', userData);

    // --- Lógica de envío al Backend ---
    try {
      const response = await fetch('http://localhost:5000/api/register', { // ¡Asegúrate que la URL sea correcta!
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registro exitoso:', data);
        setRegistrationSuccess(true);
        // Opcional: Cerrar el modal después de un registro exitoso o redirigir
        // setTimeout(() => {
        //   handleClose();
        //   setIsRegistering(false); // Volver al login view si se cierra
        // }, 2000);
      } else {
        console.error('Error en el registro:', data);
        setFormError(data.message || 'Error al registrar el usuario. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      setFormError('No se pudo conectar con el servidor. Inténtalo más tarde.');
    }
    // --- Fin lógica de envío al Backend ---
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
          <Form noValidate onSubmit={handleRegisterSubmit}>
            {/* Campo de Nombre */}
            <Form.Group className="mb-3" controlId="formRegisterFirstName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Campo de Apellidos */}
            <Form.Group className="mb-3" controlId="formRegisterLastName">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tus apellidos"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
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
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Mujer"
                  name="gender"
                  id="genderFemale"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
              <Form.Label>Correo electrónico (para iniciar sesión)</Form.Label>
              <Form.Control
                type="email"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPhone">
              <Form.Label>Número de Teléfono</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Ej: +34 600123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>

            {/* Campo de Dirección simple */}
            <Form.Group className="mb-3" controlId="formRegisterAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tu dirección completa (Calle, Nº, CP, Localidad)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterLevel">
              <Form.Label>Nivel del Cliente</Form.Label>
              <Form.Select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
              >
                <option value="">Selecciona tu nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterAllergies">
              <Form.Label>Alergias alimenticias e intolerancias</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ej: Gluten, lactosa, frutos secos..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterDietPrefs">
              <Form.Label>Preferencias en la dieta</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ej: Vegana, vegetariana, sin carnes rojas..."
                value={dietPrefs}
                onChange={(e) => setDietPrefs(e.target.value)}
              />
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
                  if (passwordMatchError && password === e.target.value) {
                    setPasswordMatchError('');
                  }
                }}
                required
                className={passwordMatchError ? 'is-invalid' : ''}
              />
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

            {/* Mensaje de éxito de registro */}
            {registrationSuccess && (
              <Alert variant="success" className="mt-3">
                ¡Registro exitoso! Ya puedes iniciar sesión.
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
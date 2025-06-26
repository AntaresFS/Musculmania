import React, { useState } from 'react';
import { Modal, Button, Form, Nav, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios'; 
import { Navigate, useNavigate } from 'react-router-dom'; // Para redirigir después del login
import { useAuth } from '../context/AuthContext.jsx'; // Importamos el contexto de autenticación

// Definimos la URL de la API desde las variables de entorno 
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthModal = ({ show, handleClose }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate(); // Usamos useNavigate para redirigir después del login
    const { login: authLogin } = useAuth (); // Importamos la función de login del contexto de autenticación


    // --- Estados para los campos del formulario de registro ---
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState(''); // Usado tanto en registro como en login
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [level, setLevel] = useState('');
    const [allergies, setAllergies] = useState('');
    const [dietPrefs, setDietPrefs] = useState('');
    const [password, setPassword] = useState(''); // Usado tanto en registro como en login
    const [confirmPassword, setConfirmPassword] = useState('');
    // --- Fin de estados para los campos ---

    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [formError, setFormError] = useState('');
    const [formMessage, setFormMessage] = useState(''); // Mensaje general para éxito o error no validado
    const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar el loading

    // Función para limpiar todos los estados del formulario
    const resetFormStates = () => {
        setFirstName('');
        setLastName('');
        setGender('');
        setEmail('');
        setPhone('');
        setAddress('');
        setLevel('');
        setAllergies('');
        setDietPrefs('');
        setPassword('');
        setConfirmPassword('');
        setPasswordMatchError('');
        setFormError('');
        setFormMessage('');
    };

    // Al cambiar entre registro y login, limpiar estados de errores y mensajes
    const handleToggleAuthMode = (mode) => {
        setIsRegistering(mode);
        resetFormStates(); // Limpia los campos y mensajes al cambiar de vista
    };

    // Función para manejar el envío del formulario de inicio de sesión
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setFormError('');
        setFormMessage('');
        setIsLoading(true);

        const loginData = { email, password };

        try {
            const response = await axios.post(`${API_URL}/api/login`, loginData);

            if (response.status === 200) { // Axios facilita el acceso directo al status
                setFormMessage(response.data.message || '¡Inicio de sesión exitoso!');
                console.log('Login exitoso:', response.data.user);

                // *** Usar el contexto de autenticación para guardar el usuario y token ***
                authLogin(response.data.token, response.data.user); // Guardamos el token y los datos

                // Redirigir al usuario al Dashboard después del login exitoso
                setTimeout(() => {
                    handleClose();
                    resetFormStates(); // Limpia los campos al cerrar
                    navigate('/dashboard'); // Redirige al Dashboard
                }, 1500); // Pequeño retraso para mostrar el mensaje de éxito

            } else { // Esto realmente no debería ocurrir con Axios si el error.response existe, pero es un fallback
                setFormError('Error desconocido al iniciar sesión.');
            }
        } catch (error) {
            console.error('Error en el login:', error);
            if (error.response) {
                // Axios captura el error.response para códigos de estado de error (4xx, 5xx)
                setFormError(error.response.data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta (servidor caído/sin conexión)
                setFormError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
            } else {
                // Algo más ocurrió al configurar la petición
                setFormError('Error desconocido al iniciar sesión.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar el envío del formulario de registro
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();

        setFormError('');
        setFormMessage('');
        setPasswordMatchError('');
        setIsLoading(true);

        // 1. Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setPasswordMatchError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        // 2. Validar campos obligatorios (controlado por `required` y `checkValidity`)
        const form = event.currentTarget;
        if (form.checkValidity() === false || gender === '' || level === '') { // Añadimos validación para select
            event.stopPropagation();
            setFormError('Por favor, rellena todos los campos obligatorios.');
            setIsLoading(false);
            return;
        }

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
            password,
        };

        console.log('Datos a enviar al backend:', userData);

        try {
            const response = await axios.post(`${API_URL}/api/register`, userData);

            if (response.status === 201) { // Axios facilita el acceso directo al status
                setFormMessage(response.data.message || '¡Registro exitoso! Ya puedes iniciar sesión.');
                // Inicio de sesión automático después del registro
                // Primero logueamos al usuario con los datos de registro
                const loginData = await axios.post(`${API_URL}/api/login`, { email, password });

                if (loginResponse.status === 200) {
                    authLogin(LoginResponse.data.accessToken, loginResponse.data.user); // Guardamos el token y los datos del usuario
                    setFormMessage('¡Registro y login exitosos! Redirigiendo al Dashboard...');
                setTimeout(() => {
                    handleClose();
                    resetFormStates(); // Limpia los campos al cerrar
                    navigate('/dashboard'); // Redirige al Dashboard
                }, 1500);
            } else { 
                // Si el login automático falla 
                setFormError('Registro exitoso, pero no se pudo iniciar sesión automáticamente. Por favor, inicia sesión manualmente.');
                setTimeout(() => {
                    handleToggleAuthMode(false); // Cambia a modo de inicio de sesión
                }, 2000); // Espera 2 segundos antes de cambiar a modo de inicio de sesión
            }
        } else {
                setFormError('Error desconocido al registrar. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            if (error.response) {
                // Axios captura el error.response para códigos de estado de error (4xx, 5xx)
                setFormError(error.response.data.message || 'Error al registrar. Verifica los datos.');
            } else if (error.request) {
                // La petición fue hecha pero no se recibió respuesta (servidor caído/sin conexión)
                setFormError('No se pudo conectar con el servidor. Intenta de nuevo más tarde.');
            } else {
                // Algo más ocurrió al configurar la petición
                setFormError('Error desconocido al registrar.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{isRegistering ? 'Registro de Clientes' : 'Acceso Clientes'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Mensaje general de éxito/error (no de validación de campos) */}
                {formMessage && (
                    <Alert variant={formError ? 'danger' : 'success'} className="mt-3">
                        {formMessage}
                    </Alert>
                )}
                {formError && (
                    <Alert variant="danger" className="mt-3">
                        {formError}
                    </Alert>
                )}

                {!isRegistering ? ( // Contenido del formulario de inicio de sesión
                    <Form noValidate onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Introduce tu correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={isLoading}>
                            {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Iniciar Sesión'}
                        </Button>

                        <div className="text-center">
                            <Nav.Link onClick={() => console.log('Recuperar contraseña')} className="text-info">
                                ¿Olvidaste tu contraseña?
                            </Nav.Link>
                            <p className="mt-3">
                                ¿No tienes cuenta?{' '}
                                <Nav.Link onClick={() => handleToggleAuthMode(true)} className="text-info d-inline-block">
                                    Regístrate aquí
                                </Nav.Link>
                            </p>
                        </div>
                    </Form>
                ) : ( // Contenido del formulario de registro
                    <Form noValidate onSubmit={handleRegisterSubmit}>
                        <Form.Group className="mb-3" controlId="formRegisterFirstName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Introduce tu nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterLastName">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control type="text" placeholder="Introduce tus apellidos" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterGender">
                            <Form.Label>Sexo</Form.Label>
                            <div>
                                <Form.Check inline type="radio" label="Hombre" name="gender" id="genderMale" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} required />
                                <Form.Check inline type="radio" label="Mujer" name="gender" id="genderFemale" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} required />
                                <Form.Check inline type="radio" label="Otro" name="gender" id="genderOther" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} required />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterEmail">
                            <Form.Label>Correo electrónico (para iniciar sesión)</Form.Label>
                            <Form.Control type="email" placeholder="Introduce tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterPhone">
                            <Form.Label>Número de Teléfono</Form.Label>
                            <Form.Control type="tel" placeholder="Ej: +34 600123456" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterAddress">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" placeholder="Tu dirección completa (Calle, Nº, CP, Localidad)" value={address} onChange={(e) => setAddress(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterLevel">
                            <Form.Label>Nivel del Cliente</Form.Label>
                            <Form.Select value={level} onChange={(e) => setLevel(e.target.value)} required>
                                <option value="">Selecciona tu nivel</option>
                                <option value="principiante">Principiante</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="avanzado">Avanzado</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterAllergies">
                            <Form.Label>Alergias alimenticias e intolerancias (opcional)</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Ej: Gluten, lactosa, frutos secos..." value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterDietPrefs">
                            <Form.Label>Preferencias en la dieta (opcional)</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Ej: Vegana, vegetariana, sin carnes rojas..." value={dietPrefs} onChange={(e) => setDietPrefs(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Crea tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    // Limpiar error de coincidencia si las contraseñas coinciden de nuevo
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

                        <Button variant="success" type="submit" className="w-100 mb-3" disabled={isLoading}>
                            {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Registrarse'}
                        </Button>

                        <div className="text-center">
                            <p className="mt-3">
                                ¿Ya tienes cuenta?{' '}
                                <Nav.Link onClick={() => handleToggleAuthMode(false)} className="text-info d-inline-block">
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
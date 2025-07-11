// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import apiClient from '../api/axiosConfig'; // Tu instancia de Axios configurada
import { useAuth } from '../context/AuthContext.jsx'; // Para acceder a los datos del usuario

const Dashboard = () => {
    const { user, logout } = useAuth(); // Obtenemos el usuario y la función de logout del contexto
    const [protectedMessage, setProtectedMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                // Intenta acceder a una ruta protegida en el backend
                const response = await apiClient.get('/api/protected');
                setProtectedMessage(response.data.message);
            } catch (err) {
                console.error("Error al obtener datos protegidos:", err);
                if (err.response && err.response.status === 401) {
                    setError("No autorizado. Tu sesión ha expirado o no tienes permisos.");
                    logout(); // Cierra la sesión si el token no es válido
                } else {
                    setError("Error al cargar datos del Dashboard.");
                }
            }
        };

        fetchProtectedData();
    }, [logout]); // Añade logout como dependencia para evitar advertencias de ESLint

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h2" className="text-center">
                            Bienvenido al Dashboard, {user?.first_name || 'Cliente'}!
                        </Card.Header>
                        <Card.Body>
                            <p>Aquí podrás gestionar tu perfil, ver tus rutinas y dietas.</p>
                            
                            {protectedMessage && (
                                <Alert variant="success">
                                    Mensaje del servidor (ruta protegida): {protectedMessage}
                                </Alert>
                            )}
                            {error && (
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            )}

                            <div className="d-grid gap-2 mt-4">
                                <Button variant="primary" size="lg">Mi Perfil (Próximamente)</Button>
                                <Button variant="info" size="lg">Mi Rutina de Entrenamiento (Próximamente)</Button>
                                <Button variant="warning" size="lg">Mi Dieta Personalizada (Próximamente)</Button>
                                <Button variant="danger" size="lg" onClick={logout}>Cerrar Sesión</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import apiClient from '../api/axiosConfig'; // Tu instancia de Axios configurada
import { useAuth } from '../context/AuthContext.jsx'; // Para acceder a los datos del usuario

// Importa los nuevos componentes del dashboard
import ProgressChart from '../components/dashboard/ProgressChart.jsx';
import TrainingCalendar from '../components/dashboard/TrainingCalendar.jsx';

const Dashboard = () => {
    const { user, logout } = useAuth(); // Obtenemos el usuario y la función de logout del contexto

    // Estados para los datos de progreso
    const [progressData, setProgressData] = useState([]);
    const [progressLoading, setProgressLoading] = useState(true);
    const [progressError, setProgressError] = useState(null);

    // Estados para los datos del calendario de entrenamiento
    const [trainingDaysData, setTrainingDaysData] = useState([]);
    const [trainingDaysLoading, setTrainingDaysLoading] = useState(true);
    const [trainingDaysError, setTrainingDaysError] = useState(null);

    // useEffect para cargar los datos del dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user || !user.id) {
                // Si no hay usuario o ID, no podemos cargar datos específicos
                setProgressLoading(false);
                setTrainingDaysLoading(false);
                setProgressError("No se pudo obtener el ID de usuario para cargar los datos.");
                setTrainingDaysError("No se pudo obtener el ID de usuario para cargar los datos.");
                return;
            }

            // Fetch Progress Data
            try {
                const progressResponse = await apiClient.get(`/api/progress/${user.id}`);
                setProgressData(progressResponse.data);
                setProgressError(null); // Limpiar cualquier error previo
            } catch (err) {
                console.error("Error al obtener datos de progreso:", err);
                if (err.response && err.response.status === 401) {
                    setProgressError("No autorizado. Tu sesión ha expirado.");
                    logout(); // Cierra la sesión si el token no es válido
                } else {
                    setProgressError("Error al cargar los datos de progreso.");
                }
            } finally {
                setProgressLoading(false);
            }

            // Fetch Training Days Data
            try {
                const trainingDaysResponse = await apiClient.get(`/api/training-days/${user.id}`);
                setTrainingDaysData(trainingDaysResponse.data);
                setTrainingDaysError(null); // Limpiar cualquier error previo
            } catch (err) {
                console.error("Error al obtener días de entrenamiento:", err);
                if (err.response && err.response.status === 401) {
                    setTrainingDaysError("No autorizado. Tu sesión ha expirado.");
                    logout(); // Cierra la sesión si el token no es válido
                } else {
                    setTrainingDaysError("Error al cargar los días de entrenamiento.");
                }
            } finally {
                setTrainingDaysLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, logout]); // Dependencias: user para el ID, logout para la función de cierre de sesión

    return (
        <Container className="py-5 bg-light min-vh-100"> {/* bg-light para fondo, min-vh-100 para altura */}
            <Row className="justify-content-center mb-4">
                <Col md={10}>
                    <Card className="p-4 shadow-sm border-0 bg-white text-dark">
                        <Card.Header className="bg-white border-0 pb-0 text-center">
                            <h1 className="text-dark fw-bold mb-0">
                                Bienvenido al Dashboard, {user?.first_name || 'Cliente'}!
                            </h1>
                        </Card.Header>
                        <Card.Body className="pt-3 text-center">
                            <p className="lead text-secondary">
                                Aquí puedes visualizar tu progreso y gestionar tu camino hacia tus metas.
                            </p>
                            <div className="d-grid gap-3 mt-4">
                                <Button variant="dark" size="lg" className="py-3">Mi Perfil (Próximamente)</Button>
                                <Button variant="outline-dark" size="lg" className="py-3">Mi Rutina de Entrenamiento (Próximamente)</Button>
                                <Button variant="outline-dark" size="lg" className="py-3">Mi Dieta Personalizada (Próximamente)</Button>
                                <Button variant="danger" size="lg" className="py-3" onClick={logout}>Cerrar Sesión</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center g-4">
                <Col md={10} lg={7}>
                    {/* Componente de la gráfica de progreso */}
                    <ProgressChart
                        data={progressData}
                        loading={progressLoading}
                        error={progressError}
                    />
                </Col>
                <Col md={10} lg={5}>
                    {/* Componente del calendario de entrenamiento */}
                    <TrainingCalendar
                        data={trainingDaysData}
                        loading={trainingDaysLoading}
                        error={trainingDaysError}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;
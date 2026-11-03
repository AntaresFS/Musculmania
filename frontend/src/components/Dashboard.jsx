import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressChart from './dashboard/ProgressChart.jsx';
import TrainingCalendar from './dashboard/TrainingCalendar.jsx';
import { getMockDashboardData } from '../data/mockDashboardData.js';
import TrainerDashboard from './TrainerDashboard.jsx';
import './Dashboard.css';

const useMockDashboardData = import.meta.env.VITE_USE_MOCK_DASHBOARD_DATA === 'true';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getErrorMessage = (error) =>
    error.response?.data?.message || 'No se pudo registrar el entrenamiento. Inténtalo de nuevo.';

const Dashboard = () => {
    const { user, logout, isLoading } = useAuth();
    const [progressData, setProgressData] = useState([]);
    const [progressLoading, setProgressLoading] = useState(true);
    const [progressError, setProgressError] = useState(null);
    const [trainingDaysData, setTrainingDaysData] = useState([]);
    const [trainingDaysLoading, setTrainingDaysLoading] = useState(true);
    const [trainingDaysError, setTrainingDaysError] = useState(null);
    const [trainingActionError, setTrainingActionError] = useState('');
    const [savingTrainingDate, setSavingTrainingDate] = useState('');
    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (isLoading) return;

            if (user?.role === 'trainer' || user?.role === 'admin') {
                setProgressLoading(false);
                setTrainingDaysLoading(false);
                return;
            }

            if (!user?.id) {
                setProgressLoading(false);
                setTrainingDaysLoading(false);
                setProgressError('No se pudo obtener el ID de usuario para cargar los datos.');
                setTrainingDaysError('No se pudo obtener el ID de usuario para cargar los datos.');
                return;
            }

            if (useMockDashboardData) {
                const mockData = getMockDashboardData(user.id);
                setProgressData(mockData.progressData);
                setTrainingDaysData(mockData.trainingDaysData);
                setProgressError(null);
                setTrainingDaysError(null);
                setProgressLoading(false);
                setTrainingDaysLoading(false);
                return;
            }

            try {
                const progressResponse = await apiClient.get(`/api/progress/${user.id}`);
                setProgressData(progressResponse.data);
                setProgressError(null);
            } catch (error) {
                console.error('Error al obtener datos de progreso:', error);
                if (error.response?.status === 401) {
                    setProgressError('No autorizado. Tu sesión ha expirado.');
                    logout();
                } else {
                    setProgressError('Error al cargar los datos de progreso.');
                }
            } finally {
                setProgressLoading(false);
            }

            try {
                const trainingDaysResponse = await apiClient.get(`/api/training-days/${user.id}`);
                setTrainingDaysData(trainingDaysResponse.data);
                setTrainingDaysError(null);
            } catch (error) {
                console.error('Error al obtener días de entrenamiento:', error);
                if (error.response?.status === 401) {
                    setTrainingDaysError('No autorizado. Tu sesión ha expirado.');
                    logout();
                } else {
                    setTrainingDaysError('Error al cargar los días de entrenamiento.');
                }
            } finally {
                setTrainingDaysLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, logout, isLoading]);

    const handleRegisterTrainingDay = async (date) => {
        const trainingDate = formatDate(date);
        setTrainingActionError('');
        setSavingTrainingDate(trainingDate);

        if (useMockDashboardData) {
            setTrainingDaysData((currentDays) => [
                ...currentDays,
                { userId: user.id, trainingDate, description: 'Entrenamiento registrado' },
            ]);
            setSavingTrainingDate('');
            return;
        }

        try {
            const response = await apiClient.post('/api/training-day', {
                trainingDate,
                description: 'Entrenamiento registrado por el cliente',
            });
            setTrainingDaysData((currentDays) =>
                [...currentDays, response.data.trainingDay].sort((a, b) =>
                    a.trainingDate.localeCompare(b.trainingDate)
                )
            );
        } catch (error) {
            console.error('Error al registrar día de entrenamiento:', error);
            if (error.response?.status === 401) {
                setTrainingActionError('No autorizado. Tu sesión ha expirado.');
                logout();
            } else {
                setTrainingActionError(getErrorMessage(error));
            }
        } finally {
            setSavingTrainingDate('');
        }
    };

    const handleRemoveTrainingDay = async (date, trainingDay) => {
        const trainingDate = formatDate(date);
        setTrainingActionError('');
        setSavingTrainingDate(trainingDate);

        if (useMockDashboardData) {
            setTrainingDaysData((currentDays) =>
                currentDays.filter((day) => day.trainingDate.slice(0, 10) !== trainingDate)
            );
            setSavingTrainingDate('');
            return;
        }

        try {
            await apiClient.delete(`/api/training-day/${trainingDay.id}`);
            setTrainingDaysData((currentDays) =>
                currentDays.filter((day) => day.id !== trainingDay.id)
            );
        } catch (error) {
            console.error('Error al desmarcar día de entrenamiento:', error);
            if (error.response?.status === 401) {
                setTrainingActionError('No autorizado. Tu sesión ha expirado.');
                logout();
            } else {
                setTrainingActionError(getErrorMessage(error));
            }
        } finally {
            setSavingTrainingDate('');
        }
    };

    const focusSection = (section) => {
        setActiveSection(section);
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" variant="dark" />
            </Container>
        );
    }

    if (user?.role === 'trainer' || user?.role === 'admin') {
        return <TrainerDashboard />;
    }

    const firstName = user?.firstName || user?.first_name || 'Cliente';
    const today = new Date();
    const trainingDaysThisMonth = trainingDaysData.filter((day) => {
        const [year, month] = day.trainingDate.split('-').map(Number);
        return year === today.getFullYear() && month === today.getMonth() + 1;
    }).length;

    return (
        <div className="client-dashboard">
            <aside className="client-sidebar">
                <div className="client-workspace-label">TU ESPACIO DE TRABAJO</div>
                <div className="client-sidebar-title">Musculmania</div>
                <nav aria-label="Navegación de cliente" className="client-side-nav">
                    <button
                        type="button"
                        className={activeSection === 'overview' ? 'active' : ''}
                        onClick={() => focusSection('overview')}
                    >
                        <span className="client-nav-symbol" aria-hidden="true">⌂</span> Resumen
                    </button>
                    <button
                        type="button"
                        className={activeSection === 'progress' ? 'active' : ''}
                        onClick={() => focusSection('progress')}
                    >
                        <span className="client-nav-symbol" aria-hidden="true">↗</span> Mi progreso
                    </button>
                    <button
                        type="button"
                        className={activeSection === 'calendar' ? 'active' : ''}
                        onClick={() => focusSection('calendar')}
                    >
                        <span className="client-nav-symbol" aria-hidden="true">▦</span> Calendario
                    </button>
                </nav>
                <div className="client-sidebar-bottom">
                    <div className="client-account">
                        <span className="client-avatar" aria-hidden="true">
                            {firstName[0]?.toUpperCase()}
                        </span>
                        <div>
                            <strong>{firstName}</strong>
                            <span>Cliente</span>
                        </div>
                    </div>
                    <button type="button" className="client-logout" onClick={logout}>Cerrar sesión</button>
                </div>
            </aside>

            <main className="client-main">
                <header className="client-topbar">
                    <div className="client-breadcrumb">
                        Musculmania <span>/</span> {activeSection === 'progress' ? 'Mi progreso' : activeSection === 'calendar' ? 'Calendario' : 'Resumen'}
                    </div>
                    <div className="client-topbar-user"><span className="client-online-dot" /> Panel de cliente</div>
                </header>

                <div className="client-content">
                    <section id="overview" className="client-page-heading">
                        <div>
                            <div className="client-eyebrow">TU ESPACIO PERSONAL</div>
                            <h1>¡Hola, {firstName}!</h1>
                            <p>Revisa tus avances y mantén el seguimiento de tus entrenamientos.</p>
                        </div>
                    </section>

                    {useMockDashboardData && (
                        <Alert variant="info" className="client-demo-alert">
                            Estás viendo datos de demostración. Los cambios del calendario no se guardan en tu cuenta.
                        </Alert>
                    )}

                    {trainingDaysError && (
                        <Alert variant="danger" className="client-dashboard-alert">{trainingDaysError}</Alert>
                    )}

                    <Row className="g-3 mb-4">
                        <Col sm={6}>
                            <Card className="client-stat-card h-100">
                                <Card.Body>
                                    <span className="client-stat-label">ENTRENAMIENTOS ESTE MES</span>
                                    <div className="client-stat-value">
                                        {trainingDaysLoading ? '—' : trainingDaysThisMonth}
                                    </div>
                                    <span className="client-stat-footnote">Días que has marcado en el calendario</span>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={6}>
                            <Card className="client-highlight-card h-100">
                                <Card.Body>
                                    <div>
                                        <span className="client-stat-label">LA CONSTANCIA CUENTA</span>
                                        <h2>Cada entrenamiento suma</h2>
                                    </div>
                                    <span className="client-highlight-icon" aria-hidden="true">✳</span>
                                    <p>Registra tus sesiones para ver tu hábito crecer semana a semana.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="g-4 align-items-stretch">
                        <Col xl={8} id="progress" className="client-dashboard-section">
                            <ProgressChart
                                data={progressData}
                                loading={progressLoading}
                                error={progressError}
                            />
                        </Col>
                        <Col xl={4} id="calendar" className="client-dashboard-section">
                            <TrainingCalendar
                                data={trainingDaysData}
                                loading={trainingDaysLoading}
                                error={trainingActionError}
                                onRegisterTrainingDay={handleRegisterTrainingDay}
                                onRemoveTrainingDay={handleRemoveTrainingDay}
                                savingDate={savingTrainingDate}
                                isDemo={useMockDashboardData}
                            />
                        </Col>
                    </Row>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

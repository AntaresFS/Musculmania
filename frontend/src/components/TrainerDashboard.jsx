import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Row,
    Spinner,
    Table,
} from 'react-bootstrap';
import apiClient from '../api/axiosConfig.js';
import { useAuth } from '../context/AuthContext.jsx';
import './TrainerDashboard.css';

const emptyUser = {
    firstName: '',
    lastName: '',
    gender: 'other',
    email: '',
    phone: '',
    address: '',
    level: 'principiante',
    allergies: '',
    dietPrefs: '',
    password: '',
};

const getFullName = (user) => `${user.firstName} ${user.lastName}`;

const getInitials = (user) =>
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

const getErrorMessage = (error) =>
    error.response?.data?.message || 'No se pudo completar la operación. Inténtalo de nuevo.';

const TrainerDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pageError, setPageError] = useState('');
    const [notice, setNotice] = useState('');
    const [search, setSearch] = useState('');
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState(emptyUser);
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [planType, setPlanType] = useState('training');
    const [planUserId, setPlanUserId] = useState('');

    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setPageError('');
        try {
            const response = await apiClient.get('/api/trainer/users');
            setUsers(response.data);
            setSelectedUserId((currentId) =>
                response.data.some((client) => client.id === currentId)
                    ? currentId
                    : response.data[0]?.id ?? null
            );
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setPageError(getErrorMessage(error));
            if (error.response?.status === 401) logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const visibleUsers = useMemo(() => {
        const query = search.trim().toLocaleLowerCase('es');
        if (!query) return users;
        return users.filter((client) =>
            [getFullName(client), client.email, client.level]
                .join(' ')
                .toLocaleLowerCase('es')
                .includes(query)
        );
    }, [search, users]);

    const selectedUser = users.find((client) => client.id === selectedUserId);
    const firstName = user?.firstName || user?.first_name || 'entrenador';

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ ...emptyUser });
        setFormError('');
        setShowUserModal(true);
    };

    const openEditModal = (client) => {
        setEditingUser(client);
        setFormData({
            ...emptyUser,
            ...client,
            password: '',
            dietPrefs: client.dietPreferences || '',
        });
        setFormError('');
        setShowUserModal(true);
    };

    const handleUserSubmit = async (event) => {
        event.preventDefault();
        setFormError('');
        setIsSaving(true);
        const payload = {
            ...formData,
            phone: formData.phone.trim(),
            allergies: formData.allergies.trim(),
            dietPrefs: formData.dietPrefs.trim(),
        };
        try {
            const response = editingUser
                ? await apiClient.patch(`/api/trainer/users/${editingUser.id}`, payload)
                : await apiClient.post('/api/trainer/users', payload);
            const savedUser = response.data.user;
            setUsers((currentUsers) =>
                editingUser
                    ? currentUsers.map((client) => client.id === savedUser.id ? savedUser : client)
                    : [...currentUsers, savedUser].sort((a, b) =>
                        getFullName(a).localeCompare(getFullName(b), 'es')
                    )
            );
            setSelectedUserId(savedUser.id);
            setNotice(editingUser ? 'Datos del cliente actualizados.' : 'Cliente creado correctamente.');
            setShowUserModal(false);
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            setFormError(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    const renderClientTable = (clients) => (
        <div className="trainer-table-wrap">
            <Table responsive className="trainer-table align-middle mb-0">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Nivel</th>
                        <th>Contacto</th>
                        <th className="text-end"> </th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr
                            key={client.id}
                            className={selectedUserId === client.id ? 'is-selected' : ''}
                            onClick={() => setSelectedUserId(client.id)}
                        >
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="trainer-avatar">{getInitials(client)}</span>
                                    <div>
                                        <div className="fw-semibold">{getFullName(client)}</div>
                                        <div className="trainer-muted small">{client.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <Badge className={`level-badge level-${client.level}`}>
                                    {client.level}
                                </Badge>
                            </td>
                            <td className="trainer-muted">{client.phone || 'Sin teléfono'}</td>
                            <td className="text-end">
                                <Button
                                    variant="link"
                                    className="trainer-row-action"
                                    aria-label={`Ver ficha de ${getFullName(client)}`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedUserId(client.id);
                                    }}
                                >
                                    Ver ficha <span aria-hidden="true">→</span>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {clients.length === 0 && (
                        <tr>
                            <td colSpan={4} className="trainer-empty-cell">
                                {search ? 'No hay clientes que coincidan con la búsqueda.' : 'Todavía no tienes clientes. Crea el primero para empezar.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );

    const renderClientDetails = (client) => (
        <Card className="trainer-panel trainer-profile-panel h-100">
            {client ? (
                <>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <div className="trainer-eyebrow">FICHA DE CLIENTE</div>
                                <h2 className="trainer-panel-title mb-0">Perfil</h2>
                            </div>
                            <Button variant="light" className="trainer-edit-button" onClick={() => openEditModal(client)}>
                                Editar
                            </Button>
                        </div>
                        <div className="trainer-profile-heading">
                            <span className="trainer-avatar trainer-avatar-large">{getInitials(client)}</span>
                            <div>
                                <h3>{getFullName(client)}</h3>
                                <p className="trainer-muted mb-0">{client.email}</p>
                            </div>
                        </div>
                        <div className="trainer-profile-data">
                            <div><span>Teléfono</span><strong>{client.phone || 'No indicado'}</strong></div>
                            <div><span>Nivel</span><strong className="text-capitalize">{client.level}</strong></div>
                            <div><span>Dirección</span><strong>{client.address}</strong></div>
                            <div><span>Alergias</span><strong>{client.allergies || 'Ninguna indicada'}</strong></div>
                            <div><span>Preferencias alimentarias</span><strong>{client.dietPreferences || 'No indicadas'}</strong></div>
                        </div>
                        <Button
                            variant="outline-dark"
                            className="w-100 mt-4 trainer-plan-link"
                            onClick={() => {
                                setPlanUserId(String(client.id));
                                setActiveSection('plans');
                            }}
                        >
                            Preparar un plan para este cliente <span aria-hidden="true">→</span>
                        </Button>
                    </Card.Body>
                </>
            ) : (
                <Card.Body className="trainer-no-selection">
                    <span className="trainer-no-selection-icon">◎</span>
                    <h3>Selecciona un cliente</h3>
                    <p className="trainer-muted mb-0">Su información aparecerá aquí.</p>
                </Card.Body>
            )}
        </Card>
    );

    return (
        <div className="trainer-dashboard">
            <aside className="trainer-sidebar">
                <div className="trainer-workspace-label">ESPACIO DE TRABAJO</div>
                <div className="trainer-sidebar-title">Tu estudio</div>
                <nav aria-label="Navegación de trainer" className="trainer-side-nav">
                    <button
                        type="button"
                        className={activeSection === 'overview' ? 'active' : ''}
                        onClick={() => setActiveSection('overview')}
                    >
                        <span className="nav-symbol">⌂</span> Resumen
                    </button>
                    <button
                        type="button"
                        className={activeSection === 'clients' ? 'active' : ''}
                        onClick={() => setActiveSection('clients')}
                    >
                        <span className="nav-symbol">◉</span> Clientes
                        <span className="nav-count">{users.length}</span>
                    </button>
                    <button
                        type="button"
                        className={activeSection === 'plans' ? 'active' : ''}
                        onClick={() => setActiveSection('plans')}
                    >
                        <span className="nav-symbol">✳</span> Planes
                        <span className="nav-new">IA</span>
                    </button>
                </nav>
                <div className="trainer-sidebar-bottom">
                    <div className="trainer-account">
                        <span className="trainer-avatar trainer-account-avatar">{getInitials({
                            firstName: user?.firstName || user?.first_name || 'T',
                            lastName: user?.lastName || user?.last_name || 'R',
                        })}</span>
                        <div className="text-truncate">
                            <strong>{firstName}</strong>
                            <span>Trainer</span>
                        </div>
                    </div>
                    <button type="button" className="trainer-logout" onClick={logout}>Cerrar sesión</button>
                </div>
            </aside>

            <main className="trainer-main">
                <header className="trainer-topbar">
                    <div className="trainer-breadcrumb">Musculmania <span>/</span> {activeSection === 'plans' ? 'Planes' : activeSection === 'clients' ? 'Clientes' : 'Resumen'}</div>
                    <div className="trainer-topbar-user">
                        <span className="trainer-online-dot" /> Panel de trainer
                    </div>
                </header>

                <div className="trainer-content">
                    {pageError && <Alert variant="danger" dismissible onClose={() => setPageError('')}>{pageError}</Alert>}
                    {notice && <Alert variant="success" dismissible onClose={() => setNotice('')}>{notice}</Alert>}

                    {activeSection === 'plans' ? (
                        <>
                            <div className="trainer-page-heading">
                                <div>
                                    <div className="trainer-eyebrow">DISEÑO PERSONALIZADO</div>
                                    <h1>Planes de entrenamiento y nutrición</h1>
                                    <p>Prepara el contexto de cada cliente para crear su próximo plan.</p>
                                </div>
                                <Badge className="trainer-coming-badge">ASISTENTE IA · PRÓXIMAMENTE</Badge>
                            </div>
                            <Row className="g-4">
                                <Col xl={8}>
                                    <Card className="trainer-panel plan-builder">
                                        <Card.Body>
                                            <div className="trainer-eyebrow">NUEVO PLAN</div>
                                            <h2 className="trainer-panel-title">¿Qué vamos a crear?</h2>
                                            <p className="trainer-muted mb-4">Elige el cliente y el tipo de plan. La asistencia para generarlo con IA llegará próximamente.</p>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="trainer-form-label">Cliente</Form.Label>
                                                <Form.Select
                                                    value={planUserId || users[0]?.id || ''}
                                                    onChange={(event) => setPlanUserId(event.target.value)}
                                                    disabled={isLoading || users.length === 0}
                                                >
                                                    <option value="">Selecciona un cliente</option>
                                                    {users.map((client) => (
                                                        <option key={client.id} value={client.id}>{getFullName(client)}</option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Label className="trainer-form-label">Tipo de plan</Form.Label>
                                            <div className="plan-type-grid mb-4">
                                                <button
                                                    type="button"
                                                    className={`plan-type-card ${planType === 'training' ? 'selected' : ''}`}
                                                    onClick={() => setPlanType('training')}
                                                >
                                                    <span className="plan-type-icon training-icon">↗</span>
                                                    <strong>Entrenamiento</strong>
                                                    <span>Rutinas, frecuencia y objetivos</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`plan-type-card ${planType === 'nutrition' ? 'selected' : ''}`}
                                                    onClick={() => setPlanType('nutrition')}
                                                >
                                                    <span className="plan-type-icon nutrition-icon">✳</span>
                                                    <strong>Nutrición</strong>
                                                    <span>Hábitos y preferencias alimentarias</span>
                                                </button>
                                            </div>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="trainer-form-label">Objetivo principal</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={4}
                                                    placeholder={planType === 'training'
                                                        ? 'Ej. ganar fuerza y mejorar la movilidad entrenando 3 días por semana…'
                                                        : 'Ej. mejorar hábitos y adaptar las comidas a sus preferencias…'}
                                                />
                                            </Form.Group>
                                            <Button className="trainer-primary-button" disabled>
                                                ✳ &nbsp; Generar plan con IA
                                            </Button>
                                            <span className="trainer-disabled-note">Disponible próximamente</span>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={4}>
                                    <Card className="trainer-panel plan-context-card">
                                        <Card.Body>
                                            <div className="plan-context-mark">✳</div>
                                            <div className="trainer-eyebrow">PRÓXIMAMENTE</div>
                                            <h2 className="trainer-panel-title">Un asistente a tu medida</h2>
                                            <p className="trainer-muted">Estamos preparando una herramienta para ayudarte a diseñar planes personalizados a partir de los objetivos y necesidades de cada cliente.</p>
                                            <div className="plan-context-list">
                                                <div><span>01</span> Contexto del cliente</div>
                                                <div><span>02</span> Propuesta de plan con IA</div>
                                                <div><span>03</span> Revisión y ajustes del trainer</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <>
                            <div className="trainer-page-heading">
                                <div>
                                    <div className="trainer-eyebrow">{activeSection === 'clients' ? 'CRM · RELACIÓN CON CLIENTES' : 'TU ESPACIO DE TRABAJO'}</div>
                                    <h1>{activeSection === 'clients' ? 'Tus clientes' : `Buenos días, ${firstName}`}</h1>
                                    <p>{activeSection === 'clients'
                                        ? 'Consulta sus perfiles y mantén su información al día.'
                                        : 'Aquí tienes una visión general de tu actividad y tus clientes.'}</p>
                                </div>
                                <Button className="trainer-primary-button" onClick={openCreateModal}>
                                    <span aria-hidden="true">＋</span> Añadir cliente
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="trainer-loading"><Spinner animation="border" size="sm" /> Cargando clientes…</div>
                            ) : (
                                <>
                                    {activeSection === 'overview' && (
                                        <Row className="g-3 mb-4">
                                            <Col sm={6} xl={4}>
                                                <Card className="trainer-stat-card">
                                                    <Card.Body>
                                                        <span className="trainer-stat-label">CLIENTES ACTIVOS</span>
                                                        <div className="trainer-stat-value">{users.length}</div>
                                                        <span className="trainer-stat-footnote">En tu espacio de trabajo</span>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col sm={6} xl={4}>
                                                <Card className="trainer-stat-card">
                                                    <Card.Body>
                                                        <span className="trainer-stat-label">PERFILES COMPLETOS</span>
                                                        <div className="trainer-stat-value">{users.filter((client) => client.address && client.level && client.email).length}</div>
                                                        <span className="trainer-stat-footnote">Con datos básicos registrados</span>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col sm={12} xl={4}>
                                                <Card className="trainer-plan-promo">
                                                    <Card.Body>
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <span className="trainer-stat-label">SIGUIENTE PASO</span>
                                                                <h3>Diseña un plan personal</h3>
                                                            </div>
                                                            <span className="plan-promo-icon">✳</span>
                                                        </div>
                                                        <Button variant="link" onClick={() => setActiveSection('plans')}>
                                                            Explorar herramienta <span aria-hidden="true">→</span>
                                                        </Button>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    <Row className="g-4">
                                        <Col xl={activeSection === 'clients' ? 8 : 12}>
                                            <Card className="trainer-panel">
                                                <Card.Body className="p-0">
                                                    <div className="trainer-list-heading">
                                                        <div>
                                                            <h2 className="trainer-panel-title mb-1">{activeSection === 'clients' ? 'Directorio de clientes' : 'Clientes recientes'}</h2>
                                                            <p className="trainer-muted mb-0">{users.length} perfiles en total</p>
                                                        </div>
                                                        <Form.Control
                                                            className="trainer-search"
                                                            type="search"
                                                            placeholder="Buscar cliente…"
                                                            aria-label="Buscar clientes"
                                                            value={search}
                                                            onChange={(event) => setSearch(event.target.value)}
                                                        />
                                                    </div>
                                                    {renderClientTable(activeSection === 'overview' ? visibleUsers.slice(0, 5) : visibleUsers)}
                                                    {activeSection === 'overview' && users.length > 5 && (
                                                        <div className="trainer-list-footer">
                                                            <Button variant="link" onClick={() => setActiveSection('clients')}>Ver todos los clientes →</Button>
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        {activeSection === 'clients' && (
                                            <Col xl={4}>{renderClientDetails(selectedUser)}</Col>
                                        )}
                                    </Row>
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered size="lg">
                <Form onSubmit={handleUserSubmit}>
                    <Modal.Header closeButton>
                        <div>
                            <div className="trainer-eyebrow">{editingUser ? 'ACTUALIZAR PERFIL' : 'CRM · NUEVO PERFIL'}</div>
                            <Modal.Title>{editingUser ? 'Editar cliente' : 'Añadir cliente'}</Modal.Title>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        {formError && <Alert variant="danger">{formError}</Alert>}
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control required name="firstName" value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control required name="lastName" value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control required type="email" name="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control name="phone" value={formData.phone || ''} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Género</Form.Label>
                                    <Form.Select name="gender" value={formData.gender} onChange={(event) => setFormData({ ...formData, gender: event.target.value })}>
                                        <option value="male">Hombre</option>
                                        <option value="female">Mujer</option>
                                        <option value="other">Otro</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nivel</Form.Label>
                                    <Form.Select name="level" value={formData.level} onChange={(event) => setFormData({ ...formData, level: event.target.value })}>
                                        <option value="principiante">Principiante</option>
                                        <option value="intermedio">Intermedio</option>
                                        <option value="avanzado">Avanzado</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control required name="address" value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Alergias</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="allergies" value={formData.allergies || ''} onChange={(event) => setFormData({ ...formData, allergies: event.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Preferencias alimentarias</Form.Label>
                                    <Form.Control as="textarea" rows={2} name="dietPrefs" value={formData.dietPrefs || ''} onChange={(event) => setFormData({ ...formData, dietPrefs: event.target.value })} />
                                </Form.Group>
                            </Col>
                            {!editingUser && (
                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label>Contraseña temporal</Form.Label>
                                        <Form.Control required type="password" minLength={8} autoComplete="new-password" name="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} />
                                        <Form.Text className="text-muted">Facilita esta contraseña al cliente por un canal seguro.</Form.Text>
                                    </Form.Group>
                                </Col>
                            )}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => setShowUserModal(false)} disabled={isSaving}>Cancelar</Button>
                        <Button className="trainer-primary-button" type="submit" disabled={isSaving}>
                            {isSaving ? <><Spinner animation="border" size="sm" className="me-2" />Guardando…</> : editingUser ? 'Guardar cambios' : 'Crear cliente'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TrainerDashboard;

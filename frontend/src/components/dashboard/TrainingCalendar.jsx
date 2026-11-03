import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Alert, Card, Spinner } from 'react-bootstrap';
import './TrainingCalendar.css';

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TrainingCalendar = ({
    data,
    loading,
    error,
    onRegisterTrainingDay,
    onRemoveTrainingDay,
    savingDate,
    isDemo,
}) => {
    const trainingDates = useMemo(
        () => new Set(data.map((day) => day.trainingDate.slice(0, 10))),
        [data]
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const handleDayClick = (date) => {
        const trainingDate = formatDate(date);
        const trainingDay = data.find((day) => day.trainingDate.slice(0, 10) === trainingDate);

        if (trainingDay) {
            onRemoveTrainingDay(date, trainingDay);
        } else {
            onRegisterTrainingDay(date);
        }
    };

    if (loading) {
        return (
            <Card className="training-calendar-card">
                <Card.Body className="client-loading-state">
                    <Spinner animation="border" role="status" className="text-success">
                        <span className="visually-hidden">Cargando calendario...</span>
                    </Spinner>
                    <span>Cargando tu calendario...</span>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="training-calendar-card h-100">
            <Card.Header>
                <div className="client-eyebrow">TU CONSTANCIA</div>
                <h2 className="client-panel-title">Calendario de entrenamientos</h2>
                <p className="client-panel-description">Selecciona un día para marcar cuándo entrenaste.</p>
            </Card.Header>
            <Card.Body>
                {error && <Alert variant="danger" className="client-action-error">{error}</Alert>}
                <Calendar
                    className="client-calendar"
                    locale="es-ES"
                    maxDate={today}
                    onClickDay={handleDayClick}
                    tileDisabled={({ date, view }) =>
                        view === 'month' && (
                            date > today ||
                            Boolean(savingDate)
                        )
                    }
                    tileClassName={({ date, view }) =>
                        view === 'month' && trainingDates.has(formatDate(date))
                            ? 'client-training-day'
                            : null
                    }
                    tileContent={({ date, view }) =>
                        view === 'month' && trainingDates.has(formatDate(date))
                            ? <span className="visually-hidden">Entrenamiento registrado. Haz clic para desmarcarlo.</span>
                            : null
                    }
                />
                <div className="client-calendar-legend">
                    <span className="client-calendar-legend-dot" aria-hidden="true" />
                    Día entrenado
                </div>
                {savingDate && (
                    <div className="client-registering" role="status">
                        <Spinner animation="border" size="sm" />
                        {isDemo ? 'Actualizando calendario…' : 'Guardando entrenamiento…'}
                    </div>
                )}
                <p className="client-calendar-help">
                    {isDemo
                        ? 'Selecciona una fecha pasada o de hoy para marcarla; vuelve a pulsarla para desmarcarla. Los cambios de demostración no se guardan en tu cuenta.'
                        : 'Selecciona una fecha pasada o de hoy para marcar tu entrenamiento. Si te equivocaste, vuelve a pulsar ese día para desmarcarlo.'}
                </p>
            </Card.Body>
        </Card>
    );
};

export default TrainingCalendar;

// frontend/src/components/dashboard/TrainingCalendar.jsx
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos por defecto del calendario
import { Card, Spinner, Alert } from 'react-bootstrap';
import moment from 'moment'; // Importa moment

// Sobrescribe algunos estilos de react-calendar para que coincidan con tu tema
import './TrainingCalendar.css';

const TrainingCalendar = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Card className="p-4 shadow-sm border-0 bg-white text-center">
        <Spinner animation="border" role="status" className="text-dark">
          <span className="visually-hidden">Cargando calendario...</span>
        </Spinner>
        <p className="text-secondary mt-2">Cargando calendario de entrenamientos...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 shadow-sm border-0 bg-white">
        <Alert variant="danger" className="mb-0">
          Error al cargar el calendario: {error}
        </Alert>
      </Card>
    );
  }

  const hasData = data && data.length > 0;

  // Convertir las fechas de entrenamiento a objetos Date para el calendario
  const trainingDates = hasData ? data.map(day => moment(day.trainingDate).toDate()) : [];

  // Función para marcar los días de entrenamiento
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Comprueba si la fecha del calendario coincide con alguna fecha de entrenamiento
      if (trainingDates.some(trainingDate => moment(trainingDate).isSame(date, 'day'))) {
        return 'training-day'; // Clase CSS para los días de entrenamiento
      }
    }
    return null;
  };

  return (
    <Card className="p-4 shadow-sm border-0 bg-white text-dark h-100">
      <Card.Header className="bg-white border-0 pb-0">
        <h3 className="text-dark fw-bold mb-0">Calendario de Entrenamientos</h3>
      </Card.Header>
      <Card.Body className="pt-3 d-flex flex-column justify-content-center align-items-center">
        <Calendar
          tileClassName={tileClassName}
          value={new Date()} // Inicia el calendario en el mes actual
          locale="es-ES" // Establece el idioma a español
          className="custom-calendar" // Clase para estilos personalizados
        />
        {!hasData && (
          <p className="text-secondary text-center mt-3">No hay días de entrenamiento registrados aún. ¡Empieza a entrenar!</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default TrainingCalendar;

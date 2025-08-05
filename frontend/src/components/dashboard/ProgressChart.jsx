// frontend/src/components/dashboard/ProgressChart.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, Spinner, Alert } from 'react-bootstrap';
import moment from 'moment'; // Importa moment para formatear fechas

const ProgressChart = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Card className="p-4 shadow-sm border-0 bg-white text-center">
        <Spinner animation="border" role="status" className="text-dark">
          <span className="visually-hidden">Cargando datos de progreso...</span>
        </Spinner>
        <p className="text-secondary mt-2">Cargando datos de progreso...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 shadow-sm border-0 bg-white">
        <Alert variant="danger" className="mb-0">
          Error al cargar los datos de progreso: {error}
        </Alert>
      </Card>
    );
  }

  const hasData = data && data.length > 0;

  // Formatear las fechas para el eje X
  const formattedData = data.map(item => ({
    ...item,
    recordDate: moment(item.recordDate).format('DD/MM/YY') // Formato más legible
  }));

  // Colores consistentes con la paleta sobria
  const colors = {
    weight: '#343a40', // Negro/Gris oscuro
    biceps: '#6c757d', // Gris medio
    chest: '#adb5bd',  // Gris claro
    waist: '#495057',  // Gris oscuro ligeramente diferente
    hips: '#868e96',   // Otro gris
    thigh: '#ced4da',  // Gris muy claro
    glutes: '#212529'  // Negro más puro
  };

  return (
    <Card className="p-4 shadow-sm border-0 bg-white text-dark h-100">
      <Card.Header className="bg-white border-0 pb-0">
        <h3 className="text-dark fw-bold mb-0">Evolución de Peso y Medidas</h3>
      </Card.Header>
      <Card.Body className="pt-3 d-flex flex-column justify-content-center align-items-center">
        {!hasData ? (
          <p className="text-secondary text-center">No hay datos de progreso disponibles aún. ¡Registra tu primer avance!</p>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" /> {/* Cuadrícula sutil */}
              <XAxis dataKey="recordDate" stroke="#6c757d" />
              <YAxis stroke="#6c757d" />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '0.25rem' }}
                labelStyle={{ color: '#212529', fontWeight: 'bold' }}
                itemStyle={{ color: '#495057' }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />

              {/* Líneas para cada métrica */}
              {formattedData.some(item => item.weightKg !== null) && <Line type="monotone" dataKey="weightKg" stroke={colors.weight} name="Peso (kg)" activeDot={{ r: 8 }} />}
              {formattedData.some(item => item.bicepsCm !== null) && <Line type="monotone" dataKey="bicepsCm" stroke={colors.biceps} name="Bíceps (cm)" activeDot={{ r: 8 }} />}
              {formattedData.some(item => item.chestCm !== null) && <Line type="monotone" dataKey="chestCm" stroke={colors.chest} name="Pecho (cm)" activeDot={{ r: 8 }} />}
              {formattedData.some(item => item.waistCm !== null) && <Line type="monotone" dataKey="waistCm" stroke={colors.waist} name="Cintura (cm)" activeDot={{ r: 8 }} />}
              {formattedData.some(item => item.hipsCm !== null) && <Line type="monotone" dataKey="hipsCm" stroke={colors.hips} name="Caderas (cm)" activeDot={{ r: 8 }} />}
              {formattedData.some(item => item.thighCm !== null) && <Line type="monotone" dataKey="thighCm" stroke={colors.thigh} name="Muslos (cm)" activeDot={{ r: 8 }} />}
              {formattedData.some(item => item.glutesCm !== null) && <Line type="monotone" dataKey="glutesCm" stroke={colors.glutes} name="Glúteos (cm)" activeDot={{ r: 8 }} />}
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProgressChart;

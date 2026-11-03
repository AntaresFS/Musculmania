import React, { useEffect, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Alert, Card, Form, Spinner } from 'react-bootstrap';
import moment from 'moment';

const METRICS = [
    { key: 'weightKg', label: 'Peso', unit: 'kg' },
    { key: 'bicepsCm', label: 'Bíceps', unit: 'cm' },
    { key: 'chestCm', label: 'Pecho', unit: 'cm' },
    { key: 'waistCm', label: 'Cintura', unit: 'cm' },
    { key: 'hipsCm', label: 'Caderas', unit: 'cm' },
    { key: 'thighCm', label: 'Muslos', unit: 'cm' },
    { key: 'glutesCm', label: 'Glúteos', unit: 'cm' },
];

const formatValue = (value) =>
    Number(value).toLocaleString('es-ES', { maximumFractionDigits: 1 });

const ProgressChart = ({ data, loading, error }) => {
    const [selectedMetric, setSelectedMetric] = useState('weightKg');
    const availableMetrics = useMemo(
        () => METRICS.filter(({ key }) =>
            data.some((item) => item[key] !== null && item[key] !== '' && Number.isFinite(Number(item[key])))
        ),
        [data]
    );

    useEffect(() => {
        if (availableMetrics.length > 0 && !availableMetrics.some(({ key }) => key === selectedMetric)) {
            setSelectedMetric(availableMetrics[0].key);
        }
    }, [availableMetrics, selectedMetric]);

    const metric = availableMetrics.find(({ key }) => key === selectedMetric) || availableMetrics[0];
    const chartData = useMemo(() => {
        if (!metric) return [];
        return data
            .filter((item) => item[metric.key] !== null && item[metric.key] !== '' && Number.isFinite(Number(item[metric.key])))
            .map((item) => ({
                timestamp: moment(item.recordDate).valueOf(),
                value: Number(item[metric.key]),
            }))
            .filter((item) => Number.isFinite(item.timestamp))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [data, metric]);

    if (loading) {
        return (
            <Card className="progress-chart-card">
                <Card.Body className="client-loading-state">
                    <Spinner animation="border" role="status" className="text-success">
                        <span className="visually-hidden">Cargando datos de progreso...</span>
                    </Spinner>
                    <span>Cargando tus avances...</span>
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="progress-chart-card">
                <Card.Body><Alert variant="danger" className="mb-0">{error}</Alert></Card.Body>
            </Card>
        );
    }

    const firstRecord = chartData[0];
    const latestRecord = chartData[chartData.length - 1];
    const totalChange = firstRecord && latestRecord ? latestRecord.value - firstRecord.value : null;

    return (
        <Card className="progress-chart-card h-100">
            <Card.Header>
                <div className="client-eyebrow">SEGUIMIENTO PERSONAL</div>
                <h2 className="client-panel-title">Tu progreso</h2>
                <p className="client-panel-description">
                    Consulta cómo evolucionan tus medidas a lo largo del tiempo.
                </p>
            </Card.Header>
            <Card.Body>
                {chartData.length === 0 ? (
                    <div className="client-empty-state">
                        <span className="client-empty-icon" aria-hidden="true">↗</span>
                        <p>Aún no hay registros de progreso. Cuando añadas tus medidas, aparecerán aquí.</p>
                    </div>
                ) : (
                    <>
                        <Form.Group>
                            <Form.Label className="client-chart-select-label">Medida que quieres consultar</Form.Label>
                            <Form.Select
                                className="client-chart-select"
                                value={metric.key}
                                onChange={(event) => setSelectedMetric(event.target.value)}
                                aria-label="Selecciona una medida de progreso"
                            >
                                {availableMetrics.map((item) => (
                                    <option key={item.key} value={item.key}>{item.label} ({item.unit})</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="client-progress-chart" role="img" aria-label={`Gráfica de evolución de ${metric.label.toLowerCase()} en ${metric.unit}`}>
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={chartData} margin={{ top: 16, right: 12, left: 2, bottom: 4 }}>
                                    <defs>
                                        <linearGradient id="clientProgressFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4c8062" stopOpacity={0.22} />
                                            <stop offset="95%" stopColor="#4c8062" stopOpacity={0.015} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="#edf1ed" />
                                    <XAxis
                                        dataKey="timestamp"
                                        type="number"
                                        scale="time"
                                        domain={['dataMin', 'dataMax']}
                                        tickFormatter={(value) => moment(value).locale('es').format('D MMM')}
                                        tick={{ fill: '#78837c', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                        minTickGap={24}
                                    />
                                    <YAxis
                                        width={48}
                                        tickFormatter={(value) => formatValue(value)}
                                        tick={{ fill: '#78837c', fontSize: 10 }}
                                        axisLine={false}
                                        tickLine={false}
                                        domain={['auto', 'auto']}
                                        label={{
                                            value: metric.unit,
                                            angle: -90,
                                            position: 'insideLeft',
                                            fill: '#78837c',
                                            fontSize: 10,
                                        }}
                                    />
                                    <Tooltip
                                        labelFormatter={(value) => moment(value).locale('es').format('D MMMM YYYY')}
                                        formatter={(value) => [`${formatValue(value)} ${metric.unit}`, metric.label]}
                                        contentStyle={{
                                            border: '1px solid #e3e9e4',
                                            borderRadius: 9,
                                            boxShadow: '0 5px 16px rgba(27, 46, 36, .08)',
                                            fontSize: 12,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name={metric.label}
                                        stroke="#397153"
                                        strokeWidth={2.5}
                                        fill="url(#clientProgressFill)"
                                        activeDot={{ r: 5, fill: '#315d4a', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="client-chart-summary">
                            <div>
                                <span>Último registro</span>
                                <strong>{formatValue(latestRecord.value)} {metric.unit}</strong>
                            </div>
                            {chartData.length > 1 && (
                                <div>
                                    <span>Variación desde el primer registro</span>
                                    <strong>{totalChange > 0 ? '+' : ''}{formatValue(totalChange)} {metric.unit}</strong>
                                </div>
                            )}
                            <div>
                                <span>Fecha más reciente</span>
                                <strong>{moment(latestRecord.timestamp).locale('es').format('D MMM YYYY')}</strong>
                            </div>
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );
};

export default ProgressChart;

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const getMockDashboardData = (userId) => {
    const today = new Date();
    const progressValues = [
        [80.4, 34.2, 101, 88, 102, 59, 105],
        [80.1, 34.1, 100.8, 87.8, 101.8, 59, 104.8],
        [79.8, 34, 100.5, 87.5, 101.5, 58.9, 104.5],
        [79.6, 33.9, 100.3, 87.2, 101.3, 58.8, 104.3],
        [79.3, 33.8, 100, 87, 101, 58.7, 104],
        [79, 33.8, 99.8, 86.7, 100.8, 58.6, 103.8],
        [78.8, 33.7, 99.5, 86.5, 100.5, 58.5, 103.5],
        [78.5, 33.6, 99.3, 86.2, 100.3, 58.4, 103.3],
        [78.2, 33.5, 99, 86, 100, 58.3, 103],
        [78, 33.5, 98.8, 85.7, 99.8, 58.2, 102.8],
        [77.7, 33.4, 98.5, 85.5, 99.5, 58.1, 102.5],
        [77.4, 33.3, 98.3, 85.2, 99.3, 58, 102.3],
        [77.2, 33.2, 98, 85, 99, 57.9, 102],
    ];
    const metricNames = [
        'weightKg',
        'bicepsCm',
        'chestCm',
        'waistCm',
        'hipsCm',
        'thighCm',
        'glutesCm',
    ];

    const progressData = progressValues.map((values, index) => {
        const recordDate = new Date(today);
        recordDate.setDate(today.getDate() - (progressValues.length - index - 1) * 7);

        return {
            userId,
            recordDate: formatDate(recordDate),
            ...Object.fromEntries(metricNames.map((name, metricIndex) => [name, values[metricIndex]])),
        };
    });

    const trainingDaysData = [];
    for (let daysAgo = 0; daysAgo < 90; daysAgo += 1) {
        const trainingDate = new Date(today);
        trainingDate.setDate(today.getDate() - daysAgo);

        if ([1, 3, 5].includes(trainingDate.getDay())) {
            trainingDaysData.push({
                userId,
                trainingDate: formatDate(trainingDate),
                description: 'Entrenamiento de fuerza',
            });
        }
    }

    return { progressData, trainingDaysData };
};

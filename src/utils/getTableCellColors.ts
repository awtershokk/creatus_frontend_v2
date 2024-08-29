export const applyCellColor = (value: any, columnName: string): React.CSSProperties => {
    const calculateColorIntensity = (val: number, minRange = 0.01, maxRange = 10): number => {
        const clampedValue = Math.min(Math.max(val, -maxRange), maxRange);
        return Math.round(Math.abs(clampedValue) / (maxRange - minRange) * 255);
    };

    let cellStyle: React.CSSProperties = {};

    if (columnName === 'deviation_temperature') {
        const deviation = parseFloat(value);
        if (!isNaN(deviation)) {
            const intensity = calculateColorIntensity(deviation);
            if (deviation > 0) {
                cellStyle.backgroundColor = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
            } else if (deviation < 0) {
                cellStyle.backgroundColor = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
            }
        }
    } else if (columnName === 'deviation_humidity') {
        const deviation = parseFloat(value);
        if (!isNaN(deviation)) {
            const intensity = calculateColorIntensity(deviation);
            if (deviation > 0) {
                cellStyle.backgroundColor = `rgb(255, 255, ${255 - intensity})`;
            } else if (deviation < 0) {
                cellStyle.backgroundColor = `rgb(${255 - intensity}, 255, ${255 - intensity})`;
            }
        }
    } else if (columnName === 'battery') {
        const batteryLevel = parseFloat(value);
        if (!isNaN(batteryLevel)) {
            if (batteryLevel <= 10) {
                cellStyle.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            } else if (batteryLevel <= 20) {
                cellStyle.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            }
        }
    } else if (columnName === 'criticality') {
        const criticalityStatus = value;
        if (criticalityStatus === 'Высокая') {
            cellStyle.backgroundColor = 'rgb(234,54,54)';
        } else if (criticalityStatus === 'Средняя') {
            cellStyle.backgroundColor = 'rgba(215,6,53,0.68)';
        } else if (criticalityStatus === 'Предупреждение') {
            cellStyle.backgroundColor = 'rgb(255,240,50)';
        }
    }

    return cellStyle;
};

-- Crear tabla de tarifas
CREATE TABLE tarifas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tarifa_por_km DECIMAL(10,2) NOT NULL,
    costo_base DECIMAL(10,2) DEFAULT 5.00,
    activa BOOLEAN DEFAULT TRUE,
    fecha_inicio DATE,
    fecha_fin DATE,
    condiciones JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de festivos
CREATE TABLE festivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar tarifas de ejemplo
INSERT INTO tarifas (nombre, descripcion, tarifa_por_km, condiciones) VALUES 
(
    'Tarifa Normal',
    'Tarifa estándar para días laborales en horario normal',
    1.25,
    '{"dias_semana": [1,2,3,4,5], "horario_inicio": "07:00", "horario_fin": "21:00", "festivos": false, "zona_especial": false, "tipo_servicio": ["normal"], "distancia_minima": 0, "distancia_maxima": null}'
),
(
    'Tarifa Especial',
    'Tarifa para fines de semana, festivos y horario nocturno',
    1.50,
    '{"dias_semana": [6,7], "horario_inicio": "00:00", "horario_fin": "23:59", "festivos": true, "zona_especial": false, "tipo_servicio": ["normal"], "distancia_minima": 0, "distancia_maxima": null}'
),
(
    'Tarifa Nocturna',
    'Tarifa para horario nocturno en días laborales',
    1.50,
    '{"dias_semana": [1,2,3,4,5], "horario_inicio": "21:00", "horario_fin": "07:00", "festivos": false, "zona_especial": false, "tipo_servicio": ["normal"], "distancia_minima": 0, "distancia_maxima": null}'
);

-- Insertar festivos de ejemplo para 2024
INSERT INTO festivos (fecha, nombre, descripcion) VALUES
('2024-01-01', 'Año Nuevo', 'Celebración del año nuevo'),
('2024-01-06', 'Día de Reyes', 'Epifanía del Señor'),
('2024-02-12', 'Carnaval', 'Festividad de carnaval'),
('2024-02-13', 'Carnaval', 'Festividad de carnaval'),
('2024-03-24', 'Día de la Memoria', 'Día nacional de la memoria'),
('2024-04-02', 'Día del Veterano', 'Día del veterano y de los caídos en la guerra de Malvinas'),
('2024-05-01', 'Día del Trabajador', 'Día internacional del trabajador'),
('2024-05-25', 'Día de la Revolución', 'Día de la revolución de mayo'),
('2024-06-20', 'Día de la Bandera', 'Día de la bandera nacional'),
('2024-07-09', 'Día de la Independencia', 'Día de la independencia argentina'),
('2024-08-17', 'Día del Libertador', 'Muerte del general José de San Martín'),
('2024-10-12', 'Día del Respeto', 'Día del respeto a la diversidad cultural'),
('2024-11-20', 'Día de la Soberanía', 'Día de la soberanía nacional'),
('2024-12-08', 'Inmaculada Concepción', 'Día de la inmaculada concepción de María'),
('2024-12-25', 'Navidad', 'Celebración de la navidad');

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_tarifas_activa ON tarifas(activa);
CREATE INDEX idx_festivos_fecha ON festivos(fecha);
CREATE INDEX idx_festivos_activo ON festivos(activo); 
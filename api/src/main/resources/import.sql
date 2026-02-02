-- Solo una etapa en progreso por proyecto (proceso secuencial)
CREATE UNIQUE INDEX IF NOT EXISTS idx_etapa_unique_en_progreso
    ON DOT_ETAPA (ID_PROYECTO)
    WHERE ESTADO = 'EN_PROGRESO';

-- Fecha de fin debe ser mayor a fecha de inicio en proyectos
ALTER TABLE dot_proyecto
    ADD CONSTRAINT chk_proyecto_fechas
        CHECK (fecha_fin > fecha_inicio);

ALTER TABLE dot_etapa
    ADD CONSTRAINT chk_etapa_fechas
        CHECK (fecha_fin_estimada > fecha_inicio);

-- Seed data for proyectos
INSERT INTO DOT_PROYECTO (NOMBRE, DESCRIPCION, FECHA_INICIO, FECHA_FIN, ESTADO)
SELECT
    'Proyecto ' || lpad(i::text, 3, '0'),
    'Proyecto de prueba ' || lpad(i::text, 3, '0'),
    (date '2025-01-05' + (i - 1) * interval '10 days')::date,
    (date '2025-01-05' + (i - 1) * interval '10 days' + interval '6 months')::date,
    'PLANIFICADO'
FROM generate_series(1, 50) AS i;

-- Seed data for etapas
INSERT INTO DOT_ETAPA (NOMBRE, ORDEN, FECHA_INICIO, FECHA_FIN_ESTIMADA, PRESUPUESTO_ASIGNADO, ESTADO, ID_PROYECTO)
SELECT
    'Etapa ' || etapa_orden || ' - ' || proyecto.nombre,
    etapa_orden,
    (proyecto.fecha_inicio + (etapa_orden - 1) * interval '45 days')::date,
    (proyecto.fecha_inicio + (etapa_orden * 45) * interval '1 day')::date,
    (10000 + (proyecto.id_proyecto * 100) + (etapa_orden * 5000))::numeric,
    CASE etapa_orden
        WHEN 1 THEN 'COMPLETADA'
        WHEN 2 THEN 'EN_PROGRESO'
        ELSE 'PENDIENTE'
    END,
    proyecto.id_proyecto
FROM DOT_PROYECTO proyecto
CROSS JOIN generate_series(1, 3) AS etapa_orden;
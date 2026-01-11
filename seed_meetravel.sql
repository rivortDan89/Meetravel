-- ================================
-- USUARIOS
-- ================================
INSERT INTO usuario (nombre, apellidos, email, password_hash, pais, ciudad) VALUES
('Ana', 'Martínez López', 'ana@mail.com', 'hash_ana', 'España', 'Madrid'),
('Carlos', 'Gómez Ruiz', 'carlos@mail.com', 'hash_carlos', 'España', 'Valencia'),
('Lucía', 'Pérez Sánchez', 'lucia@mail.com', 'hash_lucia', 'España', 'Barcelona'),
('David', 'Romero Gil', 'david@mail.com', 'hash_david', 'España', 'Sevilla'),
('María', 'Hernández Cruz', 'maria@mail.com', 'hash_maria', 'España', 'Bilbao'),
('Jorge', 'Navarro Torres', 'jorge@mail.com', 'hash_jorge', 'España', 'Zaragoza');

-- ================================
-- ETIQUETAS
-- ================================
INSERT INTO etiqueta (nombre, tipo, descripcion) VALUES
('Acceso silla de ruedas', 'accesibilidad', 'Espacios accesibles'),
('Baño adaptado', 'accesibilidad', 'Baños accesibles'),
('Ascensor', 'accesibilidad', 'Ascensor disponible'),
('Viajero tranquilo', 'viajero', 'Prefiere viajes relajados'),
('Viajero activo', 'viajero', 'Le gusta la aventura'),
('Anfitrión local', 'anfitrion', 'Conoce bien la zona');

-- ================================
-- VIAJES
-- ================================
INSERT INTO viaje (id_usuario_creador, titulo, descripcion, origen, destino, fecha_inicio, fecha_fin) VALUES
(1, 'Escapada a Barcelona', 'Viaje cultural', 'Madrid', 'Barcelona', '2026-04-10', '2026-04-15'),
(2, 'Ruta por Valencia', 'Playas y ocio', 'Valencia', 'Valencia', '2026-06-01', '2026-06-05'),
(3, 'Viaje a Sevilla', 'Historia y tapas', 'Barcelona', 'Sevilla', '2026-05-10', '2026-05-14'),
(4, 'Fin de semana en Bilbao', 'Gastronomía y museos', 'Madrid', 'Bilbao', '2026-07-01', '2026-07-03');

-- ================================
-- LUGARES
-- ================================
INSERT INTO lugar (nombre, categoria, latitud, longitud, direccion, descripcion) VALUES
('Sagrada Familia', 'Monumento', 41.403629, 2.174356, 'Barcelona', 'Basílica emblemática'),
('Playa de la Malvarrosa', 'Playa', 39.476056, -0.323606, 'Valencia', 'Playa urbana'),
('Plaza de España', 'Monumento', 37.377222, -5.986944, 'Sevilla', 'Plaza histórica'),
('Museo Guggenheim', 'Museo', 43.268611, -2.934167, 'Bilbao', 'Museo de arte moderno');

-- ================================
-- ACTIVIDADES
-- ================================
INSERT INTO actividad (id_viaje, id_lugar, titulo, descripcion, categoria, fecha_inicio, fecha_fin, requiere_desplazamiento_accesible) VALUES
(1, 1, 'Visita Sagrada Familia', 'Tour guiado', 'Cultura', '2026-04-11 10:00', '2026-04-11 12:00', 1),
(1, NULL, 'Cena grupal', 'Restaurante local', 'Gastronomía', '2026-04-12 21:00', '2026-04-12 23:00', 0),
(2, 2, 'Día de playa', 'Relax total', 'Ocio', '2026-06-02 11:00', '2026-06-02 18:00', 1),
(3, 3, 'Paseo histórico', 'Visita guiada', 'Cultura', '2026-05-11 10:00', '2026-05-11 13:00', 1),
(4, 4, 'Museo Guggenheim', 'Exposición permanente', 'Cultura', '2026-07-02 11:00', '2026-07-02 14:00', 1);

-- ================================
-- PARTICIPACIÓN
-- ================================
INSERT INTO participacion (id_usuario, id_viaje) VALUES
(1,1),(3,1),(4,1),
(2,2),(5,2),
(3,3),(6,3),
(1,4),(2,4);

-- ================================
-- PARTICIPACIÓN ACTIVIDAD
-- ================================
INSERT INTO participacion_actividad (id_participacion, id_actividad) VALUES
(1,1),(2,1),(3,2),
(4,3),(5,3),
(6,4),(7,4),
(8,5),(9,5);

-- ================================
-- CHATS
-- ================================
INSERT INTO chat (tipo_chat, id_viaje) VALUES
('viaje',1),
('viaje',2),
('viaje',3),
('viaje',4);

-- ================================
-- MENSAJES
-- ================================
INSERT INTO mensaje (id_chat, id_usuario, texto) VALUES
(1,1,'Bienvenidos al viaje a Barcelona'),
(1,3,'¡Tengo muchas ganas!'),
(2,2,'No olvidéis el protector solar'),
(3,3,'Sevilla es espectacular'),
(4,1,'Bilbao tiene pintaza');

-- ================================
-- USUARIO_ETIQUETA
-- ================================
INSERT INTO usuario_etiqueta (id_usuario, id_etiqueta) VALUES
(1,4),(1,6),
(2,5),
(3,4),
(4,5),
(5,4),
(6,6);

-- ================================
-- LUGAR_ETIQUETA
-- ================================
INSERT INTO lugar_etiqueta (id_lugar, id_etiqueta) VALUES
(1,1),(1,2),(1,3),
(2,1),
(3,1),
(4,1),(4,3);

-- ================================
-- ACTIVIDAD_ETIQUETA
-- ================================
INSERT INTO actividad_etiqueta (id_actividad, id_etiqueta) VALUES
(1,1),(1,3),
(3,1),
(4,1),
(5,3);

-- ================================
-- RESEÑAS GENERALES
-- ================================
INSERT INTO resena_general (id_usuario, id_lugar, puntuacion_global, comentario) VALUES
(3,1,5,'Impresionante'),
(4,1,4,'Muy bien organizado'),
(2,2,4,'Playa limpia'),
(5,4,5,'Museo increíble');

-- ================================
-- RESEÑAS ACCESIBILIDAD
-- ================================
INSERT INTO resena_accesibilidad (id_usuario, id_lugar, id_etiqueta, puntuacion, comentario) VALUES
(3,1,1,5,'Muy accesible'),
(4,1,3,4,'Ascensores disponibles'),
(2,2,1,4,'Buen acceso'),
(5,4,1,5,'Accesibilidad ejemplar');

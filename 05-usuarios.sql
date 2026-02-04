
-- ======================================
-- 05-usuarios_prueba.sql
-- Usuarios de ejemplo para Meetravel
-- Pensados para pruebas de insertar reseñas
-- Se puede ejecutar en cualquier momento tras crear la tabla usuario
-- ======================================

INSERT INTO usuario (id_usuario, nombre, apellidos, email, password_hash, pais, ciudad, fecha_registro) VALUES
(1, 'Ana',   'Martínez López',   'ana@mail.com',   'hash_ana',   'España', 'Madrid',    '2026-01-16 01:10:35'),
(2, 'Carlos','Gómez Ruiz',       'carlos@mail.com','hash_carlos','España', 'Valencia',  '2026-01-16 01:10:35'),
(3, 'Lucía', 'Pérez Sánchez',    'lucia@mail.com', 'hash_lucia', 'España', 'Barcelona', '2026-01-16 01:10:35'),
(4, 'David', 'Romero Gil',       'david@mail.com', 'hash_david', 'España', 'Sevilla',   '2026-01-16 01:10:35'),
(5, 'María', 'Hernández Cruz',   'maria@mail.com', 'hash_maria', 'España', 'Bilbao',    '2026-01-16 01:10:35'),
(6, 'Jorge', 'Navarro Torres',   'jorge@mail.com', 'hash_jorge', 'España', 'Zaragoza',  '2026-01-16 01:10:35'),
(7, 'Laura', 'Santos Pérez',     'laura@mail.com', 'hash_laura', 'España', 'Granada',   '2026-01-16 01:10:35'),
(8, 'Pedro', 'Iglesias Mora',    'pedro@mail.com', 'hash_pedro', 'España', 'Murcia',    '2026-01-16 01:10:35'),
(9, 'Sara',  'López Díaz',       'sara@mail.com',  'hash_sara',  'España', 'Vigo',      '2026-01-16 01:10:35');


-- ======================================
-- 04-resena_accesibilidad.sql
-- Inserta reseñas de accesibilidad de ejemplo
-- asociadas a usuarios de prueba, lugares y etiquetas
-- Debe ejecutarse después de 03-lugares_murcia.sql
-- ======================================

INSERT INTO resena_accesibilidad
(id_usuario, id_lugar, id_etiqueta, puntuacion, comentario, fecha)
VALUES
  -- 1) Hotel El Churra (Alojamiento, id_lugar = 1)
  (1, 1, 1, 5, 'Entrada accesible para silla de ruedas', '2026-01-10 10:00:00'),
  (1, 1, 2, 4, 'Baño adaptado disponible en planta baja', '2026-01-11 11:15:00'),
  (1, 1, 3, 3, 'Plazas de aparcamiento reservadas cerca de la entrada', '2026-01-12 09:30:00'),
  (2, 1, 4, 5, 'Ascensor amplio y fácil de usar', '2026-01-13 18:45:00'),

  -- 2) Enso Sushi (Restaurante, id_lugar = 3)
  (1, 3, 1, 4, 'Rampa en la entrada principal', '2026-01-18 13:20:00'),
  (2, 3, 2, 4, 'Baño adaptado correcto', '2026-01-19 14:10:00'),
  (2, 3, 5, 5, 'Aceptan perro guía sin problema', '2026-01-20 20:05:00'),

  -- 3) Restaurante La Onda (Restaurante, id_lugar = 4)
  (1, 4, 1, 4, 'Entrada casi llana, pequeña rampa', '2026-01-16 12:10:00'),
  (1, 4, 2, 4, 'Baño accesible en la planta baja', '2026-01-16 12:40:00'),
  (2, 4, 3, 4, 'Aparcamiento cercano con alguna plaza reservada', '2026-01-17 19:00:00'),

  -- 4) Burger King (Comida para llevar, id_lugar = 5)
  (1, 5, 1, 5, 'Acceso completamente llano', '2026-01-14 13:00:00'),
  (2, 5, 2, 4, 'Baño adaptado, algo estrecho pero usable', '2026-01-14 13:30:00'),

  -- 5) AMENO Cafe-Bar WL (Bar, id_lugar = 12)
  (1, 12, 1, 4, 'Rampa portátil en la entrada', '2026-01-11 18:00:00'),
  (2, 12, 2, 2, 'Baño adaptado compartido con el local contiguo', '2026-01-11 18:30:00'),

  -- 6) Museo Arqueológico (Atracción / Museo, id_lugar = 45)
  (1, 45, 1, 5, 'Recorrido accesible en silla de ruedas', '2026-01-15 10:15:00'),
  (1, 45, 4, 5, 'Ascensor a todas las plantas', '2026-01-15 10:45:00'),
  (2, 45, 6, 4, 'Audioguía disponible con buena calidad', '2026-01-16 16:20:00'),
  (2, 45, 7, 4, 'Carteles con braille en varias salas', '2026-01-17 17:05:00'),
  (2, 45, 8, 5, 'Vídeos con subtítulos claros', '2026-01-18 18:10:00'),

  -- 7) Real Casino de Murcia (Museo, id_lugar = 46)
  (1, 46, 1, 4, 'Entrada accesible por puerta lateral', '2026-01-19 11:00:00'),
  (1, 46, 4, 5, 'Ascensor moderno entre plantas', '2026-01-19 11:20:00'),
  (2, 46, 6, 4, 'Audioguías disponibles bajo petición', '2026-01-20 17:30:00'),

  -- 8) Jardín del Salitre (Parque, id_lugar = 77)
  (1, 77, 1, 4, 'Caminos accesibles casi en todo el parque', '2026-01-19 09:00:00'),
  (2, 77, 3, 4, 'Aparcamiento accesible cercano', '2026-01-20 09:30:00'),
  (2, 77, 5, 5, 'Buen acceso para personas con perro guía', '2026-01-21 10:15:00'),

  -- 9) Neocine Centrofama (Cine, id_lugar = 41)
  (1, 41, 1, 4, 'Rampas y ascensor hasta las salas', '2026-01-22 18:00:00'),
  (1, 41, 4, 5, 'Ascensor amplio hasta la planta superior', '2026-01-22 18:10:00'),
  (2, 41, 8, 5, 'Películas con subtítulos en varios pases', '2026-01-22 20:30:00'),

  -- 10) Café de Ficciones (Cafetería, id_lugar = 57)
  (1, 57, 1, 4, 'Acceso casi llano, pequeño escalón salvado con rampa', '2026-01-23 17:00:00'),
  (2, 57, 2, 4, 'Baño adaptado en la parte trasera del local', '2026-01-23 17:20:00');
  --11) Hotel Murcia Centro (Alojamiento, id_lugar = 80)
  (7, 80, 1, 5, 'Entrada totalmente llana con rampa amplia', '2026-01-24 10:00:00'),
  (8, 80, 1, 4, 'Rampa cómoda, algo estrecha pero usable', '2026-01-24 10:30:00'),
  (7, 80, 2, 2, 'Baño adaptado pero con poco espacio de giro', '2026-01-24 11:00:00'),
  (8, 80, 2, 3, 'Baño accesible, correcto pero mejorable', '2026-01-24 11:20:00'),

 -- 12) Restaurante La Plaza (Restaurante, id_lugar = 81)
  (7, 81, 1, 1, 'Escalón alto en la entrada, rampa portátil poco estable', '2026-01-24 13:00:00'),
  (8, 81, 1, 2, 'Acceso con rampa muy inclinada', '2026-01-24 13:20:00'),
  (7, 81, 2, 1, 'Baño adaptado mal señalizado y difícil de alcanzar', '2026-01-24 13:40:00'),
  (8, 81, 3, 2, 'Parking cercano sin plazas reservadas claras', '2026-01-24 14:00:00'),

 -- 13) Museo de Arte Contemporáneo (Museo, id_lugar = 82)
  (7, 82, 1, 4, 'Acceso principal accesible, rampas suaves', '2026-01-24 16:00:00'),
  (8, 82, 4, 5, 'Ascensor amplio a todas las plantas', '2026-01-24 16:20:00'),
  (9, 82, 6, 2, 'Audioguías disponibles pero con sonido bajo', '2026-01-24 16:40:00'),
  (9, 82, 8, 3, 'Algunos vídeos con subtítulos, pero no todos', '2026-01-24 17:00:00');

 -- 14) Restaurante El Churra (id_lugar = 7) -> medias bajas
  (7, 7, 1, 5, 'Rampa muy inclinada en la entrada', '2026-01-25 12:00:00'),
  (8, 7, 2, 3, 'Baño adaptado con poco espacio', '2026-01-25 12:10:00'),
  (9, 7, 3, 3, 'Parking cercano sin plazas reservadas claras', '2026-01-25 12:20:00'),

 -- 15) Urban Burrito Bar (Bar, id_lugar = 19)
  (7, 19, 1, 3, 'Rampa estrecha y con giro complicado', '2026-01-25 13:00:00'),
  (8, 19, 2, 2, 'Baño adaptado difícil de maniobrar', '2026-01-25 13:10:00'),

 -- 16) Ginos (Restaurante, id_lugar = 20)
  (7, 20, 1, 3, 'Rampa estrecha y con giro complicado', '2026-01-25 14:00:00'),
  (8, 20, 2, 2, 'Baño accesible pero con puertas pesadas', '2026-01-25 14:10:00'),
  (9, 20, 3, 2, 'Pocas plazas de aparcamiento accesible', '2026-01-25 14:20:00'),

 -- 17) Palets Bar (Bar, id_lugar = 69)
  (7, 69, 1, 1, 'Escalón alto en la entrada sin alternativa', '2026-01-25 15:00:00'),
  (8, 69, 2, 1, 'No dispone de baño adaptado', '2026-01-25 15:10:00'),

 -- 18) Plaza del Obispo Frutos (Parque, id_lugar = 78) -> solo rampa/parking/perro guía
  (7, 78, 1, 4, 'Zona accesible con rampa amplia', '2026-01-25 16:00:00'),
  (8, 78, 3, 1, 'Sin plazas reservadas cercanas', '2026-01-25 16:10:00'),
  (9, 78, 5, 2, 'Pocas zonas señalizadas para perro guía', '2026-01-25 16:20:00'),

 -- 19) Parque de Fofó (Parque, id_lugar = 83)
  (7, 83, 1, 4, 'Entrada con cuestas accesibles', '2026-01-25 17:00:00'),
  (8, 83, 3, 2, 'Parking algo alejado de la entrada accesible', '2026-01-25 17:10:00'),
  (9, 83, 5, 4, 'Accesible para perro guía', '2026-01-25 17:20:00');
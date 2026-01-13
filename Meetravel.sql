-- ======================================
-- BASE DE DATOS
-- ======================================
CREATE DATABASE IF NOT EXISTS meetravel
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE meetravel;

-- ======================================
-- USUARIO
-- ======================================
CREATE TABLE usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  pais VARCHAR(100),
  ciudad VARCHAR(100),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ======================================
-- ETIQUETA
-- ======================================
CREATE TABLE etiqueta (
  id_etiqueta INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo ENUM('accesibilidad','viajero','anfitrion') NOT NULL,
  descripcion TEXT
) ENGINE=InnoDB;

-- ======================================
-- VIAJE
-- ======================================
CREATE TABLE viaje (
  id_viaje INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario_creador INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  origen VARCHAR(150),
  destino VARCHAR(150),
  fecha_inicio DATE,
  fecha_fin DATE,
  es_fecha_abierta TINYINT(1) DEFAULT 0,
  es_destino_abierto TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_usuario_creador) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- LUGAR
-- ======================================
CREATE TABLE lugar (
  id_lugar INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(100),
  latitud DECIMAL(9,6),
  longitud DECIMAL(9,6),
  google_place_id VARCHAR(255),
  direccion TEXT,
  descripcion TEXT
) ENGINE=InnoDB;

-- ======================================
-- ACTIVIDAD
-- ======================================
CREATE TABLE actividad (
  id_actividad INT AUTO_INCREMENT PRIMARY KEY,
  id_viaje INT NOT NULL,
  id_lugar INT NULL,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(100),
  fecha_inicio DATETIME,
  fecha_fin DATETIME,
  requiere_desplazamiento_accesible TINYINT(1) DEFAULT 0,
  FOREIGN KEY (id_viaje) REFERENCES viaje(id_viaje)
    ON DELETE CASCADE,
  FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ======================================
-- PARTICIPACION (usuario ↔ viaje)
-- ======================================
CREATE TABLE participacion (
  id_participacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_viaje INT NOT NULL,
  fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (id_usuario, id_viaje),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE,
  FOREIGN KEY (id_viaje) REFERENCES viaje(id_viaje)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- PARTICIPACION_ACTIVIDAD (N:M)
-- ======================================
CREATE TABLE participacion_actividad (
  id_participacion INT NOT NULL,
  id_actividad INT NOT NULL,
  PRIMARY KEY (id_participacion, id_actividad),
  FOREIGN KEY (id_participacion) REFERENCES participacion(id_participacion)
    ON DELETE CASCADE,
  FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- CHAT
-- ======================================
CREATE TABLE chat (
  id_chat INT AUTO_INCREMENT PRIMARY KEY,
  tipo_chat ENUM('viaje','actividad','privado') NOT NULL,
  id_viaje INT NULL,
  id_actividad INT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_viaje) REFERENCES viaje(id_viaje)
    ON DELETE CASCADE,
  FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- MENSAJE
-- ======================================
CREATE TABLE mensaje (
  id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
  id_chat INT NOT NULL,
  id_usuario INT NOT NULL,
  texto TEXT NOT NULL,
  fecha_hora_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_chat) REFERENCES chat(id_chat)
    ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- USUARIO_ETIQUETA (N:M)
-- ======================================
CREATE TABLE usuario_etiqueta (
  id_usuario INT NOT NULL,
  id_etiqueta INT NOT NULL,
  PRIMARY KEY (id_usuario, id_etiqueta),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE,
  FOREIGN KEY (id_etiqueta) REFERENCES etiqueta(id_etiqueta)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- LUGAR_ETIQUETA (N:M)
-- ======================================
CREATE TABLE lugar_etiqueta (
  id_lugar INT NOT NULL,
  id_etiqueta INT NOT NULL,
  PRIMARY KEY (id_lugar, id_etiqueta),
  FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar)
    ON DELETE CASCADE,
  FOREIGN KEY (id_etiqueta) REFERENCES etiqueta(id_etiqueta)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- ACTIVIDAD_ETIQUETA (N:M)
-- ======================================
CREATE TABLE actividad_etiqueta (
  id_actividad INT NOT NULL,
  id_etiqueta INT NOT NULL,
  PRIMARY KEY (id_actividad, id_etiqueta),
  FOREIGN KEY (id_actividad) REFERENCES actividad(id_actividad)
    ON DELETE CASCADE,
  FOREIGN KEY (id_etiqueta) REFERENCES etiqueta(id_etiqueta)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- RESEÑA_GENERAL
-- ======================================
CREATE TABLE resena_general (
  id_resena_general INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_lugar INT NOT NULL,
  puntuacion_global INT NOT NULL CHECK (puntuacion_global BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE,
  FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================
-- RESEÑA_ACCESIBILIDAD
-- ======================================
CREATE TABLE resena_accesibilidad (
  id_resena_accesibilidad INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_lugar INT NOT NULL,
  id_etiqueta INT NOT NULL,
  puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
    ON DELETE CASCADE,
  FOREIGN KEY (id_lugar) REFERENCES lugar(id_lugar)
    ON DELETE CASCADE,
  FOREIGN KEY (id_etiqueta) REFERENCES etiqueta(id_etiqueta)
    ON DELETE CASCADE
) ENGINE=InnoDB;


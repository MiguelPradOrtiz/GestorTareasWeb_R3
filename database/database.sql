CREATE DATABASE IF NOT EXISTS gestor_tareas_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gestor_tareas_db;

CREATE TABLE IF NOT EXISTS tareas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_completada (completada)
) ENGINE=InnoDB;

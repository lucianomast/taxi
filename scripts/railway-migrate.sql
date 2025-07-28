-- Script de migración para Railway MySQL
-- Ejecutar este script en la base de datos de Railway

-- Tabla empresas
CREATE TABLE IF NOT EXISTS empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL
);

-- Tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255),
  telefono VARCHAR(20) UNIQUE NOT NULL,
  prefijo VARCHAR(10) DEFAULT '+34',
  ocultarTelefono BOOLEAN DEFAULT FALSE,
  email VARCHAR(255),
  informacionCliente TEXT,
  informacionAdicional TEXT,
  estadoUsuario INT DEFAULT 10,
  direccionHabitual TEXT,
  empresaId INT,
  lat DECIMAL(10, 7),
  lon DECIMAL(10, 7),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  FOREIGN KEY (empresaId) REFERENCES empresas(id)
);

-- Tabla conductores
CREATE TABLE IF NOT EXISTS conductores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255),
  dni VARCHAR(20) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  estadoConductor INT DEFAULT 1,
  empresaId INT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  FOREIGN KEY (empresaId) REFERENCES empresas(id)
);

-- Tabla conductor_posicion
CREATE TABLE IF NOT EXISTS conductor_posicion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conductorId INT NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conductorId) REFERENCES conductores(id)
);

-- Tabla festivos
CREATE TABLE IF NOT EXISTS festivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  descripcion VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL
);

-- Tabla servicios
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clienteId INT NOT NULL,
  conductorId INT,
  origen TEXT NOT NULL,
  destino TEXT NOT NULL,
  latOrigen DECIMAL(10, 7),
  lonOrigen DECIMAL(10, 7),
  latDestino DECIMAL(10, 7),
  lonDestino DECIMAL(10, 7),
  estadoServicio INT DEFAULT 1,
  precio DECIMAL(10, 2),
  distancia DECIMAL(10, 2),
  duracion INT,
  observaciones TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NULL,
  deleted_at DATETIME NULL,
  FOREIGN KEY (clienteId) REFERENCES clientes(id),
  FOREIGN KEY (conductorId) REFERENCES conductores(id)
); 
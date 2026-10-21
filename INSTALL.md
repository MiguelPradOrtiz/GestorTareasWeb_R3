# Instalación de GestorTareasWeb R3

## 1. Descripción

Aplicación web para gestionar tareas personales,
desarrollada para el Reto 3 de la UVEG.

Utiliza HTML, CSS y JavaScript en el frontend,
Express.js en el backend y MySQL como base de datos.

## 2. Requisitos

- Windows
- XAMPP con Apache y MySQL
- Node.js 24.19.0
- npm 12.0.2

## 3. Dependencias del backend

- Express: 5.3.0
- mysql2: 3.24.6
- express-validator: 7.3.2
- dotenv: 18.0.8
- cors: 2.8.6

Las dependencias se encuentran registradas en
backend/package.json y backend/package-lock.json.

## 4. Configurar la base de datos

1. Iniciar Apache y MySQL desde XAMPP.
2. Acceder a http://localhost/phpmyadmin/
3. Importar database/database.sql.
4. Verificar que exista la base de datos
   gestor_tareas_db con su tabla tareas.

## 5. Configurar el backend

Abrir una terminal dentro de backend y ejecutar:

npm ci

Crear el archivo backend/.env con los siguientes
parámetros, ajustándolos a la instalación local:

PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=gestor_tareas_db

El archivo .env no debe publicarse en GitHub.

## 6. Iniciar Express

Desde la carpeta backend ejecutar:

node server.js

El servidor estará disponible en:

http://localhost:3000/

## 7. Ejecutar el frontend

Colocar GestorTareasWeb_R3 dentro de htdocs.

Iniciar Apache y abrir:

http://localhost/GestorTareasWeb_R3/

El frontend necesita que Express y MySQL
estén ejecutándose para gestionar las tareas.

## 8. Verificaciones

Comprobar las siguientes operaciones:

- Consultar tareas.
- Agregar nuevas tareas.
- Marcar y desmarcar tareas.
- Filtrar tareas según su estado.
- Eliminar tareas.
- Conservar los cambios al recargar la página.

La conexión con MySQL puede comprobarse en:

http://localhost:3000/api/test-db

## 9. Consideraciones de seguridad

- No publicar el archivo .env.
- Excluir node_modules del repositorio.
- Utilizar credenciales propias del entorno.
- El usuario root sin contraseña se contempla
  únicamente para prácticas locales.
- Antes de publicar la aplicación en Internet,
  configurar credenciales seguras, HTTPS,
  restricciones de acceso y CORS.

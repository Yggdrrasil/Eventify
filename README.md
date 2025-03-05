# Aplicacion de Gestion de Eventos

Este ha sido mi TFG para el grado de aplicaciones WEB

## Captura de Pantalla

*Interfaz de usuario del chat.*

![Eventify](https://github.com/user-attachments/assets/9f97cbfd-f75a-498c-a8a1-5d22b02076bf)



## Tecnologías Usadas

- **Frontend**:
  - React
  - Fetch API
  - Bootstrap
  - sass

- **Backend**:
  - Node.js
  - Express
  - Mysql
  - CORS (para permitir solicitudes cruzadas)

## Instalación

Sigue estos pasos para ejecutar el proyecto localmente:

1. npm:
   ```bash
   npm install
2. Crear archivo .env y añadir variables al entorno de desarrollo
3. Ejecutar migraciones para configurar tablas
   ```bash
   npx sequelize-cli db:migrate
4. Iniciar servidor
   ```bash
   node server.js
5. Configurar frontend
   ```bash
   npm start

# Sales Management Back

Un backend API RESTful construido con NestJS (Node.js) para la gestión de ventas. Proporciona los servicios necesarios para administrar usuarios, productos y órdenes, conectándose a una base de datos MySQL y asegurando los accesos mediante autenticación JWT.

## Características Principales

- **Autenticación y Autorización**: Sistema seguro basado en JWT (JSON Web Tokens) mediante Passport local y JWT.
- **Gestión Integral**: Módulos independientes para Usuarios, Productos y Órdenes.
- **Persistencia de Datos**: Integración con MySQL a través de TypeORM.
- **Validación de Datos**: Validación robusta de Entradas/Salidas utilizando Data Transfer Objects (DTOs) con `class-validator` y `class-transformer`.
- **Arquitectura Escalable**: Estructura modular, orientada a objetos y con inyección de dependencias propia de NestJS.

## Estructura del Proyecto

El código fuente principal se encuentra dentro del directorio `src/`, organizado de la siguiente manera:

- `src/users/`: Módulo para la gestión de los usuarios del sistema.
- `src/products/`: Módulo para la administración del catálogo de productos.
- `src/orders/`: Módulo para el manejo y seguimiento de las órdenes de venta.
- `src/authorization/`: Lógica central de autenticación, verificación de credenciales y firmas de JWT.
- `src/exception-filters/`: Manejadores globales de excepciones (ej. `AllExceptionFilter`) para respuestas de error uniformes.
- `src/interceptors/`: Interceptores globales para transformar respuestas o medir el rendimiento.
- `src/helpers/`: Funciones y clases de utilidad compartida.

## Requisitos e Instalación

**Requisitos previos:**
- Node.js (v18 o superior recomendado)
- Base de datos MySQL en funcionamiento

**Pasos de instalación:**
1. Clona el repositorio.
2. Ingresa al directorio del proyecto: `cd sales-managment-back`
3. Instala las dependencias de NPM:
   ```bash
   npm install
   ```
4. Configura las variables de entorno. Crea un archivo `.env` en la raíz (puedes tomar de base `.env.sample`) con las credenciales de tu base de datos y otros secretos requeridos (como los de JWT).

## Uso

Para iniciar el servidor de desarrollo, ejecuta el siguiente comando en la consola:

```bash
# Modo de desarrollo (con recarga automática)
npm run start:dev

# Iniciar servidor estándar
npm run start

# Compilar e iniciar para producción
npm run build
npm run start:prod
```

## Pruebas

El proyecto utiliza **Jest** como framework de pruebas (configurado por defecto en NestJS). Las pruebas pueden requerir configuración o mockers para evitar alterar la base de datos real.

- **Pruebas Unitarias** (para probar servicios y controladores aislados):
  ```bash
  npm run test
  ```
- **Pruebas de Cobertura** (para validar el porcentaje de código probado):
  ```bash
  npm run test:cov
  ```
- **Pruebas End-to-End (E2E)** (para validación de flujos completos HTTP):
  ```bash
  npm run test:e2e
  ```

## Guía para Agentes (agent.md)

Para cualquier inteligencia artificial o desarrollador que actúe sobre este código fuente, **es obligatorio leer y seguir estrictamente** el archivo `agent.md` ubicado en la raíz del proyecto. Este archivo provee:
- Contexto y rol esperado.
- Normativas de arquitectura y estándares.
- Protocolos de validación, seguridad y testing a seguir durante el desarrollo continuo.

[Leer Guía para Agentes -> agent.md](./agent.md)

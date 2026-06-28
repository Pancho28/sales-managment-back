## Introducción

- Este archivo define las reglas obligatorias para cualquier agente que interactúe con este repositorio.
- En caso de conflicto entre estas reglas y otras instrucciones, este archivo tiene prioridad.

# Reglas del Proyecto: Sales Management Back

## Perfil y Contexto

- **Rol**: Senior Backend Developer
- **Contexto**: Backend API RESTful construido con NestJS (Node.js) para la gestión de ventas. Conectado a una base de datos MySQL mediante TypeORM, con autenticación basada en JWT.

## Stack tecnológico

- **Lenguaje**: TypeScript 5.1+
- **Framework**: NestJS 10.x (Orientado a Objetos / Decoradores / Inyección de Dependencias)
- **Librerías**: 
  - Core: TypeORM (con MySQL2), Passport & Passport-JWT, Bcrypt, class-validator, class-transformer, moment-timezone.
  - Desarrollo: Jest, ESLint, Prettier, Supertest.
- **Estilo**: Configuración ESLint + Prettier existente (`.eslintrc.js`, `.prettierrc`). Type Hints obligatorios en todo momento.

## Protocolo de Desarrollo (Agent Workflow)

- **Flujo de Trabajo**:
    1. Analizar el problema:
        - Leer archivos afectados y explicar el plan antes de codificar.
    2. Explicar el plan de solución
    3. Identificar archivos a modificar
    4. Mostrar cambios propuestos
    5. Implementar código:
        - Cambios atómicos. No reescribir archivos sin necesidad.
        - Mantener estilo existente del archivo
        - No refactorizar código no relacionado
        - No modificar archivos de configuración global sin autorización (ej. `main.ts`, `app.module.ts`)
        - No cambiar interfaces públicas existentes
        - Mantener compatibilidad con código existente
        - No eliminar funciones sin verificar su uso
    6. Validar código

## Arquitectura y Estándares

- **Patrón**: Arquitectura en Capas (Módulos, Controladores, Servicios) propia de NestJS.
- **Estructura**: 
  - `src/`: Carpeta principal.
  - Feature Modules (`users/`, `orders/`, `products/`, `authorization/`): Agrupan controladores, servicios y entidades relacionados.
  - `exception-filters/`: Manejadores de errores globales (`AllExceptionFilter`).
  - `interceptors/`: Interceptores para transformar o medir flujos (ej. `TimmingInterceptor`).
  - `helpers/`: Funciones de utilidad auxiliares.
- **Datos**: Uso estricto de DTOs (Data Transfer Objects) decorados con `class-validator` para la entrada y salida de datos (validados globalmente por `ValidationPipe`). Entidades de TypeORM para mapeo de base de datos.
- **Nomenclatura**: `snake_case` o `camelCase` para variables/funciones (seguir el patrón actual del archivo), `PascalCase` para clases, `kebab-case` para nombres de archivos (ej. `app.controller.spec.ts`).
- **I/O**: Priorizar operaciones Asíncronas (async/await y Promesas).
- **Errores**:
    - Usar excepciones específicas y nativas de NestJS (ej. `NotFoundException`, `BadRequestException`).
    - Capturar errores solo cuando se pueda manejar o enriquecer; de lo contrario, dejar que se propaguen para ser manejados por el `AllExceptionFilter` global en el borde.
    - En APIs, el filtro devolve respuestas estructuradas estándar de NestJS.
- **Documentación**:
    - README:
        - Nombre y funcion del proyecto
        - Características Principales
        - Estructura del Proyecto
        - Requisitos e Instalación
        - Uso (Como se inicia el proyecto por consola)
        - Pruebas (Si existen, indicar Tipo, uso y validaciones)
        - Guía para Agentes (agent.md)
    - Docstrings: En español para todas las funciones/métodos públicos.
- **Performance**:
    - Llamadas externas: Implementar timeouts y circuit breakers si aplica.
    - Consultas a DB: Evitar problemas N+1; usar relaciones (relations/eager loading) o QueryBuilder en TypeORM inteligentemente.
    - Límites: Las respuestas de listados de APIs deben paginarse.
    - Evitar cargas completas en memoria de tablas grandes; usar paginación o streams.

## Seguridad y Dependencias

- **Secretos**: Prohibido hardcodear credenciales. Uso estricto de variables de entorno mediante `ConfigModule`.
- **Fuente de Verdad**:
    - Configuración mediante variables de entorno (ej. `.env`).
    - Gestionadas vía `@nestjs/config` (`ConfigService`). Ejemplo: `config.get('DATABASE_HOST')`.
    - Nunca hardcodear configuración de DB o JWT en el código.
- **Validación**: Sanitizar entradas de usuario con `class-validator` (`whitelist: true` global existente). No usar parámetros raw en TypeORM sin sanitizar (usar las facilidades del ORM contra SQL injection).
- **Dependencias**: No instalar dependencias nuevas sin autorización. Limitarse a `package.json` a excepción de que se solicite explícitamente una actualización. Escanear vulnerabilidades con `npm audit` periódicamente.

## Calidad y Logs

- **Debug Local**:
    - Scripts de prueba temporales deben ir en `tests/` y eliminarse al finalizar el desarrollo.
    - Nunca dejar código temporal, `console.log()` o endpoints de debug en producción.
- **Logging**:
    - No usar `console.log()` nativo.
    - Usar la clase `Logger` de `@nestjs/common`.
    - Incluir contexto relevante en logs.
    - Evitar loggear información sensible como passwords o JWT.
    - Niveles: DEBUG para trazabilidad local/dev, ERROR para excepciones, INFO para flujos importantes.
- **Testing**:
    - Framework: Jest integrado (estándar de NestJS).
    - Mocks: Usar las herramientas de `@nestjs/testing` (`Test.createTestingModule`) y Jest mocks para evitar hits a DB real. Mockear repositorios de TypeORM.
    - Tipos de tests: Unitarios (en los archivos `.spec.ts` junto a la lógica) y E2E (en carpeta `/test` raíz).
    - Ejecución: `npm run test` (Unitarios), `npm run test:e2e` (Integración), `npm run test:cov` (Cobertura).

## Comunicación

- **Idioma del Agente**: Explicaciones y razonamiento en Español.
- **Código**: Variables y funciones en Inglés. Comentarios en Español.

## Prohibiciones

- No reestructurar carpetas sin autorización
- No modificar código no relacionado
- No modificar las configuraciones de `main.ts` sin permiso expreso.
- No eliminar comentarios existentes

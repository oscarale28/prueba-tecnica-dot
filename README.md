# Prueba técnica DOT - Oscar Orellana

Proyecto fullstack: API Quarkus (Java) + frontend Angular, con PostgreSQL. Se puede levantar todo el entorno con Docker Compose.

## Levantar el proyecto con Docker

Desde la **raíz del repositorio**:

```bash
docker compose up --build
```


### Servicios y puertos

| Servicio      | Contenedor   | Puerto (host) | Descripción                          |
|---------------|--------------|---------------|--------------------------------------|
| **Frontend**  | frontend     | **4200**      | Aplicación Angular (Nginx)           |
| **API**       | api-quarkus  | **8080**      | API REST Quarkus                     |
| **PostgreSQL**| postgres     | **5432**      | Base de datos `dot-prueba-tecnica`   |

### URLs de acceso

- **Aplicación web:** http://localhost:4200  
- **API REST:** http://localhost:8080  

La API está configurada para conectarse a PostgreSQL en el contenedor `postgres` (red interna Docker).

## Estructura Docker

- **`docker-compose.yml`**: define los tres servicios (`postgres`, `api-quarkus`, `frontend`), la red `dot-net` y las variables de entorno.
- **`api/Dockerfile`**: build multi-stage (JDK 21 para compilar, JRE 21 para ejecutar); genera la aplicación Quarkus y la ejecuta en el puerto 8080.
- **`frontend/Dockerfile`**: build multi-stage (Node 20 para compilar Angular, Nginx para servir los estáticos); expone el puerto 8080 dentro del contenedor, mapeado al 4200 en el host.

## Datos de prueba

A través del archivo `import.sql`, al correr la API se cargan 50 proyectos y 150 etapas (3 por proyecto) como datos iniciales de prueba.
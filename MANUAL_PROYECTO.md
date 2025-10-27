# Manual de Estructura y Despliegue

## Estructura

- /Api: Backend .NET 8 (Api RESTful, autenticación CiDi, DB, caché)
- /Web: Frontend Next.js (React, formularios, integración Api)
- /publish: (se genera al compilar Api)
- /out: (se genera al exportar Web para deploy estático)

## Tecnologías

- Backend: .NET 8, EF Core, MySQL/Oracle, IIS
- Frontend: Next.js, React, Node, npm

## Compilación y Deploy

### Backend

1. `cd Api`
2. `dotnet publish -c Release -o ./publish`
3. Subir carpeta /publish a IIS
4. Configurar appsettings.Production.json, variables de entorno, credenciales

### Frontend

- **Desarrollo**:  
  `npm run dev`  
  `.env.local` con configuración de test

- **Producción (estático)**:  
  `npm run build && npm run export`  
  Subir `/out` a IIS como sitio web

- **Producción (Node)**:  
  (No recomendado salvo que uses API Routes o rewrites)
  `npm run build && npm start`

## Entornos y configuración

- `Api/appsettings.Development.json` y `appsettings.Production.json`
- `Web/.env.local` y `Web/.env.production`
- No subir archivos con credenciales reales a git

## Proxy y rewrites

- Solo usar rewrites/proxy en desarrollo local
- En prod, front debe consumir API apuntando a la URL pública del backend

## Mejoras sugeridas

- Dividir formularios y componentes largos en subcomponentes
- Adoptar caché distribuido en producción
- Agregar tests (unitarios y de integración)
- Automatizar build y compresión con scripts
- Usar Redis/memcached para sesión/caché en producción
- Documentar endpoints, esquema de DB y flujo de autenticación
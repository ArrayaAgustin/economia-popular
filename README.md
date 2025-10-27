# Manual de Estructura y Despliegue

## Resumen del proyecto

Este repositorio contiene dos aplicaciones principales que funcionan de forma separada pero integradas:

- Api: Backend en .NET 8 (C#). Expone APIs REST, integra autenticación con CiDi, usa Entity Framework Core para acceso a datos (actualmente MySQL, plan de migración a Oracle), y maneja caché de sesión/usuario.
- Web: Frontend en Next.js (React). Contiene la UI, formularios (incluido el formulario-persona), y consume las APIs del backend.

Estructura principal:
- /Api
- /Web
- /docs (documentación)
- ProyectoGobierno.sln
- README.md

---

## Tecnologías

- Backend: .NET 8, C#, Entity Framework Core, Pomelo MySQL provider (posible cambio a Oracle provider), IIS para despliegue.
- Frontend: Next.js 14.x, React, Node.js, npm.
- Cache/Session: Actualmente in-memory (MemoryCache). Recomendado Redis en producción.
- Autenticación: Integración con CiDi (API de gobierno) y manejo de cookie / token.
- Herramientas recomendadas: ESLint, Prettier, react-hook-form/Formik, xUnit/NUnit, Playwright/Cypress, SonarQube, Dependabot/Snyk.

---

## Cómo ejecutar localmente (desarrollo)

### Backend (Api)
1. Configurar variables de entorno o `appsettings.Development.json` con las credenciales de test (no subir secrets).
2. Restaurar y ejecutar:
```bash
cd Api
dotnet restore
dotnet build
dotnet run
```
- En modo Development la app suele exponer puertos HTTP y HTTPS (ej. https://localhost:7110).

### Frontend (Web)
1. Crear `.env.local` con variables de entorno para desarrollo (ej. API_URL=https://localhost:7110).
2. Instalar dependencias y ejecutar:
```bash
cd Web
npm install
npm run dev:cidi:https    # si tenés script específico para mkcert/https
# o
npm run dev
```
- `dev:cidi:https` crea certificados locales con mkcert y levanta Next.js con hostname custom (`localhost.cba.gov.ar`) para probar integraciones CiDi seguras.

---

## Compilación y publicación (producción / preparación a deploy)

### Backend (Api) - Producción (IIS)
1. Preparar `appsettings.Production.json` con las variables apropiadas o configurar variables de entorno en el servidor.
2. Publicar:
```bash
cd Api
dotnet publish -c Release -o ./publish
```
3. Comprimir o copiar la carpeta `publish` al servidor IIS.
4. Configurar sitio en IIS:
   - Crear Application Pool con .NET CLR apropiado (No Managed Code si se usa out-of-process).
   - Configurar binding HTTPS y certificados.
   - Revisar `web.config` generado por `dotnet publish`.
5. Variables sensibles (strings de conexión, client secrets) manejar con **variables de entorno** o un vault (Key Vault).

### Frontend (Web) - Opciones

Opción A — Export estático (IIS sirve HTML/JS/CSS)
- Requisito: NO usar API Routes de Next ni rewrites dependientes del runtime.
- Build + export:
```bash
cd Web
npm run build
npm run export
```
- Carpeta resultante: `/out` — subir al servidor web (IIS) como contenido estático.

Opción B — Servir con Node (si necesitás rewrites o API Routes)
- Requiere Node en server o usar infraestructura que soporte Node apps (menos habitual en entornos gubernamentales).
- Build + start:
```bash
npm run build
npm start
```
- En IIS esto requiere soluciones como iisnode o proxies reversos hacia la app Node.

---

## Proxy / Rewrites y comunicación Front <-> Back

- En desarrollo se usan rewrites o proxy en `next.config.js` para mapear rutas `/api/*` al backend (ej. https://localhost:7110).
- En producción es preferible que el frontend (si es estático) haga llamadas directamente al endpoint público del backend (API_URL) y no dependa de rewrites server-side.
- Configura CORS en el backend para aceptar orígenes permitidos (ej. https://app.gobierno.local, https://frontend.prod).
- Evita usar API Routes de Next para la lógica crítica del negocio si tu objetivo es deploy estático.

---

## Manejo de entornos y credenciales

- Backend: `appsettings.json`, `appsettings.Development.json`, `appsettings.Production.json` + Variables de entorno (`ASPNETCORE_ENVIRONMENT`).
- Frontend: `.env.local`, `.env.development`, `.env.production`.
- Nunca subir credenciales reales al repo. Usar placeholders y documentar variables necesarias en README / docs.
- En producción usar secreto centralizado (Azure KeyVault / HashiCorp Vault) o variables de entorno en el servidor.

---

## Arquitectura de autenticación y sesión (resumen)

Flujo:
1. Usuario llega al frontend y es redirigido / autenticado vía CiDi (cookie o token).
2. Frontend incluye cookie/token en headers hacia el backend (`x-cidi-token` / `cidi` cookie).
3. Backend valida el token con API CiDi (solicitud a cuentacidi.test.cba.gov.ar en dev), obtiene datos de usuario.
4. Backend cachea datos de usuario y cookie (ej. clave `cookie_{hash}`) por un tiempo (actualmente 6 horas).
5. Backend utiliza EF Core para mapear usuarios/roles locales y aplicar permisos.

Puntos críticos:
- No loguear secretos ni clientSecrets en producción.
- Cache en memoria está bien para desarrollo; en producción, usar Redis o cache distribuida para balanceo/alta disponibilidad.
- Garantizar expiración y revocación del cache cuando el token caduque o se cierre sesión.

---

## Refactor sugerido para formulario-persona (prioritario)

Problema: componente muy grande (> 1.600 líneas), mezclar estado/validaciones/UI.

Propuesta:
- Separar en subcomponentes:
  - DatosPersonales.jsx
  - Direccion.jsx
  - Contacto.jsx
  - Documentacion.jsx
  - ResumenPersona.jsx
- Crear hook `usePersonaForm` para:
  - Estado centralizado
  - Validaciones (delegadas a validacionesPersona.js)
  - API interactions (submit, partial-save)
- Usar `react-hook-form` para rendimiento y manejo de validación por campo.
- Añadir pruebas con react-testing-library + Jest y pruebas E2E con Playwright o Cypress.

Estructura propuesta:
```
/components/formulario-persona/
  PersonaForm.jsx
  DatosPersonales.jsx
  Direccion.jsx
  Contacto.jsx
  Documentacion.jsx
  usePersonaForm.js
  validacionesPersona.js
```

---

## Seguridad y buenas prácticas

- No loguear client secrets, tokens ni datos PII en producción.
- Forzar HTTPS en producción; redirigir todo HTTP a HTTPS.
- Configurar HSTS y cabeceras de seguridad (Content-Security-Policy si aplica).
- Limitar el tamaño de payloads y validar entradas en backend.
- Implementar rate limiting si el endpoint público lo requiere.

---

## Cache y escalabilidad

- Reemplazar MemoryCache por Redis para cache de sesiones/usuario con múltiples instancias API.
- Para cargas pesadas, separar lectura (EF Core) de las transacciones críticas (procedimientos PL/SQL en Oracle) y si corresponde usar Dapper para llamadas a procedimientos.

---

## Tests recomendados (prioridad)
1. Backend: pruebas unitarias de servicios críticos (UserService, CacheService), pruebas de integración para endpoints de autenticación.
2. Frontend: unit tests para subcomponentes de formulario-persona y validaciones.
3. E2E: flujos de login con CiDi (mockear CiDi en test), completar formulario y submit.
4. Pipeline CI: ejecutar linters, tests y builds automáticos antes de publicar artefactos.

---

## Scripts útiles sugeridos (ejemplos)

- Script para publicar backend y comprimir:
```bash
cd Api
dotnet publish -c Release -o ./publish
zip -r publish.zip publish
```

- Script para build + export frontend (estático):
```bash
cd Web
npm ci
npm run build
npm run export
zip -r web_out.zip out
```

---

## Documentación y entrega para el equipo de deploy

Incluye en README o `docs/DEPLOY.md`:
- Lista de variables de entorno obligatorias para Test/Prod.
- Procedimiento de build y archivos resultantes (Api: /publish, Web: /out o bundle Node).
- Instrucciones de IIS: Application Pool, bindings HTTPS, permisos de carpeta.
- Cómo rotar secretos y actualizar `appsettings.Production.json`.

---

## Diagrama de alto nivel (flujo)

```mermaid
flowchart TD
    User[Usuario]
    Web[Frontend Next.js]
    Api[Backend .NET 8]
    DB[(DB MySQL/Oracle)]
    CiDi[API CiDi Gobierno]
    Cache[Cache/Session (Redis)]

    User -->|Login| Web
    Web -->|Token CiDi| Api
    Api -->|Validación| CiDi
    Api -->|Query| DB
    Api <--> Cache
    Api -->|Respuesta| Web
    Web --> User
```

---

## Qué hice y próximos pasos

He consolidado y formalizado el manual en este archivo para que puedas agregarlo al repo. Si querés, puedo:
- Subir este archivo directamente al repo (crear PR).
- Generar `docs/DEPLOY.md` y ejemplos de `appsettings.Production.json.sample` y `.env.production.sample`.
- Empezar el refactor del `formulario-persona` en pasos con PRs: 1) extraer estado a `usePersonaForm`, 2) crear subcomponentes, 3) agregar tests.

Indícame qué querés que haga ahora (subir el archivo al repo, crear PRs con el refactor, o generar archivos de muestra de configuración).  
```
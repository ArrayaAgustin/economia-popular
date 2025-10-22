# Configuración para desarrollo local con CiDi

## Configuración del archivo hosts

Para que la aplicación pueda acceder a las cookies de CiDi durante el desarrollo local, es necesario configurar el archivo hosts para usar un subdominio de `.cba.gov.ar`.

### Windows
1. Abrir el Bloc de notas como administrador
2. Abrir el archivo `C:\Windows\System32\drivers\etc\hosts`
3. Agregar las siguientes líneas:
```
127.0.0.1 localhost.cba.gov.ar
```
4. Guardar el archivo

### macOS/Linux
1. Abrir una terminal
2. Ejecutar `sudo nano /etc/hosts`
3. Agregar las siguientes líneas:
```
127.0.0.1 localhost.cba.gov.ar
```
4. Guardar con Ctrl+O y salir con Ctrl+X

## Configuración del servidor Next.js

Para que Next.js se ejecute en el dominio personalizado, es necesario modificar el comando de inicio:

```bash
# En package.json, modificar el script "dev"
"dev": "next dev -H localhost.cba.gov.ar -p 3000"
```

## Configuración del backend

En el backend, asegurarse de que CORS esté configurado para permitir solicitudes desde `localhost.cba.gov.ar`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost.cba.gov.ar:3000", "https://localhost.cba.gov.ar:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

## Flujo de autenticación con CiDi

El flujo de autenticación con CiDi funciona de la siguiente manera:

1. El usuario accede a la aplicación en `http://localhost.cba.gov.ar:3000`
2. Si el usuario no está autenticado, se le muestra un botón para iniciar sesión con CiDi
3. Al hacer clic en el botón, se redirige al usuario a `https://cidi.test.cba.gov.ar/Cuenta/Login?app=414`
4. El usuario inicia sesión en CiDi con sus credenciales
5. CiDi redirige al usuario de vuelta a la aplicación con cookies de autenticación
6. La aplicación verifica las cookies y obtiene los datos del usuario

## Solución de problemas comunes

### Las cookies de CiDi no se guardan correctamente

Si las cookies de CiDi no se guardan correctamente, verificar lo siguiente:

1. **Verificar que el archivo hosts esté configurado correctamente**
   - Abrir una terminal y ejecutar `ping localhost.cba.gov.ar`
   - Debería responder con `127.0.0.1`

2. **Verificar que el servidor Next.js esté ejecutándose en el dominio correcto**
   - La URL en el navegador debe ser `http://localhost.cba.gov.ar:3000`
   - En la consola del servidor debe aparecer `- Local: http://localhost.cba.gov.ar:3000`

3. **Limpiar cookies y caché del navegador**
   - A veces, las cookies antiguas pueden causar problemas
   - Borrar todas las cookies relacionadas con `.cba.gov.ar`

4. **Verificar las cookies en el navegador**
   - Abrir las herramientas de desarrollo del navegador (F12)
   - Ir a la pestaña "Application" (Chrome) o "Storage" (Firefox)
   - Verificar que existan las cookies `CiDi` y `.AUTHCOOKIE`
   - Verificar que el dominio de las cookies sea `.cba.gov.ar`

### La aplicación redirige constantemente a CiDi

Si la aplicación redirige constantemente a CiDi, verificar lo siguiente:

1. **Verificar la consola del navegador**
   - Abrir las herramientas de desarrollo del navegador (F12)
   - Revisar los mensajes de depuración en la consola
   - Buscar mensajes relacionados con la verificación de cookies

2. **Verificar que el backend esté respondiendo correctamente**
   - Verificar que el servidor backend esté en ejecución
   - Revisar los logs del servidor para ver si hay errores
   - Verificar que CORS esté configurado correctamente

3. **Probar con otro navegador**
   - A veces, las configuraciones de privacidad del navegador pueden bloquear cookies de terceros
   - Probar con un navegador diferente para descartar problemas específicos del navegador

## Configuración de variables de entorno

Asegurarse de que las siguientes variables de entorno estén configuradas:

```
# .env.local
NEXT_PUBLIC_API_URL=https://localhost:7110
NEXT_PUBLIC_CIDI_APP_ID=414
```

## Verificación de cookies

Para verificar manualmente si las cookies de CiDi están presentes, abrir la consola del navegador y ejecutar:

```javascript
// Verificar todas las cookies
console.log(document.cookie);

// Verificar cookies específicas
console.log('CiDi cookie:', document.cookie.includes('CiDi='));
console.log('AUTHCOOKIE:', document.cookie.includes('.AUTHCOOKIE='));
```

Si las cookies están presentes pero la aplicación no las detecta, puede ser un problema con el dominio o la configuración de seguridad de las cookies.

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* No incluimos la meta etiqueta Content-Security-Policy */}
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Verificar si hay una preferencia guardada
              var savedTheme = localStorage.getItem('theme');
              var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `
        }} />
        
        {/* Script para manejar cookies SameSite=Lax */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Función para parsear todas las cookies
              function parseCookies() {
                const cookies = {};
                document.cookie.split(';').forEach(cookie => {
                  const [name, value] = cookie.trim().split('=');
                  if (name && value) cookies[name] = value;
                });
                return cookies;
              }
              
              // Función para verificar si tenemos las cookies necesarias
              function verificarCookies() {
                const cookies = parseCookies();
                console.log('Cookies disponibles en el documento:', cookies);
                
                // Verificar si tenemos las cookies de CiDi
                const tieneCiDi = !!cookies['CiDi'];
                const tieneAuthCookie = !!cookies['.AUTHCOOKIE'];
                
                console.log('Verificación de cookies:', {
                  CiDi: tieneCiDi,
                  '.AUTHCOOKIE': tieneAuthCookie
                });
                
                // Almacenar esta información para que la aplicación pueda acceder a ella
                window.__cookieStatus = {
                  tieneCiDi,
                  tieneAuthCookie,
                  todasLasCookies: cookies
                };
              }
              
              // Ejecutar la verificación al cargar la página
              verificarCookies();
              
              // Volver a verificar periódicamente (por si las cookies cambian)
              setInterval(verificarCookies, 5000);
            })();
          `
        }} />
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

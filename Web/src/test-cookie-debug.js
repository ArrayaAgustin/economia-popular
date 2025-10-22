// Script para diagnosticar problemas con las cookies
const axios = require('axios');
const https = require('https');

// URL base de la API
const API_URL = 'https://localhost:7110';

// Función para probar si las cookies se están enviando correctamente
async function testCookies() {
  try {
    console.log('=== DIAGNÓSTICO DE COOKIES ===');
    console.log('Realizando solicitud a:', `${API_URL}/api/User/obtener-usuario`);
    
    // Configurar Axios para enviar cookies
    const axiosConfig = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // No podemos establecer el encabezado Cookie manualmente desde el cliente
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Solo para desarrollo
      })
    };
    
    console.log('Configuración de Axios:');
    console.log(JSON.stringify(axiosConfig, null, 2));
    
    try {
      // Intentar obtener el usuario
      const response = await axios.get(`${API_URL}/api/User/obtener-usuario`, axiosConfig);
      
      console.log('\n✅ Solicitud exitosa:');
      console.log('Status:', response.status);
      console.log('Datos:', response.data);
    } catch (error) {
      console.log('\n❌ Error en la solicitud:');
      console.log('Mensaje:', error.message);
      
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Datos:', error.response.data);
      }
    }
    
    // Solicitar un endpoint que nos muestre todas las cookies recibidas
    console.log('\n=== VERIFICANDO COOKIES RECIBIDAS EN EL BACKEND ===');
    console.log('Nota: Para que esto funcione, debes crear un endpoint en el backend que devuelva todas las cookies recibidas.');
    console.log('Ejemplo de endpoint:\n');
    console.log(`
    [HttpGet("debug-cookies")]
    public IActionResult DebugCookies()
    {
        var cookies = Request.Cookies.ToDictionary(c => c.Key, c => c.Value);
        return Ok(new { 
            message = "Cookies recibidas en el backend",
            cookies = cookies,
            hasCiDiCookie = Request.Cookies.ContainsKey("CiDi"),
            ciDiCookieValue = Request.Cookies["CiDi"] ?? "No encontrada"
        });
    }
    `);
    
    try {
      // Intentar obtener información de depuración de cookies (si existe el endpoint)
      const debugResponse = await axios.get(`${API_URL}/api/User/debug-cookies`, axiosConfig);
      
      console.log('\n✅ Información de depuración de cookies:');
      console.log('Status:', debugResponse.status);
      console.log('Datos:', debugResponse.data);
    } catch (error) {
      console.log('\n❌ No se pudo obtener información de depuración de cookies:');
      console.log('Mensaje:', error.message);
      
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Datos:', error.response.data);
      } else {
        console.log('Es probable que el endpoint de depuración no exista en el backend.');
      }
    }
    
    // Verificar la configuración CORS
    console.log('\n=== VERIFICANDO CONFIGURACIÓN CORS ===');
    
    try {
      const corsResponse = await axios({
        method: 'OPTIONS',
        url: `${API_URL}/api/User/obtener-usuario`,
        headers: {
          'Origin': 'http://localhost.cba.gov.ar:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      });
      
      console.log('Respuesta OPTIONS:');
      console.log('Status:', corsResponse.status);
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': corsResponse.headers['access-control-allow-origin'],
        'Access-Control-Allow-Credentials': corsResponse.headers['access-control-allow-credentials'],
        'Access-Control-Allow-Methods': corsResponse.headers['access-control-allow-methods'],
        'Access-Control-Allow-Headers': corsResponse.headers['access-control-allow-headers']
      };
      
      console.log('Encabezados CORS:', corsHeaders);
      
      // Verificar si la configuración CORS es correcta para cookies
      const isOriginAllowed = corsHeaders['Access-Control-Allow-Origin'] === 'http://localhost.cba.gov.ar:3000';
      const isCredentialsAllowed = corsHeaders['Access-Control-Allow-Credentials'] === 'true';
      
      if (isOriginAllowed && isCredentialsAllowed) {
        console.log('\n✅ La configuración CORS parece correcta para enviar cookies.');
      } else {
        console.log('\n❌ La configuración CORS NO es correcta para enviar cookies:');
        
        if (!isOriginAllowed) {
          console.log('  - El origen "http://localhost.cba.gov.ar:3000" no está permitido explícitamente.');
          console.log('  - El backend debe configurar específicamente este origen.');
          console.log('  - Valor actual:', corsHeaders['Access-Control-Allow-Origin']);
        }
        
        if (!isCredentialsAllowed) {
          console.log('  - Las credenciales no están permitidas.');
          console.log('  - El backend debe configurar "Access-Control-Allow-Credentials: true".');
        }
      }
    } catch (error) {
      console.log('Error al verificar la configuración CORS:', error.message);
    }
    
  } catch (error) {
    console.error('Error general:', error.message);
  }
}

// Ejecutar las pruebas
testCookies();

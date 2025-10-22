// Script de prueba para verificar la conexión con la API
const axios = require('axios');

// Función para hacer una solicitud directa a la API
async function testApiConnection() {
  try {
    // Configuración de la solicitud
    const config = {
      method: 'get',
      url: 'https://localhost:7110/api/User/obtener-usuario',
      withCredentials: true, // Importante: enviar cookies
      headers: {
        'Cookie': 'CiDi=YOUR_CIDI_COOKIE_VALUE' // Reemplazar con el valor real de la cookie CiDi
      }
    };

    console.log('Enviando solicitud a la API...');
    const response = await axios(config);
    
    console.log('Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error al conectar con la API:');
    if (error.response) {
      // La solicitud fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta. Request:', error.request);
    } else {
      // Algo ocurrió durante la configuración de la solicitud que disparó un error
      console.error('Error de configuración:', error.message);
    }
    
    // Para errores de certificado SSL en desarrollo
    if (error.code === 'DEPTH_ZERO_SELF_SIGNED_CERT' || error.code === 'CERT_HAS_EXPIRED') {
      console.error('Error de certificado SSL. En desarrollo, puedes deshabilitar la verificación SSL:');
      console.error('process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";');
    }
    
    return null;
  }
}

// Ejecutar la prueba
testApiConnection()
  .then(() => console.log('Prueba completada'))
  .catch(err => console.error('Error en la prueba:', err));

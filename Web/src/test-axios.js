// Script para probar la comunicación con la API usando el cliente Axios configurado
const axios = require('axios');
const https = require('https');

// Configuración similar a la de axiosClient.ts
const API_URL = 'https://localhost:7110';

// Crear una instancia de Axios con configuración para pruebas
const axiosTest = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante: esto hace que Axios envíe automáticamente las cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Ignorar errores de certificado SSL en desarrollo local
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Función para probar la obtención de datos del usuario
async function testObtenerUsuario() {
  try {
    console.log('Enviando solicitud a /api/User/obtener-usuario...');
    
    // Establecer la cookie manualmente para esta prueba
    // En una aplicación real, esta cookie vendría del navegador
    axiosTest.defaults.headers.Cookie = 'CiDi=635A78574477424B756F764C6877357668502F443966567476306F3D';
    
    const response = await axiosTest.get('/api/User/obtener-usuario');
    
    console.log('Respuesta recibida:');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:');
    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado
      // que no está en el rango 2xx
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor');
      console.error(error.request);
    } else {
      // Algo ocurrió al configurar la solicitud que desencadenó un error
      console.error('Error de configuración:', error.message);
    }
    console.error('Config:', error.config);
    
    throw error;
  }
}

// Ejecutar la prueba
console.log('Iniciando prueba de API con Axios...');
testObtenerUsuario()
  .then(data => {
    console.log('Prueba completada con éxito');
  })
  .catch(error => {
    console.error('Prueba fallida');
  });

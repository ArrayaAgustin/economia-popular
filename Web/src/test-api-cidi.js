// Script para probar la comunicación con la API usando la cookie CiDi
const axios = require('axios');

// Configuración de Axios con la cookie CiDi
const axiosInstance = axios.create({
  baseURL: 'https://localhost:7110',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cookie': 'CiDi=635A78574477424B756F764C6877357668502F443966567476306F3D'
  },
  // Ignorar errores de certificado SSL en desarrollo local
  httpsAgent: new (require('https').Agent)({
    rejectUnauthorized: false
  })
});

// Función para probar la obtención de datos del usuario
async function testObtenerUsuario() {
  try {
    console.log('Enviando solicitud a /api/User/obtener-usuario...');
    const response = await axiosInstance.get('/api/User/obtener-usuario');
    
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
console.log('Iniciando prueba de API con cookie CiDi...');
testObtenerUsuario()
  .then(data => {
    console.log('Prueba completada con éxito');
  })
  .catch(error => {
    console.error('Prueba fallida');
  });

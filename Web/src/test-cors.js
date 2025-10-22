// Script para probar la configuración CORS del backend
const axios = require('axios');
const https = require('https');

// URL base de la API
const API_URL = 'https://localhost:7110';

// Función para probar la configuración CORS
async function testCors() {
  try {
    console.log('Probando configuración CORS del backend...');
    
    // Realizar una solicitud OPTIONS para verificar los encabezados CORS
    const response = await axios({
      method: 'OPTIONS',
      url: `${API_URL}/api/User/obtener-usuario`,
      headers: {
        'Origin': 'http://localhost.cba.gov.ar:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Solo para desarrollo
      })
    });
    
    console.log('Respuesta OPTIONS recibida:');
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    
    // Verificar los encabezados CORS importantes
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    };
    
    console.log('\nEncabezados CORS:');
    console.log(corsHeaders);
    
    // Verificar si la configuración CORS es correcta para cookies
    const isOriginAllowed = corsHeaders['Access-Control-Allow-Origin'] === 'http://localhost.cba.gov.ar:3000' || 
                           corsHeaders['Access-Control-Allow-Origin'] === '*';
    const isCredentialsAllowed = corsHeaders['Access-Control-Allow-Credentials'] === 'true';
    
    console.log('\nAnálisis de configuración CORS:');
    console.log('¿Origen permitido?', isOriginAllowed ? 'Sí' : 'No');
    console.log('¿Credenciales permitidas?', isCredentialsAllowed ? 'Sí' : 'No');
    
    if (isOriginAllowed && isCredentialsAllowed) {
      console.log('\n✅ La configuración CORS parece correcta para enviar cookies.');
    } else {
      console.log('\n❌ La configuración CORS NO es correcta para enviar cookies:');
      
      if (!isOriginAllowed) {
        console.log('  - El origen "http://localhost.cba.gov.ar:3000" no está permitido.');
        console.log('  - El backend debe configurar específicamente este origen en lugar de usar "*".');
      }
      
      if (!isCredentialsAllowed) {
        console.log('  - Las credenciales no están permitidas.');
        console.log('  - El backend debe configurar "Access-Control-Allow-Credentials: true".');
      }
    }
    
  } catch (error) {
    console.error('Error al probar la configuración CORS:', error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    }
  }
}

// Ejecutar la prueba
testCors();

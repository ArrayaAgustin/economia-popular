import axios from 'axios';

// URL base de la API
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'https://localhost:7110' 
  : (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7110');

console.log('API URL configurada:', API_URL);

// Cache para evitar solicitudes duplicadas
const requestCache = new Map();
const CACHE_TIME = 2000; // 2 segundos de tiempo de cache

// Crear una instancia de Axios con configuración básica
const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Importante: permite enviar cookies en solicitudes cross-origin
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Ignorar errores de certificado SSL en desarrollo local
  ...(process.env.NODE_ENV === 'development' ? {
    httpsAgent: new (require('https').Agent)({
      rejectUnauthorized: false
    })
  } : {})
});

// Interceptor para solicitudes con depuración de cookies y prevención de duplicados
axiosClient.interceptors.request.use(
  (config) => {
    // Crear una clave única para la solicitud basada en la URL y los parámetros
    const requestKey = `${config.method}-${config.url}-${JSON.stringify(config.params || {})}-${JSON.stringify(config.data || {})}`;
    
    // Verificar si esta solicitud ya está en caché y es reciente
    const cachedRequest = requestCache.get(requestKey);
    if (cachedRequest) {
      const now = Date.now();
      if (now - cachedRequest.timestamp < CACHE_TIME) {
        console.log(`Solicitud duplicada a ${config.url} detectada y prevenida`);
        // Cancelar la solicitud duplicada y reutilizar la promesa anterior
        return cachedRequest.promise;
      } else {
        // La solicitud ya es antigua, eliminarla del caché
        requestCache.delete(requestKey);
      }
    }
    
    // Log detallado
    console.log(`Realizando solicitud a ${config.url}`);
    console.log('Configuración de la solicitud:', {
      withCredentials: config.withCredentials,
      headers: config.headers,
      method: config.method
    });
    
    // Asegurarse de que withCredentials esté habilitado
    config.withCredentials = true;
    
    // Depuración: Mostrar cookies disponibles
    if (typeof document !== 'undefined') {
      console.log('Cookies que se enviarán:', document.cookie);
      
      // Extraer la cookie CiDi y agregarla como header personalizado
      const cookies = document.cookie.split(';');
      const cidiCookie = cookies.find(cookie => cookie.trim().startsWith('CiDi='));
      
      if (cidiCookie) {
        const cidiValue = cidiCookie.trim().substring(5); // Eliminar 'CiDi='
        
        // Agregar la cookie como headers personalizados para máxima compatibilidad
        config.headers = config.headers || {};
        config.headers['CiDi'] = cidiValue;
        config.headers['X-CiDi-Token'] = cidiValue;
        
        console.log('Cookie CiDi encontrada y agregada a headers:', cidiValue.substring(0, 10) + '...');
      } else {
        console.log('No se encontró cookie CiDi para agregar a headers');
      }
    }
    
    // Guardar esta solicitud en el caché
    // Usar una propiedad compatible con TypeScript
    (config as any)._requestKey = requestKey;
    
    return config;
  },
  (error) => {
    console.error('Error en la configuración de la solicitud:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas con depuración de cookies
axiosClient.interceptors.response.use(
  (response) => {
    // Log básico
    console.log(`Respuesta recibida de ${response.config.url}:`, response.status);
    
    // Depuración de cookies recibidas
    if (typeof document !== 'undefined') {
      console.log('Headers de respuesta:', response.headers);
      
      // Verificar si hay cookies en los headers de respuesta
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        console.log('Set-Cookie headers recibidos:', setCookieHeader);
      } else {
        console.log('No se recibieron headers Set-Cookie');
      }
      
      // Verificar cookies actuales en el navegador
      console.log('Cookies actuales en el navegador:', document.cookie);
    }
    
    return response;
  },
  (error) => {
    // Log de errores
    console.error('Error en solicitud:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosClient;

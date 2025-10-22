// Importar el cliente axios y funciones de autenticación
import axiosClient from './axiosClient';
import { Usuario } from './authService';

// Función para obtener el valor de la cookie CiDi (implementada directamente para evitar problemas de importación)
const obtenerCookieCiDi = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const cidiCookie = cookies.find(cookie => cookie.trim().startsWith('CiDi='));
  
  if (cidiCookie) {
    // Depuración
    // (log eliminado)
    return cidiCookie.trim().substring(5); // Eliminar 'CiDi='
  }
  
  // (log eliminado)
  return null;
};

// Función para verificar si existe la cookie CiDi
const verificarCookieCiDi = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('CiDi='));
};

// Función para verificar si existe la cookie de acceso
const verificarCookieAcceso = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('access_token='));
};

// Función para verificar si existe la cookie de refresco
const verificarCookieRefresco = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('refresh_token='));
};

// Función para verificar el estado de autenticación basado en cookies
const verificarEstadoAutenticacion = (): { cidi: boolean; accessToken: boolean; refreshToken: boolean } => {
  return {
    cidi: verificarCookieCiDi(),
    accessToken: verificarCookieAcceso(),
    refreshToken: verificarCookieRefresco()
  };
};

// Funciones para interactuar con la API

// Cache para almacenar la respuesta de autenticación
let autenticacionCache: {
  usuario: Usuario | null;
  timestamp: number;
  promise: Promise<Usuario | null> | null;
} | null = null;

// Tiempo de validez del cache en milisegundos (5 minutos)
const AUTENTICACION_CACHE_DURATION = 5 * 60 * 1000;

// Función para autenticar al usuario con CiDi
// Esta función será utilizada en _app.tsx para evitar problemas de importación circular
export const autenticarUsuario = async (): Promise<Usuario | null> => {
  // Verificar si hay una solicitud en curso
  if (autenticacionCache?.promise) {
    // (log eliminado)
    return autenticacionCache.promise;
  }

  // Verificar si hay datos en cache y son válidos
  const now = Date.now();
  if (autenticacionCache && (now - autenticacionCache.timestamp < AUTENTICACION_CACHE_DURATION)) {
    // (log eliminado)
    return autenticacionCache.usuario;
  }
  
  // Si llegamos aquí, necesitamos hacer una nueva solicitud
  // Crear una promesa para esta solicitud
  const authPromise = _realizarAutenticacion();
  
  // Guardar la promesa en el cache
  autenticacionCache = {
    usuario: null,
    timestamp: now,
    promise: authPromise
  };
  
  try {
    // Resolver la promesa
    const usuario = await authPromise;
    
    // Actualizar el cache con el resultado
    if (autenticacionCache) {
      autenticacionCache.usuario = usuario;
      autenticacionCache.promise = null;
    }
    
    return usuario;
  } catch (error) {
    // En caso de error, limpiar el cache
    autenticacionCache = null;
    throw error;
  }
};

// Función interna que realiza la autenticación real
const _realizarAutenticacion = async (): Promise<Usuario | null> => {
  try {
    // Verificar si la cookie CiDi existe
    const cidiExists = verificarCookieCiDi();
    // (log eliminado)
    
    if (!cidiExists) {
      console.log('No se encontró la cookie CiDi, no se puede autenticar');
      return null;
    }
    
    // Obtener el valor de la cookie CiDi
    const cidiToken = obtenerCookieCiDi();
    if (!cidiToken) {
      return null;
    }
    
    // (log eliminado)
    
    // Preparar los headers para la solicitud
    const headers: Record<string, string> = {};
    
    // Incluir el token CiDi como header
    headers['CiDi'] = cidiToken;
    // También incluirlo como X-CiDi-Token según la memoria compartida
    headers['X-CiDi-Token'] = cidiToken;
    
    // (log eliminado)
    
    // Llamar al endpoint para obtener el usuario
    const response = await axiosClient.get('/api/User/obtener-usuario', { headers });
    
    if (response.data && response.data.usuario) {
      // Mapear la respuesta al formato de Usuario
      return {
        cuil: response.data.usuario.cuil,
        nombre: response.data.usuario.nombre,
        apellido: response.data.usuario.apellido,
        rol: response.data.usuario.rol
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    return null;
  }
};

// Obtener datos del usuario autenticado
export const getUsuarioData = async () => {
  try {
    
    // Mostrar el estado de autenticación actual basado en cookies
    if (typeof document !== 'undefined') {
      const { cidi, accessToken, refreshToken } = verificarEstadoAutenticacion();
      console.log('Estado de autenticación actual:');
      console.log('- CiDi:', cidi ? 'Presente' : 'No encontrado');
      console.log('- access_token:', accessToken ? 'Presente' : 'No encontrado');
      console.log('- refresh_token:', refreshToken ? 'Presente' : 'No encontrado');
    }
    
    // Usar la función autenticarUsuario que ya tiene caché implementado
    // Esto evitará múltiples solicitudes innecesarias al backend
    const usuarioAutenticado = await autenticarUsuario();
    
    // Si tenemos un usuario autenticado desde la caché, usarlo
    if (usuarioAutenticado) {
      return {
        exito: true,
        mensaje: 'Usuario autenticado exitosamente',
        usuario: usuarioAutenticado
      };
    }
    
    // Si no hay usuario autenticado, intentar con la cookie CiDi directamente
    const cidiToken = obtenerCookieCiDi();
    if (!cidiToken) {
      return {
        exito: false,
        mensaje: 'No se encontró la cookie CiDi',
        usuario: null
      };
    }
    
    // Preparar los headers para la solicitud
    const headers: Record<string, string> = {};
    
    // Incluir el token CiDi como header
    headers['CiDi'] = cidiToken;
    headers['X-CiDi-Token'] = cidiToken;
    
    // Realizar la solicitud al endpoint
    const response = await axiosClient.get('/api/User/obtener-usuario', { headers });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

// Autenticación con CIDI
export const loginWithCidi = async (cookieHash: string) => {
  try {
    // Usar la ruta correcta del backend y enviar el token como X-CiDi-Token
    const response = await axiosClient.get('/api/User/obtener-usuario', {
      headers: {
        'X-CiDi-Token': cookieHash
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error en loginWithCidi:', error);
    throw error;
  }
};

// Esta función ha sido reemplazada por getUsuarioData
// y se mantiene por compatibilidad con código existente
export const getUsuarioAutenticado = async () => {
  return getUsuarioData();
};

// Obtener datos de usuario por CUIL
export const getUserData = async (cuil: string) => {
  try {
    // Obtener el valor de la cookie CiDi para autenticación
    const cidiToken = obtenerCookieCiDi();
    
    // Preparar los headers para la solicitud
    const headers: Record<string, string> = {};
    
    // Si tenemos el token CiDi, incluirlo como header
    if (cidiToken) {
      headers['CiDi'] = cidiToken;
      // También incluirlo como X-CiDi-Token según la memoria compartida
      headers['X-CiDi-Token'] = cidiToken;
    }
    
    const response = await axiosClient.get(`/api/User/${cuil}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos del usuario ${cuil}:`, error);
    throw error;
  }
};

// Obtener datos completos de una persona por CUIL
export const getPersonaData = async (cuil: string) => {
  try {
    // Obtener el valor de la cookie CiDi para autenticación
    const cidiToken = obtenerCookieCiDi();
    
    // Mostrar todas las cookies disponibles antes de la solicitud
    if (typeof document !== 'undefined') {
      console.log('Cookies disponibles antes de la solicitud:', document.cookie);
      
      // Verificar estado de autenticación basado en cookies
      const { cidi, accessToken, refreshToken } = verificarEstadoAutenticacion();
      console.log('Estado de autenticación antes de la solicitud:');
      console.log('- CiDi:', cidi ? 'Presente' : 'No encontrado');
      console.log('- access_token:', accessToken ? 'Presente' : 'No encontrado');
      console.log('- refresh_token:', refreshToken ? 'Presente' : 'No encontrado');
    }
    
    // Preparar los headers para la solicitud
    const headers: Record<string, string> = {};
    
    // Si tenemos el token CiDi, incluirlo como header
    if (cidiToken) {
      headers['CiDi'] = cidiToken;
      // También incluirlo como X-CiDi-Token según la memoria compartida
      headers['X-CiDi-Token'] = cidiToken;
    }
    
    // Realizar la solicitud al endpoint de persona
    const response = await axiosClient.get(`/api/Persona/${cuil}`, { headers });
    
    // Verificar si se recibieron las cookies de acceso y refresco después de la solicitud
    if (typeof document !== 'undefined') {
      console.log('Cookies disponibles después de la solicitud:', document.cookie);
      
      // Verificar estado de autenticación basado en cookies
      const { cidi, accessToken, refreshToken } = verificarEstadoAutenticacion();
      console.log('Estado de autenticación después de la solicitud:');
      console.log('- CiDi:', cidi ? 'Presente' : 'No encontrado');
      console.log('- access_token:', accessToken ? 'Presente' : 'No encontrado');
      console.log('- refresh_token:', refreshToken ? 'Presente' : 'No encontrado');
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error al obtener datos de la persona con CUIL ${cuil}:`, error);
    return null;
  }
};

// Guardar formulario de persona
export const savePersonForm = async (formData: any) => {
  try {
    // Obtener el valor de la cookie CiDi para autenticación
    const cidiToken = obtenerCookieCiDi();
    
    // Preparar los headers para la solicitud
    const headers: Record<string, string> = {};
    
    // Si tenemos el token CiDi, incluirlo como header
    if (cidiToken) {
      headers['CiDi'] = cidiToken;
      // También incluirlo como X-CiDi-Token según la memoria compartida
      headers['X-CiDi-Token'] = cidiToken;
    }
    
    console.log('Enviando formulario de persona con headers:', headers);
    const response = await axiosClient.post('/api/Persona/guardar', formData, { headers });
    return response.data;
  } catch (error) {
    console.error('Error al guardar formulario de persona:', error);
    throw error;
  }
};

// Guardar formulario de organización
export const saveOrganizacionForm = async (formData: any) => {
  try {
    // Verificar que tenemos un token de acceso
    const estadoAuth = verificarEstadoAutenticacion();
    
    if (!estadoAuth.accessToken && !estadoAuth.cidi) {
      console.error('No hay un token de acceso o cookie CiDi válidos');
      return { exito: false, mensaje: 'No autorizado. Debe iniciar sesión nuevamente.' };
    }
    
    const response = await axiosClient.post('/api/Organizacion/guardar', formData);
    
    if (response.status === 200 || response.status === 201) {
      return { exito: true, datos: response.data };
    } else {
      console.error('Error al guardar formulario:', response.statusText);
      return { exito: false, mensaje: response.statusText || 'Error al guardar los datos' };
    }
  } catch (error: any) {
    console.error('Error al guardar formulario:', error);
    return { 
      exito: false, 
      mensaje: error.response?.data?.mensaje || error.message || 'Error desconocido' 
    };
  }
};

/**
 * Cierre de sesión completo: elimina tokens, limpia caché y redirige a CiDi para cerrar sesión también allí
 */
export const cerrarSesionCompleta = async (): Promise<{logoutUrl: string, message: string}> => {
  console.log('Iniciando proceso de cierre de sesión completo...');
  const tiempoInicial = performance.now();
  
  try {
    // Llamar al endpoint de cierre de sesión en el backend
    const response = await axiosClient.get('/api/User/cerrar-sesion');
    
    const tiempoFinal = performance.now();
    console.log(`Sesión cerrada correctamente en ${(tiempoFinal - tiempoInicial).toFixed(2)}ms`);
    
    // Eliminar todas las cookies del cliente (incluidas las que el backend no puede eliminar)
    if (typeof document !== 'undefined') {
      // Limpieza de cookies locales (frontend)
      document.cookie = 'Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'RefreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // No eliminamos CiDi aquí, será manejada por el proceso de cierre de CiDi
    }
    
    // Limpiar caché local y autenticación
    if (autenticacionCache) {
      autenticacionCache = null;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

// Obtiene los datos completos del usuario autenticado (incluida toda la información de CiDi)
// Este método aprovecha el sistema de caché en el backend
export const getUsuarioCompletoData = async () => {
  try {
    // Verificar estado de autenticación
    const estadoAuth = verificarEstadoAutenticacion();
    
    if (!estadoAuth.accessToken && !estadoAuth.cidi) {
      console.error('No hay un token de acceso o cookie CiDi válidos');
      return { exito: false, mensaje: 'No autorizado. Debe iniciar sesión nuevamente.' };
    }
    
    console.log('Obteniendo datos completos del usuario desde endpoint con caché...');
    const tiempoInicio = performance.now();
    
    // Llamar al endpoint que utiliza el sistema de caché
    const response = await axiosClient.get('/api/User/obtener-usuario-completo');
    
    const tiempoFin = performance.now();
    console.log(`Respuesta recibida en ${(tiempoFin - tiempoInicio).toFixed(2)}ms`);
    
    if (response.status === 200) {
      return { 
        exito: true, 
        usuario: response.data,
        tiempoRespuesta: tiempoFin - tiempoInicio
      };
    } else {
      console.error('Error al obtener datos del usuario:', response.statusText);
      return { exito: false, mensaje: 'Error al obtener datos del usuario' };
    }
  } catch (error: any) {
    console.error('Error al obtener datos completos del usuario:', error);
    
    // Si hay un error de autorización, podría ser necesario refrescar el token
    if (error.response && error.response.status === 401) {
      return { exito: false, mensaje: 'La sesión ha expirado. Por favor, inicie sesión nuevamente.' };
    }
    
    return { 
      exito: false, 
      mensaje: error.response?.data?.mensaje || error.message || 'Error desconocido'
    };
  }
};

export default axiosClient;

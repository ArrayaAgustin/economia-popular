import axiosClient from './axiosClient';

export interface Usuario {
  cuil: string;
  nombre: string;
  apellido: string;
  rol: string;
}

// Función para verificar si el documento está listo para acceder a las cookies
export const documentoListo = (): boolean => {
  return typeof document !== 'undefined' && document.readyState === 'complete';
};

// Función para esperar a que el documento esté listo
export const esperarDocumentoListo = (): Promise<void> => {
  return new Promise((resolve) => {
    if (documentoListo()) {
      resolve();
      return;
    }

    const checkReadyState = () => {
      if (documentoListo()) {
        resolve();
        document.removeEventListener('readystatechange', checkReadyState);
      }
    };

    document.addEventListener('readystatechange', checkReadyState);
  });
};

// Función para verificar si existe la cookie CiDi
export const verificarCookieCiDi = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('CiDi='));
};

// Función para obtener el valor de la cookie CiDi
export const obtenerCookieCiDi = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const cidiCookie = cookies.find(cookie => cookie.trim().startsWith('CiDi='));
  
  if (cidiCookie) {
    // Depuración
    console.log('Cookie CiDi encontrada:', cidiCookie.trim());
    return cidiCookie.trim().substring(5); // Eliminar 'CiDi='
  }
  
  console.log('Cookie CiDi no encontrada en:', document.cookie);
  return null;
};

// Función para obtener el valor de la cookie de acceso
export const obtenerCookieAcceso = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const accessCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
  
  if (accessCookie) {
    return accessCookie.trim().substring(13); // Eliminar 'access_token='
  }
  
  return null;
};

// Función para verificar si existe la cookie de acceso
export const verificarCookieAcceso = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('access_token='));
};

// Función para verificar si existe la cookie de refresco
export const verificarCookieRefresco = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => cookie.trim().startsWith('refresh_token='));
};

// Función para verificar el estado de autenticación basado en cookies
export const verificarEstadoAutenticacion = (): { cidi: boolean; accessToken: boolean; refreshToken: boolean } => {
  return {
    cidi: verificarCookieCiDi(),
    accessToken: verificarCookieAcceso(),
    refreshToken: verificarCookieRefresco()
  };
};

// Función para verificar si el usuario está autenticado y obtener sus datos
export const verificarAutenticacion = async (): Promise<Usuario | null> => {
  try {
    // Esperar a que el documento esté completamente cargado
    await esperarDocumentoListo();
    
    // Obtener el valor de la cookie CiDi
    const cidiToken = obtenerCookieCiDi();
    
    // Si no hay cookie CiDi, no intentar la autenticación
    if (!cidiToken) {
      console.log('No se encontró la cookie CiDi, no se puede autenticar');
      return null;
    }
    
    console.log('Enviando solicitud con cookie CiDi:', cidiToken.substring(0, 10) + '...');
    
    // Preparar los headers para la solicitud
    const headers: Record<string, string> = {};
    
    // Si tenemos el token CiDi, incluirlo como header
    if (cidiToken) {
      headers['CiDi'] = cidiToken;
      // También incluirlo como X-CiDi-Token según la memoria compartida
      headers['X-CiDi-Token'] = cidiToken;
    }
    
    console.log('Enviando solicitud a /api/User/obtener-usuario con headers:', headers);
    
    // Llamar directamente a la API para obtener el usuario
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
    console.error('Error al verificar autenticación:', error);
    return null;
  }
};

// Función para cerrar sesión
export const cerrarSesion = (): void => {
  if (typeof document === 'undefined') return;
  
  // Eliminar cookies de autenticación
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Redirigir a la página principal
  window.location.href = '/';
};

// URL de autenticación de CiDi
export const CIDI_AUTH_URL = 'https://cidi.test.cba.gov.ar/Cuenta/Login?app=414';

// Función para redirigir a la página de inicio de CiDi
export const redirigirACidi = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log('Redirigiendo a CiDi para autenticación...');
  // Guardar la URL actual para redirigir de vuelta después de la autenticación
  const currentUrl = window.location.href;
  localStorage.setItem('redirectAfterAuth', currentUrl);
  
  // Redirigir a CiDi
  window.location.href = CIDI_AUTH_URL;
};

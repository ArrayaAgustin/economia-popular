import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axiosClient from '@/lib/axiosClient';

// Página de prueba para verificar la comunicación con la API
const TestApiPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookiesInfo, setCookiesInfo] = useState<Record<string, string>>({});
  const [requestHeaders, setRequestHeaders] = useState<Record<string, string>>({});

  // Función para obtener y mostrar las cookies actuales
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      
      setCookiesInfo(cookies);
    }
  }, []);

  // Función para obtener datos del usuario
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Enviando solicitud a /api/User/obtener-usuario...');
      
      // Crear un interceptor temporal para capturar los headers
      const interceptorId = axiosClient.interceptors.request.use((config) => {
        setRequestHeaders(config.headers as Record<string, string>);
        return config;
      });
      
      const response = await axiosClient.get('/api/User/obtener-usuario');
      
      // Eliminar el interceptor temporal
      axiosClient.interceptors.request.eject(interceptorId);
      
      console.log('Respuesta recibida:', response.status);
      console.log('Datos:', response.data);
      
      setUserData(response.data);
    } catch (err: any) {
      console.error('Error al obtener datos del usuario:', err);
      setError(err.message || 'Error al comunicarse con la API');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <Layout title="Prueba de API">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Prueba de Comunicación con la API
          </h1>
          
          <div className="mb-6">
            <button
              onClick={fetchUserData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Obtener Datos de Usuario'}
            </button>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              Cookies Disponibles
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(cookiesInfo, null, 2)}
              </pre>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
              Headers de la Solicitud
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(requestHeaders, null, 2)}
              </pre>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          
          {userData && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Datos del Usuario
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          <div className="mt-8 border-t pt-4 text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Esta página prueba la comunicación con el backend utilizando la cookie CiDi configurada.
            </p>
            <p className="text-sm mt-2">
              Importante: Para que esto funcione, la aplicación debe ejecutarse en el dominio <code>localhost.cba.gov.ar</code> y
              el backend debe permitir solicitudes CORS desde este dominio.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestApiPage;

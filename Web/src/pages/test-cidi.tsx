import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '@/components/Layout';

const TestCidi = () => {
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cidiCookie, setCidiCookie] = useState<string | null>(null);

  // Función para obtener la cookie CiDi
  const obtenerCookieCiDi = (): string | null => {
    const cookies = document.cookie.split(';');
    const cidiCookie = cookies.find(cookie => cookie.trim().startsWith('CiDi='));
    
    if (cidiCookie) {
      return cidiCookie.trim().substring(5); // Eliminar 'CiDi='
    }
    
    return null;
  };

  // Verificar si existe la cookie CiDi al cargar la página
  useEffect(() => {
    const cookie = obtenerCookieCiDi();
    setCidiCookie(cookie);
    console.log('Cookie CiDi encontrada:', cookie);
  }, []);

  // Función para probar la autenticación con CiDi
  const probarAutenticacion = async () => {
    try {
      setError(null);
      
      // Obtener la cookie CiDi
      const cookie = obtenerCookieCiDi();
      
      if (!cookie) {
        setError('No se encontró la cookie CiDi. Por favor, inicie sesión en CiDi primero.');
        return;
      }
      
      console.log('Enviando solicitud con cookie CiDi:', cookie);
      
      // Intentar diferentes enfoques para enviar la cookie CiDi
      
      // 1. Enviar como header personalizado
      // 2. Enviar como parámetro de consulta
      // 3. Mantener withCredentials para intentar enviar cookies
      
      console.log('Cookies actuales:', document.cookie);
      
      const response = await axios.get(`https://localhost:7110/api/User/obtener-usuario?cidiToken=${encodeURIComponent(cookie)}`, {
        headers: {
          'X-CiDi-Token': cookie,
          'CiDi': cookie
        },
        withCredentials: true
      });
      
      console.log('Respuesta recibida:', response.data);
      setResultado(response.data);
    } catch (error: any) {
      console.error('Error al probar autenticación:', error);
      setError(`Error: ${error.message}`);
    }
  };

  // Función para redirigir a CiDi
  const irACidi = () => {
    window.location.href = 'https://cidi.test.cba.gov.ar/Cuenta/Login?app=414';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Prueba de Autenticación CiDi</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Estado de la Cookie CiDi</h2>
          {cidiCookie ? (
            <div className="text-green-600">
              <p>Cookie CiDi encontrada</p>
              <p className="text-sm font-mono bg-gray-200 p-2 rounded mt-2">
                {cidiCookie.substring(0, 20)}...
              </p>
            </div>
          ) : (
            <p className="text-red-600">Cookie CiDi no encontrada</p>
          )}
        </div>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={probarAutenticacion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Probar Autenticación
          </button>
          
          <button 
            onClick={irACidi}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Ir a CiDi
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {resultado && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Resultado</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestCidi;

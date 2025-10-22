import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

// URL base de la API
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'https://localhost:7110' 
  : (process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7110');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Solo permitir solicitudes GET
  if (req.method !== 'GET') {
    return res.status(405).json({ mensaje: 'Método no permitido' });
  }

  try {
    // Obtener la cookie CiDi de la solicitud
    const cidiCookie = req.cookies.CiDi;
    
    console.log('Proxy - Cookie CiDi recibida:', cidiCookie);
    
    if (!cidiCookie) {
      return res.status(401).json({ mensaje: 'No se encontró la cookie de CiDi en la solicitud' });
    }

    // Configurar el cliente Axios para la solicitud al backend
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `CiDi=${cidiCookie}`
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // Solo para desarrollo
      })
    };

    // Realizar la solicitud al backend
    console.log('Proxy - Enviando solicitud a:', `${API_URL}/api/User/obtener-usuario`);
    const response = await axios.get(`${API_URL}/api/User/obtener-usuario`, axiosConfig);
    
    console.log('Proxy - Respuesta recibida:', response.status);
    
    // Devolver la respuesta al cliente
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Proxy - Error en la solicitud:', error.message);
    
    // Devolver el error al cliente
    return res.status(error.response?.status || 500).json({
      mensaje: error.response?.data?.mensaje || 'Error al comunicarse con el servidor',
      error: error.message
    });
  }
}

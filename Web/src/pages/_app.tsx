import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect, useCallback } from 'react';
import { Usuario } from '@/lib/authService';
import { autenticarUsuario } from '@/lib/api';
import { createContext, useContext } from 'react';

// Crear contexto de autenticación
export const AuthContext = createContext<{
  usuario: Usuario | null;
  cargando: boolean;
  autenticado: boolean;
  refrescarUsuario: () => Promise<void>;
}>({
  usuario: null,
  cargando: true,
  autenticado: false,
  refrescarUsuario: async () => {}
});

// Hook para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export default function App({ Component, pageProps }: AppProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  
  // Función para refrescar los datos del usuario (memoizada)
  const refrescarUsuario = useCallback(async () => {
    try {
      setCargando(true);
      console.log('Refrescando datos del usuario...');
      // Usar la función autenticarUsuario de api.ts
      // Esta función maneja la cookie CiDi y la envía como header
      const usuarioData = await autenticarUsuario();
      console.log('Respuesta de autenticarUsuario:', usuarioData);
      if (usuarioData) {
        console.log('Usuario autenticado:', usuarioData);
        setUsuario(usuarioData);
        setAutenticado(true);
      } else {
        console.log('Usuario no autenticado');
        setUsuario(null);
        setAutenticado(false);
      }
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
    } finally {
      setCargando(false);
    }
  }, []);
  
  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    refrescarUsuario();
  }, []);
  
  return (
    <AuthContext.Provider value={{ 
      usuario, 
      cargando, 
      autenticado,
      refrescarUsuario
    }}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

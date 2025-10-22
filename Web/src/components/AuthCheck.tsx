import React, { useEffect, useState } from 'react';
import { verificarCookiesCiDi, verificarAutenticacion, Usuario, redirigirACidi } from '@/lib/authService';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children, fallback }) => {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificar = async () => {
      try {
        // Verificar si existen las cookies de CiDi
        const tieneCoookies = verificarCookiesCiDi();
        
        if (tieneCoookies) {
          // Si existen las cookies, intentamos autenticar
          const resultado = await verificarAutenticacion();
          setAutenticado(resultado.autenticado);
          setUsuario(resultado.usuario || null);
        } else {
          setAutenticado(false);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setAutenticado(false);
      } finally {
        setCargando(false);
      }
    };

    verificar();
  }, []);

  if (cargando) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!autenticado) {
    if (fallback) {
      return <>{fallback}</>;
    } else {
      // Si no hay un fallback proporcionado, mostramos un botón para iniciar sesión
      return (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col items-center">
            <p className="text-blue-700 dark:text-blue-300 font-medium mb-3">
              Necesitas iniciar sesión con CiDi para acceder a esta sección.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={redirigirACidi}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Iniciar sesión con CiDi
            </motion.button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default AuthCheck;

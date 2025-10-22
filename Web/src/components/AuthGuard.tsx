import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/pages/_app';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { autenticado, cargando } = useAuth();
  const [verificado, setVerificado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Solo verificar después de que el estado de autenticación se haya cargado
    if (!cargando) {
      // Si no está autenticado, redirigir a CiDi
      if (!autenticado) {
        console.log('Usuario no autenticado, redirigiendo a CiDi...');
        // Esperar un momento para asegurarse de que se hayan cargado las cookies
        setTimeout(() => {
          // Redirigir a CiDi directamente
          const CIDI_AUTH_URL = 'https://cidi.test.cba.gov.ar/Cuenta/Login?app=414';
          // Guardar la URL actual para redirigir de vuelta después de la autenticación
          const currentUrl = window.location.href;
          localStorage.setItem('redirectAfterAuth', currentUrl);
          // Redirigir a CiDi
          window.location.href = CIDI_AUTH_URL;
        }, 1000);
      } else {
        // Si está autenticado, marcar como verificado
        setVerificado(true);
      }
    }
  }, [autenticado, cargando, router]);

  // Mientras se está cargando o verificando, mostrar un indicador de carga
  if (cargando || !verificado) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado y verificado, mostrar el contenido
  return <>{children}</>;
};

export default AuthGuard;

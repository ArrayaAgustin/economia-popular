import { useState } from 'react';
import React from 'react';

// Interfaz para el usuario
export interface Usuario {
  cuil: string;
  nombre: string;
  apellido: string;
  rol: string;
}

// Usuario de prueba por defecto
const usuarioPrueba: Usuario = {
  cuil: '20123456789',
  nombre: 'Usuario',
  apellido: 'De Prueba',
  rol: 'Usuario'
};

// Función simplificada para verificar autenticación (siempre retorna true)
export const verificarAutenticacion = async (): Promise<boolean> => {
  return true;
};

// Hook simplificado que devuelve un usuario de prueba
export const useRequiereAutenticacion = () => {
  const [usuario] = useState<Usuario>(usuarioPrueba);
  return { 
    cargando: false, 
    autenticado: true, 
    usuario 
  };
};

// Componente HOC simplificado (solo pasa el usuario de prueba)
export function withAutenticacion(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    return React.createElement(Component, { ...props, usuario: usuarioPrueba });
  };
}

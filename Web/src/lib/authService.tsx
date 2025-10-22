import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interfaz para los datos del usuario
export interface Usuario {
  cuil: string;
  nombre: string;
  apellido: string;
  rol: string;
}

// Interfaz para el contexto de autenticación simplificado
interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
}

// Crear el contexto de autenticación
export const AuthContext = createContext<AuthContextType | null>(null);

// Usuario de prueba por defecto
const usuarioPrueba: Usuario = {
  cuil: '20123456789',
  nombre: 'Usuario',
  apellido: 'De Prueba',
  rol: 'Usuario'
};

// Proveedor de autenticación simplificado
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Usar el usuario de prueba por defecto en desarrollo
  const [usuario, setUsuario] = useState<Usuario | null>(
    process.env.NODE_ENV === 'development' ? usuarioPrueba : null
  );
  
  // Valor del contexto simplificado
  const contextValue: AuthContextType = {
    usuario,
    setUsuario
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

// Exportar el contexto de autenticación para su uso en toda la aplicación
export default AuthContext;

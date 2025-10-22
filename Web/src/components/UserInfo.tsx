import React from 'react';
import { motion } from 'framer-motion';
import { Usuario } from '@/lib/authService';

interface UserInfoProps {
  usuario: Usuario;
}

const UserInfo: React.FC<UserInfoProps> = ({ usuario }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center mb-3">
        <div className="bg-primary-600 dark:bg-primary-500 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Información del Usuario
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">Nombre completo</span>
          <span className="font-medium text-gray-800 dark:text-white">{usuario.nombre} {usuario.apellido}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">CUIL</span>
          <span className="font-medium text-gray-800 dark:text-white">{usuario.cuil}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-gray-400">Rol</span>
          <motion.span 
            className={`font-medium ${
              usuario.rol === 'ADMIN' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-green-600 dark:text-green-400'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {usuario.rol}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default UserInfo;

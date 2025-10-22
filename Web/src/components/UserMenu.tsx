import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/pages/_app';
import { cerrarSesionCompleta } from '@/lib/api';

function getInitials(nombre?: string, apellido?: string) {
  if (!nombre && !apellido) return '';
  const n = nombre ? nombre[0].toUpperCase() : '';
  const a = apellido ? apellido[0].toUpperCase() : '';
  return n + a;
}

const UserMenu: React.FC = () => {
  const { usuario } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!usuario) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-700/80 hover:bg-primary-800 transition-colors shadow text-white focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Información de usuario"
      >
        <span className="flex items-center justify-center h-8 w-8 rounded-full bg-white/20 font-bold text-lg uppercase border border-primary-200">
          {getInitials(usuario.nombre, usuario.apellido)}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4"
          >
            <div className="flex items-center mb-3 gap-3">
              <span className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-700 text-white font-bold text-xl uppercase border border-primary-200">
                {getInitials(usuario.nombre, usuario.apellido)}
              </span>
              <div>
                <div className="font-semibold text-gray-800 dark:text-white text-base">
                  {usuario.nombre} {usuario.apellido}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{usuario.rol}</div>
              </div>
            </div>
            <div className="mb-2 text-sm text-gray-700 dark:text-gray-200">
              <span className="font-medium">CUIL:</span> {usuario.cuil}
            </div>
            <div className="mb-2 text-sm text-gray-700 dark:text-gray-200">
              <span className="font-medium">Email:</span> {'No disponible'}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={async () => {
                  try {
                    const { logoutUrl } = await cerrarSesionCompleta();
                    window.location.href = logoutUrl;
                  } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                  }
                }}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;

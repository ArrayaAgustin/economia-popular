import React, { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import ChatBot from './ChatBot';
import UserMenu from './UserMenu';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'Economía Popular - Gobierno de Córdoba' }) => {
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Iniciando aplicación');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    // Establecer el enlace activo basado en la URL actual
    setActiveLink(window.location.pathname);
    
    // Mensajes de carga para mostrar durante la animación
    const loadingMessages = [
      'Iniciando aplicación',
      'Cargando recursos',
      'Preparando formularios',
      'Casi listo...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 400);
    
    // Reducir el tiempo de carga a 800ms
    const timer = setTimeout(() => {
      clearInterval(messageInterval);
      setLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      clearInterval(messageInterval);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Sistema de Registro para Economía Popular - Gobierno de Córdoba" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <AnimatePresence>
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
              className="flex flex-col items-center"
            >
              <img src="/images/logo (1).jpg" alt="Logo Gobierno de Córdoba" className="h-24 mb-4 rounded-md" />
              <motion.div 
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="h-1 bg-primary-600 dark:bg-primary-400 rounded-full"
                style={{ width: '150px' }}
              />
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mt-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                {loadingText}
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            {/* Navbar moderno */}
            <header className="bg-gradient-to-r from-primary-800 to-primary-900 dark:bg-gray-900 dark:bg-opacity-95 text-white shadow-lg sticky top-0 z-40 backdrop-blur-sm">
              <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                  {/* Logo y título */}
                  <motion.div 
                    className="flex items-center space-x-3 flex-shrink-0"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <img src="/images/logo (1).jpg" alt="Logo Gobierno de Córdoba" className="h-12 rounded-md shadow-md hidden xs:block" />
                    <div>
                      <h1 className="text-xl font-bold truncate">Economía Popular</h1>
                      <p className="text-xs text-primary-100 truncate md:whitespace-normal">Ministerio de Desarrollo Social</p>
                    </div>
                  </motion.div>
                  
                  {/* Navegación escritorio */}
                  <motion.nav
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="hidden md:block"
                  >
                    <ul className="flex space-x-1">
                      <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          href="/" 
                          className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-all duration-200 ${
                            activeLink === '/' 
                              ? 'bg-white/20 text-white font-medium' 
                              : 'hover:bg-white/10 text-white/90 hover:text-white'
                          }`}
                          onClick={() => setActiveLink('/')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Inicio</span>
                        </Link>
                      </motion.li>
                      <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          href="/reprotep-introduccion" 
                          className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-all duration-200 ${
                            activeLink === '/reprotep-introduccion' || activeLink === '/formulario-persona' 
                              ? 'bg-white/20 text-white font-medium' 
                              : 'hover:bg-white/10 text-white/90 hover:text-white'
                          }`}
                          onClick={() => setActiveLink('/reprotep-introduccion')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Registro Personal</span>
                        </Link>
                      </motion.li>
                      <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link 
                          href="/formulario-organizacion" 
                          className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-all duration-200 ${
                            activeLink === '/formulario-organizacion' 
                              ? 'bg-white/20 text-white font-medium' 
                              : 'hover:bg-white/10 text-white/90 hover:text-white'
                          }`}
                          onClick={() => setActiveLink('/formulario-organizacion')}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Registro Organización</span>
                        </Link>
                      </motion.li>
                    </ul>
                  </motion.nav>
                  
                  <div className="flex items-center space-x-3 md:space-x-4 ml-auto">
                    <UserMenu />
                    <ThemeToggle />
                    
                    {/* Botón menú móvil */}
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMobileMenu}
                      className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 focus:outline-none transition-colors"
                      aria-label="Menú"
                    >
                      {mobileMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
              
              {/* Menú móvil desplegable */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-primary-800 dark:bg-primary-950 overflow-hidden"
                  >
                    <div className="container mx-auto px-4 py-3">
                      <ul className="space-y-2">
                        <motion.li 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link 
                            href="/" 
                            className={`flex items-center space-x-3 p-3 rounded-md ${
                              activeLink === '/' 
                                ? 'bg-white/20 text-white' 
                                : 'hover:bg-white/10'
                            }`}
                            onClick={() => {
                              setActiveLink('/');
                              setMobileMenuOpen(false);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Inicio</span>
                          </Link>
                        </motion.li>
                        <motion.li 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link 
                            href="/formulario-persona" 
                            className={`flex items-center space-x-3 p-3 rounded-md ${
                              activeLink === '/formulario-persona' 
                                ? 'bg-white/20 text-white' 
                                : 'hover:bg-white/10'
                            }`}
                            onClick={() => {
                              setActiveLink('/formulario-persona');
                              setMobileMenuOpen(false);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Registro Personal</span>
                          </Link>
                        </motion.li>
                        <motion.li 
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link 
                            href="/formulario-organizacion" 
                            className={`flex items-center space-x-3 p-3 rounded-md ${
                              activeLink === '/formulario-organizacion' 
                                ? 'bg-white/20 text-white' 
                                : 'hover:bg-white/10'
                            }`}
                            onClick={() => {
                              setActiveLink('/formulario-organizacion');
                              setMobileMenuOpen(false);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>Registro Organización</span>
                          </Link>
                        </motion.li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>
            
            <main className="flex-grow container mx-auto px-4 py-6">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {children}
              </motion.div>
              <ChatBot />
            </main>
            
            <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-6 mt-auto">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <img src="/images/logo (1).jpg" alt="Logo Gobierno de Córdoba" className="h-10 rounded-md mr-3" />
                    <div>
                      <p className="font-bold">Ministerio de Desarrollo Social</p>
                      <p className="text-sm">Gobierno de Córdoba</p>
                    </div>
                  </div>
                  <div className="text-sm text-center md:text-right">
                    <p>&copy; {new Date().getFullYear()} Gobierno de Córdoba. Todos los derechos reservados.</p>
                    <p className="mt-1">Programa de Economía Popular</p>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Layout;

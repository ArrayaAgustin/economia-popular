import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AuthGuard from '@/components/AuthGuard';

const ReprotepIntroduccion = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Referencias para detectar elementos visibles para animaciones
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [carouselRef, carouselInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [buttonRef, buttonInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Auto avance del carrusel cada 6 segundos si autoPlay está activo
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleContinuar = () => {
    router.push('/formulario-persona');
  };
  
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setAutoPlay(false); // Detener autoplay cuando el usuario interactúa manualmente
  };
  
  // Datos de las pestañas
  const tabs = [
    {
      id: 'dirigido',
      title: '¿A quién está dirigido?',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      color: 'blue',
      content: (
        <div>
          <p className="mb-4 text-gray-700 dark:text-white">Este registro está dirigido a aquellos que realicen actividades en el marco de la economía popular, en las siguientes ramas:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Agricultura familiar</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Comercio popular</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Construcción e infraestructura</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Mejoramiento ambiental</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Industria manufacturera</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Reciclado y servicios ambientales</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Servicios personales</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Sociocomunitaria</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-blue-500 dark:text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-white">Transporte y almacenamiento</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'requisitos',
      title: 'Requisitos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      color: 'green',
      content: (
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-gray-700 rounded-full p-2 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-white">Edad</h3>
              <p className="text-gray-700 dark:text-white">Ser mayor de 18 años.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-gray-700 rounded-full p-2 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-white">Actividad</h3>
              <p className="text-gray-700 dark:text-white">Trabajar en la economía popular.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-gray-700 rounded-full p-2 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 dark:text-white">Nacionalidad</h3>
              <p className="text-gray-700 dark:text-white">Ser argentino –nativo, naturalizado, o por opción– o extranjero con residencia permanente o temporaria.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'incompatibilidades',
      title: 'Incompatibilidades',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: 'amber',
      content: (
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 dark:text-white mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700 dark:text-white">Ser titular de más de 2 inmuebles.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 dark:text-white mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700 dark:text-white">Ser titular de más de 3 automóviles. No se contemplan motos.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 dark:text-white mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700 dark:text-white">En ambos casos -inmuebles y automóviles- 1 de dichos bienes debe estar afectado al emprendimiento.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 dark:text-white mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700 dark:text-white">Si además trabajás en relación de dependencia, el salario no puede superar los dos Salarios Mínimo, Vital y Móvil.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 dark:text-white mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700 dark:text-white">No tributar ganancias ni bienes personales.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-amber-500 dark:text-white mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700 dark:text-white">Si estás inscripto como monotributista, solo se admiten categorías A, B, C y D o Monotributo Social.</span>
          </li>
        </ul>
      ),
    },
  ];

  return (
    <Layout title="Introducción REPROTEP">
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
        {/* Header con animación de entrada */}
        <motion.div 
          ref={headerRef}
          initial={{ opacity: 0, y: -30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 dark:text-primary-300 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
              REGISTRO PROVINCIAL DE TRABAJADORES/AS DE LA ECONOMÍA SOCIAL/POPULAR
            </span>
          </h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={headerInView ? { width: "200px" } : { width: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-primary-500 to-blue-500 mx-auto mb-6 rounded-full"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Los trabajadores de la economía popular son protagonistas del desarrollo de nuestro país. 
            Este registro busca reconocer, formalizar y garantizar sus derechos y acompañarlos 
            para que puedan potenciar su trabajo.
          </motion.p>
        </motion.div>

        {/* Contenedor principal con efecto de desvanecimiento */}
        <motion.div 
          ref={contentRef}
          initial={{ opacity: 0, y: 40 }}
          animate={contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          {/* Contenido principal */}
          <div className="p-6 md:p-10">
            {/* Pestañas de navegación */}
            <div ref={carouselRef} className="mb-8">
              {/* Barra de navegación de pestañas */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  {tabs.map((tab, index) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => handleTabChange(index)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm md:text-base font-medium transition-all ${
                        activeTab === index 
                          ? `bg-white dark:bg-gray-800 text-${tab.color}-600 dark:text-${tab.color}-400 shadow-sm` 
                          : `text-gray-600 dark:text-gray-300 hover:text-${tab.color}-500 dark:hover:text-${tab.color}-400`
                      }`}
                      whileHover={{ scale: activeTab === index ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={`text-${tab.color}-500 dark:text-${tab.color}-400`}>
                        {tab.icon}
                      </span>
                      <span>{tab.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              {/* Indicadores de progreso */}
              <div className="flex justify-center space-x-2 mb-6">
                {tabs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabChange(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeTab === index 
                        ? `bg-${tabs[activeTab].color}-500 w-8` 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Ver sección ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Contenido del carrusel */}
              <div className="relative min-h-[250px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center mb-4">
                      <div className={`bg-${tabs[activeTab].color}-100 dark:bg-gray-700 p-3 rounded-full mr-3`}>
                        <div className="text-primary-600 dark:text-white">
                          {tabs[activeTab].icon}
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {tabs[activeTab].title}
                      </h2>
                    </div>
                    
                    {tabs[activeTab].content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mensaje informativo con animación */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border-l-4 border-primary-500 mb-10 shadow-sm"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-800 dark:text-white font-medium">
                  Si cumplís con los requisitos, completá el formulario de inscripción haciendo clic en el botón de abajo.
                </p>
              </div>
            </motion.div>

            {/* Botón de continuar con animación mejorada */}
            <motion.div 
              ref={buttonRef}
              initial={{ opacity: 0, y: 20 }}
              animate={buttonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex justify-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinuar}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg transition duration-300 flex items-center group"
              >
                <span className="mr-2">Continuar al formulario</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const ReprotepIntroduccionWithAuth = () => (
  <AuthGuard>
    <ReprotepIntroduccion />
  </AuthGuard>
);

export default ReprotepIntroduccionWithAuth;

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import AnimatedBanner from '@/components/AnimatedBanner';
import AnimatedAdBanner from '@/components/AnimatedAdBanner';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AuthCheck from '@/components/AuthCheck';
import { Usuario } from '@/lib/authService';
import UserInfo from '@/components/UserInfo';
import { useAuth } from './_app';

export default function Home() {
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ref3, inView3] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Usar el contexto de autenticación con la función para refrescar datos
  const { usuario, cargando, refrescarUsuario } = useAuth();

  // Estados para la animación y mensajes de error
  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);

  // Efecto para verificar la autenticación cuando se carga la página
  // Esto es útil cuando el usuario regresa después de autenticarse con CiDi
  useEffect(() => {
    // Eliminar logs de depuración de cookies
    const allCookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    // (sin logs)
    const cookieCheck = {
      CiDi: document.cookie.includes('CiDi='),
      '.AUTHCOOKIE': document.cookie.includes('.AUTHCOOKIE=')
    };
    // (sin logs)
    const verificarAuth = async () => {
      try {
        await refrescarUsuario();
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        setErrorMensaje('Error al verificar la autenticación. Inténtelo de nuevo.');
      }
    };

    verificarAuth();
  }, [refrescarUsuario]);

  const handleLoginClick = () => {
    // Redirigir a la página de inicio de sesión de CiDi
    window.location.href = 'https://cidi.test.cba.gov.ar/Cuenta/Login?app=414';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-8">
        {/* Contenido principal */}
        <div className="w-full lg:w-5/6 max-w-6xl mx-auto">
          {/* Banner principal animado */}
          <AnimatedBanner />
          
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif font-bold text-blue-900 dark:text-primary-300 text-center mb-4"
            >
              Registro de Economía Popular
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="max-w-2xl mx-auto text-base md:text-lg text-center text-gray-700 dark:text-gray-200 leading-relaxed"
            >
              Bienvenido al sistema de registro para la Economía Popular de la Provincia de Córdoba.<br />
              Este portal le permite registrarse como persona o como organización para acceder a los beneficios y programas disponibles.
            </motion.p>
          </div>
          
          {/* Estado de autenticación (removido, ahora va en el navbar) */}
          
          {/* Tarjetas de registro con animación */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/40 p-6 rounded-xl border border-primary-200 dark:border-primary-700 shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 dark:bg-primary-500 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-300">Registro Personal</h2>
              </div>
              
              <p className="mb-6 text-primary-700 dark:text-primary-200">
                Si usted es una persona que trabaja en el ámbito de la economía popular, 
                regístrese aquí para acceder a programas de apoyo, capacitación y financiamiento.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href="/reprotep-introduccion" className="btn-primary inline-block w-full text-center py-3">
                  Registrarme como Persona
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/40 dark:to-secondary-800/40 p-6 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="flex items-center mb-4">
                <div className="bg-secondary-700 dark:bg-secondary-600 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-300">Registro de Organización</h2>
              </div>
              
              <p className="mb-6 text-secondary-700 dark:text-secondary-200">
                Si representa una cooperativa, asociación, fundación u otra organización 
                del ámbito de la economía popular, regístrese aquí.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href="/formulario-organizacion" className="btn-secondary inline-block w-full text-center py-3">
                  Registrar Organización
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Sección informativa con animación al hacer scroll */}
          <motion.div 
            ref={ref1}
            initial="hidden"
            animate={inView1 ? "visible" : "hidden"}
            variants={containerVariants}
            className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 mb-8"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ¿Qué es la Economía Popular?
            </motion.h3>
            
            <motion.p variants={itemVariants} className="dark:text-blue-100">
              La Economía Popular comprende actividades económicas y prácticas sociales desarrolladas 
              por sectores populares con el objetivo de garantizar la satisfacción de sus necesidades 
              básicas, tanto materiales como inmateriales.
            </motion.p>
          </motion.div>
          
          {/* Beneficios con animación al hacer scroll */}
          <motion.div 
            ref={ref2}
            initial="hidden"
            animate={inView2 ? "visible" : "hidden"}
            variants={containerVariants}
            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Beneficios del Registro
            </motion.h3>
            
            <motion.ul variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5 dark:text-green-100">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Acceso a programas de capacitación y formación</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Posibilidades de financiamiento para proyectos</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Asesoramiento técnico y legal</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Participación en ferias y eventos</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Vinculación con otras organizaciones del sector</span>
              </li>
            </motion.ul>
          </motion.div>
          
          
          {/* Estadísticas animadas */}
          <motion.div 
            ref={ref3}
            initial="hidden"
            animate={inView3 ? "visible" : "hidden"}
            variants={containerVariants}
            className="bg-gradient-to-br from-primary-700 to-secondary-800 dark:from-primary-800 dark:to-secondary-900 text-white p-6 rounded-xl shadow-xl mb-8"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl font-semibold mb-6 text-center"
            >
              Impacto del Programa de Economía Popular
            </motion.h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">+5.000</div>
                <div className="text-primary-200 text-sm md:text-base">Personas Registradas</div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">+800</div>
                <div className="text-primary-200 text-sm md:text-base">Organizaciones</div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">+120</div>
                <div className="text-primary-200 text-sm md:text-base">Proyectos Financiados</div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">+50</div>
                <div className="text-primary-200 text-sm md:text-base">Capacitaciones</div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Llamado a la acción final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold mb-4 dark:text-white">¿Listo para formar parte?</h3>
            <p className="mb-6 dark:text-gray-300">Únase hoy al programa de Economía Popular y acceda a todos los beneficios</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/formulario-persona" className="btn-primary py-3 px-6 block sm:inline-block">
                  Registro Personal
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/formulario-organizacion" className="btn-secondary py-3 px-6 block sm:inline-block">
                  Registro Organización
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
        

      </div>
      {/* Banner de publicidad derecho eliminado */}
    </Layout>
  );
}

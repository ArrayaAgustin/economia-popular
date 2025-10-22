import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Ad = {
  title: string;
  description: string;
  cta: string;
  color: string;
  icon: React.ReactNode;
};

const ads: Ad[] = [
  {
    title: "Financiamiento para Emprendedores",
    description: "Hasta $500.000 para tu proyecto de economía popular",
    cta: "Solicitar ahora",
    color: "from-blue-500 to-indigo-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Capacitación Gratuita",
    description: "Cursos de marketing digital para tu emprendimiento",
    cta: "Inscribirse",
    color: "from-green-500 to-emerald-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    )
  },
  {
    title: "Feria de Economía Popular",
    description: "Participa con tu stand en la próxima feria provincial",
    cta: "Reservar espacio",
    color: "from-orange-500 to-red-600",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

const AnimatedAdBanner: React.FC = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Cambiar cada 5 segundos
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full w-full overflow-hidden rounded-lg shadow-lg">
      <AnimatePresence mode="wait">
        {ads.map((ad, index) => (
          index === currentAdIndex && (
            <motion.div
              key={index}
              className={`h-full w-full bg-gradient-to-br ${ad.color} text-white p-4 flex flex-col`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-3">
                <div className="bg-white/20 p-2 rounded-full mr-3">
                  {ad.icon}
                </div>
                <motion.h3 
                  className="text-lg font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {ad.title}
                </motion.h3>
              </div>
              
              <motion.p 
                className="text-sm mb-4 flex-grow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {ad.description}
              </motion.p>
              
              <motion.button
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg self-start hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {ad.cta}
              </motion.button>
              
              {/* Indicadores de posición */}
              <div className="flex justify-center mt-4 space-x-1">
                {ads.map((_, dotIndex) => (
                  <motion.div
                    key={dotIndex}
                    className={`h-1.5 rounded-full ${
                      dotIndex === currentAdIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + dotIndex * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedAdBanner;

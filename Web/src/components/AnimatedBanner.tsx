import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedBanner: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={bannerVariants}
      className="relative overflow-hidden rounded-xl shadow-2xl mb-12"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-700/80 to-secondary-800/80 z-10" />
      
      <img 
        src="/images/centro-civico.jpg" 
        alt="Centro Cívico de Córdoba" 
        className="w-full h-[400px] object-cover"
      />
      
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-8 md:p-12">
        <motion.h2 
          custom={0}
          variants={textVariants}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Programa de Economía Popular
        </motion.h2>
        
        <motion.p 
          custom={1}
          variants={textVariants}
          className="text-lg md:text-xl text-white mb-6 max-w-2xl"
        >
          Impulsando el desarrollo económico inclusivo y sostenible para todos los cordobeses
        </motion.p>
        
        <motion.div 
          custom={2}
          variants={textVariants}
          className="text-white mb-8"
        >
          <ul className="list-disc pl-5 space-y-1">
            <li>Apoyo financiero para emprendimientos</li>
            <li>Capacitación técnica y profesional</li>
            <li>Acceso a mercados y comercialización</li>
            <li>Asesoramiento legal y contable</li>
          </ul>
        </motion.div>
        
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap={{ scale: 0.95 }}
          className="bg-white text-primary-700 font-bold py-3 px-6 rounded-full shadow-lg"
        >
          Conoce más sobre el programa
        </motion.button>
      </div>
      
      {/* Elementos decorativos animados */}
      <motion.div 
        className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-primary-300/30 z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute top-8 right-12 w-12 h-12 rounded-full bg-secondary-400/20 z-10"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </motion.div>
  );
};

export default AnimatedBanner;

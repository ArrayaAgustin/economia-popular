import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Tipos para las noticias y eventos
type NewsItem = {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  category: 'news' | 'event';
};

// Datos de ejemplo
const sampleData: NewsItem[] = [
  {
    id: 1,
    title: 'Lanzamiento del Programa de Economía Popular',
    date: '2025-03-15',
    description: 'El Gobierno de Córdoba lanza oficialmente el Programa de Economía Popular para apoyar a emprendedores y organizaciones sociales.',
    imageUrl: '/images/R.jpg',
    category: 'news'
  },
  {
    id: 2,
    title: 'Taller de Capacitación: Herramientas Digitales',
    date: '2025-04-10',
    description: 'Participa de nuestro taller gratuito donde aprenderás a utilizar herramientas digitales para potenciar tu emprendimiento.',
    imageUrl: '/images/R.jpg',
    category: 'event'
  },
  {
    id: 3,
    title: 'Nuevas líneas de financiamiento disponibles',
    date: '2025-03-28',
    description: 'Se han habilitado nuevas líneas de financiamiento para proyectos de economía popular con tasas preferenciales.',
    imageUrl: '/images/R.jpg',
    category: 'news'
  },
  {
    id: 4,
    title: 'Feria de Emprendedores de Economía Popular',
    date: '2025-04-25',
    description: 'Gran feria de emprendedores en el Parque de las Naciones. Inscripciones abiertas para participar con tu stand.',
    imageUrl: '/images/R.jpg',
    category: 'event'
  }
];

// Función para formatear la fecha
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-AR', options);
};

const NewsEvents: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'news' | 'event'>('all');
  const [filteredItems, setFilteredItems] = useState<NewsItem[]>(sampleData);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Efecto para filtrar los elementos
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredItems(sampleData);
    } else {
      setFilteredItems(sampleData.filter(item => item.category === activeFilter));
    }
  }, [activeFilter]);

  // Variantes para las animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
          ref={ref}
        >
          <h2 className="text-3xl font-bold text-primary-700 dark:text-primary-400 mb-2">Noticias y Eventos</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Mantente informado sobre las últimas novedades y próximos eventos del Programa de Economía Popular
          </p>
          
          {/* Filtros */}
          <div className="flex justify-center mt-6 space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('news')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'news' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Noticias
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter('event')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'event' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              Eventos
            </motion.button>
          </div>
        </motion.div>
        
        {/* Tarjetas de noticias y eventos */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                  {item.category === 'news' ? 'Noticia' : 'Evento'}
                </div>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/R.jpg'; // Imagen por defecto si falla la carga
                  }}
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {formatDate(item.date)}
                </p>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                  {item.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-primary-600 dark:text-primary-400 font-medium text-sm inline-flex items-center"
                >
                  Leer más
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Botón para ver más */}
        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-full inline-flex items-center"
          >
            Ver todas las noticias
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;

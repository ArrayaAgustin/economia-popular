import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

const Custom404: React.FC = () => {
  const router = useRouter();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 dark:text-white">Página no encontrada</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-md"
          >
            Volver al inicio
          </button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Custom404;

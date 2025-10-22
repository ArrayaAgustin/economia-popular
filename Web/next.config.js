/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  // Habilita la exportación estática
  distDir: 'out',    // Directorio donde se generarán los archivos estáticos
  images: {
    unoptimized: true, // Necesario para exportación estática
  },
  // Configuración para proxy en desarrollo (apuntando a tu API)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Ajusta el puerto según tu API
      },
    ];
  },
};

module.exports = nextConfig;

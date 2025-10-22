using System;
using Api.CIDI;
using Api.Interfaces.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Api.Services
{
    public class CacheService : ICacheService
    {
        private readonly IMemoryCache _cache;
        private readonly ILogger<CacheService> _logger;
        
        // Opciones de caché para usuarios (5-6 horas)
        private readonly MemoryCacheEntryOptions _userCacheOptions;
        
        // Opciones de caché para datos estáticos (24 horas)
        private readonly MemoryCacheEntryOptions _staticDataCacheOptions;

        public CacheService(IMemoryCache cache, ILogger<CacheService> logger)
        {
            _cache = cache;
            _logger = logger;
            
            // Configuración para datos de usuarios (6 horas)
            _userCacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(6))
                .SetSlidingExpiration(TimeSpan.FromHours(1)); // Extiende tiempo si se usa
            
            // Configuración para datos estáticos/catálogos (24 horas)
            _staticDataCacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(TimeSpan.FromHours(24));
        }

        /// <summary>
        /// Obtiene un usuario CIDI del caché
        /// </summary>
        public UsuarioCidi GetUsuarioCidi(string cuil)
        {
            string key = $"usuario_cidi_{cuil}";
            if (_cache.TryGetValue(key, out UsuarioCidi usuario))
            {
                _logger.LogInformation($"Caché HIT: Datos de usuario {cuil} obtenidos desde caché");
                return usuario;
            }
            
            _logger.LogInformation($"Caché MISS: No se encontraron datos para usuario {cuil} en caché");
            return null;
        }

        /// <summary>
        /// Guarda un usuario CIDI en el caché
        /// </summary>
        public void SetUsuarioCidi(string cuil, UsuarioCidi usuario)
        {
            string key = $"usuario_cidi_{cuil}";
            _cache.Set(key, usuario, _userCacheOptions);
            _logger.LogInformation($"Almacenados datos de usuario {cuil} en caché (expiración: 6 horas)");
        }
        
        /// <summary>
        /// Elimina todos los datos de un usuario del caché por CUIL
        /// </summary>
        public void RemoveUsuarioCidi(string cuil)
        {
            if (string.IsNullOrEmpty(cuil))
            {
                _logger.LogWarning("Intento de eliminar usuario del caché con CUIL nulo o vacío");
                return;
            }
            
            string key = $"usuario_cidi_{cuil}";
            _cache.Remove(key);
            _logger.LogInformation($"Datos del usuario {cuil} eliminados del caché");
        }

        /// <summary>
        /// Obtiene datos del caché por clave
        /// </summary>
        public T GetData<T>(string key) where T : class
        {
            if (_cache.TryGetValue(key, out T data))
            {
                _logger.LogInformation($"Caché HIT: Datos de '{key}' obtenidos desde caché");
                return data;
            }
            
            _logger.LogInformation($"Caché MISS: No se encontraron datos para '{key}' en caché");
            return null;
        }

        /// <summary>
        /// Almacena datos en el caché
        /// </summary>
        public void SetData<T>(string key, T data, bool isStatic = false) where T : class
        {
            if (data == null || string.IsNullOrEmpty(key))
            {
                _logger.LogWarning("Intento de guardar datos nulos o con clave vacía en caché");
                return;
            }
            
            var options = isStatic ? _staticDataCacheOptions : _userCacheOptions;
            _cache.Set(key, data, options);
            
            string duracion = isStatic ? "24 horas" : "6 horas";
            _logger.LogInformation($"Almacenados datos de '{key}' en caché (expiración: {duracion})");
        }

        /// <summary>
        /// Elimina un elemento del caché
        /// </summary>
        public void RemoveData(string key)
        {
            _cache.Remove(key);
            _logger.LogInformation($"Eliminados datos de '{key}' del caché");
        }
    }
}

using System.Threading.Tasks;
using Api.CIDI;
using Api.Interfaces.Repositories;
using Api.Interfaces.Services;
using Api.Domain.Results;
using Microsoft.AspNetCore.Http;
using Api.Config; // Para TokenHelper
using System.Collections.Concurrent;
using Microsoft.Extensions.Logging;

namespace Api.Services
{
    public class UserService : IUserService
    {
        private readonly CidiClient _cidiClient;
        private readonly IUserRepository _userRepository;
        private readonly TokenHelper _tokenHelper;
        private readonly ICacheService _cacheService;
        private readonly ILogger<UserService> _logger;
        
        // Diccionario que maneja las promesas en curso para evitar múltiples llamadas simultáneas
        private static readonly ConcurrentDictionary<string, Task<UsuarioCidi>> _pendingCidiRequests = new();

        public UserService(CidiClient cidiClient, IUserRepository userRepository, TokenHelper tokenHelper, 
                        ICacheService cacheService, ILogger<UserService> logger)
        {
            _cidiClient = cidiClient;
            _userRepository = userRepository;
            _tokenHelper = tokenHelper;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<UsuarioResponse> ObtenerUsuario(HttpContext httpContext)
        {
            // Depuración: Registrar todas las cookies recibidas en el servicio
            Console.WriteLine("[DEBUG-SERVICE] Cookies recibidas en UserService.ObtenerUsuario:");
            foreach (var cookie in httpContext.Request.Cookies)
            {
                Console.WriteLine($"[DEBUG-SERVICE] Cookie: {cookie.Key} = {cookie.Value.Substring(0, Math.Min(cookie.Value.Length, 10))}...");
            }
            
            // Intentar obtener la cookie CiDi de diferentes fuentes
            var cookieHash = httpContext.Request.Cookies["CiDi"];
            var headerCidi = httpContext.Request.Headers["CiDi"].FirstOrDefault();
            var xCidiToken = httpContext.Request.Headers["X-CiDi-Token"].FirstOrDefault();
            var itemCidi = httpContext.Items["CiDi"] as string;
            
            // Usar cualquier fuente disponible de la cookie CiDi
            var cidiValue = cookieHash ?? headerCidi ?? xCidiToken ?? itemCidi;
            
            Console.WriteLine($"[DEBUG-SERVICE] Cookie CiDi: {(cookieHash != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG-SERVICE] Header CiDi: {(headerCidi != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG-SERVICE] Header X-CiDi-Token: {(xCidiToken != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG-SERVICE] HttpContext.Items CiDi: {(itemCidi != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG-SERVICE] Valor final de CiDi: {(cidiValue != null ? "Presente" : "Ausente")}");
            
            // Si se encontró el valor en X-CiDi-Token, mostrarlo para depuración
            if (xCidiToken != null) {
                Console.WriteLine($"[DEBUG-SERVICE] Valor de X-CiDi-Token: {xCidiToken.Substring(0, Math.Min(xCidiToken.Length, 20))}...");
            }
            
            // Actualizar cookieHash con el valor encontrado
            cookieHash = cidiValue;
            
            var accessToken = httpContext.Request.Cookies["access_token"];
            var refreshToken = httpContext.Request.Cookies["refresh_token"];

            // 🔹 1️⃣ Si existe un `access_token`, extraer usuario directamente
            if (!string.IsNullOrEmpty(accessToken))
            {
                return _tokenHelper.ExtractUserFromToken(accessToken);
            }

            // 🔹 2️⃣ Si no hay `access_token`, pero sí `refresh_token`, generar uno nuevo
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var (newAccessToken, newRefreshToken) = await _tokenHelper.RefreshAccessTokenAsync(refreshToken);
                if (!string.IsNullOrEmpty(newAccessToken))
                {
                    httpContext.Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict
                    });

                    if (!string.IsNullOrEmpty(newRefreshToken))
                    {
                        httpContext.Response.Cookies.Append("refresh_token", newRefreshToken, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            SameSite = SameSiteMode.Strict
                        });
                    }

                    return _tokenHelper.ExtractUserFromToken(newAccessToken);
                }
            }

            // 💺 3⃣ Si no hay `access_token` ni `refresh_token`, intentar con `CiDi`
            if (!string.IsNullOrEmpty(cookieHash))
            {
                _logger.LogInformation($"Intentando autenticar con cookie CiDi: {cookieHash.Substring(0, Math.Min(cookieHash.Length, 10))}...");
                
                UsuarioCidi usuarioCidi;
                try {
                    // Intentar obtener el usuario CiDi desde caché o API (con gestión de promesas compartidas)
                    usuarioCidi = await ObtenerUsuarioCidiAsync(cookieHash);
                    
                    if (usuarioCidi == null) {
                        _logger.LogError("La API de CiDi devolvió null");
                        return null;
                    }
                    
                    _logger.LogInformation($"Usuario CiDi obtenido: {usuarioCidi.Nombre} {usuarioCidi.Apellido}, CUIL: {usuarioCidi.CUIL}");
                } catch (Exception ex) {
                    _logger.LogError(ex, $"Error al llamar a la API de CiDi: {ex.Message}");
                    return null;
                }

                // 🔹 Buscar en la base de datos
                var usuarioDb = await _userRepository.ObtenerUsuarioPorCuil(usuarioCidi.CUIL);

                // 🔹 Si el usuario no está en la DB, devolverlo con rol "USUARIO"
                var usuario = new UsuarioResponse
                {
                    CUIL = usuarioCidi.CUIL,
                    Nombre = usuarioCidi.Nombre,
                    Apellido = usuarioCidi.Apellido,
                    Rol = usuarioDb?.IdRolNavigation?.Rol ?? "USUARIO" // 🔥 Asigna "USUARIO" si no existe en la DB
                };

                // 🔹 Generar `access_token` y `refresh_token`
                var (newAccessToken, newRefreshToken) = await _tokenHelper.GenerateTokensAsync(usuario);

                httpContext.Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

                httpContext.Response.Cookies.Append("refresh_token", newRefreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });

                return usuario;
            }

            // 🔹 4️⃣ Si no se pudo autenticar de ninguna forma, eliminar cookies y retornar `null`
            httpContext.Response.Cookies.Delete("access_token");
            httpContext.Response.Cookies.Delete("refresh_token");
            return null;
        }


        public async Task<List<UsuarioResponse>> ListarUsuarios()
        {
            var usuariosDb = await _userRepository.ObtenerTodosLosUsuarios();
            var usuarios = new List<UsuarioResponse>();

            foreach (var usuario in usuariosDb)
            {
                usuarios.Add(new UsuarioResponse
                {
                    CUIL = usuario.Cuil,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    Rol = usuario.IdRolNavigation?.Rol ?? "USUARIO"
                });
            }

            return usuarios;
        }
        
        /// <summary>
        /// Obtiene los datos completos del usuario, incluyendo toda la información de CiDi
        /// Utiliza caché para mejorar el rendimiento
        /// </summary>
        public async Task<UsuarioCompletoResponse> ObtenerUsuarioCompleto(HttpContext httpContext)
        {
            _logger.LogInformation("Iniciando obtención de datos completos del usuario (con caché)");
            
            // Obtener primero la información básica usando el flujo normal del método ObtenerUsuario
            // Esto ya maneja todas las opciones de autenticación (token, cookie, etc.)
            var usuarioBasico = await ObtenerUsuario(httpContext);
            if (usuarioBasico == null)
            {
                _logger.LogWarning("No se pudo autenticar al usuario");
                return null; // No autenticado
            }
            
            _logger.LogInformation($"Usuario autenticado: {usuarioBasico.CUIL}");
            
            // Buscar datos completos en caché primero usando el CUIL
            var usuarioCidi = _cacheService.GetUsuarioCidi(usuarioBasico.CUIL);
            if (usuarioCidi != null)
            {
                _logger.LogInformation($"Datos de usuario encontrados en caché para CUIL: {usuarioBasico.CUIL}");
                // Crear respuesta completa con los datos del caché e indicar que viene del caché
                return UsuarioCompletoResponse.FromUsuarioCidi(usuarioCidi, usuarioBasico.Rol, "Caché");
            }
            
            _logger.LogInformation("Datos no encontrados en caché, consultando a CiDi");
            
            // Si no está en caché, necesitamos obtener los datos de CiDi
            var cookieHash = httpContext.Request.Cookies["CiDi"] ?? 
                           httpContext.Request.Headers["CiDi"].FirstOrDefault() ?? 
                           httpContext.Items["CiDi"] as string;
            
            if (string.IsNullOrEmpty(cookieHash))
            {
                _logger.LogWarning("No se encontró cookie CiDi para obtener datos completos");
                
                // Si no tenemos cookie CiDi, devolver solo los datos básicos
                return new UsuarioCompletoResponse
                {
                    FuenteDatos = "Datos básicos (sin CiDi)",
                    CUIL = usuarioBasico.CUIL,
                    Nombre = usuarioBasico.Nombre,
                    Apellido = usuarioBasico.Apellido,
                    Rol = usuarioBasico.Rol
                };
            }
            
            try
            {
                // Obtener datos completos desde CiDi (esto ya usa el sistema de caché interno)
                usuarioCidi = await ObtenerUsuarioCidiAsync(cookieHash);
                
                // Si obtuvimos los datos, guardarlos en caché (esto lo hace ObtenerUsuarioCidiAsync)
                if (usuarioCidi != null)
                {
                    _logger.LogInformation($"Datos de CiDi obtenidos para CUIL: {usuarioBasico.CUIL}");
                    return UsuarioCompletoResponse.FromUsuarioCidi(usuarioCidi, usuarioBasico.Rol, "CiDi (API Externa)");
                }
                else
                {
                    _logger.LogWarning("No se pudieron obtener datos completos de CiDi");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener datos completos de CiDi");
            }
            
            // Fallback: devolver solo los datos básicos
            return new UsuarioCompletoResponse
            {
                FuenteDatos = "Datos básicos (fallback)",
                CUIL = usuarioBasico.CUIL,
                Nombre = usuarioBasico.Nombre,
                Apellido = usuarioBasico.Apellido,
                Rol = usuarioBasico.Rol
            };
        }
        
        /// <summary>
        /// Método interno: Obtiene un usuario CiDi a partir de cookie, con gestión de caché
        /// y protección contra race conditions (múltiples solicitudes simultáneas)
        /// </summary>
        private async Task<UsuarioCidi> ObtenerUsuarioCidiAsync(string cookieHash)
        {
            // Si no hay cookie, no hay usuario
            if (string.IsNullOrEmpty(cookieHash))
            {
                return null;
            }
            
            // Crear clave única para esta cookie
            string cacheKey = $"cookie_{cookieHash}";
            
            // 1. Verificar primero en el caché por CUIL (evita extracción desde API)
            var usuarioCidiFromCache = _cacheService.GetData<UsuarioCidi>(cacheKey);
            if (usuarioCidiFromCache != null)
            {
                _logger.LogInformation($"Usuario CiDi obtenido de caché por cookie");
                // Si tenemos el usuario en caché por cookie, también guardarlo por CUIL para futuras consultas
                if (!string.IsNullOrEmpty(usuarioCidiFromCache.CUIL))
                {
                    _cacheService.SetUsuarioCidi(usuarioCidiFromCache.CUIL, usuarioCidiFromCache);
                }
                return usuarioCidiFromCache;
            }
            
            // 2. Si hay una solicitud en curso para esta cookie, esperar su resultado
            // Esto evita múltiples llamadas simultáneas a la API para la misma cookie
            Task<UsuarioCidi> pendingTask = null;
            bool newRequest = false;
            
            try {
                // Intentar agregar una nueva tarea o recuperar una existente
                pendingTask = _pendingCidiRequests.GetOrAdd(cacheKey, _ => {
                    newRequest = true;
                    return ObtenerUsuarioCidiDesdeCidiAsync(cookieHash);
                });
                
                // Esperar el resultado de la tarea (ya sea nueva o existente)
                var usuarioCidi = await pendingTask;
                
                return usuarioCidi;
            }
            finally {
                // Si esta fue la solicitud que creó la tarea, eliminarla cuando termine
                if (newRequest)
                {
                    _pendingCidiRequests.TryRemove(cacheKey, out _);
                }
            }
        }
        
        /// <summary>
        /// Método interno: Realiza la llamada real a la API de CiDi y guarda en caché
        /// </summary>
        private async Task<UsuarioCidi> ObtenerUsuarioCidiDesdeCidiAsync(string cookieHash)
        {
            try
            {
                _logger.LogInformation($"Obteniendo usuario desde API CiDi con cookie: {cookieHash.Substring(0, Math.Min(cookieHash.Length, 10))}...");
                var usuarioCidi = await _cidiClient.ObtenerUsuarioAplicacionAsync(cookieHash);
                
                if (usuarioCidi != null && !string.IsNullOrEmpty(usuarioCidi.CUIL))
                {
                    // Guardar en caché por CUIL y por cookie
                    _cacheService.SetUsuarioCidi(usuarioCidi.CUIL, usuarioCidi);
                    _cacheService.SetData($"cookie_{cookieHash}", usuarioCidi);
                    
                    _logger.LogInformation($"Usuario CiDi guardado en caché: {usuarioCidi.CUIL}");
                }
                
                return usuarioCidi;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener usuario desde API CiDi: {ex.Message}");
                throw; // Propagar el error para manejarlo en el llamador
            }
        }


    }
}

using Api.Domain.Results;
using Api.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Api.Config;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly TokenHelper _tokenHelper;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, TokenHelper tokenHelper, ILogger<UserController> logger)
        {
            _userService = userService;
            _tokenHelper = tokenHelper;
            _logger = logger;
        }

        [HttpGet("obtener-usuario")]
        [AllowAnonymous] // Permitir acceso sin autenticación previa
        public async Task<IActionResult> ObtenerUsuario([FromQuery] string cidiToken = null)
        {
            // Depuración: Registrar todas las cookies recibidas
            Console.WriteLine("[DEBUG] Cookies recibidas en ObtenerUsuario:");
            foreach (var cookie in Request.Cookies)
            {
                Console.WriteLine($"[DEBUG] Cookie: {cookie.Key} = {cookie.Value.Substring(0, Math.Min(cookie.Value.Length, 10))}...");
            }
            
            // Depuración: Registrar todos los headers recibidos
            Console.WriteLine("[DEBUG] Headers recibidos en ObtenerUsuario:");
            foreach (var header in Request.Headers)
            {
                Console.WriteLine($"[DEBUG] Header: {header.Key} = {header.Value}");
            }
            
            // Intentar obtener la cookie CiDi de diferentes fuentes
            var cookieCidi = Request.Cookies["CiDi"];
            var headerCidi = Request.Headers["CiDi"].FirstOrDefault();
            var xCidiToken = Request.Headers["X-CiDi-Token"].FirstOrDefault();
            var itemCidi = HttpContext.Items["CiDi"] as string;
            var queryCidiToken = cidiToken; // Parámetro de consulta
            
            Console.WriteLine($"[DEBUG] Cookie CiDi: {(cookieCidi != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG] Header CiDi: {(headerCidi != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG] Header X-CiDi-Token: {(xCidiToken != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG] HttpContext.Items CiDi: {(itemCidi != null ? "Presente" : "Ausente")}");
            Console.WriteLine($"[DEBUG] Query cidiToken: {(queryCidiToken != null ? "Presente" : "Ausente")}");
            
            // Usar cualquier fuente disponible de la cookie CiDi
            var cidiValue = cookieCidi ?? headerCidi ?? xCidiToken ?? itemCidi ?? queryCidiToken;
            
            // Si se encontró el valor en X-CiDi-Token, mostrarlo para depuración
            if (xCidiToken != null) {
                Console.WriteLine($"[DEBUG] Valor de X-CiDi-Token: {xCidiToken.Substring(0, Math.Min(xCidiToken.Length, 20))}...");
            }
            
            // Verificar si existe la cookie de CiDi
            if (string.IsNullOrEmpty(cidiValue))
            {
                Console.WriteLine("[ERROR] No se encontró la cookie de CiDi necesaria para la autenticación.");
                return Unauthorized(new { mensaje = "No se encontró la cookie de CiDi necesaria para la autenticación." });
            }
            
            // Asegurarse de que la cookie esté disponible en el HttpContext para el servicio
            if (HttpContext.Request.Cookies["CiDi"] == null && !string.IsNullOrEmpty(cidiValue))
            {
                // Si la cookie no está en Request.Cookies pero sí en otro lugar, agregarla manualmente
                HttpContext.Request.Headers["Cookie"] = $"CiDi={cidiValue}";
                
                // También agregarla a HttpContext.Items por si acaso
                HttpContext.Items["CiDi"] = cidiValue;
                
                Console.WriteLine("[DEBUG] Cookie CiDi agregada manualmente al contexto");
            }

            var usuario = await _userService.ObtenerUsuario(HttpContext);
            if (usuario == null)
            {
                Console.WriteLine("[ERROR] Usuario no encontrado en la base de datos.");
                return NotFound("Usuario no encontrado en la base de datos.");
            }
            
            Console.WriteLine($"[INFO] Usuario encontrado: {usuario.Nombre} {usuario.Apellido}, CUIL: {usuario.CUIL}, Rol: {usuario.Rol}");

            // Generar token JWT para el frontend
            var (accessToken, refreshToken) = await _tokenHelper.GenerateTokensAsync(usuario);
            
            // Agregar el token a la respuesta
            var respuesta = new
            {
                Usuario = usuario,
                Token = accessToken
            };

            return Ok(respuesta);
        }

        [Authorize(Policy = "AdminPolicy")] // 🔥 La política ya valida el rol
        [HttpGet("admin/listar-usuarios")]
        public async Task<IActionResult> ListarUsuarios()
        {
            var usuarios = await _userService.ListarUsuarios();
            return Ok(usuarios);
        }

        [Authorize]
        [HttpGet("debug/claims")]
        public IActionResult DebugClaims()
        {
            var claims = User.Claims.ToDictionary(c => c.Type, c => c.Value);
            return Ok(claims);
        }
        
        /// <summary>
        /// Cierre de sesión completo: elimina tokens, limpia caché y redirecciona a CiDi para cerrar sesión también allí
        /// </summary>
        [HttpGet("cerrar-sesion")]
        [AllowAnonymous] // Permitir acceso para cerrar sesión sin estar autenticado
        public async Task<IActionResult> CerrarSesion([FromServices] ICacheService cacheService)
        {
            _logger.LogInformation("Iniciando proceso de cierre de sesión completo");
            
            try 
            {
                // 1. Obtener el CUIL del usuario actual (si existe) para limpieza de caché
                string cuilUsuario = null;
                
                // Intentar obtener el CUIL del token JWT si existe
                if (User.Identity.IsAuthenticated) 
                {
                    cuilUsuario = User.Claims.FirstOrDefault(c => c.Type == "cuil")?.Value;
                    _logger.LogInformation($"Usuario autenticado encontrado: {cuilUsuario}");
                }
                
                // Si no hay token JWT, intentar obtener el usuario vía CiDi cookie
                if (string.IsNullOrEmpty(cuilUsuario))
                {
                    var usuario = await _userService.ObtenerUsuario(HttpContext);
                    if (usuario != null)
                    {
                        cuilUsuario = usuario.CUIL;
                        _logger.LogInformation($"Usuario obtenido de cookie CiDi: {cuilUsuario}");
                    }
                }
                
                // 2. Limpiar caché si tenemos el CUIL
                if (!string.IsNullOrEmpty(cuilUsuario))
                {
                    cacheService.RemoveUsuarioCidi(cuilUsuario);
                    _logger.LogInformation($"Caché de usuario {cuilUsuario} eliminado correctamente");
                }
                
                // 3. Eliminar cookies de autenticación
                Response.Cookies.Delete("Token");
                Response.Cookies.Delete("RefreshToken");
                _logger.LogInformation("Cookies de Token y RefreshToken eliminadas");
                
                // No eliminamos la cookie CiDi porque la usaremos para cerrar sesión en CiDi
                
                // 4. Obtener URL de cierre de sesión configurada en appsettings
                var cidiConfig = HttpContext.RequestServices.GetRequiredService<IConfiguration>().GetSection("CidiSettings");
                string cidiLogoutUrl = cidiConfig["Endpoints:CerrarSesion"];
                
                if (string.IsNullOrEmpty(cidiLogoutUrl))
                {
                    _logger.LogWarning("URL de cierre de sesión de CiDi no configurada en appsettings");
                    cidiLogoutUrl = "https://cidi.test.cba.gov.ar/Cuenta/CerrarSesion"; // Valor por defecto
                }
                
                // 5. URL de retorno a tu aplicación después del cierre en CiDi
                string returnUrl = $"{Request.Scheme}://{Request.Host}";
                
                // Construir URL completa de cierre (ajustar parámetros según documentación de CiDi)
                string logoutRedirectUrl = $"{cidiLogoutUrl}?returnUrl={Uri.EscapeDataString(returnUrl)}";
                
                _logger.LogInformation($"Cierre de sesión completo. Redirigiendo a: {logoutRedirectUrl}");
                
                // Devolver la URL de cierre de sesión para que el frontend redirija
                return Ok(new { logoutUrl = logoutRedirectUrl, message = "Sesión cerrada correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error durante el proceso de cierre de sesión");
                return StatusCode(500, new { mensaje = "Error al cerrar sesión", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtiene los datos completos del usuario (incluidos todos los datos de CiDi) utilizando el sistema de caché
        /// </summary>
        [AllowAnonymous] // Permitir acceso sin autenticación previa, igual que obtener-usuario
        [HttpGet("obtener-usuario-completo")]
        public async Task<IActionResult> ObtenerUsuarioCompleto([FromQuery] string cidiToken = null)
        {
            // Log de depuración similar al endpoint original
            _logger.LogDebug("==== Solicitud a obtener-usuario-completo ====");
            foreach (var cookie in Request.Cookies)
            {
                _logger.LogDebug($"Cookie: {cookie.Key} = {cookie.Value.Substring(0, Math.Min(cookie.Value.Length, 10))}...");
            }
            
            // Intentar obtener la cookie CiDi de diferentes fuentes (igual que en obtener-usuario)
            var cookieCidi = Request.Cookies["CiDi"];
            var headerCidi = Request.Headers["CiDi"].FirstOrDefault();
            var xCidiToken = Request.Headers["X-CiDi-Token"].FirstOrDefault();
            var itemCidi = HttpContext.Items["CiDi"] as string;
            var queryCidiToken = cidiToken; // Parámetro de consulta
            
            // Usar cualquier fuente disponible de la cookie CiDi
            var cidiValue = cookieCidi ?? headerCidi ?? xCidiToken ?? itemCidi ?? queryCidiToken;
            
            // Verificar si existe la cookie de CiDi
            if (string.IsNullOrEmpty(cidiValue))
            {
                _logger.LogWarning("No se encontró la cookie de CiDi necesaria para la autenticación.");
                return Unauthorized(new { mensaje = "No se encontró la cookie de CiDi necesaria para la autenticación." });
            }
            
            // Asegurarse de que la cookie esté disponible en el HttpContext para el servicio
            if (HttpContext.Request.Cookies["CiDi"] == null && !string.IsNullOrEmpty(cidiValue))
            {
                // Si la cookie no está en Request.Cookies pero sí en otro lugar, agregarla manualmente
                HttpContext.Request.Headers["Cookie"] = $"CiDi={cidiValue}";
                HttpContext.Items["CiDi"] = cidiValue;
            }
            
            try
            {
                // Obtener datos completos del usuario utilizando el sistema de caché
                var usuario = await _userService.ObtenerUsuarioCompleto(HttpContext);
                if (usuario == null)
                {
                    return Unauthorized(new { mensaje = "No se pudo obtener el usuario" });
                }
                
                // Devolver los datos completos que incluyen toda la información de CiDi
                return Ok(usuario);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener datos completos del usuario");
                return StatusCode(500, new { mensaje = "Error interno del servidor al obtener los datos del usuario" });
            }
        }
    }
}

using Api.CIDI;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Api.Interfaces.Services;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CidiController : ControllerBase
    {
        private readonly CidiClient _cidiClient;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;

        public CidiController(CidiClient cidiClient, IConfiguration configuration, IUserService userService)
        {
            _cidiClient = cidiClient;
            _configuration = configuration;
            _userService = userService;
        }

        [HttpGet("iniciar-sesion")]
        public async Task<IActionResult> IniciarSesion([FromHeader] string cookieHash)
        {
            if (string.IsNullOrEmpty(cookieHash))
            {
                return BadRequest("El encabezado 'cookieHash' es obligatorio.");
            }

            var result = await _cidiClient.ObtenerUsuarioAplicacionAsync(cookieHash);
            return Ok(result);
        }

        [HttpGet("obtener-usuario")]
        public async Task<IActionResult> ObtenerUsuario()
        {
            var cookieHash = Request.Cookies["CiDi"]; 
            if (string.IsNullOrEmpty(cookieHash))
            {
                return Unauthorized("No se encontró la cookie de autenticación 'CiDi'.");
            }

            var usuario = await _userService.ObtenerUsuario(HttpContext);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado en la base de datos.");
            }

            return Ok(usuario);
        }

        [HttpGet("logout")]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cerrarSesionUrl = _configuration["CidiSettings:Endpoints:CerrarSesion"];

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Redirect(cerrarSesionUrl);
        }
    }
}

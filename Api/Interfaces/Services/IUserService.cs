using System.Threading.Tasks;
using Api.Domain.Results;
using Microsoft.AspNetCore.Http;

namespace Api.Interfaces.Services
{
    public interface IUserService
    {
        /// <summary>
        /// Obtiene los datos básicos del usuario (nombre, apellido, CUIL y rol)
        /// </summary>
        Task<UsuarioResponse> ObtenerUsuario(HttpContext httpContext);
        
        /// <summary>
        /// Obtiene los datos completos del usuario, incluyendo toda la información de CiDi
        /// </summary>
        Task<UsuarioCompletoResponse> ObtenerUsuarioCompleto(HttpContext httpContext);
        
        /// <summary>
        /// Lista todos los usuarios registrados
        /// </summary>
        Task<List<UsuarioResponse>> ListarUsuarios(); 
    }
}



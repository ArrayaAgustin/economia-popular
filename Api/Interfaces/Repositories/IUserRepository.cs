using System.Threading.Tasks;
using Api.Data.Models;

namespace Api.Interfaces.Repositories
{
    public interface IUserRepository
    {
        /// <summary>
        /// Obtiene un usuario de la base de datos por su CUIL.
        /// </summary>
        Task<TUsuarios> ObtenerUsuarioPorCuil(string cuil);

        /// <summary>
        /// Guarda o actualiza el refresh token de un usuario en la base de datos.
        /// </summary>
        Task GuardarRefreshToken(string cuil, string refreshToken);

        /// <summary>
        /// Valida si un refresh token es válido y pertenece al usuario.
        /// </summary>
        Task<string> ValidarRefreshToken(string refreshToken);

        /// <summary>
        /// Elimina un refresh token, por ejemplo, al cerrar sesión o detectar actividad sospechosa.
        /// </summary>
        Task EliminarRefreshToken(string refreshToken);

        /// <summary>
        /// Obtiene todos los usuarios registrados en nuestro sistema.
        /// </summary>
        Task<List<TUsuarios>> ObtenerTodosLosUsuarios();
    }
}




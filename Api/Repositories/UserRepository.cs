using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Api.Data.Models;
using Api.Data.Contexts;
using Api.Interfaces.Repositories;
using System.Data.Common;

namespace Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly EFContext _dbContext;
        private readonly IDbConnection _dapperConnection;

        public UserRepository(EFContext dbContext, IDbConnection dapperConnection)
        {
            _dbContext = dbContext;
            _dapperConnection = dapperConnection;
        }

        /// <summary>
        /// Obtiene un usuario por CUIL usando Entity Framework (con carga de roles).
        /// </summary>
        public async Task<TUsuarios> ObtenerUsuarioPorCuil(string cuil)
        {
            return await _dbContext.TUsuarios
                .Include(u => u.IdRolNavigation) // Relación con Roles
                .FirstOrDefaultAsync(u => u.Cuil == cuil);
        }

        /// <summary>
        /// Obtiene todos los usuarios con sus roles registrados en nuestra aplicacion.
        /// </summary>
        public async Task<List<TUsuarios>> ObtenerTodosLosUsuarios()
        {
            return await _dbContext.TUsuarios
                .Include(u => u.IdRolNavigation) 
                .ToListAsync();
        }


        /// <summary>
        /// Guarda o actualiza el refresh token de un usuario en la base de datos usando Dapper.
        /// </summary>
        public async Task GuardarRefreshToken(string cuil, string refreshToken)
        {
            using var transaction = _dapperConnection.BeginTransaction();

            try
            {
                // 🔍 Verificar si el usuario existe en `t_usuarios`
                var usuarioExiste = await _dapperConnection.QueryFirstOrDefaultAsync<int>(
                    "SELECT COUNT(*) FROM t_usuarios WHERE CUIL = @Cuil;",
                    new { Cuil = cuil }, transaction);

                // 🔥 Si no existe, lo creamos con rol "USUARIO"
                if (usuarioExiste == 0)
                {
                    await _dapperConnection.ExecuteAsync(
                        "INSERT INTO t_usuarios (CUIL, Nombre, Apellido, Rol) VALUES (@Cuil, '', '', 'USUARIO');",
                        new { Cuil = cuil }, transaction);
                    Console.WriteLine($"✅ Usuario {cuil} registrado automáticamente con rol 'USUARIO'.");
                }

                // 🔥 Ahora guardamos el refresh_token
                var sql = @"
                    INSERT INTO t_refresh_tokens (CUIL, REFRESH_TOKEN, EXPIRATION)
                    VALUES (@Cuil, @RefreshToken, DATE_ADD(NOW(), INTERVAL 7 DAY))
                    ON DUPLICATE KEY UPDATE
                    REFRESH_TOKEN = @RefreshToken, EXPIRATION = DATE_ADD(NOW(), INTERVAL 7 DAY);";

                await _dapperConnection.ExecuteAsync(sql, new { Cuil = cuil, RefreshToken = refreshToken }, transaction);

                transaction.Commit();
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                Console.WriteLine($"❌ Error guardando refresh_token: {ex.Message}");
            }
        }

        /// <summary>
        /// Valida si un refresh token es válido y pertenece a un usuario en la base de datos.
        /// </summary>
        public async Task<string> ValidarRefreshToken(string refreshToken)
        {
            var sql = @"
                SELECT CUIL FROM T_REFRESH_TOKENS
                WHERE REFRESH_TOKEN = @RefreshToken AND EXPIRATION > NOW();";

            return await _dapperConnection.QueryFirstOrDefaultAsync<string>(sql, new { RefreshToken = refreshToken }) ?? string.Empty;
        }

        /// <summary>
        /// Elimina un refresh token de la base de datos cuando el usuario cierra sesión o hay actividad sospechosa.
        /// </summary>
        public async Task EliminarRefreshToken(string refreshToken)
        {
            var sql = "DELETE FROM T_REFRESH_TOKENS WHERE REFRESH_TOKEN = @RefreshToken;";
            await _dapperConnection.ExecuteAsync(sql, new { RefreshToken = refreshToken });
        }


    }
}

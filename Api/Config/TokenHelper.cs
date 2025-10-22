using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Api.Interfaces.Repositories;
using Api.Domain.Results;
using System.Threading.Tasks;
using System.Text.Json;


namespace Api.Config
{
    public class TokenHelper
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IUserRepository _userRepository;

        public TokenHelper(JwtSettings jwtSettings, IUserRepository userRepository)
        {
            _jwtSettings = jwtSettings;
            _userRepository = userRepository;
        }

        public async Task<(string accessToken, string refreshToken)> GenerateTokensAsync(UsuarioResponse usuario)
        {
            var key = new SymmetricSecurityKey(Convert.FromBase64String(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expirationTime = DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes);

            // ✅ Serializar `UsuarioResponse` en JSON
            var usuarioJson = JsonSerializer.Serialize(usuario);
            var claims = new List<Claim>
            {
              new Claim("usuario", usuarioJson),
              new Claim("rol", usuario.Rol.ToUpper()), 
              new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };


            var accessToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expirationTime,
                signingCredentials: creds
            );

            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            await _userRepository.GuardarRefreshToken(usuario.CUIL, refreshToken);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

            Console.WriteLine("✅ Token generado correctamente.");
            return (tokenString, refreshToken);
        }




        public UsuarioResponse ExtractUserFromToken(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    Console.WriteLine("❌ Error: Token vacío o no recibido.");
                    return null;
                }

                var handler = new JwtSecurityTokenHandler();
                var key = new SymmetricSecurityKey(Convert.FromBase64String(_jwtSettings.SecretKey));

                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true, // ✅ Verifica la firma digital
                    IssuerSigningKey = key,

                    ValidateIssuer = true,  // ✅ Valida el emisor
                    ValidIssuer = _jwtSettings.Issuer,

                    ValidateAudience = true, // ✅ Valida la audiencia
                    ValidAudience = _jwtSettings.Audience,

                    ValidateLifetime = true,  // ✅ Rechaza tokens expirados
                    ClockSkew = TimeSpan.Zero // 🔹 Sin tolerancia en la expiración
                };

                // ✅ Validar el token y obtener `ClaimsPrincipal`
                var principal = handler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

                Console.WriteLine("✅ Token validado correctamente.");

                // ✅ Obtener el claim con el JSON del usuario
                var usuarioJson = principal.Claims.FirstOrDefault(c => c.Type == "usuario")?.Value;
                if (string.IsNullOrEmpty(usuarioJson))
                {
                    Console.WriteLine("❌ No se encontró el claim de usuario.");
                    return null;
                }

                // ✅ Deserializar el JSON a `UsuarioResponse`
                var usuario = JsonSerializer.Deserialize<UsuarioResponse>(usuarioJson);
                Console.WriteLine($"✅ Usuario extraído correctamente: {JsonSerializer.Serialize(usuario)}");

                return usuario;
            }
            catch (SecurityTokenExpiredException)
            {
                Console.WriteLine("❌ Error: El token ha expirado.");
                return null;
            }
            catch (SecurityTokenValidationException ex)
            {
                Console.WriteLine($"❌ Error de validación del token: {ex.Message}");
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error extrayendo el token: {ex.Message}");
                return null;
            }
        }







        public async Task<(string accessToken, string refreshToken)> RefreshAccessTokenAsync(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken)) return (null, null);

            // 🔹 Validar el refresh token en la base de datos
            var cuil = await _userRepository.ValidarRefreshToken(refreshToken);
            if (string.IsNullOrEmpty(cuil)) return (null, null); // ❌ Token inválido o expirado

            // 🔹 Obtener usuario de la base de datos
            var usuarioDb = await _userRepository.ObtenerUsuarioPorCuil(cuil);
            if (usuarioDb == null || usuarioDb.IdRolNavigation == null) return (null, null); // ❌ Usuario no encontrado

            // 🔹 Construir objeto `UsuarioResponse`
            var usuario = new UsuarioResponse
            {
                CUIL = usuarioDb.Cuil,
                Nombre = usuarioDb.Nombre,
                Apellido = usuarioDb.Apellido,
                Rol = usuarioDb.IdRolNavigation.Rol
            };

            // 🔹 Generar un nuevo access_token y refresh_token
            var (newAccessToken, newRefreshToken) = await GenerateTokensAsync(usuario);

            // 🔹 Guardar el nuevo refresh_token en la base de datos (reemplaza el anterior)
            await _userRepository.GuardarRefreshToken(usuario.CUIL, newRefreshToken);

            return (newAccessToken, newRefreshToken);
        }

    }
}

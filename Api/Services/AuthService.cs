using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Api.Config;
using Api.Interfaces.Repositories;
using Api.Interfaces.Services;
using Microsoft.IdentityModel.Tokens;

namespace Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IUserRepository _userRepository;
        private readonly TokenHelper _tokenHelper;

        public AuthService(JwtSettings jwtSettings, IUserRepository userRepository, TokenHelper tokenHelper)
        {
            _jwtSettings = jwtSettings;
            _userRepository = userRepository;
            _tokenHelper = tokenHelper;
        }

        public (string accessToken, string refreshToken) GenerateTokens(string cuil, string nombre, string apellido, string rol)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim("CUIL", cuil),         // 🔹 Usa nombres personalizados
                new Claim("Nombre", nombre),
                new Claim("Apellido", apellido),
                new Claim("Rol", rol)
            };

            var accessToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
                signingCredentials: creds
            );

            // 🔹 Genera un `refresh_token` aleatorio en lugar de un JWT
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            // 🔹 Guarda el refresh_token en la base de datos
            _userRepository.GuardarRefreshToken(cuil, refreshToken);

            return (
                new JwtSecurityTokenHandler().WriteToken(accessToken),
                refreshToken
            );
        }
    }
}

using System;

namespace Api.Interfaces.Services
{
    public interface IAuthService
    {
        (string accessToken, string refreshToken) GenerateTokens(string cuil, string nombre, string apellido, string rol);
    }
}


using System;
using System.Security.Cryptography;
using System.Text;

namespace Api.CIDI
{
    public static class TokenUtil
    {
        /// <summary>
        /// Genera un token en formato Hexadecimal basado en SHA-1.
        /// </summary>
        /// <param name="timeStamp">TimeStamp en formato "yyyyMMddHHmmssfff".</param>
        /// <param name="key">Clave secreta proporcionada por CIDI.</param>
        /// <returns>El token en formato Hexadecimal.</returns>
        public static string ObtenerToken_SHA1(string timeStamp, string key)
        {
            var buffer = Encoding.ASCII.GetBytes(timeStamp + key);
            using (SHA1 sha1 = SHA1.Create())
            {
                return BitConverter.ToString(sha1.ComputeHash(buffer)).Replace("-", "");
            }
        }
    }
}

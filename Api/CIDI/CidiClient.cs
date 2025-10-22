using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Api.CIDI
{
    public class CidiClient
    {
        private readonly HttpClient _httpClient;
        private readonly CidiSettings _settings;

        public CidiClient(HttpClient httpClient, IOptions<CidiSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<UsuarioCidi> ObtenerUsuarioAplicacionAsync(string cookieHash)
        {
            var url = $"{_settings.Endpoints.CidiUrlApiCuenta}/api/Usuario/Obtener_Usuario_Aplicacion";

            Console.WriteLine($"[DEBUG] CidiUrlApiCuenta: {_settings?.Endpoints?.CidiUrlApiCuenta}");
            Console.WriteLine($"[DEBUG] IdApplication: {_settings?.IdApplication}");
            Console.WriteLine($"[DEBUG] ClientSecret: {_settings?.ClientSecret}");

            if (string.IsNullOrEmpty(_settings?.Endpoints?.CidiUrlApiCuenta))
            {
                throw new InvalidOperationException("CidiSettings:Endpoints:CidiUrlApiCuenta no está configurado correctamente.");
            }
            return await ObtenerGenerico(cookieHash, url);
        }

        private async Task<UsuarioCidi> ObtenerGenerico(string cookieHash, string url)
        {
            try
            {
                // Generar TimeStamp y TokenValue
                var argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                var argentinaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                var timeStamp = argentinaTime.ToString("yyyyMMddHHmmssfff");

                var tokenValue = TokenUtil.ObtenerToken_SHA1(timeStamp, _settings.ClientKey);

                // Crear el objeto de entrada utilizando configuraciones
                var entrada = new Entrada
                {
                    IdAplicacion = _settings.IdApplication,
                    Contrasenia = _settings.ClientSecret,
                    TimeStamp = timeStamp,
                    TokenValue = tokenValue,
                    CUIL = null,
                    HashCookie = cookieHash,
                    SesionHash = null,
                    CUILOperador = null,
                    HashCookieOperador = null
                };

                // Registrar el payload para depuración
                Console.WriteLine($"[INFO] Payload enviado a {url}: {JsonSerializer.Serialize(entrada)}");

                // Llamar a la API usando HttpClientUtil
                var result = await HttpClientUtil.LlamarWebApiAsync<Entrada, UsuarioCidi>(url, entrada, _httpClient);

                // Registrar la respuesta para depuración
                Console.WriteLine($"[INFO] Respuesta recibida: {JsonSerializer.Serialize(result)}");

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error al obtener datos de la API de CIDI: {ex.Message}");
                throw new InvalidOperationException("Error al obtener datos de la API CiDi.", ex);
            }
        }
    }
}

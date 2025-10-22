using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Api.CIDI
{
    public static class HttpClientUtil
    {
        public static async Task<TRespuesta> LlamarWebApiAsync<TEntrada, TRespuesta>(
       string accion, TEntrada tEntrada, HttpClient httpClient)
        {
            try
            {
                const SecurityProtocolType Tls12 = (SecurityProtocolType)0x00000C00;
                ServicePointManager.SecurityProtocol = Tls12;

                var rawJson = JsonSerializer.Serialize(
                    tEntrada,
                    new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull });

                Console.WriteLine($"[INFO] Enviando solicitud a: {accion}");
                Console.WriteLine($"[INFO] Payload: {rawJson}");

                var request = new HttpRequestMessage(HttpMethod.Post, accion)
                {
                    Content = new StringContent(rawJson, Encoding.UTF8, "application/json")
                };

                // Agregar encabezados obligatorios
                request.Headers.Add("Accept", "application/json");
                request.Headers.Host = "cuentacidi.test.cba.gov.ar";

                var response = await httpClient.SendAsync(request);

                Console.WriteLine($"[INFO] Código de estado recibido: {response.StatusCode}");

                var responseContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[INFO] Respuesta cruda: {responseContent}");

                response.EnsureSuccessStatusCode();

                return JsonSerializer.Deserialize<TRespuesta>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch (HttpRequestException httpEx)
            {
                Console.WriteLine($"[ERROR] Error en la solicitud HTTP: {httpEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error general: {ex.Message}");
                throw;
            }
        }

    }
}

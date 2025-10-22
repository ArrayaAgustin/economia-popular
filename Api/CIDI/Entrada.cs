using System;

namespace Api.CIDI
{
    public class Entrada
    {
        public int IdAplicacion { get; set; }
        public string Contrasenia { get; set; }
        public string TokenValue { get; set; }
        public string TimeStamp { get; set; }
        public string CUIL { get; set; }
        public string HashCookie { get; set; }  
        public string SesionHash { get; set; }
        public string CUILOperador { get; set; }
        public string HashCookieOperador { get; set; }
     
    }
}

namespace Api.CIDI
{
    public class CidiSettings
    {
        public int IdApplication { get; set; } // Identificador de la aplicación
        public string ClientSecret { get; set; }  // Contraseña de la aplicación
        public string ClientKey { get; set; }     // Clave de la aplicación
        public string Environment { get; set; }  // Entorno (DEBUG, PRODUCCIÓN)
        public EndpointsSettings Endpoints { get; set; } // Configuración de endpoints
    }

    public class EndpointsSettings
    {
        public string IniciarSesion { get; set; }      // URL para iniciar sesión
        public string CerrarSesion { get; set; }       // URL para cerrar sesión
        public string CidiUrlApiCuenta { get; set; }   // URL para API Cuenta
    }
}

using Api.CIDI;

namespace Api.Domain.Results
{
    /// <summary>
    /// Respuesta que contiene todos los datos del usuario incluyendo la información completa de CiDi
    /// </summary>
    public class UsuarioCompletoResponse : UsuarioResponse
    {
        // Campo para depuración que indica la fuente de los datos
        public string FuenteDatos { get; set; }
        
        // Datos adicionales del usuario CiDi
        public string CuilFormateado { get; set; }
        public string NroDocumento { get; set; }
        public string NombreFormateado { get; set; }
        public string FechaNacimiento { get; set; }
        public string Id_Sexo { get; set; }
        public string PaiCodPais { get; set; }
        public int Id_Numero { get; set; }
        public int? Id_Estado { get; set; }
        public string Estado { get; set; }
        public string Email { get; set; }
        public string TelArea { get; set; }
        public string TelNro { get; set; }
        public string TelFormateado { get; set; }
        public string CelArea { get; set; }
        public string CelNro { get; set; }
        public string CelFormateado { get; set; }
        public string Empleado { get; set; }
        public string Id_Empleado { get; set; }
        public string FechaRegistro { get; set; }
        public string FechaBloqueo { get; set; }
        public string IdAplicacionOrigen { get; set; }
        public string TieneRepresentados { get; set; }
        public Domicilio Domicilio { get; set; }
        
        // Constructor para mapear desde UsuarioCidi y UsuarioResponse básico
        public static UsuarioCompletoResponse FromUsuarioCidi(UsuarioCidi usuarioCidi, string rol, string fuenteDatos = "Desconocida")
        {
            return new UsuarioCompletoResponse
            {
                // Fuente de los datos para depuración
                FuenteDatos = fuenteDatos,
                
                // Datos básicos de UsuarioResponse
                CUIL = usuarioCidi.CUIL,
                Nombre = usuarioCidi.Nombre,
                Apellido = usuarioCidi.Apellido,
                Rol = rol,
                
                // Datos adicionales de CiDi
                CuilFormateado = usuarioCidi.CuilFormateado,
                NroDocumento = usuarioCidi.NroDocumento,
                NombreFormateado = usuarioCidi.NombreFormateado,
                FechaNacimiento = usuarioCidi.FechaNacimiento,
                Id_Sexo = usuarioCidi.Id_Sexo,
                PaiCodPais = usuarioCidi.PaiCodPais,
                Id_Numero = usuarioCidi.Id_Numero,
                Id_Estado = usuarioCidi.Id_Estado,
                Estado = usuarioCidi.Estado,
                Email = usuarioCidi.Email,
                TelArea = usuarioCidi.TelArea,
                TelNro = usuarioCidi.TelNro,
                TelFormateado = usuarioCidi.TelFormateado,
                CelArea = usuarioCidi.CelArea,
                CelNro = usuarioCidi.CelNro,
                CelFormateado = usuarioCidi.CelFormateado,
                Empleado = usuarioCidi.Empleado,
                Id_Empleado = usuarioCidi.Id_Empleado,
                FechaRegistro = usuarioCidi.FechaRegistro,
                FechaBloqueo = usuarioCidi.FechaBloqueo,
                IdAplicacionOrigen = usuarioCidi.IdAplicacionOrigen,
                TieneRepresentados = usuarioCidi.TieneRepresentados,
                Domicilio = usuarioCidi.Domicilio
            };
        }
    }
}

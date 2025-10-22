namespace Api.Data.Models
{
    public class T_USUARIOS
    {
        public int ID_USUARIO { get; set; } // Identificador único del usuario (Primary Key)
        public string CUIL { get; set; } // Clave Única de Identificación Laboral
        public string NOMBRE { get; set; } // Nombre del usuario
        public string APELLIDO { get; set; } // Apellido del usuario
        public DateTime FECHA_CREACION { get; set; } // Fecha de creación del registro
        public DateTime? FECHA_BAJA { get; set; } // Fecha de baja (puede ser null)
        public bool ACTIVO { get; set; } // Indicador de si el usuario está activo
        public int ID_ROL { get; set; } // Identificador del rol (Foreign Key)

        // Propiedad de navegación para T_ROLES
        public virtual T_ROLES Rol { get; set; }
    }
}



namespace Api.Data.Models
{
    public class T_ROLES
    {
        public int ID_ROL { get; set; } // Identificador único del rol (Primary Key)
        public string ROL { get; set; } // Nombre del rol
        public DateTime FECHA_CREACION { get; set; } // Fecha de creación del registro
        public DateTime? FECHA_BAJA { get; set; } // Fecha de baja (puede ser null)
        public bool ACTIVO { get; set; } // Indicador de si el rol está activo

        // Propiedad de navegación inversa (colección de usuarios asociados a este rol)
        public ICollection<T_USUARIOS> USUARIOS { get; set; }
    }
}

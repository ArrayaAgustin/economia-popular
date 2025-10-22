using System;
using System.Collections.Generic;

namespace Api.Data.Models;

public partial class TUsuarios
{
    public int IdUsuario { get; set; }

    public string Cuil { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaBaja { get; set; }

    public bool? Activo { get; set; }

    public int? IdRol { get; set; }

    public virtual TRoles? IdRolNavigation { get; set; }

    // 🔹 Relación con TRefreshTokens
    public virtual ICollection<TRefreshTokens> TRefreshTokens { get; set; } = new List<TRefreshTokens>();
}

using System;
using System.Collections.Generic;

namespace Api.Migrations.GeneratedContext;

public partial class TUsuario
{
    public int IdUsuario { get; set; }

    public string Cuil { get; set; } = null!;

    public string Nombre { get; set; } = null!;

    public string Apellido { get; set; } = null!;

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaBaja { get; set; }

    public bool? Activo { get; set; }

    public int? IdRol { get; set; }

    public virtual TRole? IdRolNavigation { get; set; }

    public virtual ICollection<TRefreshToken> TRefreshTokens { get; set; } = new List<TRefreshToken>();
}

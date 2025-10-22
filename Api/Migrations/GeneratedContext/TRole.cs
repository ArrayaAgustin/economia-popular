using System;
using System.Collections.Generic;

namespace Api.Migrations.GeneratedContext;

public partial class TRole
{
    public int IdRol { get; set; }

    public string Rol { get; set; } = null!;

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaBaja { get; set; }

    public bool? Activo { get; set; }

    public virtual ICollection<TUsuario> TUsuarios { get; set; } = new List<TUsuario>();
}

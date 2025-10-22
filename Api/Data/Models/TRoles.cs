using System;
using System.Collections.Generic;

namespace Api.Data.Models;

public partial class TRoles
{
    public int IdRol { get; set; }

    public string Rol { get; set; } = null!;

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaBaja { get; set; }

    public bool? Activo { get; set; }

    public virtual ICollection<TUsuarios> TUsuarios { get; set; } = new List<TUsuarios>();
}

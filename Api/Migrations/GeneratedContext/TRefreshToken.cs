using System;
using System.Collections.Generic;

namespace Api.Migrations.GeneratedContext;

public partial class TRefreshToken
{
    public int Id { get; set; }

    public string Cuil { get; set; } = null!;

    public string RefreshToken { get; set; } = null!;

    public DateTime Expiration { get; set; }

    public virtual TUsuario CuilNavigation { get; set; } = null!;
}

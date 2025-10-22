using System;
using System.Collections.Generic;

namespace Api.Data.Models;

public partial class TRefreshTokens
{
    public int Id { get; set; }

    public string Cuil { get; set; } = null!;

    public string RefreshToken { get; set; } = null!;

    public DateTime Expiration { get; set; }

    public virtual TUsuarios CuilNavigation { get; set; } = null!;
}

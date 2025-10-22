using System.Reflection;
using System.Text;
using Api.CIDI;
using Api.Config;
using Api.Data.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Api.Interfaces.Services;
using Api.Services;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Configurar y registrar JwtSettings desde appsettings.json con validaciones
var jwtSettings = new JwtSettings();
builder.Configuration.GetSection("JwtSettings").Bind(jwtSettings);

if (string.IsNullOrEmpty(jwtSettings.SecretKey) || jwtSettings.SecretKey.Length < 32)
{
    throw new Exception("❌ Error: La clave secreta del JWT debe tener al menos 32 caracteres.");
}

builder.Services.AddSingleton(jwtSettings);
var key = Convert.FromBase64String(jwtSettings.SecretKey);

Encoding.ASCII.GetBytes(jwtSettings.SecretKey);

// 🔹 Configurar y registrar CidiSettings desde appsettings.json
builder.Services.Configure<CidiSettings>(builder.Configuration.GetSection("CidiSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<CidiSettings>>().Value);

// 🔹 Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost.cba.gov.ar:3000",
                "https://localhost.cba.gov.ar:3000"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Importante para permitir cookies
    });
});

// 🔹 Configuración de autenticación con JWT
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = "rol"

    };
});

// ✅ Configurar autorización basada en roles
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("ADMIN"));
    options.AddPolicy("EmpresaPolicy", policy => policy.RequireRole("EMPRESA"));
    options.AddPolicy("UsuarioPolicy", policy => policy.RequireRole("USUARIO", "EMPRESA", "ADMIN"));
});


// 🔹 Registrar HttpClient para CidiClient
builder.Services.AddHttpClient<CidiClient>();

// 🔹 Configurar la base de datos (Entity Framework y Dapper)
builder.Services.AddDatabaseServices(builder.Configuration.GetConnectionString("MySqlDb"));

// 🔹 Configurar el sistema de caché en memoria
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ICacheService, CacheService>();

// 🔹 Registrar servicios manuales
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<TokenHelper>(); // ❌ No usar AddSingleton()


// 🔹 Registrar automáticamente todos los servicios que terminan en 'Service'
var assembly = Assembly.GetExecutingAssembly();
foreach (var type in assembly.GetTypes().Where(t => t.Name.EndsWith("Service") && !t.IsInterface && !t.IsAbstract))
{
    var serviceInterface = type.GetInterfaces().FirstOrDefault();
    if (serviceInterface != null)
    {
        builder.Services.AddScoped(serviceInterface, type);
    }
}

// 🔹 Registrar automáticamente todos los repositorios que terminan en 'Repository'
foreach (var type in assembly.GetTypes().Where(t => t.Name.EndsWith("Repository") && !t.IsInterface && !t.IsAbstract))
{
    var repositoryInterface = type.GetInterfaces().FirstOrDefault();
    if (repositoryInterface != null)
    {
        builder.Services.AddScoped(repositoryInterface, type);
    }
}

// 🔹 Agregar controladores al contenedor
builder.Services.AddControllers();

// 🔹 Habilitar Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 🔹 Configurar el pipeline de solicitudes HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend"); // 🔹 Agregado para permitir CORS (si es necesario)


app.Use(async (context, next) =>
{
    // Procesar cookie de access_token para autenticación JWT
    if (context.Request.Cookies.ContainsKey("access_token"))
    {
        var token = context.Request.Cookies["access_token"];
        if (!string.IsNullOrEmpty(token))
        {
            context.Request.Headers.Append("Authorization", $"Bearer {token}");
        }
    }
    
    // Procesar cookie de CiDi para autenticación con CiDi
    if (context.Request.Cookies.ContainsKey("CiDi"))
    {
        var cidiToken = context.Request.Cookies["CiDi"];
        if (!string.IsNullOrEmpty(cidiToken))
        {
            // Guardar la cookie CiDi en los Items del HttpContext para accederla desde los controladores
            context.Items["CiDi"] = cidiToken;
            
            // Opcionalmente, también puedes agregarla como un header personalizado
            context.Request.Headers.Append("CiDi", cidiToken);
        }
    }
    
    await next();
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

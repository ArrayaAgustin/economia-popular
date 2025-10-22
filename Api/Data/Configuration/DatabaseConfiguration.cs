using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Api.Data.Contexts;
using System.Data;
using MySqlConnector;

namespace Api.Data.Configuration
{
    public static class DatabaseConfiguration
    {
        public static IServiceCollection AddDatabaseServices(this IServiceCollection services, string connectionString)
        {
            // Entity Framework: Registra el contexto normalmente
            services.AddDbContext<EFContext>(options =>
                options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 31))));

            // 🔹 Registra un servicio Singleton para gestionar la conexión compartida
            services.AddSingleton<IDbConnection>(sp =>
            {
                var connection = new MySqlConnection(connectionString);
                connection.Open(); // 🔥 Mantiene la conexión abierta para ser compartida
                return connection;
            });

            return services;
        }
    }
}

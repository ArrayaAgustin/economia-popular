
using MySqlConnector;
using System.Data;

namespace Api.Data.Contexts
{
    public static class DapperContext
    {
        public static IDbConnection GetConnection(string connectionString)
        {
            return new MySqlConnection(connectionString);
        }
    }
}


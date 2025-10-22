using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using System.Linq;

namespace Api.Data
{
    /// <summary>
    /// Clase utilitaria para ejecutar procedimientos almacenados de manera simplificada
    /// </summary>
    public class StoredProcedureExecutor
    {
        private readonly IDbConnection _connection;

        public StoredProcedureExecutor(IDbConnection connection)
        {
            _connection = connection ?? throw new ArgumentNullException(nameof(connection));
        }

        /// <summary>
        /// Ejecuta un procedimiento almacenado y devuelve una lista de resultados tipados
        /// </summary>
        /// <typeparam name="T">Tipo de objeto a devolver</typeparam>
        /// <param name="procedureName">Nombre del procedimiento almacenado</param>
        /// <param name="parameters">Parámetros anónimos (new { Param1 = value1, Param2 = value2 })</param>
        /// <returns>Lista de objetos del tipo especificado</returns>
        public async Task<IEnumerable<T>> QueryAsync<T>(string procedureName, object parameters = null)
        {
            try
            {
                return await _connection.QueryAsync<T>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error ejecutando SP {procedureName}: {ex.Message}");
                throw new Exception($"Error al ejecutar el procedimiento almacenado {procedureName}", ex);
            }
        }

        /// <summary>
        /// Ejecuta un procedimiento almacenado y devuelve un único resultado tipado
        /// </summary>
        /// <typeparam name="T">Tipo de objeto a devolver</typeparam>
        /// <param name="procedureName">Nombre del procedimiento almacenado</param>
        /// <param name="parameters">Parámetros anónimos (new { Param1 = value1, Param2 = value2 })</param>
        /// <returns>Un objeto del tipo especificado o default si no hay resultados</returns>
        public async Task<T> QueryFirstOrDefaultAsync<T>(string procedureName, object parameters = null)
        {
            try
            {
                return await _connection.QueryFirstOrDefaultAsync<T>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error ejecutando SP {procedureName}: {ex.Message}");
                throw new Exception($"Error al ejecutar el procedimiento almacenado {procedureName}", ex);
            }
        }

        /// <summary>
        /// Ejecuta un procedimiento almacenado que realiza operaciones de modificación (INSERT, UPDATE, DELETE)
        /// </summary>
        /// <param name="procedureName">Nombre del procedimiento almacenado</param>
        /// <param name="parameters">Parámetros anónimos (new { Param1 = value1, Param2 = value2 })</param>
        /// <returns>Número de filas afectadas</returns>
        public async Task<int> ExecuteAsync(string procedureName, object parameters = null)
        {
            try
            {
                return await _connection.ExecuteAsync(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error ejecutando SP {procedureName}: {ex.Message}");
                throw new Exception($"Error al ejecutar el procedimiento almacenado {procedureName}", ex);
            }
        }

        /// <summary>
        /// Ejecuta un procedimiento almacenado y devuelve múltiples conjuntos de resultados
        /// </summary>
        /// <typeparam name="T1">Tipo del primer conjunto de resultados</typeparam>
        /// <typeparam name="T2">Tipo del segundo conjunto de resultados</typeparam>
        /// <param name="procedureName">Nombre del procedimiento almacenado</param>
        /// <param name="parameters">Parámetros anónimos</param>
        /// <returns>Tupla con ambos conjuntos de resultados</returns>
        public async Task<(IEnumerable<T1>, IEnumerable<T2>)> QueryMultipleAsync<T1, T2>(
            string procedureName, object parameters = null)
        {
            try
            {
                using var multi = await _connection.QueryMultipleAsync(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);

                var result1 = await multi.ReadAsync<T1>();
                var result2 = await multi.ReadAsync<T2>();

                return (result1, result2);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error ejecutando SP {procedureName}: {ex.Message}");
                throw new Exception($"Error al ejecutar el procedimiento almacenado {procedureName}", ex);
            }
        }

        /// <summary>
        /// Ejecuta un procedimiento almacenado con parámetros de salida
        /// </summary>
        /// <typeparam name="T">Tipo de resultado</typeparam>
        /// <param name="procedureName">Nombre del procedimiento almacenado</param>
        /// <param name="parameters">Objeto DynamicParameters con parámetros de entrada y salida</param>
        /// <returns>Los resultados del procedimiento</returns>
        public async Task<IEnumerable<T>> QueryWithOutputParametersAsync<T>(
            string procedureName, DynamicParameters parameters)
        {
            try
            {
                return await _connection.QueryAsync<T>(
                    procedureName,
                    parameters,
                    commandType: CommandType.StoredProcedure);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error ejecutando SP {procedureName}: {ex.Message}");
                throw new Exception($"Error al ejecutar el procedimiento almacenado {procedureName}", ex);
            }
        }
    }
}

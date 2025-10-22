using Api.CIDI;

namespace Api.Interfaces.Services
{
    public interface ICacheService
    {
        /// <summary>
        /// Obtiene un usuario CIDI del caché si existe
        /// </summary>
        /// <param name="cuil">CUIL del usuario</param>
        /// <returns>UsuarioCidi o null si no está en caché</returns>
        UsuarioCidi GetUsuarioCidi(string cuil);

        /// <summary>
        /// Almacena un usuario CIDI en el caché
        /// </summary>
        /// <param name="cuil">CUIL del usuario</param>
        /// <param name="usuario">Datos completos del usuario</param>
        void SetUsuarioCidi(string cuil, UsuarioCidi usuario);

        /// <summary>
        /// Obtiene datos estáticos/catálogos del caché
        /// </summary>
        /// <typeparam name="T">Tipo de datos</typeparam>
        /// <param name="key">Clave para identificar los datos</param>
        /// <returns>Datos del tipo T o default si no existe</returns>
        T GetData<T>(string key) where T : class;

        /// <summary>
        /// Almacena datos estáticos/catálogos en el caché
        /// </summary>
        /// <typeparam name="T">Tipo de datos</typeparam>
        /// <param name="key">Clave para identificar los datos</param>
        /// <param name="data">Datos a almacenar</param>
        /// <param name="isStatic">Si es true, se almacena por más tiempo (datos estáticos)</param>
        void SetData<T>(string key, T data, bool isStatic = false) where T : class;

        /// <summary>
        /// Elimina un elemento del caché
        /// </summary>
        /// <param name="key">Clave del elemento a eliminar</param>
        void RemoveData(string key);
        
        /// <summary>
        /// Elimina todos los datos de un usuario del caché por CUIL
        /// </summary>
        /// <param name="cuil">CUIL del usuario a eliminar del caché</param>
        void RemoveUsuarioCidi(string cuil);
    }
}

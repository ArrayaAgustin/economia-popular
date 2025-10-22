namespace Api.Data.Models
{
    public class Resultado<T>
    {
        public bool Ok { get; set; } // Indica si la operación fue exitosa
        public T Data { get; set; } // Los datos retornados por la operación
        public int Codigo { get; set; } // Código de estado (por ejemplo, 200, 404, etc.)
        public string Error { get; set; } // Detalle del error (si existe)
        public string Mensaje { get; set; } // Mensaje adicional sobre la operación
    }
}

namespace Api.CIDI
{
    public class RespuestaUsuario
    {
        public string Resultado { get; set; }
        public string CodigoError { get; set; }
        public string ExisteUsuario { get; set; }
        public string SesionHash { get; set; }
    }
}

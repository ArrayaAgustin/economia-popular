namespace Api.CIDI
{
    public interface  IUsuario
    {
          string CUIL { get; }
          string Apellido { get; }
          string Nombre { get; }
          string Email { get; }
    }
}
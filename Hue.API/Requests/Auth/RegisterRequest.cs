namespace Hue.API.Requests.Auth {
    public class RegisterRequest : LoginRequest{
        public string RegistrationKey { get; set; } = "";
        public bool IsArtist { get; set; } = false;
    }
}

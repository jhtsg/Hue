namespace Hue.API.Requests.Auth {
    public class RegisterRequest : LoginRequest{
        public string RegistrationKey { get; set; } = "";
    }
}

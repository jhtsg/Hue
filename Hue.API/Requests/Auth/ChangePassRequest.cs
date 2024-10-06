namespace Hue.API.Requests.Auth {
    public class ChangePassRequest {
        public string OldPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}

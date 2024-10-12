namespace Hue.Common {
    public class User {
        public string Username { get; set; } = "";
        public string Password { get; set; } = "";
        public int? PrimaryCharacterId { get; set; }
        public string? PrimaryCharacterColor { get; set; }
        public bool IsArtist { get; set; } = false;
    }
}

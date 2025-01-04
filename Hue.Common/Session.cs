namespace Hue.Common {
    public class Session {
        /// <summary>ID of the session</summary>
        public Guid Id { get; set; } = Guid.Empty;

        /// <summary>Username this session is associated to</summary>
        public string Username { get; set; } = "";

        /// <summary>Expiration time of the session on the DB</summary>
        public DateTime CreationTime { get; set; }
        
    }
}

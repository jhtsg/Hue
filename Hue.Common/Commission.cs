namespace Hue.Common {
    public class Commission : Identifiable {

        /// <summary>Name of this Commission</summary>
        public string Name { get; set; } = "";

        /// <summary>Description of this commission</summary>
        public string Description { get; set; } = "";

        /// <summary>Price paid to the artist in USD</summary>
        public int Price { get; set; } = 0;

        /// <summary>Number of Characters in this commission (NOT calculated, One of the characters may appear more than once)</summary>
        public int CharCount { get; set; } = 0;

        /// <summary>Tags for this commission once posted to Itaku or Furaffinity</summary>
        public string PostTags { get; set; } = "";

        /// <summary>Body for the Post once posted to Twitter, Itaku, or Furaffinity</summary>
        public string PostDescription { get; set; } = "";

        /// <summary>Days its taken to complete this piece. 0 if the piece hasn't finished yet</summary>
        public double? DaysToComplete => StartTs == null ? null 
            : DoneTs == null 
                ? (DateTime.UtcNow - StartTs).Value.TotalDays 
            : (DoneTs - StartTs).Value.TotalDays;

        /// <summary>Status of this commission</summary>
        public CommissionStatus Status { get; set; } = CommissionStatus.BRAINSTORM;

        /// <summary>Type of this commission</summary>
        public CommissionType Type { get; set; } = CommissionType.SIMPLE_IMAGE;

        /// <summary>Date this commission was created, and started being tracked</summary>
        public DateTime CreateTs { get; set; } = DateTime.Now;

        /// <summary>Date this commission was last updated</summary>
        public DateTime? UpdateTs { get; set; }

        /// <summary>Date this commission was started</summary>
        public DateTime? StartTs { get; set; }

        /// <summary>Date this commission was finished by the artist</summary>
        public DateTime? DoneTs { get; set; }

        /// <summary>Date this commission was posted to social media</summary>
        public DateTime? PublishTs { get; set; }

        /// <summary>Artist who's in charge of this commission</summary>
        public Artist? Artist { get; set; } = null;

        /// <summary>Characters in this commission</summary>
        public List<Character> Characters { get; set; } = [];

        /// <summary>Tags for this commission on Hue</summary>
        public List<CommissionTag> CommissionTags { get; set; } = [];

    }
}

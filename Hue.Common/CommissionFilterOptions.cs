namespace Hue.Common {
    public class CommissionFilterOptions {
        public int? Page { get; set; } = 0;
        public int? ArtistId { get; set; }
        public int? CommissionTagId { get; set; }
        public int? CharacterId { get; set; }
        public CommissionStatus? CommissionStatus { get; set; }
        public int? Year { get; set; }
    }
}

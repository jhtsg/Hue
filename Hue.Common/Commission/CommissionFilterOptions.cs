namespace Hue.Common.Commission
{
    public class CommissionFilterOptions
    {
        public int? Page { get; set; } = null;
        public int? ArtistId { get; set; }
        public int? CommissionTagId { get; set; }
        public int? CharacterId { get; set; }
        public CommissionStatus? CommissionStatus { get; set; }
        public int? Year { get; set; }
    }
}

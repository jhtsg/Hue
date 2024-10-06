namespace Hue.Common.Artist
{
    public class Artist : Identifiable
    {
        /// <summary>Full name of this artist</summary>
        public string Name { get; set; } = "";

        /// <summary>Primary Social Media URL of this artist (Like a Twitter or FurAffinity profile</summary>
        public string SocialUrl { get; set; } = "";

        /// <summary>URL to the current commission pricing sheet for this artist</summary>
        public string CommSheetUrl { get; set; } = "";
    }
}

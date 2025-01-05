namespace Hue.Common.Artist
{
    public class Artist : Identifiable
    {
        /// <summary>Full name of this artist</summary>
        public string Name { get; set; } = "";

        ///<summary>Payment Information</summary>
        public string PaymentUrl { get; set; } = "";

        /// <summary>Primary Social Media URL of this artist (Like a Twitter or FurAffinity profile</summary>
        public string SocialUrl { get; set; } = "";

        /// <summary>URL to the current commission pricing sheet for this artist</summary>
        public string CommSheetUrl { get; set; } = "";

        /// <summary>Whether or not this artist has an image</summary>
        public bool HasImage { get; set; } = false;

        /// <summary>Whether or not this artist is retired and should be hidden from selectors</summary>
        public bool IsRetired { get; set; } = false;
    }
}

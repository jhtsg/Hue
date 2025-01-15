namespace Hue.Common.Commission {
    public class CommissionAssociatedImage : Identifiable {

        public enum ImageType { 
            REFERENCE_IMAGE = 0,
            POST_IMATE = 1
        }

        public string Notes { get; set; } = "";
        public DateTime CreateTs { get; set; } = DateTime.Now;
        public ImageType Type { get; set; } = ImageType.REFERENCE_IMAGE;
        
    }
}

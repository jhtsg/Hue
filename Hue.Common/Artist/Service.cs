using Hue.Common.Commission;

namespace Hue.Common.Artist {
    public class Service : Identifiable {

        
        public CommissionType CommissionType { get; set; }

        public Artist Artist { get; set; } = new();

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public int BasePrice { get; set; } = 0;
        public string Currency { get; set; } = "";

        public List<ServiceAddition> Additions { get; set; } = [];

    }
}

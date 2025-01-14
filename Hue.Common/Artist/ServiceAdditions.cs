namespace Hue.Common.Artist {
    public class ServiceAddition : Identifiable {

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public int Price { get; set; } = 0;
        public int Limit { get; set; } = -1;
        public bool Dirty { get; set; } = false;

    }

}

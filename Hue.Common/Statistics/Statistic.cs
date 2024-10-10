namespace Hue.Common.Statistics {
    public class Statistic {
        public int Id { get; set; } = 0;
        public string Name { get; set; } = "";
        public string Color { get; set; } = "";
        public int Count { get; set; } = 0;
        public int Spent { get; set; } = 0;
        public DateTime? LastSeen { get; set; }

    }
}

namespace Hue.Common.Commission {
    public class CommissionAlert : Identifiable {
        public string Name { get; set; } = "";
        public CommissionStatus Status { get; set; } = CommissionStatus.BRAINSTORM;
        public int daysOverdue { get; set; } = 0;
    }
}

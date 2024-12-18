namespace Hue.Common.Commission {
    public class CommissionAlert : Identifiable {
        public string Name { get; set; } = "";
        public CommissionStatus Status { get; set; } = CommissionStatus.BRAINSTORM;
        public int DaysOverdue { get; set; } = 0;
    }
}

namespace Hue.Common.Commission
{
    public class CommissionTag : Identifiable
    {
        /// <summary>Name of this Tag</summary>
        public string Name { get; set; } = "";

        /// <summary>Description of this tag</summary>
        public string Description { get; set; } = "";

        /// <summary>Color of this tag</summary>
        public string Color { get; set; } = "";
    }
}

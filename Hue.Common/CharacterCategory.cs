namespace Hue.Common {
    public class CharacterCategory : Identifiable {

        /// <summary>Name of this Category</summary>
        public string Name { get; set; } = "";

        /// <summary>Description of this category</summary>
        public string Description { get; set; } = "";

        /// <summary>Color of this Category</summary>
        public string Color { get; set; } = "";
    }
}

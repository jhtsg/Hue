namespace Hue.Common.Character
{
    public class Character : Identifiable
    {
        /// <summary>Name of this character</summary>
        public string Name { get; set; } = "";

        /// <summary>Species of this character</summary>
        public string Species { get; set; } = "";

        /// <summary>Description of this character in Markdown</summary>
        public string Description { get; set; } = "";

        /// <summary>Color for this character's tile</summary>
        public string Color { get; set; } = "";

        /// <summary>Whether or not this character is the primary</summary>
        public bool? IsPrimary { get; set; }

        /// <summary>Whether or not this character has an image</summary>
        public bool HasImage { get; set; } = false;

        /// <summary>Whether or not the character is retired and should be hidden from selectors</summary>
        public bool IsRetired { get; set; } = false;

        /// <summary>Category of this character</summary>
        public CharacterCategory? Category { get; set; }
    }
}

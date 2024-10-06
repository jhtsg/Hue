namespace Hue.Common {

    /// <summary>Type of Commission</summary>
    public enum CommissionType {

        /// <summary>Default single image commission</summary>
        SIMPLE_IMAGE = 0,

        /// <summary>Sketch, or otherwise uncolored simple image</summary>
        SKETCH = 1,

        /// <summary>Image with a Background</summary>
        BG = 2,

        /// <summary>Sequence commission with multiple parts</summary>
        SEQUENCE = 3,

        /// <summary>Comic page or pages commission</summary>
        COMIC = 4,

        /// <summary>Animated commission</summary>
        ANIM = 5,

        /// <summary>Animated commission with a background</summary>
        ANIM_WITH_BG =6,

        /// <summary>Animated commissions with multiple scenes</summary>
        FILM = 7,

        /// <summary>3D Model</summary>
        MODEL_3D = 8,

        /// <summary>Render of an existing 3D model</summary>
        RENDER_3D = 9,

        /// <summary>Character Ref sheet</summary>
        REF_SHEET = 9
    }
}

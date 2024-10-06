namespace Hue.Common {

    /// <summary>Status of a commission</summary>
    public enum CommissionStatus {

        /// <summary>Archived or left for later</summary>
        ARCHIVE = -1,

        /// <summary>Still Brainstorming</summary>
        BRAINSTORM = 0,

        /// <summary>A commission that's been scheduled and is ready to start</summary>
        SCHEDULED = 1,

        /// <summary>A commission that has been paid and is being worked on</summary>
        IN_PROGRESS = 2,

        /// <summary>A commission that has been finished, but has not been posted</summary>
        DONE = 3,

        /// <summary>A commission that has been published</summary>
        PUBLISHED = 4
    }
}

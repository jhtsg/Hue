namespace Hue.Common.Commission {
    public class CommissionStatistics {

        public class TypeCount {
            public CommissionType Type { get; set; } = CommissionType.SIMPLE_IMAGE;
            public int Count { get; set; } = 0;
        }

        public class TagCount { 
            public CommissionTag? Tag { get; set; }
            public int Count { get; set; }
        }

        public class ArtistCount {
            public Artist.Artist? Artist { get; set; }
            public int Count { get; set; }
        }

        public class CharacterCount { 
            public Character.Character? Character { get; set; }
            public int Count { get; set; }
        }

        public class DateValuePair {
            public int Id { get; set; } = 0;
            public bool HasImage { get; set; } =  false;
            public string Name { get; set; } = "";
            public DateTime Date { get; set; } = DateTime.Now;
            public double Value { get; set; } = 0;
        }

        public class CumulativeSpendingData:DateValuePair {
            public double RunningTotal { get; set; } = 0;
            public bool Started { get; set; } = false;
        }

        /// <summary>
        /// Counts of types of commissions for the Commission Type Bar Chart
        /// </summary>
        public List<TypeCount> Types { get; set; } = [];

        /// <summary>
        /// Cumulative spending where date is the start date of a commission and value is the previous total plus the added value of the commission
        /// </summary>
        public List<CumulativeSpendingData> CumulativeSpending { get; set; } = [];

        /// <summary>
        /// TTC for a commission to spot trends, where date is the start date of the commission, and the value is the TTC <br/><br/>
        /// <b>This statistic will only be retrieved if the paired commission filter includes an artist</b>
        /// </summary>
        public List<DateValuePair>? TimeToCompletion { get; set; } = null;

        /// <summary>
        /// Counts of the times an artist appears matching a given commission filter, used for a pie charts of artitsts that have drawn the criteria<br/><br/>
        /// <b>This statistic will only be retrieved if the paired commission filter does NOT include an artist</b>
        /// </summary>
        public List<ArtistCount>? ArtistCounts { get; set; } = null;

        /// <summary>
        /// Counts of the times an character appears matching a given commission filter, used for a barchart for the numebr of times a character has appeared matching the criteria<br/><br/>
        /// <b>This statistic will only be retrieved if the paired commission filter does NOT include a character</b>
        /// </summary>
        public List<CharacterCount>? CharacterCounts { get; set; } = null;

        /// <summary>
        /// Counts of the times a tag appears matching a given commission filter, used for a barchart for the numebr of times a tag has appeared matching the criteria<br/><br/>
        /// <b>This statistic will only be retrieved if the paired commission filter does NOT include a tag</b>
        /// </summary>
        public List<TagCount>? TagCounts { get; set; } = null;

    }
}

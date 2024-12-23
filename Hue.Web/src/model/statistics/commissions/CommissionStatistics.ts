import ArtistCount from "./ArtistCount";
import CharacterCount from "./CharacterCount";
import CumulativeSpendingData from "./CumulativeSpendingData";
import DateValuePair from "./DateValuePair";
import TagCount from "./TagCount";
import TypeCount from "./TypeCount";

export default class CommissionStatistics {
    public types: TypeCount[] = [];
    public cumulativeSpending: CumulativeSpendingData[] = [];
    public timeToCompletion: DateValuePair[] | undefined;
    public artistCounts: ArtistCount[] | undefined
    public characterCounts: CharacterCount[] | undefined
    public tagCounts: TagCount[] | undefined
}
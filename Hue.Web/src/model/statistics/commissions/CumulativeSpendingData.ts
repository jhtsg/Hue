import DateValuePair from "./DateValuePair";

export default class CumulativeSpendingData extends DateValuePair {
    public runningTotal: number = 0;
    public started: boolean = true;
}
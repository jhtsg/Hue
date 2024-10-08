import Artist from "../artist/Artist";
import Character from "../character/Character";
import Identifiable from "../Identifiable";
import CommissionTag from "./CommissionTag";

export default class Commission extends Identifiable {
    public name: string = "";
    public description: string = "";
    public price: number = 0;
    public charCount: number = 0;
    public postTags: string = "";
    public postDescription: string = "";
    public daysToComplete?: number
    public status: number = 0;
    public type: number = 0;
    public createTs?: string;
    public updateTs?: string;
    public startTs?: string;
    public doneTs?: string;
    public artist?: Artist
    public characters: Character[] = []
    public commissionTags: CommissionTag[] = []
}
import Identifiable from "../Identifiable";

export default class CommissionAssociatedImage extends Identifiable {
    public notes: string = "";
    public type: number = 0;
    public createTs?: string;
}
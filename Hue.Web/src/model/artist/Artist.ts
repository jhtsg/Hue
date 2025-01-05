import Identifiable from "../Identifiable";

export default class Artist extends Identifiable {
    public name: string = "";
    public socialUrl: string = "";
    public paymentUrl: string = "";
    public commSheetUrl: string = "";
    public hasImage: boolean = false;
    public isRetired: boolean = false;
}
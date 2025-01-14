import Identifiable from "../Identifiable";

export default class ServiceAddition extends Identifiable {
    public name: string = "";
    public description: string = "";
    public price: number = 0;
    public limit: number = -1;
    public dirty: boolean = false;

}
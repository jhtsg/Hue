import Identifiable from "../Identifiable";

export default class CommissionAlert extends Identifiable {
    public name: string = "";
    public status: number = 0;
    public daysOverdue: number = 0;
}
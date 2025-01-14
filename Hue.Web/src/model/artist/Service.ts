import Identifiable from "../Identifiable";
import Artist from "./Artist";
import ServiceAddition from "./ServiceAddition";

export default class Service extends Identifiable {
    public name: string = "";
    public description: string = "";
    public basePrice: number = 0;
    public currency: string = "USD";
    public additions: ServiceAddition[] = []
    public artist: Artist = {} as Artist
    public commissionType: number = 0

}
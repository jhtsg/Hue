import Identifiable from "../Identifiable";
import CharacterCategory from "./CharacterCategory";

export default class Character extends Identifiable {
    public name: string = "";
    public species: string = "";
    public description: string = "";
    public color: string = "";
    public isPrimary?: boolean;
    public category?: CharacterCategory;
}
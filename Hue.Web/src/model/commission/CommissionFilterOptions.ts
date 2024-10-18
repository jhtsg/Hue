export default class CommissionFilterOptions {

    //This is NOT a mistake, here we Capitalize the key because the keys still need to be capital for the backend to be on the query

    [key: string]: any

    public Page: number = 0;
    public ArtistId?: number;
    public CommissionTagId?: number;
    public CharacterId?: number;
    public CommissionStatus?: number;
    public Year?: number;

    public Query?: string;

}
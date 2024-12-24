export default class DbPongResponse {
    /**Time this ping request was initiated by the backend*/
    public pingTime: string = "";
    /**Time this ping request was replied to by the DB*/
    public pongTime: string = "";
    /**Whether the backend is able to contact the DB */
    public up: boolean = false;

}
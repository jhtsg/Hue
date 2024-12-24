import DbPongResponse from "./DbPongResponse";

export default class PongResponse {
    /**Time this ping request was initiated*/
    public pingTime: string = "";
    /**Time the application was started at*/
    public startupTime: string = "";
    /**Time this ping request was replied to by the server*/
    public pongTime: string = "";
    public dbPingPong?: DbPongResponse
    public pong: string = "";

}
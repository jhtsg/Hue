import LoginRequest from "./LoginRequest";

export default class RegisterRequest extends LoginRequest {
    public constructor(
        public registrationKey: string,
        public isArtist: boolean,
        username: string,
        password: string
    ) { super(username, password) }
}
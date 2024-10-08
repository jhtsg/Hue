export default class ChangePassRequest{
    public constructor(
        public oldPassword:string,
        public newPassword:string
    ){}
}
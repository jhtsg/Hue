export default class User {
    public constructor(
        public username: string,
        public isArtist: boolean,
        public primaryCharacterId?: number,
        public primaryCharacterColor?: string
    ) { }
}
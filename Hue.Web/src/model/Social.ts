export default class Social {
    public site: string = ''
    public username: string = ''

    public static fromUrl(url: string): Social {

        //Determine the host
        try {
            const u = new URL(url);
            const segments = u.pathname.split('/').filter(Boolean);

            return {
                site: u.host,
                username: segments[segments.length - 1]
            } as Social;
        } catch {
            return {
                site: "",
                username: ""
            } as Social
        }

    }

}
export default class Social {
    public site: string = ''
    public username: string = ''
    public url: string = '';

    public static fromUrl(url: string): Social {

        //Determine the host
        try {
            const u = new URL(url);
            const segments = u.pathname.split('/').filter(Boolean);
            return {
                site: u.host,
                username: segments[segments.length - 1],
                url: u.host.toLowerCase().includes("paypal") && url.includes("@") ? "https://www.paypal.com/myaccount/transfer/homepage" : url,
            } as Social;
        } catch {
            return {
                site: "",
                username: "",
                url: '',
            } as Social
        }

    }

}
import Social from "../../model/Social";

export default function SocialIcon(props: {
    social: Social
    size: number
}) {

    const { social, size } = props;
    const icon = (host: string) => {
        switch (true) {
            case host.toLowerCase().includes('itaku'):
                return "itaku"
            case host.toLowerCase().includes('twitter'):
            case host.toLowerCase().includes('x.com'):
                return "twitter"
            case host.includes('bsky'):
                return "bsky"
            case host.includes('reddit'):
                return "reddit"
            case host.includes('furaffinity'):
                return "fa"
            case host.includes('instagram'):
                return "instagram"
            case host.includes('paypal'):
                return "paypal"
            default:
                return "globe"
        }
    }

    return <img src={`/socialIcons/${icon(social.site)}.png`} width={size} />


}
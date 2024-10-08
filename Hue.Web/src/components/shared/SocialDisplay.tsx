import { CSSProperties } from "react";
import Social from "../../model/Social";
import SocialIcon from "./SocialIcon";
import { Box } from "@mui/material";

export default function SocialDisplay(props: {
    url: string
    link?: boolean
    iconSize?: number,
    style?: CSSProperties
}) {

    const { url, iconSize, style, link } = props;
    const social = Social.fromUrl(url);

    const usernamePrefix = (host: string) => {
        switch (true) {
            case host.toLowerCase().includes('twitter'):
            case host.toLowerCase().includes('x.com'):
            case host.toLowerCase().includes('bsky'):
            case host.toLowerCase().includes('itaku'):
                return "@"
            case host.toLowerCase().includes('furaffinity'):
                return "~"
            case host.includes('reddit'):
                return "/u/"
            default:
                return ""
        }
    }

    const openLink = () => {
        window.open(url)
    }

    return <>
        <Box style={{
            display: "flex",
            color: "#999999",
            fontSize: `.8em`,
            cursor: link ? 'pointer' : undefined,
            ...style
        }}
            onClick={link ? openLink : undefined}
        >
            <div style={{ marginRight: "5px" }}><SocialIcon size={iconSize ?? 16} social={social} /></div>
            <div style={{ marginTop: "-2px" }}>{usernamePrefix(social.site)}{social.username}</div>
        </Box>
    </>


}
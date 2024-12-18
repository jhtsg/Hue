import { Box } from "@mui/material";
import { CSSProperties, } from "react";
import { BeachAccess } from "@mui/icons-material";
import SafeAvatar from "./SafeAvatar";

export default function RetiredAvatar(props: {
    src?: string,
    size?: number,
    text?: string,
    color?: string,
    style?: CSSProperties,
    hasImage: boolean,
    variant?: "rounded" | "circular" | "square"
}) {

    const { size, text, src, variant, color, style, hasImage } = props;
    return <Box sx={{ position: "relative", display: "inline-block", width: size, height: size, }}>
        <SafeAvatar hasImage={hasImage} color={color} size={size} src={src} style={style} text={text} variant={variant} />

        <Box
            sx={{
                position: "absolute",
                top: 0, left: 0,
                width: size, height: size,
                backgroundColor: `rgba(128, 128, 128, ${(size ?? 0) > 64 ? ".75" : ".5"})`,
                color: "white", display: "flex",
                alignItems: "center", justifyContent: "center", flexDirection: "column"
            }}
        >
            <div><BeachAccess /></div>
            {/* {(size ?? 0) > 64 && <div>Retired</div>} */}
        </Box>
    </Box>
}
import { Avatar } from "@mui/material";
import { stringToColor } from "./Utils";
import { CSSProperties, useEffect, useState } from "react";

export default function SafeAvatar(props: {
    src?: string,
    size?: number,
    text?: string,
    color?: string,
    style?: CSSProperties,
    hasImage: boolean,
    variant?: "rounded" | "circular" | "square"
}) {

    const { size, text, src, variant, color, style, hasImage } = props

    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false)
    }, [src])

    return <Avatar
        variant={variant ?? "rounded"} style={style}
        sx={{ bgcolor: color ?? (text ? stringToColor(text) : '#999'), width: size, height: size }}
        src={!imgError && hasImage ? src ?? undefined : undefined} // Fallback to undefined if there's an error
        onError={() => setImgError(true)} // If image fails to load, set error state
    >
        {text?.[0] ?? '?'}
    </Avatar>
}
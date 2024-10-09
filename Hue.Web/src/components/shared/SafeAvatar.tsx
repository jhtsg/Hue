import { Avatar } from "@mui/material";
import { stringToColor } from "./Utils";
import { useEffect, useState } from "react";

export default function SafeAvatar(props: {
    src?: string,
    size?: number,
    text?: string,
    color?: string
    variant?: "rounded" | "circular" | "square"
}) {

    const { size, text, src, variant, color } = props

    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false)
    }, [src])

    return <Avatar
        variant={variant ?? "rounded"}
        sx={{ bgcolor: color ?? (text ? stringToColor(text) : '#999'), width: size, height: size }}
        src={!imgError ? src ?? undefined : undefined} // Fallback to undefined if there's an error
        onError={() => setImgError(true)} // If image fails to load, set error state
    >
        {text?.[0] ?? '?'}
    </Avatar>
}
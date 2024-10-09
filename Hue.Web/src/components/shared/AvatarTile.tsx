import { Card, CardActionArea, Typography } from "@mui/material";
import SafeAvatar from "./SafeAvatar";

export default function AvatarTile(props: {
    children?: any,
    width?: number,
    avatarUrl?: string,
    avatarSize?: number,
    avatarString: string
    avatarColor?: string
    onClick?: (e: any) => void
}) {

    const { avatarUrl, onClick, children, width, avatarString, avatarColor } = props
    const avatarSize = props.avatarSize ?? 32

    const handleClick = (e: any) => {
        e.stopPropagation();
        if (onClick) onClick(e);

    }

    return <Card style={{ width: !width ? '100%' : `${width}px`, margin: "5px" }} elevation={4}>
        <CardActionArea style={{ padding: "10px" }} onClick={handleClick}>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center", maxWidth: width ? `${width - 20}px` : '' }}>
                <div style={{ marginRight: "20px" }}>
                    <SafeAvatar color={avatarColor} size={avatarSize} src={avatarUrl} text={avatarString} />
                </div>
                <div style={width ? { width: `${width - 80}px` } : { flex: "1" }}>
                    <Typography noWrap>{children}</Typography>
                </div>
            </div>
        </CardActionArea>
    </Card>

}
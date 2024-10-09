import { Card, CardActionArea, Typography } from "@mui/material";
// @ts-ignore
import { LightenDarkenColor } from 'lighten-darken-color';


export default function ColorPill(props: {
    color: string,
    text: string,
    onClick?: () => void
}) {

    const { color, text, onClick } = props

    const Body = () => <div style={{ display: "flex" }}>
        <div style={{ padding: "0px 5px", backgroundColor: color }}></div>
        <div style={{ padding: "2px 10px 2px 4px", flex: "1", backgroundColor: LightenDarkenColor(color, -30) }}>{text}</div>
    </div>

    return <Card style={{ margin: "5px" }} elevation={8}>
        {onClick ? <CardActionArea onClick={onClick}>
            <Typography><Body /></Typography>
        </CardActionArea> : <Body />}
    </Card>
}
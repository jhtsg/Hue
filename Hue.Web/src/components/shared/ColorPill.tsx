import { Card, CardActionArea, Typography } from "@mui/material";


export default function ColorPill(props: {
    color: string,
    children: any,
    onClick?: () => void
}) {

    const { color, children, onClick } = props


    const Body = () => <div style={{ backgroundColor: color }}>
        <div style={{ marginLeft: "10px", padding: "2px 10px 2px 4px", backgroundColor: 'rgba(0,0,0,0.25)' }}>{children}</div>
    </div>

    return <Card style={{ margin: "5px" }} elevation={8}>
        {onClick ? <CardActionArea onClick={onClick}>
            <Typography><Body /></Typography>
        </CardActionArea> : <Body />}
    </Card>
}
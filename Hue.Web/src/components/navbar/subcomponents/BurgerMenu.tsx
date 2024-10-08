import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BurgerMenu(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props

    const close = () => setOpen(false)

    return <Drawer open={open} onClose={close}>
        <Box sx={{ width: 250 }} onClick={close} onKeyDown={close}>
            <div style={{ width: "100%", textAlign: "center", padding: "20px 0px" }}>
                <img style={{ width: "130px" }} src="/logo.png" />
            </div>
            <Divider style={{ marginBottom: "20px" }} />
            <List>
                <BurgerMenuItem navTo="/" image="/icons/statistics.png" text="Dashboard" />
                <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
                <BurgerMenuItem navTo="/commissions" image="/icons/images.png" text="Commissions" />
                <BurgerMenuItem navTo="/characters" image="/icons/chars.png" text="Characters" />
                <BurgerMenuItem navTo="/artists" image="/icons/artist.png" text="Artists" />
            </List>
        </Box>
    </Drawer>

}

function BurgerMenuItem(props: {
    navTo: string,
    text: string
    image: string
}) {

    const { image, navTo, text } = props
    const nav = useNavigate();

    return <ListItem disablePadding>
        <ListItemButton onClick={() => nav(navTo)}>
            <ListItemIcon>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <img src={image} height="30px" />
                </div>
            </ListItemIcon>
            <ListItemText><div style={{ marginLeft: "10px" }}>{text}</div></ListItemText>
        </ListItemButton>
    </ListItem>


}
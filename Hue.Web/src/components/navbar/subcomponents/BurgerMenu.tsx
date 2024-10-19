import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import BarChartIcon from '@mui/icons-material/BarChart';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import GroupsIcon from '@mui/icons-material/Groups';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import PaymentsIcon from '@mui/icons-material/Payments';




export default function BurgerMenu(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props

    const close = () => setOpen(false)
    const { user } = useUser();
    const artist = user?.isArtist

    return <Drawer open={open} onClose={close}>
        <Box sx={{ width: 250 }} onClick={close} onKeyDown={close}>
            <div style={{ width: "100%", textAlign: "center", padding: "20px 0px" }}>
                <img style={{ width: "130px" }} src="/logo.png" />
            </div>
            <Divider style={{ marginBottom: "20px" }} />
            <List>
                <BurgerMenuItem navTo="/" icon={<BarChartIcon fontSize="large" />} text="Dashboard" />
                <BurgerMenuItem navTo="/search" icon={<ImageSearchIcon fontSize="large" />} text="Advanced Search" />
                <Divider style={{ marginTop: "20px", marginBottom: "20px" }} />
                <BurgerMenuItem navTo="/commissions" icon={<PhotoLibraryIcon fontSize="large" />} text="Commissions" />
                <BurgerMenuItem navTo="/characters" icon={<GroupsIcon fontSize="large" />} text="Characters" />
                <BurgerMenuItem navTo="/artists" icon={artist ? <PaymentsIcon fontSize="large" /> : <ColorLensIcon fontSize="large" />} text={artist ? "Clients" : "Artists"} />
            </List>
        </Box>
    </Drawer>

}

function BurgerMenuItem(props: {
    navTo: string,
    text: string
    image?: string
    icon?: any
}) {

    const { icon, image, navTo, text } = props
    const nav = useNavigate();

    return <ListItem disablePadding>
        <ListItemButton onClick={() => nav(navTo)}>
            <ListItemIcon>
                <div style={{ width: "100%", textAlign: "center" }}>
                    {icon ? icon : <img src={image} height="30px" />}
                </div>
            </ListItemIcon>
            <ListItemText><div style={{ marginLeft: "10px" }}>{text}</div></ListItemText>
        </ListItemButton>
    </ListItem>


}
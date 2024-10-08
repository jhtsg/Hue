import { useTheme } from "@emotion/react"
import { Menu as MenuIcon } from "@mui/icons-material"
import { AppBar, Avatar, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip } from "@mui/material"
import { useState } from "react"
import { useUser } from "../hooks/useUser"
import { useSnackbar } from "notistack"
import useApi from "../hooks/useApi"
import { logout } from "../../api/Auth"
import ChangePassModal from "./subcomponents/ChangePassModal"
import BurgerMenu from "./subcomponents/BurgerMenu"

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false)
    const { user } = useUser();

    return <>
        <AppBar color={"primary"} enableColorOnDark>
            <Toolbar>
                <div style={{ display: "flex", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                    {user && <IconButton onClick={() => { setMenuOpen(true) }} style={{ marginRight: "15px" }}>
                        <MenuIcon />
                    </IconButton>}
                    <div style={{ flex: "1" }}>
                        <img src={"/logo.png"} alt="Hue logo" height="50" />
                    </div>
                    <UserButton />
                </div>
            </Toolbar>
        </AppBar>

        <BurgerMenu open={menuOpen} setOpen={setMenuOpen} />

    </>

}

function UserButton() {

    const theme = useTheme() as any;
    const { user, loading, refreshAuth } = useUser();
    const [changePassModalOpen, setChangePassModalOpen] = useState(false)
    const [profileMenuEl, setProfileMenuEl] = useState(false as any);
    const { enqueueSnackbar } = useSnackbar();

    const logoutApi = useApi(logout);

    if (loading) return <></>

    const handleProfileClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setProfileMenuEl(e.currentTarget);
    };

    const handleLogout = () => {
        logoutApi.fetch(() => {
            enqueueSnackbar("Logged out!", { variant: "success" })
            refreshAuth();
        });
        handleCloseProfileMenu();
    }

    const handleChangePass = () => {
        setChangePassModalOpen(true)
        handleCloseProfileMenu()
    }

    const handleCloseProfileMenu = () => {
        setProfileMenuEl(null);
    };

    return <>
        {user ? <>
            <Tooltip title={user.username}>
                <IconButton
                    onClick={handleProfileClick}
                    size="small"
                    sx={{ ml: 2 }}
                >
                    <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>{user.username.charAt(0)}</Avatar>
                </IconButton>
            </Tooltip>
            <Menu anchorEl={profileMenuEl} open={!!profileMenuEl} onClose={handleCloseProfileMenu}>
                <ListItem>
                    <ListItemIcon>
                        <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: theme.palette.secondary.main }}>{user.username.charAt(0)}</Avatar>
                    </ListItemIcon>
                    <ListItemText>
                        <div>
                            {user.username}
                        </div>
                        <div style={{ color: "#999999", fontSize: "0.8em" }}>
                            {user.isArtist ? "Artist" : "Commissioner"}
                        </div>
                    </ListItemText>
                </ListItem>
                <Divider style={{ margin: "10px 0" }} />
                <MenuItem onClick={handleChangePass}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
            : <></>
        }

        <ChangePassModal open={changePassModalOpen} setOpen={setChangePassModalOpen} />
    </>

}
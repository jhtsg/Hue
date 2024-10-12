import { Menu as MenuIcon } from "@mui/icons-material"
import { AppBar, IconButton, Toolbar } from "@mui/material"
import { useState } from "react"
import { useUser } from "../hooks/useUser"
import BurgerMenu from "./subcomponents/BurgerMenu"
import { UserButton } from "./subcomponents/UserButton"

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
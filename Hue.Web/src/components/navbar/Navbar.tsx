import { Menu as MenuIcon, Search } from "@mui/icons-material"
import { AppBar, IconButton, Toolbar } from "@mui/material"
import { useEffect, useState } from "react"
import { useUser } from "../hooks/useUser"
import BurgerMenu from "./subcomponents/BurgerMenu"
import { UserButton } from "./subcomponents/UserButton"
import GlobalSearchBar from "./subcomponents/GlobalSearchBar"
import { useWindowDimensions } from "../hooks/useWindowDimensions"
import { useLocation } from "react-router-dom"

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false)
    const [searchBar, setSearchBar] = useState(false)
    const { user } = useUser();
    const location = useLocation();

    const { width } = useWindowDimensions();
    const fullWidthSearchbar = width < 750

    useEffect(() => {
        setSearchBar(false)
    }, [location])

    return <>
        <AppBar color={"primary"} enableColorOnDark>
            <Toolbar>
                {searchBar && fullWidthSearchbar ? <div style={{ width: "100%" }}>
                    <GlobalSearchBar onExit={() => setSearchBar(false)} />
                </div>

                    : <div style={{ display: "flex", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>

                        {/* Left Side */}
                        <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
                            {user && <IconButton onClick={() => { setMenuOpen(true) }} style={{ marginRight: "15px" }}>
                                <MenuIcon />
                            </IconButton>}
                            <img src={"/logo.png"} alt="Hue logo" height="50" />
                        </div>

                        {/* Right side */}
                        <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
                            {!searchBar ? <>
                                <IconButton onClick={() => setSearchBar(true)} disabled={!user}><Search /></IconButton>
                            </> : <div hidden={!user} style={{ width: "400px" }}>
                                <GlobalSearchBar onExit={() => setSearchBar(false)} />
                            </div>}
                            <UserButton />
                        </div>
                    </div>}
            </Toolbar>
        </AppBar>

        <BurgerMenu open={menuOpen} setOpen={setMenuOpen} />

    </>

}
import { useTheme } from "@emotion/react";
import { useUser } from "../../hooks/useUser";
import { CSSProperties, useState } from "react";
import { useSnackbar } from "notistack";
import useApi from "../../hooks/useApi";
import { logout } from "../../../api/Auth";
import { Avatar, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import ChangePassModal from "./ChangePassModal";
import SafeAvatar from "../../shared/SafeAvatar";
import { characterImage, updatePrimaryCharacter } from "../../../api/Char";
import CharacterSelector from "../../pages/chars/subcomponents/CharacterSelector";
import AreYouSureModal from "../../shared/modals/AreYouSureModal";
import Character from "../../../model/character/Character";
import CharacterTile from "../../pages/chars/subcomponents/CharacterTile";

export function UserButton() {

    const { user, loading, refreshAuth } = useUser();
    const [changePassModalOpen, setChangePassModalOpen] = useState(false)
    const [profileMenuEl, setProfileMenuEl] = useState(false as any);
    const { enqueueSnackbar } = useSnackbar();

    const [characterSelector, setCharacterSelector] = useState(false)
    const [newChar, setNewChar] = useState(undefined as undefined | Character)

    const logoutApi = useApi(logout);
    const updatePrimaryCharacterApi = useApi(updatePrimaryCharacter);

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
                    onClick={handleProfileClick} size="small"
                    sx={{ ml: 2 }}
                >
                    <UserProfile />
                </IconButton>
            </Tooltip>

            <Menu anchorEl={profileMenuEl} open={!!profileMenuEl} onClose={handleCloseProfileMenu}>
                <Tooltip title="Select a Primary Character" enterDelay={500}>
                    <MenuItem onClick={() => {
                        setCharacterSelector(true)
                        handleCloseProfileMenu();
                    }}>
                        <ListItemIcon>
                            <UserProfile style={{ marginRight: "20px" }} />
                        </ListItemIcon>
                        <ListItemText>
                            <div>
                                {user.username}
                            </div>
                            <div style={{ color: "#999999", fontSize: "0.8em" }}>
                                {user.isArtist ? "Artist" : "Commissioner"}
                            </div>
                        </ListItemText>
                    </MenuItem>
                </Tooltip>
                <Divider style={{ margin: "10px 0" }} />
                <MenuItem onClick={handleChangePass}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
            : <></>
        }

        <CharacterSelector open={characterSelector} setOpen={setCharacterSelector} setChar={(val) => {
            setNewChar(val);
            setCharacterSelector(false);
        }} title="Select a new Primary Character" />
        <AreYouSureModal open={!!newChar} setOpen={() => setNewChar(undefined)}
            loading={updatePrimaryCharacterApi.loading}
            onYes={() => {
                updatePrimaryCharacterApi.fetch(() => {
                    setNewChar(undefined)
                    refreshAuth();
                    enqueueSnackbar("Primary character updated!")
                }, undefined, newChar)
            }}
            title={`Set ${newChar?.name} as your primary character?`}
        >
            <div style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <CharacterTile character={newChar ?? new Character()} onClick={() => { }} />
            </div>
            <hr />
            <div style={{ textAlign: 'center' }}>
                {newChar?.name}'s profile will be yours. Not much else, for now.
            </div>
        </AreYouSureModal>
        <ChangePassModal open={changePassModalOpen} setOpen={setChangePassModalOpen} />
    </>

}

export function UserProfile(props: {
    style?: CSSProperties
}) {

    const { style } = props
    const { user } = useUser();
    const theme = useTheme() as any;

    return user?.primaryCharacterId
        ? <SafeAvatar
            color={user.primaryCharacterColor}
            size={32} style={style}
            src={characterImage(user.primaryCharacterId)}
            text={user.username}
        /> :
        <Avatar variant="rounded" style={style}
            sx={{
                width: 32, height: 32,
                bgcolor: theme.palette.secondary.main
            }}>{user?.username.charAt(0)}</Avatar>


}
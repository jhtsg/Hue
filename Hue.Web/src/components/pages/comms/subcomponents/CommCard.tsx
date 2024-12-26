import { Card, CardActionArea, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material"
import Commission from "../../../../model/commission/Commission"
import Character from "../../../../model/character/Character"

import ColorPill from "../../../shared/ColorPill";
import CommissionTag from "../../../../model/commission/CommissionTag";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { commHeaderImage, createCommission, deleteCommission, updateCommission } from "../../../../api/Comm";
import { CommissionStatus } from "../../../../model/commission/CommissionEnums";
import SafeAvatar from "../../../shared/SafeAvatar";
import { characterImage } from "../../../../api/Char";
import { artistImage } from "../../../../api/Artist";
import useApi from "../../../hooks/useApi";
import { useSnackbar } from "notistack";
import { useRefresh } from "../../../hooks/useRefresh";
import { REFRESH_ALL_COLUMNS } from "../../../contexts/RefreshContext";
import TransitionModal from "./TransitionModal/TransitionModal";
import { Archive, ArrowBack, ArrowForward, ContentCopy, Delete, Edit, Public } from "@mui/icons-material";
import AreYouSureModal from "../../../shared/modals/AreYouSureModal";
import CloneModal from "./CloneModal/CloneModal";

//An individual commission card
export default function CommCard(props: {
    commission: Commission
    noContextMenu?: boolean
}) {

    const { commission, noContextMenu } = props
    const nav = useNavigate()
    const { enqueueSnackbar } = useSnackbar();
    const [imageError, setImageError] = useState(!commission.hasImage)

    const updateCommApi = useApi(updateCommission);
    const cloneCommApi = useApi(createCommission);
    const deleteCommApi = useApi(deleteCommission);

    const { refresh } = useRefresh(REFRESH_ALL_COLUMNS);

    const color = commission?.characters?.[0]?.color ?? "#999999"

    const [transitionComm, setTransitionComm] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [cloneOpen, setCloneOpen] = useState(false);

    const [contextMenu, setContextMenu] = useState(undefined as {
        mouseX: number;
        mouseY: number;
    } | undefined);

    useEffect(() => {
        if (!commission.hasImage) return; //Do not conduct this check if we're already told there's no image.
        const img = new Image();
        img.src = commHeaderImage(commission.id)
        img.onerror = () => {
            setImageError(true)
        }
    }, [])

    const handleClick = () => nav(`/commissions/${commission.id}`);

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === undefined
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                // Other native context menus might behave different.
                // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                undefined,
        );
    };

    const handleClose = () => {
        setContextMenu(undefined);
    };

    const handleView = () => {
        handleClose();
        window.open(commission.postUrl);
    }

    const handleArchive = () => {
        handleClose();

        const val = { ...commission }
        val.status = -1
        val.startTs = val.startTs ? val.startTs.endsWith("Z") ? val.startTs : val.startTs + "Z" : undefined
        val.doneTs = val.doneTs ? val.doneTs.endsWith("Z") ? val.doneTs : val.doneTs + "Z" : undefined
        val.publishTs = val.publishTs ? val.publishTs.endsWith("Z") ? val.publishTs : val.publishTs + "Z" : undefined

        enqueueSnackbar("Moving...", { variant: 'info' })

        updateCommApi.fetch(() => {
            enqueueSnackbar("Commission archived!", { variant: 'success' })
            refresh();
        }, () => {
            enqueueSnackbar("Could not archive!", { variant: 'error' })
        }, val);
    }

    const handleAdvanceState = () => {
        handleClose();

        const val = { ...commission }
        val.status = commission.status + 1
        val.startTs = val.startTs ? val.startTs.endsWith("Z") ? val.startTs : val.startTs + "Z" : undefined
        val.doneTs = val.doneTs ? val.doneTs.endsWith("Z") ? val.doneTs : val.doneTs + "Z" : undefined
        val.publishTs = val.publishTs ? val.publishTs.endsWith("Z") ? val.publishTs : val.publishTs + "Z" : undefined


        if (commission.status === -1) {
            enqueueSnackbar("Moving...", { variant: 'info' })
            updateCommApi.fetch(() => {
                enqueueSnackbar("Commission Moved!", { variant: 'success' })
                refresh();
            }, () => {
                enqueueSnackbar("Could not archive!", { variant: 'error' })
            }, { ...commission, status: 0 } as Commission);
        } else {
            setTransitionComm(true)
        }

    }

    const handleDelete = () => {
        handleClose();
        setDeleteOpen(true);
    }

    const handleRealDelete = () => {
        deleteCommApi.fetch(() => {
            enqueueSnackbar("Commission deleted!", { variant: 'success' })
            setDeleteOpen(false)
            refresh();
        }, undefined, commission.id)
    }

    const handleRollbackState = () => {
        handleClose();

        const val = { ...commission }
        val.status = commission.status - 1
        val.startTs = val.startTs ? val.startTs.endsWith("Z") ? val.startTs : val.startTs + "Z" : undefined
        val.doneTs = val.doneTs ? val.doneTs.endsWith("Z") ? val.doneTs : val.doneTs + "Z" : undefined
        val.publishTs = val.publishTs ? val.publishTs.endsWith("Z") ? val.publishTs : val.publishTs + "Z" : undefined


        enqueueSnackbar("Moving...", { variant: 'info' })

        updateCommApi.fetch(() => {
            enqueueSnackbar("Commission moved!", { variant: 'success' })
            refresh();

        }, () => {
            enqueueSnackbar("Could not move!", { variant: 'error' })
        }, val);
    }

    const handleClone = () => {
        handleClose();
        setCloneOpen(true);
    }

    const handleRealClone = (val: Commission) => {
        cloneCommApi.fetch(() => {
            enqueueSnackbar("Commission cloned!", { variant: 'success' })
            setCloneOpen(false)
            refresh();
        }, undefined, val)
    }

    const anyMetadata = commission.artist || commission.charCount > 0 || commission.price > 0 || commission.characters.length > 0


    return <>
        <Card elevation={10} style={{ margin: "10px" }}>
            <CardActionArea onClick={() => nav(`/commissions/${commission.id}`)} onContextMenu={handleContextMenu}>
                <div style={{
                    paddingBottom: imageError ? "15%" : "25%",
                    display: "block",
                    boxSizing: 'border-box',
                    backgroundColor: color,
                    backgroundImage: imageError ? `
                repeating-linear-gradient(
                    45deg, /* Diagonal angle */
                    rgba(0,0,0,0), /* First color stop (the given color) */
                    rgba(0,0,0,0) 10px, /* Width of the first stripe */
                    rgba(0,0,0,0.15) 10px, /* Slightly darker stripe */
                    rgba(0,0,0,0.15) 20px /* Total width of a stripe pair */
                )
            ` : `url("${commHeaderImage(commission.id)}")`,
                    backgroundPosition: imageError ? undefined : 'center',
                    backgroundRepeat: imageError ? undefined : 'no-repeat',
                    backgroundSize: imageError ? undefined : 'cover'
                }}>
                </div>
                <div style={{ padding: "15px", fontSize: "1.1em" }}>
                    <div><b>{commission.name}</b></div>
                    <div style={{ fontSize: ".75em", display: "flex" }}>
                        <div style={{ flex: "1", alignContent: "center" }}>
                            <DateRow startDate={commission.startTs} doneDate={commission.doneTs} />
                        </div>
                        {noContextMenu && <div style={{ marginRight: "-5px", width: "100px" }}>
                            <ColorPill color="#444444">{commission.status === -1 ? 'Archived' : CommissionStatus[commission.status]}</ColorPill>
                        </div>}
                    </div>

                    {anyMetadata && <>
                        <hr />
                        <CharRow characters={commission.characters} />
                        <MetadataRow commission={commission} />
                    </>
                    }
                    {commission.commissionTags.length > 0 && <>
                        <hr />
                        <TagRow tags={commission.commissionTags} />
                    </>}
                </div>
            </CardActionArea>
        </Card>

        <TransitionModal comm={commission} open={transitionComm} setOpen={setTransitionComm} />
        <CloneModal commission={commission} open={cloneOpen} setOpen={setCloneOpen} onOk={handleRealClone} loading={cloneCommApi.loading} />

        <Menu
            open={!!contextMenu}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== undefined
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
        >
            <MenuItem onClick={handleClick}>
                <ListItemIcon><Edit /></ListItemIcon>
                <ListItemText primary='Edit' />
            </MenuItem>
            {
                commission.status === 4 && <MenuItem onClick={handleView} disabled={commission.postUrl?.trim().length === 0}>
                    <ListItemIcon><Public /></ListItemIcon>
                    <ListItemText primary='View Post' />
                </MenuItem>
            }

            {!noContextMenu && <>
                <Divider />
                {commission.status !== CommissionStatus.length - 1 && <MenuItem onClick={handleAdvanceState}>
                    <ListItemIcon><ArrowForward /></ListItemIcon>
                    <ListItemText primary={`Move to ${CommissionStatus[commission.status + 1]}`} />
                </MenuItem>}
                {commission.status > 0 && <MenuItem onClick={handleRollbackState} >
                    <ListItemIcon><ArrowBack /></ListItemIcon>
                    <ListItemText primary={`Move to ${CommissionStatus[commission.status - 1]}`} />
                </MenuItem>}
                <Divider />
                <MenuItem onClick={handleClone}>
                    <ListItemIcon><ContentCopy /></ListItemIcon>
                    <ListItemText primary='Clone' />
                </MenuItem>
                {commission.status == -1 ? <MenuItem onClick={handleDelete}>
                    <ListItemIcon><Delete /></ListItemIcon>
                    <ListItemText primary='Delete' />
                </MenuItem> :
                    <MenuItem onClick={handleArchive}>
                        <ListItemIcon><Archive /></ListItemIcon>
                        <ListItemText primary='Archive' />
                    </MenuItem>
                }
            </>}
        </Menu>

        {/* Performance */}
        {commission.status === -1 && <AreYouSureModal open={deleteOpen} setOpen={setDeleteOpen}
            error={deleteCommApi.error} loading={deleteCommApi.loading} onYes={handleRealDelete} >
            Are you sure you want to delete this commission?
        </AreYouSureModal>}

    </>
}

function DateRow(props: {
    startDate?: string,
    doneDate?: string
}) {

    const { doneDate, startDate } = props

    if (!startDate) { return <>Unscheduled</> }
    if (!doneDate) { return <>Started {new Date(startDate).toLocaleDateString()}</> }
    return <>{new Date(startDate).toLocaleDateString()} - {new Date(doneDate).toLocaleDateString()}</>

}

function CharRow(props: {
    characters?: Character[]
}) {

    const { characters } = props
    if (!characters || characters.length === 0) { return <></> }

    return <div style={{ display: "flex", flexWrap: "wrap", fontSize: ".75em", marginLeft: "-5px" }}>
        {characters.map(a => <ColorPill color={a.color}>
            <div style={{ display: "flex", alignItems: 'center' }}>
                <div style={{ marginRight: "5px" }}>
                    <SafeAvatar hasImage={a.hasImage} color="#999999" text={a.name} src={characterImage(a.id)} size={16} />
                </div>
                <div>{a.name}</div>
            </div>
        </ColorPill>)}
    </div>
}


function MetadataRow(props: {
    commission: Commission
}) {

    const { commission } = props
    if (!commission) { return <></> }

    return <div style={{ display: "flex", flexWrap: "wrap", fontSize: ".75em", marginLeft: "-5px" }}>
        {commission.artist && <ColorPill color='#888888'>
            <div style={{ display: "flex", alignItems: 'center' }}>
                <div style={{ marginRight: "5px" }}>
                    🎨
                </div>
                <div style={{ marginRight: "5px" }}>
                    <SafeAvatar hasImage={commission.artist.hasImage} color="#999999" text={commission.artist.name} src={artistImage(commission.artist.id)} size={16} />
                </div>
                <div>{commission.artist.name}</div>
            </div>
        </ColorPill>}
        {commission.price > 0 && <ColorPill color={
            commission.price >= 80 ? '#BB5555'
                : commission.price >= 50 ? '#BBBB55' : '#55BB55'

        }>💵 ${commission.price}</ColorPill>}
        {commission.charCount > 0 && <ColorPill color={
            commission.charCount > 3 ? '#995555' : commission.charCount === 2 ? '#999955' : '#559955'
        }>👥 Chars: {commission.charCount}</ColorPill>}
    </div>
}

function TagRow(props: {
    tags?: CommissionTag[]
}) {

    const { tags } = props
    if (!tags || tags.length === 0) { return <></> }

    return <div style={{ display: "flex", flexWrap: "wrap", fontSize: ".6em", marginLeft: "-5px" }}>
        {tags.map(a => <ColorPill color={a.color}>#{a.name}</ColorPill>)}
    </div>
}
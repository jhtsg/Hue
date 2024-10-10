import { Card, CardActionArea, Divider, Menu, MenuItem } from "@mui/material"
import Commission from "../../../../model/commission/Commission"
import Character from "../../../../model/character/Character"

// @ts-ignore
import { LightenDarkenColor } from 'lighten-darken-color';
import ColorPill from "../../../shared/ColorPill";
import CommissionTag from "../../../../model/commission/CommissionTag";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { commHeaderImage } from "../../../../api/Comm";
import { CommissionStatus } from "../../../../model/commission/CommissionEnums";
import SafeAvatar from "../../../shared/SafeAvatar";
import { characterImage } from "../../../../api/Char";
import { artistImage } from "../../../../api/Artist";

//An individual commission card
export default function CommCard(props: {
    commission: Commission
    noContextMenu?: boolean
}) {

    const { commission } = props
    const nav = useNavigate()
    const [imageError, setImageError] = useState(false)

    const color = commission?.characters?.[0]?.color ?? "#999999"

    const [contextMenu, setContextMenu] = useState(undefined as {
        mouseX: number;
        mouseY: number;
    } | undefined);

    useEffect(() => {
        const img = new Image();
        img.src = commHeaderImage(commission.id)
        img.onerror = () => {
            setImageError(true)
        }
    }, [])

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

    const anyMetadata = commission.artist || commission.charCount > 0 || commission.price > 0 || commission.characters.length > 0


    return <>
        <Card elevation={10} style={{ margin: "10px" }}>
            <CardActionArea onClick={() => nav(`/commissions/${commission.id}`)} onContextMenu={handleContextMenu}>
                <div style={{
                    paddingBottom: imageError ? "15%" : "25%",
                    display: "block",
                    boxSizing: 'border-box',
                    backgroundImage: imageError ? `
                repeating-linear-gradient(
                    45deg, /* Diagonal angle */
                    ${color}, /* First color stop (the given color) */
                    ${color} 10px, /* Width of the first stripe */
                    ${LightenDarkenColor(color, -20)} 10px, /* Slightly darker stripe */
                    ${LightenDarkenColor(color, -20)} 20px /* Total width of a stripe pair */
                )
            ` : `url("${commHeaderImage(commission.id)}")`,
                    backgroundPosition: imageError ? undefined : 'center',
                    backgroundRepeat: imageError ? undefined : 'no-repeat',
                    backgroundSize: imageError ? undefined : 'cover'
                }}>
                </div>
                <div style={{ padding: "15px", fontSize: "1.1em" }}>
                    <div><b>{commission.name}</b></div>
                    <div style={{ fontSize: ".75em" }}>
                        <DateRow startDate={commission.startTs} doneDate={commission.doneTs} />
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
            {commission.status !== 0 && <MenuItem onClick={handleClose}>Move to {CommissionStatus[commission.status - 1]}</MenuItem>}
            {commission.status !== CommissionStatus.length - 1 && <MenuItem onClick={handleClose}>Move to {CommissionStatus[commission.status + 1]}</MenuItem>}
            <Divider />
            <MenuItem onClick={handleClose}>Archive</MenuItem>
        </Menu>
    </>
}

function DateRow(props: {
    startDate?: string,
    doneDate?: string
}) {

    const { doneDate, startDate } = props

    if (!startDate) {
        return <>Unscheduled</>
    }

    if (!doneDate) {
        return <>Started {new Date(startDate).toLocaleDateString()}</>
    }

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
                    <SafeAvatar color="#999999" text={a.name} src={characterImage(a.id)} size={16} />
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
                    <SafeAvatar color="#999999" text={commission.artist.name} src={artistImage(commission.artist.id)} size={16} />
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
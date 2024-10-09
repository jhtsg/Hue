import { Card, CardActionArea } from "@mui/material"
import Commission from "../../../../model/commission/Commission"
import Character from "../../../../model/character/Character"

// @ts-ignore
import { LightenDarkenColor } from 'lighten-darken-color';
import ColorPill from "../../../shared/ColorPill";
import CommissionTag from "../../../../model/commission/CommissionTag";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { commHeaderImage } from "../../../../api/Comm";

//An individual commission card
export default function CommCard(props: {
    commission: Commission
}) {

    const { commission } = props
    const nav = useNavigate()
    const [imageError, setImageError] = useState(false)

    const color = commission?.characters?.[0]?.color ?? "#999999"

    useEffect(() => {
        const img = new Image();
        img.src = commHeaderImage(commission.id)
        img.onerror = () => {
            setImageError(true)
        }
    }, [])

    const anyMetadata = commission.artist || commission.charCount > 0 || commission.price > 0 || commission.characters.length > 0


    return <Card elevation={10} style={{ margin: "10px" }}>
        <CardActionArea onClick={() => nav(`/commissions/${commission.id}`)}>
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
        {characters.map(a => <ColorPill color={a.color} text={`👤 ${a.name}`} />)}
    </div>
}

function MetadataRow(props: {
    commission: Commission
}) {

    const { commission } = props
    if (!commission) { return <></> }

    return <div style={{ display: "flex", flexWrap: "wrap", fontSize: ".75em", marginLeft: "-5px" }}>
        {commission.artist && <ColorPill color='#888888' text={`🎨 Artist: ${commission.artist.name}`} />}
        {commission.price > 0 && <ColorPill color={
            commission.price > 80 ? '#BB5555'
                : commission.price > 50 ? '#BBBB55' : '#55BB55'

        } text={`💵 Price: $${commission.price}`} />}
        {commission.charCount > 0 && <ColorPill color={
            commission.charCount > 3 ? '#995555' : commission.charCount === 2 ? '#999955' : '#559955'
        } text={`👥 Chars: ${commission.charCount}`} />}
    </div>
}

function TagRow(props: {
    tags?: CommissionTag[]
}) {

    const { tags } = props
    if (!tags || tags.length === 0) { return <></> }

    return <div style={{ display: "flex", flexWrap: "wrap", fontSize: ".6em", marginLeft: "-5px" }}>
        {tags.map(a => <ColorPill color={a.color} text={`#${a.name}`} />)}
    </div>
}
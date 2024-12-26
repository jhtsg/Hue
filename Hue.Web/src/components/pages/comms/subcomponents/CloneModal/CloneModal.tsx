import { useEffect, useState } from "react"
import Commission from "../../../../../model/commission/Commission"
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, TextField } from "@mui/material"
import { CommissionStatus } from "../../../../../model/commission/CommissionEnums"
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions"

export default function CloneModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void,
    commission: Commission
    onOk: (val: Commission) => void
    loading?: boolean
}) {

    const { commission, open, setOpen, onOk, loading } = props

    const { vertical } = useWindowDimensions();

    const [name, setName] = useState(commission.name)
    const [desc, setDesc] = useState(commission.description)
    const [cloneDates, setCloneDates] = useState(false)
    const [cloneStatus, setCloneStatus] = useState(false)
    const [cloneArtist, setCloneArtist] = useState(true);
    const [cloneChars, setCloneChars] = useState(true);
    const [cloneTags, setCloneTags] = useState(true)

    useEffect(() => {
        if (open) {
            setName("CLONE - " + commission.name)
            setDesc(commission.description)
            setCloneDates(false);
            setCloneStatus(false)
            setCloneArtist(true)
            setCloneChars(true)
            setCloneTags(true)
        }
    }, [open])

    const handleOk = () => {
        onOk({
            name: name,
            description: desc,
            type: commission.type,
            status: cloneStatus ? commission.status : 0,

            startTs: cloneDates ? commission.startTs : undefined,
            doneTs: cloneDates ? commission.doneTs : undefined,

            artist: cloneArtist ? commission.artist : undefined,
            price: cloneArtist ? commission.price : 0,

            characters: cloneChars ? commission.characters : [],
            charCount: cloneChars ? commission.charCount : 0,

            commissionTags: cloneTags ? commission.commissionTags : [],

            postDescription: "",
            postTags: "",
            postUrl: "",
            publishTs: undefined

        } as Commission)
    }


    const commaString = (entries: string[]): string => {
        switch (entries.length) {
            case 0:
                return ""
            case 1:
                return entries[0];
            case 2:
                return `${entries[0]} and ${entries[1]}`
            default:
                return `${entries[0]}, ${entries[1]}, and ${entries.length - 2} other(s)`
        }
    }


    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Clone a Commission</DialogTitle>
        <DialogContent style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <TextField name="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField name="Description" value={desc} onChange={(e) => setDesc(e.target.value)} multiline minRows={12} />
            <hr style={{ width: "100%" }} />
            <div style={{ display: "flex", gap: vertical ? "10px" : "20px", flexDirection: vertical ? "column" : undefined }}>
                <FormGroup style={{ flex: "1" }} sx={{ gap: 1 }}>
                    {(commission.startTs?.length ?? 0) === 0 && (commission.doneTs?.length ?? 0) === 0 ? <></> : <CloneCheckbox
                        checked={cloneDates} setChecked={setCloneDates} label="Clone Dates"
                        secondaryLabel="Clone start and end dates for this commission"
                    />}
                    {commission.status !== 0 && <CloneCheckbox
                        checked={cloneStatus} setChecked={setCloneStatus} label="Clone Status"
                        secondaryLabel={`Clone this commissions status of ${CommissionStatus[commission.status]}`}
                    />}
                </FormGroup>

                <FormGroup style={{ flex: "1" }} sx={{ gap: 1 }}>
                    {commission.artist && <CloneCheckbox
                        checked={cloneArtist} setChecked={setCloneArtist} label="Clone Artist"
                        secondaryLabel={`Assign this clone to ${commission.artist?.name}`}
                    />}
                    {commission.characters.length > 0 && <CloneCheckbox
                        checked={cloneChars} setChecked={setCloneChars} label="Clone Characters"
                        secondaryLabel={`Add ${commaString(commission.characters.map(a => a.name))} to this commission`}
                    />}
                    {commission.commissionTags.length > 0 && <CloneCheckbox
                        checked={cloneTags} setChecked={setCloneTags} label="Clone Tags"
                        secondaryLabel={`Tag this commission with ${commaString(commission.commissionTags.map(a => "\"" + a.name + "\""))}`}
                    />}
                </FormGroup>

            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)} style={{ visibility: loading ? "hidden" : undefined }}>Cancel</Button>
            <Button onClick={handleOk} disabled={loading}>{loading ? <CircularProgress size={24} /> : "OK"}</Button>
        </DialogActions>
    </Dialog>
}

function CloneCheckbox(props: {
    checked: boolean,
    setChecked: (val: boolean) => void,
    label: string,
    secondaryLabel: string
}) {

    const { checked, label, secondaryLabel, setChecked } = props

    return <FormControlLabel
        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
        label={<>
            <div>{label}</div>
            <div style={{ fontSize: ".8em", color: "#999999" }}>{secondaryLabel}</div>
        </>}
    />

}
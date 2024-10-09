import { Button, Dialog, DialogActions, DialogContent, InputAdornment, TextField } from "@mui/material";
import CommissionTag from "../../../../model/commission/CommissionTag";
import { useEffect, useState } from "react";
import ColorBox from "../../../shared/ColorBox";

export default function CommTagEditor(props: {
    open: boolean,
    setOpen: (val: boolean) => void,
    tag?: CommissionTag
    onOk: (val: CommissionTag) => void
}) {

    const { open, onOk, setOpen, tag } = props

    const [name, setName] = useState("")
    const [color, setColor] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        setName(tag?.name ?? "")
        setColor(tag?.color ?? "")
        setDescription(tag?.description ?? "")
    }, [open])

    const ok = () => {
        onOk({
            id: tag?.id,
            color: color,
            description: description,
            name: name
        } as CommissionTag)
    }

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='sm'>
        <DialogContent>
            <div style={{ display: "flex", width: "100%", marginBottom: "20px" }}>
                <div style={{ flex: "1", marginRight: "20px" }}>
                    <TextField label="Name" fullWidth
                        value={name} onChange={(e) => setName(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    #
                                </InputAdornment>
                            }
                        }}
                    />
                </div>
                <div>
                    <ColorBox color={color} setColor={setColor} />
                </div>
            </div>
            <TextField label='Description' multiline minRows={5} fullWidth
                value={description} onChange={(e) => setDescription(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => { setOpen(false) }}>Cancel</Button>
            <Button onClick={ok}>OK</Button>
        </DialogActions>
    </Dialog>


}
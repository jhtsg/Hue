import { Button, Dialog, TextField } from "@mui/material";
import CharacterCategory from "../../../../model/character/CharacterCategory";
import { useEffect, useState } from "react";
import ColorBox from "../../../shared/ColorBox";

export default function CharacterCategoryEditorModal(props: {
    open: boolean
    category?: CharacterCategory
    onOk: (val: CharacterCategory) => void
    onCancel: () => void
}) {

    const { category, onCancel, onOk, open } = props
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [color, setColor] = useState("")

    useEffect(() => {
        setName(category?.name ?? "")
        setDesc(category?.description ?? "")
        setColor(category?.color ?? "")
    }, [open]);

    const ok = () => {
        onOk({
            id: category?.id ?? 0,
            name: name,
            color: color,
            description: desc
        } as CharacterCategory)
    }

    return <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
        <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "20px", display: "flex" }}>
                <div style={{ flex: "1" }}>
                    <TextField
                        label="Name" fullWidth
                        value={name} onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div style={{ width: "200px", marginLeft: "20px" }}>
                    <ColorBox color={color} setColor={setColor} />
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <TextField
                    label="Description" fullWidth multiline minRows={5}
                    value={desc} onChange={(e) => setDesc(e.target.value)}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                <Button onClick={ok}>OK</Button>
                <Button onClick={onCancel} style={{ marginRight: "20px" }}>Cancel</Button>
            </div>
        </div>
    </Dialog>

}
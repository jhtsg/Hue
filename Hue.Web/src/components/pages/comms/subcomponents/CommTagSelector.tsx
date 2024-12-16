import { useEffect, useState } from "react"
import { getCommTags } from "../../../../api/CommTag"
import CommissionTag from "../../../../model/commission/CommissionTag"
import useApi from "../../../hooks/useApi"
import { Dialog, DialogContent, DialogTitle, IconButton, Skeleton, TextField } from "@mui/material"
import ColorPill from "../../../shared/ColorPill"
import CommTagEditor from "./CommTagEditor"
import { Add } from "@mui/icons-material"

export default function CommTagSelector(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    setTag: (val: CommissionTag) => void
}) {

    const tagsApi = useApi(getCommTags)
    const { open, setOpen, setTag } = props;

    const [newTagOpen, setNewTagOpen] = useState(false)
    const [filter, setFilter] = useState("")

    useEffect(() => {
        if (open) { tagsApi.fetch(); setFilter("") }
    }, [open])

    return <>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='xs'>
            <DialogTitle>Select a Tag</DialogTitle>
            <DialogContent>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <TextField variant="standard" placeholder="Search" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ flex: "1" }} />
                        <IconButton onClick={() => setNewTagOpen(true)}><Add /></IconButton>
                    </div>
                    <div>
                        {tagsApi.loading ? <Skeleton />
                            : tagsApi.data?.filter(tag => filter.length < 0 || tag.name.includes(filter)).map(tag => <div style={{ marginTop: "5px" }}>
                                <ColorPill
                                    color={tag.color}
                                    onClick={() => setTag(tag)}
                                >#{tag.name}</ColorPill>
                            </div>)
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <CommTagEditor setOpen={setNewTagOpen} open={newTagOpen} onOk={(val) => {
            setNewTagOpen(false)
            setTag(val)
        }} />
    </>
}
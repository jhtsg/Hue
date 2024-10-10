import { useEffect, useState } from "react"
import { getCommTags } from "../../../../api/CommTag"
import CommissionTag from "../../../../model/commission/CommissionTag"
import useApi from "../../../hooks/useApi"
import { Dialog, DialogContent, DialogTitle, Skeleton } from "@mui/material"
import ColorPill from "../../../shared/ColorPill"
import CommTagEditor from "./CommTagEditor"

export default function CommTagSelector(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    setTag: (val: CommissionTag) => void
}) {

    const tagsApi = useApi(getCommTags)
    const { open, setOpen, setTag } = props;

    const [newTagOpen, setNewTagOpen] = useState(false)

    useEffect(() => {
        if (open) { tagsApi.fetch(); }
    }, [open])

    return <>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='xs'>
            <DialogTitle>Select a Tag</DialogTitle>
            <DialogContent>
                <ColorPill
                    color='#999999'
                    onClick={() => setNewTagOpen(true)}
                > Create a Tag </ColorPill>
                {tagsApi.loading ? <Skeleton />
                    : tagsApi.data?.map(tag => <div style={{ marginTop: "5px" }}>
                        <ColorPill
                            color={tag.color}
                            onClick={() => setTag(tag)}
                        >{tag.name}</ColorPill>
                    </div>)
                }
            </DialogContent>
        </Dialog>

        <CommTagEditor setOpen={setNewTagOpen} open={newTagOpen} onOk={(val) => {
            setNewTagOpen(false)
            setTag(val)
        }} />
    </>
}
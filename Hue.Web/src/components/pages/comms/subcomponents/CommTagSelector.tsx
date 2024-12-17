import { useEffect, useState } from "react"
import { getCommTags } from "../../../../api/CommTag"
import CommissionTag from "../../../../model/commission/CommissionTag"
import useApi from "../../../hooks/useApi"
import ColorPill from "../../../shared/ColorPill"
import CommTagEditor from "./CommTagEditor"
import SelectorModal from "../../../shared/modals/SelectorModal"

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
        <SelectorModal
            entries={tagsApi.data} loading={tagsApi.loading}
            open={open} setOpen={setOpen} onSelect={setTag}
            onNewClick={() => setNewTagOpen(true)} type="tag"
            entryFilterDecider={(entry, filter) => entry.name.toLowerCase().includes(filter.toLowerCase())}
            renderEntry={(props) =>
                <ColorPill
                    color={props.entry.color}
                    onClick={props.onClick}
                >#{props.entry.name}</ColorPill>
            }

        />
        <CommTagEditor setOpen={setNewTagOpen} open={newTagOpen} onOk={(val) => {
            setNewTagOpen(false)
            setTag(val)
        }} />
    </>
}
import { Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Tooltip } from "@mui/material";
import Searchbox from "../Searchbox";
import { Add } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

export default function SelectorModal<T>(props: {

    /**Type of thing we're selecting (used for title "Select a {Type}" and for the new button "New {Type}") */
    type?: string;

    /**Whether the entries are loading */
    loading: boolean

    /**Selectable Entry */
    entries: T[]

    /**Callback function for when an entry is selected*/
    onSelect: (val: T) => void,

    /** Callback for when the "New" entry is clicked. New button will be hidden if this isn't set*/
    onNewClick?: () => void;

    /**
     * Callback function to render an entry
     * @param props 
     * @returns 
     */
    renderEntry: (props: { entry: T, onClick: () => void }) => ReactNode

    open: boolean,
    setOpen: (val: boolean) => void,

    entryFilterDecider: (entry: T, filter: string) => boolean

}) {

    const { entries: unfilteredEntries, loading, onSelect, open, renderEntry: RenderEntry, setOpen, onNewClick, entryFilterDecider } = props;
    const type = props.type ?? "entry"

    const { maxComponentHeight } = useWindowDimensions();

    const [filter, setFilter] = useState("")

    useEffect(() => {
        if (open) {
            setFilter("")
        }
    }, [open])

    const entries = unfilteredEntries?.filter(entry => filter.length < 0 || entryFilterDecider(entry, filter));

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Select a {type}</DialogTitle>
        <DialogContent>
            <div style={{ display: "flex", gap: "10px" }}>
                <Searchbox filter={filter} setFilter={setFilter} active={open} entries={entries} onKeyEsc={() => setOpen(false)} setEntry={onSelect} />
                {onNewClick && <Tooltip title={`Create a ${type}`}>
                    <IconButton onClick={() => onNewClick()}>
                        <Add />
                    </IconButton>
                </Tooltip>
                }
            </div>
            <div style={{ height: `${maxComponentHeight - 100}px`, overflowY: "auto", marginTop: "10px" }}>
                {loading ? <Skeleton />
                    : entries?.length === 0 ? <div style={{ textAlign: 'center', marginTop: "20px" }}>
                        No Results!
                    </div> : entries?.map(entry => <RenderEntry entry={entry} onClick={() => onSelect(entry)} />)
                }
            </div>

        </DialogContent>
    </Dialog>


}
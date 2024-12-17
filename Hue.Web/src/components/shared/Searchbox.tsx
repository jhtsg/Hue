import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useRef } from "react";

export default function Searchbox<T>(props: {
    filter: string,
    setFilter: (val: string) => void,
    entries?: T[]
    setEntry?: (val: T) => void
    active?: boolean
    onKeyEsc?: () => void
}) {

    const { filter, setFilter, entries, setEntry, onKeyEsc, active } = props;
    const textFieldRef = useRef<HTMLInputElement>(null);

    if (active && textFieldRef.current) {
        textFieldRef.current.focus();
    }

    return <TextField
        inputRef={textFieldRef}
        variant="standard" placeholder="Search" value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ flex: "1" }} slotProps={{
            input: {
                startAdornment: <InputAdornment position="start">
                    <Search />
                </InputAdornment>
            }
        }}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && entries?.length === 1) {
                setEntry?.(entries[0]);
            }
            if (e.key === 'Escape') {
                onKeyEsc?.();
            }
        }}
    />


}
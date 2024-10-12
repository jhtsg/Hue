import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import Character from "../../../../model/character/Character";
import CharsPage from "../CharsPage";

export default function CharacterSelector(props: {
    open: boolean,
    title?: string,
    setOpen: (val: boolean) => void
    setChar: (val: Character) => void
}) {

    const { open, setOpen, setChar, title } = props

    if (!open) return <></>

    return <Dialog
        open={open} onClose={() => { setOpen(false) }}
        maxWidth="xl" fullWidth
    >
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>
            <CharsPage onSelect={(val) => {
                setChar(val)
            }} />
        </DialogContent>
    </Dialog>

}
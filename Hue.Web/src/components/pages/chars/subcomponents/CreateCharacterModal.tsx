import { Dialog } from "@mui/material";
import CharacterPane from "./CharacterPane";

export default function CreateCharacterModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    onOk: () => void
}) {

    const { open, setOpen, onOk } = props

    return <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <div style={{ padding: 20 }}>
            <CharacterPane create open={open} setOpen={setOpen} onOk={() => {
                setOpen(false);
                onOk();
            }} />
        </div>
    </Dialog>

}
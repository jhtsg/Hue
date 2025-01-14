import { Dialog } from "@mui/material";
import ArtistPane from "./ArtistPane";

export default function CreateArtistModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    onOk: () => void
}) {

    const { open, setOpen, onOk } = props

    return <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <div style={{ padding: 20 }}>
            <ArtistPane create open={open} setOpen={setOpen} onOk={() => {
                setOpen(false);
                onOk()
            }} />
        </div>
    </Dialog>


}
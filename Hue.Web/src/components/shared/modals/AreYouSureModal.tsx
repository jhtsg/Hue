import { Button, CircularProgress, Dialog, DialogActions } from "@mui/material"
import ApiAlert from "../ApiAlert";

export default function AreYouSureModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void,
    loading?: boolean,
    error?: any
    onYes: () => void,
    children: any
}) {

    const { onYes, open, setOpen, loading, error, children } = props;

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <div style={{ padding: "20px" }}>
            <ApiAlert result={error} style={{ marginBottom: "20px" }} />
            {children}
        </div>

        <DialogActions>
            {loading
                ? <CircularProgress size={32} />
                : <>
                    <Button disabled={loading} onClick={() => setOpen(false)}>No</Button>
                    <Button disabled={loading} onClick={() => onYes()}>Yes</Button>
                </>
            }
        </DialogActions>

    </Dialog>

}
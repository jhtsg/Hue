import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import ApiAlert from "../ApiAlert";

export default function AreYouSureModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void,
    loading?: boolean,
    error?: any
    onYes: () => void,
    title?: string
    children: any
}) {

    const { onYes, open, setOpen, loading, error, children, title } = props;

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">

        {title && <DialogTitle>{title}</DialogTitle>}

        <DialogContent>
            <ApiAlert result={error} style={{ marginBottom: "20px" }} />
            {children}
        </DialogContent>

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
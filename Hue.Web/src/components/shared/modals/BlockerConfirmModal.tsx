import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Blocker } from "react-router-dom";

export default function BlockerConfirmModal(props: {
    blocker: Blocker
}) {

    const { blocker } = props;

    const reset = () => blocker.reset ? blocker.reset() : console.error("waos");
    const proceed = () => blocker.proceed ? blocker.proceed() : console.error("waos");

    return <Dialog open={blocker.state === 'blocked'} onClose={reset}>
        <DialogTitle>You have unsaved changes</DialogTitle>
        <DialogContent>
            Are you sure you want to leave?
        </DialogContent>
        <DialogActions>
            <Button onClick={reset}>No</Button>
            <Button onClick={proceed}>Yes</Button>
        </DialogActions>
    </Dialog>

}
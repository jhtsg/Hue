import { useEffect, useState } from "react";
import Commission from "../../../../../model/commission/Commission"
import { Alert, Button, DialogActions, DialogContent } from "@mui/material";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { DateInformation } from "../CommPane";
import { dateFromBackend } from "../../../../shared/Utils";

export default function DoneTransitionBody(props: {
    comm: Commission
    update: (val: Commission) => void
    close: () => void
}) {

    const { comm, update, close } = props;
    const { width } = useWindowDimensions();
    const vertical = width < 800

    //Show done time

    const [startTs, setStartTs] = useState("")
    const [doneTs, setDoneTs] = useState("")

    const [dirty, setDirty] = useState(false);
    const markDirty = () => setDirty(true);

    useEffect(() => {
        setStartTs(comm.startTs ? dateFromBackend(comm.startTs) : dateFromBackend(new Date().toISOString()))
        setDoneTs(comm.doneTs ? dateFromBackend(comm.doneTs) : dateFromBackend(new Date().toISOString()))
        setDirty(true) //It will probably be dirty if we're changing the done date
    }, [comm])

    const ok = () => {
        if (!dirty) { update(comm); }
        else {
            update({
                ...comm,
                startTs: startTs,
                doneTs: doneTs
            })
        }
    }

    return <>
        <DialogContent>
            <Alert style={{ marginBottom: "30px" }} severity="info">
                Make sure to set a cover!
            </Alert>
            <DateInformation
                vertical={vertical} markDirty={markDirty}
                startTs={startTs} setStartTs={setStartTs}
                doneTs={doneTs} setDoneTs={setDoneTs}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={ok}>OK</Button>
        </DialogActions>
    </>

}
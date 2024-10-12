import { CircularProgress, Dialog, DialogTitle } from "@mui/material";
import { updateCommission } from "../../../../../api/Comm";
import Commission from "../../../../../model/commission/Commission";
import useApi from "../../../../hooks/useApi";
import { CommissionStatus } from "../../../../../model/commission/CommissionEnums";
import { useSnackbar } from "notistack";
import ScheduledTransitionBody from "./ScheduledTransitionBody";
import DoneTransitionBody from "./DoneTransitionBody";
import PublishedTransitionBody from "./PublishedTransitionBody";
import { useRefresh } from "../../../../hooks/useRefresh";
import { REFRESH_ALL_COLUMNS } from "../../../../contexts/RefreshContext";

export default function TransitionModal(props: {
    comm?: Commission
    open: boolean
    setOpen: (val: boolean) => void
}) {

    const { enqueueSnackbar } = useSnackbar();

    const { comm, open, setOpen } = props;
    const updateCommApi = useApi(updateCommission)
    const { refresh } = useRefresh(REFRESH_ALL_COLUMNS);

    const close = () => { setOpen(false) }

    const update = (val: Commission) => {
        val.status = (comm?.status ?? 0) + 1;
        enqueueSnackbar("Moving...", { variant: 'info' })
        updateCommApi.fetch(() => {
            enqueueSnackbar("Commission moved!", { variant: 'success' })
            refresh();
        }, () => {
            enqueueSnackbar("Something happened!", { variant: 'error' })
        }, val);
        close();
    }

    //The only reason this modal should be open is because
    //we are transitioning the Comm to the next state
    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth='md'>
        <DialogTitle>Transition to {comm ? CommissionStatus[comm?.status + 1] : ''}</DialogTitle>
        {(!comm || updateCommApi.loading) ? <div style={{ display: "flex", alignContent: 'center', justifyContent: 'center' }}>
            <CircularProgress size={32} />
        </div> : <TransitionModalDecider comm={comm} update={update} close={close} />}
    </Dialog>

}

function TransitionModalDecider(props: {
    comm?: Commission
    update: (val: Commission) => void
    close: () => void
}) {
    const { comm, update, close } = props
    switch (comm?.status) {
        case 0:
        case 1:
            return <ScheduledTransitionBody comm={comm} update={update} close={close} />
        case 2:
            return <DoneTransitionBody comm={comm} update={update} close={close} />
        case 3:
            return <PublishedTransitionBody comm={comm} update={update} close={close} />
        default:
            return <></>
    }
}
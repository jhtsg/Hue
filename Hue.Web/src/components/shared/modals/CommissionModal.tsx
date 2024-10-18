import { Dialog } from "@mui/material";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import CommsDisplay from "../../pages/comms/subcomponents/CommsDisplay";

export default function CommissionModal(props: {
    children?: any,
    open: boolean,
    setOpen: (val: boolean) => void,
    filter?: CommissionFilterOptions
}) {

    const { open, setOpen, filter, children } = props
    const { maxComponentHeight } = useWindowDimensions();

    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <div style={{ height: maxComponentHeight, display: 'flex', flexDirection: 'column', padding: "20px" }}>
            {children}
            <hr style={{ width: "100%" }} />
            <div style={{ flex: "1", overflowY: "auto" }}>
                <CommsDisplay filter={filter} />
            </div>
        </div>
    </Dialog>
}
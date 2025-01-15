import { Button, CircularProgress } from "@mui/material"
import CommissionFilterOptions from "../../../../model/commission/CommissionFilterOptions"
import { useCommissions } from "../../../hooks/useCommissions"
import { useWindowDimensions } from "../../../hooks/useWindowDimensions"
import CommCard from "./CommCard"
import { ReactNode } from "react"

export default function CommsDisplay(props: {
    style?: React.CSSProperties
    filter?: CommissionFilterOptions
    noCommsPane?: ReactNode,
    verticalOverride?: boolean
}) {

    const { filter, style, noCommsPane, verticalOverride } = props
    const { vertical } = useWindowDimensions();

    const comms = useCommissions(filter)

    return <>
        <div style={{ maxWidth: "1200px", margin: "40px auto", display: "flex", flexWrap: 'wrap', justifyContent: 'center', ...style }}>
            {comms.loading && comms.comms.length === 0 && <CircularProgress />}
            {comms.count === 0 && (noCommsPane ?? <div style={{ marginTop: "20px", textAlign: 'center' }}>No commissions!</div>)}
            {comms.comms.map(a => <div style={vertical || verticalOverride ? { width: "50%" } : { width: "33%" }}>
                <CommCard commission={a} noContextMenu />
            </div>)}
        </div>
        {comms.hasMore && comms.comms.length > 0 && <div style={{ textAlign: "center", margin: "20px" }}>
            <Button color="secondary" onClick={comms.showMore}>{
                comms.loading ? <CircularProgress size={25} color="inherit" /> : 'Show More'
            }</Button>
        </div>}
    </>

}
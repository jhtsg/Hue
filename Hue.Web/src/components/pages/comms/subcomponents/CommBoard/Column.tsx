import { Button, Card, CircularProgress } from "@mui/material"
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions"
import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../../../../model/commission/CommissionFilterOptions";
import { useRefresh } from "../../../../hooks/useRefresh";
import { REFRESH_ALL_COLUMNS, REFRESH_SPECIFIC_COLUMN_PREFIX } from "../../../../contexts/RefreshContext";
import CommCard from "../CommCard";
import { useCommissions } from "../../../../hooks/useCommissions";

export default function CommColumn(props: {
    year?: number,
    code: number,
    title: string
    fullHeight?: boolean
}) {

    const { code, title, year, fullHeight } = props
    const { height } = useWindowDimensions();
    const { flag: AllColumnsFlag } = useRefresh(REFRESH_ALL_COLUMNS)
    const { flag: StatusColumnsFlag } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + `${code}`)
    const [filter, setFilter] = useState({
        Page: 0,
        year: year,
        CommissionStatus: code
    } as CommissionFilterOptions)

    const comms = useCommissions(filter)

    useEffect(() => {
        setFilter(year ? {
            Page: 0,
            year: year,
            CommissionStatus: code
        } as CommissionFilterOptions : {
            Page: 0,
            CommissionStatus: code
        } as CommissionFilterOptions)
    }, [year])

    useEffect(() => {
        comms.refresh()
    }, [AllColumnsFlag, StatusColumnsFlag])

    return <div style={{ minWidth: "300px", maxWidth: "300px", marginRight: fullHeight ? undefined : "20px", paddingBottom: fullHeight ? undefined : "20px" }}>
        <Card >
            <div style={{ padding: "20px 20px 10px 20px", fontSize: "1.1em", background: "gray" }}>
                <b>{title} ({comms.count ?? '...'})</b>
            </div>
            <div style={{ height: fullHeight ? height - 60 : height - 245, overflowY: "auto" }}>
                {comms.loading && comms.comms.length === 0 ?
                    <div style={{
                        height: "100%",
                        width: "32px", margin: "0 auto",
                        display: "flex", alignItems: "center", justifyContent: 'center'
                    }}>
                        <CircularProgress size={32} />
                    </div> :
                    comms.comms?.map(c => <CommCard commission={c} />)
                }
                {comms.hasMore && <div style={{ textAlign: "center", margin: "20px" }}>
                    <Button color="secondary" onClick={comms.showMore}>{
                        comms.loading ? <CircularProgress size={25} color="inherit" /> : 'Show More'
                    }</Button>
                </div>}
            </div>
        </Card>
    </div>
}
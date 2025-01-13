import { Button, Card, CircularProgress } from "@mui/material"
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions"
import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../../../../model/commission/CommissionFilterOptions";
import { useRefresh } from "../../../../hooks/useRefresh";
import { REFRESH_ALL_COLUMNS, REFRESH_SPECIFIC_COLUMN_PREFIX } from "../../../../contexts/RefreshContext";
import CommCard from "../CommCard";
import { useCommissions } from "../../../../hooks/useCommissions";
import { Archive, Construction, Done, Psychology, Public, QuestionMark, Schedule } from "@mui/icons-material";

export default function CommColumn(props: {
    year?: number,
    code: number
    fullHeight?: boolean
}) {

    const { code, year, fullHeight } = props
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

    const titles = ["Archived", "Brainstorming", "Scheduled", "In Progress", "Done", "Published"]
    const icons = [<Archive />, <Psychology />, <Schedule />, <Construction />, <Done />, <Public />]


    return <div style={{ minWidth: "300px", maxWidth: "300px", marginRight: fullHeight ? undefined : "20px", paddingBottom: fullHeight ? undefined : "20px" }}>
        <Card >
            <div style={{ padding: "10px 15px 10px 15px", fontSize: "1em", background: "gray", display: "flex", justifyContent: 'space-between', alignItems: "center" }}>
                <div style={{ fontWeight: "500", display: "flex", gap: "10px", alignItems: "center" }}>
                    {icons[code + 1] ?? <QuestionMark />}
                    <div>{titles[code + 1] ?? "Unknown State"}</div>
                </div>
                <div>{comms.count ?? <CircularProgress color="inherit" size={16} />}</div>
            </div>
            <div style={{ height: fullHeight ? height - 45 : height - 230, display: "flex", flexDirection: "column" }}>
                {comms.loading && comms.comms.length === 0
                    ? <div style={{
                        flex: "1",
                        width: "32px", margin: "0 auto",
                        display: "flex", alignItems: "center", justifyContent: 'center'
                    }}>
                        <CircularProgress size={32} />
                    </div>
                    :
                    <div style={{ flex: "1", overflowY: "auto" }}>
                        {comms.comms?.map(c => <CommCard commission={c} />)}
                        {comms.hasMore && <div style={{ textAlign: "center", margin: "20px" }}>
                            <Button color="secondary" onClick={comms.showMore}>{
                                comms.loading ? <CircularProgress size={25} color="inherit" /> : 'Show More'
                            }</Button>
                        </div>}
                    </div>
                }
            </div>
        </Card>
    </div>
}
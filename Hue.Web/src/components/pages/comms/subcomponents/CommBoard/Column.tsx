import { Card, CardContent, CardHeader, CircularProgress } from "@mui/material"
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions"
import { getCommissions } from "../../../../../api/Comm";
import useApi from "../../../../hooks/useApi";
import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../../../../model/commission/CommissionFilterOptions";
import { useRefresh } from "../../../../hooks/useRefresh";
import { REFRESH_ALL_COLUMNS, REFRESH_SPECIFIC_COLUMN_PREFIX } from "../../../../contexts/RefreshContext";
import CommCard from "../CommCard";

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


    const commApi = useApi(getCommissions)
    const [page, setPage] = useState(0)

    useEffect(() => {
        commApi.fetch(undefined, undefined, year ? {
            Page: page,
            year: year,
            CommissionStatus: code
        } as CommissionFilterOptions : {
            Page: page,
            CommissionStatus: code
        } as CommissionFilterOptions
        )
    }, [year, code, AllColumnsFlag, StatusColumnsFlag])


    return <div style={{ minWidth: "300px", maxWidth: "300px", marginRight: fullHeight ? undefined : "20px", paddingBottom: fullHeight ? undefined : "20px" }}>
        <Card >
            <div style={{ padding: "20px 20px 10px 20px", fontSize: "1.1em", background: "gray" }}>
                <b>{title}</b>
            </div>
            <div style={{ height: fullHeight ? height - 60 : height - 260, overflowY: "auto" }}>
                {commApi.loading ? <div style={{
                    height: "100%",
                    width: "32px", margin: "0 auto",
                    display: "flex", alignItems: "center"
                }}>
                    <CircularProgress size={32} />
                </div> :
                    commApi.data?.map(c => <CommCard commission={c} />)
                }
            </div>
        </Card>
    </div>
}
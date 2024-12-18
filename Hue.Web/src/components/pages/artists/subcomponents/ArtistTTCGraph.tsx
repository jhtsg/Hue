import { useState } from "react";
import { useCommissions } from "../../../hooks/useCommissions"
import { LineChart } from "@mui/x-charts";
import { months } from "../../../shared/Utils";

export default function ArtistTTCGraph(props: {
    id: number
}) {

    const { id } = props;
    const [filter] = useState({ ArtistId: id, Page: 0 })

    const commsApi = useCommissions(filter);

    const comms = commsApi.comms?.filter(a => (a.startTs?.length ?? 0) > 0 && a.daysToComplete !== undefined)
        .map(a => { return { ...a, startTs: (new Date(a.startTs ?? 20)).getTime() } }).reverse() ?? undefined

    return <LineChart loading={commsApi.loading}
        grid={{ horizontal: true }}
        xAxis={[{
            scaleType: "time",
            dataKey: "startTs",
            valueFormatter: (val) => months[new Date(val).getMonth()] + " " + new Date(val).getFullYear()
        }]}
        yAxis={[{
            min: 0
        }]}
        series={[{
            curve: "linear",
            dataKey: "daysToComplete",
            valueFormatter: (v, context) => v === null ? "" : `${comms[context.dataIndex]?.name}: ${v} days `
        }]}
        dataset={comms as any[]}
        width={800}
        height={300}
    />


}
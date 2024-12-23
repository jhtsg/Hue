import { LineChart } from "@mui/x-charts"
import CumulativeSpendingData from "../../../../model/statistics/commissions/CumulativeSpendingData"
import { months } from "../../Utils"

export default function SpendingLineChart(props: {
    data?: CumulativeSpendingData[]
    width: number
    height: number
}) {

    const { width, height } = props
    const data = props.data?.map(a => { return { ...a, date: Date.parse(a.date) } })

    return <LineChart
        series={[
            {
                dataKey: "runningTotal",
                valueFormatter: (value, context) => <>
                    <div>{data?.[context.dataIndex].name}</div>
                    <div>${data?.[context.dataIndex].value.toLocaleString()}{data?.[context.dataIndex].started ? "" : " (Estimated)"}</div>
                    <div style={{ marginTop: "20px" }}>Total {data?.[context.dataIndex].started ? "to Date" : "estimated"}: ${value?.toLocaleString()}</div>
                </> as unknown as string,
            }
        ]}
        xAxis={[{
            dataKey: "date",
            valueFormatter: (val, context) => context.location === "tick"
                ? months[new Date(val).getMonth()] + " " + new Date(val).getFullYear()
                : new Date(val).toLocaleDateString()
        }]}
        yAxis={[{ min: 0 }]}
        height={height}
        width={width}
        dataset={data as any[]}
    />

}

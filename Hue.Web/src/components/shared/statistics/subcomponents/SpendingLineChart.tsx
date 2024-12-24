import { LineChart } from "@mui/x-charts"
import CumulativeSpendingData from "../../../../model/statistics/commissions/CumulativeSpendingData"
import { months } from "../../Utils"
import { commHeaderImage } from "../../../../api/Comm"
import { useNavigate } from "react-router-dom"

export default function SpendingLineChart(props: {
    data?: CumulativeSpendingData[]
    width: number
    height: number
}) {

    const { width, height } = props
    const data = props.data?.map(a => { return { ...a, date: Date.parse(a.date) } })
    const nav = useNavigate();

    return <LineChart
        series={[
            {
                dataKey: "runningTotal",
                valueFormatter: (value, context) => <div style={{ width: "250px" }}>
                    {data?.[context.dataIndex].hasImage ? <img src={commHeaderImage(data?.[context.dataIndex].id ?? 0)} width={"250px"} /> : <></>}
                    <div style={{ fontWeight: "bold" }}>{data?.[context.dataIndex].name}</div>
                    <div style={{ color: "#CCC" }}>${data?.[context.dataIndex].value.toLocaleString()}{data?.[context.dataIndex].started ? "" : " (Estimated)"}</div>
                    <div style={{ marginTop: "20px" }}>Total {data?.[context.dataIndex].started ? "to Date" : "estimated"}: ${value?.toLocaleString()}</div>
                </div> as unknown as string,
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
        onAxisClick={(_, d) => { if (d) { nav(`/commissions/${data?.[d?.dataIndex].id}`) } }}
    />

}

import { LineChart } from "@mui/x-charts"
import DateValuePair from "../../../../model/statistics/commissions/DateValuePair"
import { months } from "../../Utils"
import { commHeaderImage } from "../../../../api/Comm"

export default function TtcLienChart(props: {
    data?: DateValuePair[]
    width: number,
    height: number
}) {

    const { height, width } = props
    const data = props.data?.map(a => { return { ...a, date: Date.parse(a.date) } })


    return <LineChart loading={!data}
        grid={{ horizontal: true }}
        xAxis={[{
            scaleType: "time",
            dataKey: "date",
            valueFormatter: (val) => months[new Date(val).getMonth()] + " " + new Date(val).getFullYear()
        }]}
        yAxis={[{
            min: 0
        }]}
        series={[{
            curve: "linear",
            dataKey: "value",
            valueFormatter: (v, context) => v === null ? "" : <div style={{ width: "250px" }}>
                {data?.[context.dataIndex].hasImage ? <img src={commHeaderImage(data?.[context.dataIndex].id ?? 0)} width={"250px"} /> : <></>}
                <div>{data?.[context.dataIndex].name}</div>
                <div>{data?.[context.dataIndex].value.toLocaleString()} day{data?.[context.dataIndex].value === 1 ? "" : "s"}</div>
            </div> as unknown as string
        }]}
        dataset={data as any[]}
        width={width}
        height={height}
    />
}
import { PieChart } from "@mui/x-charts"
import TypeCount from "../../../../model/statistics/commissions/TypeCount"
import { CommissionTypes } from "../../../../model/commission/CommissionEnums"

export default function TypesPieChart(props: {
    data?: TypeCount[]
    width: number
    height: number
}) {

    const { data, width, height } = props

    data?.sort((a, b) => b.count - a.count)

    return <PieChart
        series={[{
            data: data?.map(a => { return { value: a.count, id: CommissionTypes[a.type].type, label: CommissionTypes[a.type].type } }) ?? []
        }]}
        width={width}
        height={height}
        margin={{ right: 20, left: 20, bottom: 80 }}
        slotProps={{
            legend: { labelStyle: { fontSize: ".6em", justifyItems: "center" }, direction: "row", position: { horizontal: "middle", vertical: "bottom" } },
        }}

    />
}
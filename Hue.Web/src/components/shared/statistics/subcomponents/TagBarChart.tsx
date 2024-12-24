import { BarChart } from "@mui/x-charts"
import TagCount from "../../../../model/statistics/commissions/TagCount"
import CommissionTag from "../../../../model/commission/CommissionTag"
import ColorPill from "../../ColorPill"

export default function TagBarChart(props: {
    data?: TagCount[]
    width: number
    height: number
}) {

    const { data, width, height } = props


    return <BarChart loading={!data}
        dataset={data as any[]}
        width={width}
        height={height}

        slotProps={{
            legend: { hidden: true },
        }}
        series={[
            { dataKey: "count", valueFormatter: (value) => `${value} Commission${value === 1 ? "" : "s"}` },
        ]}
        xAxis={[{
            dataKey: "tag", scaleType: 'band',
            valueFormatter: (value, context) => context.location === "tick"
                ? (value as CommissionTag)?.name
                : <ColorPill color={(value as CommissionTag).color}>{(value as CommissionTag).name}</ColorPill> as unknown as string, //MUI can bug off
            tickLabelStyle: {
                angle: -25,
                textAnchor: 'end',
                fontSize: '.66em'
            },
            colorMap: {
                type: 'ordinal',
                colors: data?.map(a => a.tag?.color ?? "") ?? []
            }
        }]}
    />
}
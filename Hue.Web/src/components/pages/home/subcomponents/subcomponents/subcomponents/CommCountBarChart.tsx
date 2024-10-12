import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import Statistic from "../../../../../../model/statistics/Statistic"
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from "@emotion/react";

export default function CommCountBarChart(props: {
    statistics?: Statistic[],
    title: string
}) {

    const { statistics, title } = props;
    const theme = useTheme() as any

    statistics?.sort((a, b) => b.count - a.count)
    const xAxis = statistics?.map(a => a.name)
    const yAxis = statistics?.map(a => a.count)
    const colorAxis = statistics?.map(a => a.color.length === 0 ? theme.palette.primary.main : a.color) ?? []

    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {statistics ? <BarChart
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}
                series={[
                    { data: yAxis, label: 'Count' },
                ]}
                xAxis={[{
                    data: xAxis, scaleType: 'band',
                    colorMap: {
                        type: 'ordinal',
                        values: xAxis,
                        colors: colorAxis
                    }
                }]}
            /> : <Skeleton width={500} height={300} />}
        </CardContent>
    </Card>

}
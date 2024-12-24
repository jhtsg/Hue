import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import MonthlySpend from "../../../../../../model/statistics/MonthlySpend";
import { months } from "../../../../../shared/Utils";

export default function SpendingBarChartPane(props: {
    spending?: MonthlySpend[],
    title: string,
    loading: boolean
}) {

    const { spending: priceCats, title, loading } = props;

    const xAxis = priceCats?.map(a => a.month)
    const committedAxis = priceCats?.map(a => a.confirmed)
    const potentialAxis = priceCats?.map(a => a.potential)

    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {priceCats ? <BarChart
                loading={loading}
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}
                series={[
                    { data: committedAxis, label: 'Committed', color: '#292', stack: "SpendingStack", valueFormatter: (v) => `$${v?.toLocaleString()}` },
                    { data: potentialAxis, label: 'Potential', color: '#992', stack: "SpendingStack", valueFormatter: (v) => `$${v?.toLocaleString()}` },
                ]}
                xAxis={[{
                    data: xAxis, scaleType: 'band', valueFormatter: (val) => months[val - 1],
                    tickLabelStyle: {
                        angle: -25,
                        textAnchor: 'end',
                        fontSize: '.66em'
                    },
                }]}
            /> : <Skeleton width={500} height={300} />}
        </CardContent>
    </Card>

}
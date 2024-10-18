import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import MonthlySpend from "../../../../../../model/statistics/MonthlySpend";
import { Months } from "../../../../../../model/Months";

export default function SpendingBarChartPane(props: {
    spending?: MonthlySpend[],
    title: string
}) {

    const { spending: priceCats, title } = props;

    const xAxis = priceCats?.map(a => a.month)
    const committedAxis = priceCats?.map(a => a.confirmed)
    const potentialAxis = priceCats?.map(a => a.potential)

    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {priceCats ? <BarChart
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}
                series={[
                    { data: committedAxis, label: 'Committed', color: '#292', stack: "SpendingStack" },
                    { data: potentialAxis, label: 'Potential', color: '#992', stack: "SpendingStack" },
                ]}
                xAxis={[{
                    data: xAxis, scaleType: 'band', valueFormatter: (val) => Months[val - 1],
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
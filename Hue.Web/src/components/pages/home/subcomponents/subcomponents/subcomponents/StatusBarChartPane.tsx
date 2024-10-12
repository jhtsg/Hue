import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import MonthlyStatus from "../../../../../../model/statistics/MonthlyStatus";
import { Months } from '../../../../../../model/Months'

export default function StatusBarChartPane(props: {
    statuses?: MonthlyStatus[],
    title: string
}) {

    const { statuses: priceCats, title } = props;

    const xAxis = priceCats?.map(a => a.month)

    const getTotal = (s: MonthlyStatus) => s.brainstorm + s.scheduled + s.inProgress + s.done + s.published

    const brainstormAxis = priceCats?.map(a => a.brainstorm / getTotal(a))
    const scheduledAxis = priceCats?.map(a => a.scheduled / getTotal(a))
    const inProgressAxis = priceCats?.map(a => a.inProgress / getTotal(a))
    const doneAxis = priceCats?.map(a => a.done / getTotal(a))
    const publishedAxis = priceCats?.map(a => a.published / getTotal(a))

    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {priceCats ? <BarChart
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}
                yAxis={[{
                    id: "percentageAxis", valueFormatter: (val) => `${val * 100}%`
                }]}
                series={[
                    { data: brainstormAxis, label: 'Brainstorming', color: '#999', stack: "SpendingStack" },
                    { data: scheduledAxis, label: 'Scheduled', color: '#279', stack: "SpendingStack" },
                    { data: inProgressAxis, label: 'In Progress', color: '#B72', stack: "SpendingStack" },
                    { data: doneAxis, label: 'Done', color: '#992', stack: "SpendingStack" },
                    { data: publishedAxis, label: 'Published', color: '#292', stack: "SpendingStack" }
                ]}
                xAxis={[{
                    data: xAxis, scaleType: 'band', valueFormatter: (val) => Months[val - 1]
                }]}
            /> : <Skeleton width={500} height={300} />}
        </CardContent>
    </Card>

}
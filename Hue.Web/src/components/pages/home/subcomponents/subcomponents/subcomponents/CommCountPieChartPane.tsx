import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import Statistic from "../../../../../../model/statistics/Statistic"
import { PieChart, PieValueType } from "@mui/x-charts";

export default function CommCountPieChartPane(props: {
    statistics?: Statistic[]
    title: string
    statisticType: 'ARTIST' | 'CHARACTER' | 'TAG'
}) {

    const { statistics, title } = props;

    statistics?.sort((a, b) => b.count - a.count)

    const data = statistics?.map(a => {
        return a.color.length === 0 ? {
            label: a.name,
            value: a.count,
        } as PieValueType : {
            label: a.name,
            value: a.count,
            color: a.color
        } as PieValueType
    })




    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {data ? <div style={{ display: "flex" }}>
                <PieChart
                    height={300}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                    series={[{
                        data: data, type: 'pie',
                    }]} />

            </div> : <Skeleton height={300} />}
        </CardContent>
    </Card>

}
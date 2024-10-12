import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import MonthlyPriceCat from "../../../../../../model/statistics/MonthlyPriceCat";
import { Months } from "../../../../../../model/Months";

export default function PriceCatBarChartPane(props: {
    priceCats?: MonthlyPriceCat[],
    title: string
}) {

    const { priceCats, title } = props;

    const xAxis = priceCats?.map(a => a.month)
    const smAxis = priceCats?.map(a => a.small)
    const mdAxis = priceCats?.map(a => a.med)
    const lgAxis = priceCats?.map(a => a.large)

    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {priceCats ? <BarChart
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}
                series={[
                    { data: smAxis, label: 'Small (<50)', color: '#292', stack: "PriceStack" },
                    { data: mdAxis, label: 'Medium (>50, <80)', color: '#992', stack: "PriceStack" },
                    { data: lgAxis, label: 'Large (>80)', color: '#922', stack: "PriceStack" },
                ]}
                xAxis={[{
                    data: xAxis, scaleType: 'band', valueFormatter: (val) => Months[val - 1]
                }]}
            /> : <Skeleton width={500} height={300} />}
        </CardContent>
    </Card>

}
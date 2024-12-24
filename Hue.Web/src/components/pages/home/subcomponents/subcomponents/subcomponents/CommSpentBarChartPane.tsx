import { Card, CardContent, CardHeader, Skeleton, Tooltip } from "@mui/material";
import Statistic from "../../../../../../model/statistics/Statistic"
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from "@emotion/react";
import { useUser } from "../../../../../hooks/useUser";
import SafeAvatar from "../../../../../shared/SafeAvatar";
import { artistImage } from "../../../../../../api/Artist";
import { characterImage } from "../../../../../../api/Char";
import { useNavigate } from "react-router-dom";

export default function CommSpentBarChartPane(props: {
    statistics?: Statistic[],
    title: string,
    statisticType: 'ARTIST' | 'CHARACTER' | 'TAG',
    loading: boolean,
}) {

    const { statistics, title, loading, statisticType } = props;
    const { user } = useUser()
    const theme = useTheme() as any
    const nav = useNavigate();

    statistics?.sort((a, b) => b.spent - a.spent)
    const xAxis = statistics
    const yAxis = statistics?.map(a => a.spent)
    const colorAxis = statistics?.map(a => a.color.length === 0 ? theme.palette.primary.main : a.color) ?? []

    const TooltipContent = (props: { stat: Statistic }) => <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <SafeAvatar hasImage={props.stat.hasImage} color={props.stat.color} size={32} src={
            statisticType === "ARTIST" ? artistImage(props.stat.id) : characterImage(props.stat.id)
        } text={props.stat.name} />
        <div>{props.stat.name}</div>
    </div>

    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {statistics ? <BarChart loading={loading}
                height={300}
                slotProps={{
                    legend: { hidden: true },
                }}

                onAxisClick={(_, d) => statisticType === "TAG" ? undefined
                    : d ? nav(`/${statisticType === "ARTIST" ? "artists" : "characters"}/${statistics?.sort((a, b) => b.spent - a.spent)[d.dataIndex].id}`)
                        : console.warn("nope!")}

                series={[
                    {
                        data: yAxis,
                        label: user?.isArtist ? 'Earned' : 'Spent',
                        valueFormatter: (value) => `$${value?.toLocaleString()}`
                    },
                ]}
                xAxis={[{
                    data: xAxis, scaleType: 'band',
                    tickLabelStyle: {
                        angle: -25,
                        textAnchor: 'end',
                        fontSize: '.66em'
                    },
                    colorMap: {
                        type: 'ordinal',
                        values: xAxis as any[],
                        colors: colorAxis
                    },
                    valueFormatter: (value, context) => context.location === "tick"
                        ? (value as Statistic).name
                        : <TooltipContent stat={value} /> as unknown as string
                }]}
            /> : <Skeleton width={500} height={300} />}
        </CardContent>
    </Card>

}
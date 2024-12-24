import { Card, CardContent, CardHeader, Skeleton } from "@mui/material";
import Statistic from "../../../../../../model/statistics/Statistic"
import { PieChart, PieValueType } from "@mui/x-charts";
import { characterImage } from "../../../../../../api/Char";
import SafeAvatar from "../../../../../shared/SafeAvatar";
import { artistImage } from "../../../../../../api/Artist";
import { useNavigate } from "react-router-dom";

export default function CommCountPieChartPane(props: {
    statistics?: Statistic[]
    title: string
    statisticType: 'ARTIST' | 'CHARACTER' | 'TAG',
    loading: boolean
}) {

    const { statistics, title, loading, statisticType } = props;
    const nav = useNavigate();

    statistics?.sort((a, b) => b.count - a.count)

    const SeriesLabel = (props: { stat: Statistic }) => <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
        <SafeAvatar hasImage={props.stat.hasImage} color={props.stat.color} size={32} src={
            statisticType === "ARTIST" ? artistImage(props.stat.id) : characterImage(props.stat.id)
        } text={props.stat.name} />
        <div>{props.stat.name}</div>
    </div> as unknown as string

    const data = statistics?.map(a => {
        return a.color.length === 0 ? {
            id: a.id,
            label: <SeriesLabel stat={a} /> as unknown as string,
            value: a.count,
        } as PieValueType : {
            id: a.id,
            label: <SeriesLabel stat={a} /> as unknown as string,
            value: a.count,
            color: a.color
        } as PieValueType
    })




    return <Card>
        <CardHeader title={title} />
        <CardContent>
            {data ? <div style={{ display: "flex" }}>
                <PieChart loading={loading}
                    height={300}
                    slotProps={{
                        legend: { hidden: true },
                    }}
                    series={[{
                        data: data, type: 'pie',
                        valueFormatter: (context) => `${context.value} Commission${context.value === 1 ? "" : "s"}`
                    }]}

                    onItemClick={statisticType === "TAG" ? undefined : (_, context) => {
                        nav(`/${statisticType === "ARTIST" ? "artists" : "characters"}/${data[context.dataIndex].id}`)
                    }}

                    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                />
            </div> : <Skeleton height={300} />}
        </CardContent>
    </Card>

}
import { BarChart } from "@mui/x-charts"
import ArtistCount from "../../../../model/statistics/commissions/ArtistCount"
import Artist from "../../../../model/artist/Artist"
import ArtistTile from "../../../pages/artists/subcomponents/ArtistTile"
import { useNavigate } from "react-router-dom"

export default function ArtistBarChart(props: {
    data?: ArtistCount[]
    width: number
    height: number
}) {

    const { data, width, height } = props
    const nav = useNavigate();

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

        onAxisClick={(_, d) => d ? nav(`/artists/${data?.[d.dataIndex].artist?.id}`) : console.warn("nope!")}

        xAxis={[{
            dataKey: "artist", scaleType: 'band',
            valueFormatter: (value, context) => context.location === "tick"
                ? (value as Artist).name
                : <ArtistTile artist={value} /> as unknown as string, //MUI can bug off
            tickLabelStyle: {
                angle: -25,
                textAnchor: 'end',
                fontSize: '.66em'
            }
        }]}
    />
}
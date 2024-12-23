import { BarChart } from "@mui/x-charts"
import ArtistCount from "../../../../model/statistics/commissions/ArtistCount"
import Artist from "../../../../model/artist/Artist"
import ArtistTile from "../../../pages/artists/subcomponents/ArtistTile"

export default function ArtistBarChart(props: {
    data?: ArtistCount[]
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
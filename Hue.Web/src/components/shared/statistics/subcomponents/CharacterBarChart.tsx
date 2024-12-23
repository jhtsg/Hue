import { BarChart } from "@mui/x-charts"
import CharacterCount from "../../../../model/statistics/commissions/CharacterCount"
import Character from "../../../../model/character/Character"
import CharacterTile from "../../../pages/chars/subcomponents/CharacterTile"

export default function CharacterBarChart(props: {
    data?: CharacterCount[]
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
            dataKey: "character", scaleType: 'band',
            valueFormatter: (value, context) => context.location === "tick"
                ? (value as Character).name
                : <CharacterTile character={value} /> as unknown as string, //MUI can bug off
            tickLabelStyle: {
                angle: -25,
                textAnchor: 'end',
                fontSize: '.66em'
            },
            colorMap: {
                type: 'ordinal',
                colors: data?.map(a => a.character?.color ?? "") ?? []
            }
        }]}
    />
}
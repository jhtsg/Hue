import { ReactNode, useEffect, useState } from "react"
import { getCommissionStatistics } from "../../../api/Statistics"
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions"
import useApi from "../../hooks/useApi"
import { getCommissionYears } from "../../../api/Comm"
import ApiAlert from "../ApiAlert"
import { Card, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material"
import { BarChart, ColorLens, Groups, Payments, PhotoLibrary, Style, Timelapse } from "@mui/icons-material"
import TagBarChart from "./subcomponents/TagBarChart"
import CharacterBarChart from "./subcomponents/CharacterBarChart"
import ArtistBarChart from "./subcomponents/ArtistPieChart"
import TtcLienChart from "./subcomponents/TtcLineChart"
import SpendingLineChart from "./subcomponents/SpendingLineChart"
import TypesBarChart from "./subcomponents/TypesPieChart"
import CommissionStatistics from "../../../model/statistics/commissions/CommissionStatistics"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"

const modes = [
    "types",
    "cumulativeSpending",
    "timeToCompletion",
    "artistCounts",
    "characterCounts",
    "tagCounts"
]

export default function CommissionStatisticsPane(props: {
    filter: CommissionFilterOptions
    yearSelect?: boolean,
    maxWidth?: number
}) {

    const { filter, yearSelect, maxWidth } = props
    const { width } = useWindowDimensions();

    const statsApi = useApi(getCommissionStatistics)
    const yearsApi = useApi(getCommissionYears)

    const [year, setYear] = useState(filter.Year)
    const [mode, setMode] = useState("");



    //Get the years if we need to
    useEffect(() => {
        if (yearSelect) { yearsApi.fetch() }
    }, [yearSelect])

    //
    useEffect(() => {
        setMode("")
        const completeFilter = { ...filter } as CommissionFilterOptions;

        //if we're allowed to select the filter, we override the year
        if (yearSelect) {
            completeFilter.Year = year;
        }

        statsApi.fetch(undefined, undefined, filter)
    }, [filter])

    const superVertical = width < 700


    const typesDisabled = !statsApi.data?.types || statsApi.data.types.length < 2
    const spendingDisabled = !statsApi.data?.cumulativeSpending || statsApi.data.cumulativeSpending.length < 2
    const ttcDisabled = !statsApi.data?.timeToCompletion || statsApi.data.timeToCompletion.length < 2
    const artistDisabled = !statsApi.data?.artistCounts || statsApi.data.artistCounts.length < 2
    const characterDisabled = !statsApi.data?.characterCounts || statsApi.data.characterCounts.length < 2
    const tagsDisabled = !statsApi.data?.tagCounts || statsApi.data.tagCounts.length < 2

    const allDisabled = typesDisabled && spendingDisabled && ttcDisabled && artistDisabled && characterDisabled && tagsDisabled

    return <Card elevation={3} style={{ padding: "20px" }}>
        <ApiAlert result={statsApi.error} />
        <div style={{ display: "flex", gap: "10px", flexDirection: superVertical ? "column" : undefined }}>

            {allDisabled ? <></> : <>
                <div style={{ width: superVertical ? undefined : "220px", height: superVertical ? undefined : "310px" }}>
                    <List>
                        <SelectableListitem defaultItem disabled={typesDisabled}
                            icon={<PhotoLibrary />} text="Types" value={modes[0]}
                            selectedValue={mode} setSelectedValue={setMode}
                            desc="Types of Commissions"
                        />
                        <SelectableListitem disabled={spendingDisabled}
                            icon={<Payments />} text="Spending" value={modes[1]}
                            selectedValue={mode} setSelectedValue={setMode}
                            desc="Total spending"
                        />
                        <SelectableListitem disabled={ttcDisabled}
                            icon={<Timelapse />} text="Completion Time" value={modes[2]}
                            selectedValue={mode} setSelectedValue={setMode}
                            desc="Time it's taken to complete commissions"
                        />
                        <SelectableListitem disabled={artistDisabled}
                            icon={<ColorLens />} text="Artists" value={modes[3]}
                            selectedValue={mode} setSelectedValue={setMode}
                            desc="Artists involved in these commissions"
                        />
                        <SelectableListitem disabled={characterDisabled}
                            icon={<Groups />} text="Characters" value={modes[4]}
                            selectedValue={mode} setSelectedValue={setMode}
                            desc="Characters in these commissions"
                        />
                        <SelectableListitem disabled={tagsDisabled}
                            icon={<Style />} text="Tags" value={modes[5]}
                            selectedValue={mode} setSelectedValue={setMode}
                            desc="Tags in these commissions"
                        />
                    </List>
                </div>
                {!superVertical && <hr />}
            </>}
            <div style={{ flex: "1" }}>
                <DisplayDecider mode={mode} data={statsApi.data} superVertical={superVertical} allDisabled={allDisabled} maxWidth={maxWidth} />
            </div>
        </div>
    </Card>
}

const DisplayDecider = (props: { mode: string, data: CommissionStatistics, superVertical: boolean, allDisabled: boolean, maxWidth?: number }) => {
    const { mode, data, superVertical, allDisabled, maxWidth } = props;

    const { width, vertical } = useWindowDimensions()

    const chartWidth = Math.min(superVertical ? width - 70 : vertical ? width - 150 : width - 700, maxWidth ?? 99999)
    const chartHeight = superVertical ? 500 : 310


    switch (mode) {
        case modes[5]:
            return <TagBarChart data={data?.tagCounts} width={chartWidth} height={chartHeight} />
        case modes[4]:
            return <CharacterBarChart data={data?.characterCounts} width={chartWidth} height={chartHeight} />
        case modes[3]:
            return <ArtistBarChart data={data?.artistCounts} width={chartWidth} height={chartHeight} />
        case modes[2]:
            return <TtcLienChart data={data?.timeToCompletion} width={chartWidth} height={chartHeight} />
        case modes[1]:
            return <SpendingLineChart data={data?.cumulativeSpending} width={chartWidth} height={chartHeight} />
        case modes[0]:
            return <TypesBarChart data={data?.types} width={chartWidth} height={chartHeight} />
        default:
            return <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                color: "#999", height: `${chartHeight}px`, transition: "height 250ms ease-out"
            }}
            >
                <div><BarChart fontSize="large" /></div>
                <div>{allDisabled ? "No statistics available" : "Select a Statistic"}</div>

            </div>
    }
}


function SelectableListitem(props: {
    icon: ReactNode,
    text: string,
    desc: string,
    value: string,
    selectedValue: string,
    setSelectedValue: (val: string) => void,
    defaultItem?: boolean,
    disabled?: boolean
}) {

    const { icon, text, value, selectedValue, setSelectedValue, defaultItem, disabled, desc } = props

    const selected = value === selectedValue || (value === "" && defaultItem);

    if (disabled) { return <></> }

    return <Tooltip title={desc}><ListItemButton onClick={() => setSelectedValue(value)} selected={selected} >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
    </ListItemButton>
    </Tooltip>

}
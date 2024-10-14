import { Tab, Tabs } from "@mui/material"
import useApi from "../../hooks/useApi"
import { getCommissionYears } from "../../../api/Comm"
import { useState } from "react"
import StatisticsPane from "./subcomponents/StatisticPane"

export default function HomePage() {

    const [year, setYear] = useState(-1)
    const yearsApi = useApi(getCommissionYears, true)

    return <>
        <Tabs value={year} onChange={(_, newval) => { setYear(newval) }}
            variant="scrollable"
        >
            <Tab label='Overall Statistics' value={-1} />
            {yearsApi.data?.map(y => <Tab label={`${y}`} value={y} />)}
        </Tabs>
        <hr />

        <div style={{ marginBottom: "40px" }}>
            <StatisticsPane year={year} />
        </div>

    </>
}
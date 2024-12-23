import { useEffect, useState } from "react"
import { getCommissionStatistics } from "../../../api/Statistics"
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions"
import useApi from "../../hooks/useApi"
import { getCommissionYears } from "../../../api/Comm"

export default function name(props: {
    filter: CommissionFilterOptions
    yearSelect?: boolean
}) {

    const { filter, yearSelect } = props
    const statsApi = useApi(getCommissionStatistics)
    const yearsApi = useApi(getCommissionYears)

    const [year, setYear] = useState(filter.Year)

    //Get the years if we need to
    useEffect(() => {
        if (yearSelect) { yearsApi.fetch() }
    }, [])

    //
    useEffect(() => {
        const completeFilter = { ...filter } as CommissionFilterOptions;

        //if we're allowed to select the filter, we override the year
        if (yearSelect) {
            completeFilter.Year = year;
        }

        statsApi.fetch(undefined, undefined, filter)
    }, [filter])

    return <>
    </>
}
import { useEffect } from "react";
import { getStatisticForCharacter } from "../../../../api/Statistics";
import useApi from "../../../hooks/useApi";
import { StatisticsPane } from "../../../shared/StatisticsPane";

export default function CharsStatisticPane(props: { id: number }) {

    const { id } = props;

    const overallApi = useApi(getStatisticForCharacter)
    const yearlyApi = useApi(getStatisticForCharacter)

    useEffect(() => {
        overallApi.fetch(undefined, undefined, id)
        yearlyApi.fetch(undefined, undefined, id, new Date().getFullYear())
    }, [id])

    return <StatisticsPane
        overall={overallApi.data} overallLoading={overallApi.loading} overallError={overallApi.error}
        thisYear={yearlyApi.data} thisYearLoading={yearlyApi.loading} thisYearError={yearlyApi.error}
    />


}
import { useEffect } from "react";
import { getStatisticForArtist } from "../../../../api/Statistics";
import useApi from "../../../hooks/useApi";
import { StatisticsPane } from "../../../shared/StatisticsPane";

export default function ArtistStatisticPane(props: { id: number }) {

    const { id } = props;

    const overallApi = useApi(getStatisticForArtist)
    const yearlyApi = useApi(getStatisticForArtist)

    useEffect(() => {
        overallApi.fetch(undefined, undefined, id)
        yearlyApi.fetch(undefined, undefined, id, new Date().getFullYear())
    }, [id])

    return <StatisticsPane
        overall={overallApi.data} overallLoading={overallApi.loading} overallError={overallApi.error}
        thisYear={yearlyApi.data} thisYearLoading={yearlyApi.loading} thisYearError={yearlyApi.error}
    />


}
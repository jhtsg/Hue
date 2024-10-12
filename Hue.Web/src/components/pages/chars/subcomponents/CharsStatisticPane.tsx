import { getStatisticForCharacter } from "../../../../api/Statistics";
import useApi from "../../../hooks/useApi";
import { StatisticsPane } from "../../../shared/StatisticsPane";

export default function CharsStatisticPane(props: { id: number }) {

    const { id } = props;

    const overallApi = useApi(getStatisticForCharacter, true, undefined, undefined, id)
    const yearlyApi = useApi(getStatisticForCharacter, true, undefined, undefined, id, new Date().getFullYear())

    return <StatisticsPane
        overall={overallApi.data} overallLoading={overallApi.loading} overallError={overallApi.error}
        thisYear={yearlyApi.data} thisYearLoading={yearlyApi.loading} thisYearError={yearlyApi.error}
    />


}
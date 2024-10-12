import { useEffect } from "react";
import { getPriceCats, getSpending, getStatuses } from "../../../../../api/Statistics";
import useApi from "../../../../hooks/useApi";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import PriceCatBarChartPane from "./subcomponents/PriceCatBarChartPane";
import SpendingBarChartPane from "./subcomponents/SpendingBarChartPane";
import StatusBarChartPane from "./subcomponents/StatusBarChartPane";

export default function MonthlyStatisticsPane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical } = useWindowDimensions();

    const priceCatApi = useApi(getPriceCats)
    const spendingApi = useApi(getSpending)
    const statusApi = useApi(getStatuses)


    useEffect(() => {
        if (!year || year < 0) return;

        priceCatApi.fetch(undefined, undefined, year)
        spendingApi.fetch(undefined, undefined, year)
        statusApi.fetch(undefined, undefined, year)

    }, [year])


    if (year < 0) return <></>

    return <div style={{ marginBottom: "20px" }}>

        <div style={vertical ? {} : { display: "flex" }}>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
                <PriceCatBarChartPane title="Monthly Commissions by Price Category" priceCats={priceCatApi.data} />
            </div>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px", marginRight: "10px" }}>
                <SpendingBarChartPane title="Monthly Spending" spending={spendingApi.data} />
            </div>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px" }}>
                <StatusBarChartPane title="Monthly Status Percentages" statuses={statusApi.data} />
            </div>
        </div>

    </div>
}
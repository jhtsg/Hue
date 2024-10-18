import { useEffect } from "react";
import { getPriceCats, getSpending, getStatuses } from "../../../../../api/Statistics";
import { useOptionedApi } from "../../../../hooks/useApi";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import PriceCatBarChartPane from "./subcomponents/PriceCatBarChartPane";
import SpendingBarChartPane from "./subcomponents/SpendingBarChartPane";
import StatusBarChartPane from "./subcomponents/StatusBarChartPane";
import { CSSTransition } from "react-transition-group";
import './MonthlyStatisticsPane.css'

export default function MonthlyStatisticsPane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical } = useWindowDimensions();

    const priceCatApi = useOptionedApi({ maintainData: true }, getPriceCats)
    const spendingApi = useOptionedApi({ maintainData: true }, getSpending)
    const statusApi = useOptionedApi({ maintainData: true }, getStatuses)


    useEffect(() => {
        if (!year || year < 0) return;

        priceCatApi.fetch(undefined, undefined, year)
        spendingApi.fetch(undefined, undefined, year)
        statusApi.fetch(undefined, undefined, year)

    }, [year])



    return <CSSTransition
        in={year > 0}
        timeout={500}  // Duration of the transition
        classNames={vertical ? "grow-vertical" : "grow"}
        unmountOnExit
    ><div style={{ marginBottom: "20px" }}>

            <div style={vertical ? {} : { display: "flex" }}>
                <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
                    <PriceCatBarChartPane title="Monthly Commissions by Price Category" priceCats={priceCatApi.data} loading={priceCatApi.loading} />
                </div>
                <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px", marginRight: "10px" }} >
                    <SpendingBarChartPane title="Monthly Spending" spending={spendingApi.data} loading={spendingApi.loading} />
                </div>
                <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px" }}>
                    <StatusBarChartPane title="Monthly Status Percentages" statuses={statusApi.data} loading={statusApi.loading} />
                </div>
            </div>

        </div>
    </CSSTransition>
}
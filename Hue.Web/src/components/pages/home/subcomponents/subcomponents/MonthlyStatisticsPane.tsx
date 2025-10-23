import { useEffect, useRef, useState } from "react";
import { getPriceCats, getSpending, getStatuses } from "../../../../../api/Statistics";
import { useOptionedApi } from "../../../../hooks/useApi";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import PriceCatBarChartPane from "./subcomponents/PriceCatBarChartPane";
import SpendingBarChartPane from "./subcomponents/SpendingBarChartPane";
import StatusBarChartPane from "./subcomponents/StatusBarChartPane";

export default function MonthlyStatisticsPane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical, width } = useWindowDimensions();
    const [maxHeight, setMaxHeight] = useState("0px");

    const contentRef = useRef<HTMLDivElement>(null);

    const priceCatApi = useOptionedApi({ maintainData: true }, getPriceCats)
    const spendingApi = useOptionedApi({ maintainData: true }, getSpending)
    const statusApi = useOptionedApi({ maintainData: true }, getStatuses)


    const expanded = year > 0

    useEffect(() => {
        if (!year || year < 0) return;

        priceCatApi.fetch(undefined, undefined, year)
        spendingApi.fetch(undefined, undefined, year)
        statusApi.fetch(undefined, undefined, year)

    }, [year])

    useEffect(() => {
        if (contentRef.current) {
            setMaxHeight(year > 0 ? `${contentRef.current.scrollHeight + 10}px` : "0px");
        }
    }, [year]);

    useEffect(() => {
        if (year <= 0) return;

        if (contentRef.current) {
            setMaxHeight(year > 0 ? `${contentRef.current.scrollHeight + 10}px` : "0px");
        }
    }, [width]);

    return <div
        ref={contentRef}
        style={{
            marginBottom: expanded ? "20px" : "0px",
            overflowY: 'hidden',
            maxHeight: maxHeight,
            opacity: expanded ? 1 : 0,
            transition: "max-height 0.3s ease, opacity 0.3s ease, margin-bottom 0.3s ease"
        }}>
        <div>
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
    </div>
}
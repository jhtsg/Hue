import { useEffect, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import CommFilterBuilder from "./subcomponents/CommFilterBuilder";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";
import CommsDisplay from "../comms/subcomponents/CommsDisplay";
import { useSearchParams } from "react-router-dom";
import CommissionStatisticsPane from "../../shared/statistics/CommissionStatisticsPane";

export default function CommSearchPage() {

    const { vertical, maxComponentHeight } = useWindowDimensions()

    const [searchParams, setSearchParams] = useSearchParams()

    const [filter, setFilter] = useState(undefined as CommissionFilterOptions | undefined)

    useEffect(() => {
        setSearchParams(filter)
    }, [filter])

    useEffect(() => {
        const obj = Object.fromEntries([...searchParams]);
        setFilter(Object.keys(obj).length === 0 ? undefined : obj as CommissionFilterOptions)
    }, [])

    return <div style={{ height: vertical ? undefined : maxComponentHeight + 20, display: vertical ? undefined : 'flex' }}>
        <div style={vertical ? { marginBottom: "20px" } : { height: '100%', marginRight: "20px", width: "300px" }}>
            <CommFilterBuilder filter={filter} setFilter={setFilter} />
        </div>
        <div style={vertical ? undefined : { flex: '1', height: maxComponentHeight + 20, overflowY: 'auto' }}>
            {filter
                ? <>
                    <div style={{ marginBottom: "20px" }}><CommissionStatisticsPane filter={filter} /></div>
                    <CommsDisplay filter={filter} style={{ justifyContent: 'flex-start', maxWidth: undefined, marginTop: '0px', marginBottom: '0px' }} />
                </>
                : <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    Specify a filter to get started!
                </div>}
        </div>
    </div>

}
import { useEffect, useState } from "react";
import { getTagStatistics } from "../../../../../api/Statistics";
import { useOptionedApi } from "../../../../hooks/useApi";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import CommSpentBarChartPane from "./subcomponents/CommSpentBarChartPane";
import CommCountBarChart from "./subcomponents/CommCountBarChart";
import { Card, CardContent, CardHeader } from "@mui/material";
import StatisticDataGrid from "./StatisticDataGrid";
import { useUser } from "../../../../hooks/useUser";
import CommissionModal from "../../../../shared/modals/CommissionModal";
import CommissionFilterOptions from "../../../../../model/commission/CommissionFilterOptions";
import Statistic from "../../../../../model/statistics/Statistic";
import ColorPill from "../../../../shared/ColorPill";

export default function TagsStatisticsPane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical } = useWindowDimensions();

    const [tagOpen, setTagOpen] = useState(false)
    const [statistic, setStatistic] = useState(undefined as Statistic | undefined)
    const [filter, setFilter] = useState(undefined as CommissionFilterOptions | undefined)

    const statsApi = useOptionedApi({ maintainData: true }, getTagStatistics)
    const { user } = useUser();
    const artist = user?.isArtist

    useEffect(() => {
        statsApi.fetch(undefined, undefined, year < 0 ? undefined : year)
    }, [year])

    const handleClick = (val: Statistic) => {
        setFilter(year < 0 ? {
            CommissionTagId: val.id
        } as CommissionFilterOptions : {
            Year: year, CommissionTagId: val.id
        } as CommissionFilterOptions)
        setStatistic(val)
        setTagOpen(true)
    }

    return <>

        <div style={vertical ? {} : { display: "flex" }}>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
                <CommSpentBarChartPane title={artist ? "Earned from Tags" : "Spent on Tags"} statistics={statsApi.data} loading={statsApi.loading} />
            </div>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px", marginRight: "10px" }}>
                <CommCountBarChart title="Commissions with Tags" statistics={statsApi.data} loading={statsApi.loading} />
            </div>
            <Card style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px" }}>
                <CardHeader title="Tags" />
                <CardContent>
                    <StatisticDataGrid statisticType="TAG" statistics={statsApi.data} pageSize={3} onClick={handleClick} loading={statsApi.loading} />
                </CardContent>
            </Card>
            <CommissionModal open={tagOpen} setOpen={setTagOpen} filter={filter}>
                <div style={{ display: "flex", width: "100%", alignContent: "center", alignItems: 'center' }}>
                    <div style={{ marginRight: "20px" }}>
                        <ColorPill color={statistic?.color ?? '#999'}>{statistic?.name}</ColorPill>
                    </div>
                    <div style={{ flex: "1" }}>
                        {statistic?.count} Commission(s) totalling ${statistic?.spent.toLocaleString()}
                        {vertical && <div>
                            Last Seen {statistic?.lastSeen ? new Date(statistic?.lastSeen).toLocaleDateString() : '-'}
                        </div>}
                    </div>

                    {!vertical && <div>
                        Last Seen {statistic?.lastSeen ? new Date(statistic?.lastSeen).toLocaleDateString() : '-'}
                    </div>}

                </div>
            </CommissionModal>
        </div>

    </>

}

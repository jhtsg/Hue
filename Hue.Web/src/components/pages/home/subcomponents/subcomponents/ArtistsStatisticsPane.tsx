import { useEffect } from "react";
import { getArtistStatistics } from "../../../../../api/Statistics";
import { useOptionedApi } from "../../../../hooks/useApi";
import CommCountPieChartPane from "./subcomponents/CommCountPieChartPane";
import CommSpentBarChartPane from "./subcomponents/CommSpentBarChartPane";
import { Card, CardContent, CardHeader } from "@mui/material";
import StatisticDataGrid from "./StatisticDataGrid";
import { useUser } from "../../../../hooks/useUser";

export default function ArtistsStatisticsPane(props: {
    year: number
}) {

    const { year } = props;

    const statsApi = useOptionedApi({ maintainData: true }, getArtistStatistics)
    const { user } = useUser();
    const artist = user?.isArtist

    useEffect(() => {
        statsApi.fetch(undefined, undefined, year < 0 ? undefined : year)
    }, [year])

    return <div>
        <div style={{ marginBottom: "20px" }}>
            <CommCountPieChartPane statistics={statsApi.data} title={`Commissions from ${artist ? "Clients" : "Artists"}`} statisticType="ARTIST" loading={statsApi.loading} />
        </div>
        <div>
            <CommSpentBarChartPane statistics={statsApi.data} title={artist ? "Earned from Clients" : "Spent on Artists"} loading={statsApi.loading} />
        </div>
        <div>
            <Card style={{ marginTop: "20px" }} >
                <CardHeader title={artist ? "Clients" : "Artists"} />
                <CardContent>
                    <StatisticDataGrid statistics={statsApi.data} statisticType="ARTIST" loading={statsApi.loading} />
                </CardContent>
            </Card>
        </div>
    </div>


}

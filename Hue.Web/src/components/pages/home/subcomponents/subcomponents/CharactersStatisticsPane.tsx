import { useEffect } from "react";
import { getCharacterStatistics } from "../../../../../api/Statistics";
import useApi from "../../../../hooks/useApi";
import CommCountPieChartPane from "./subcomponents/CommCountPieChartPane";
import CommSpentBarChartPane from "./subcomponents/CommSpentBarChartPane";
import StatisticDataGrid from "./StatisticDataGrid";
import { Card, CardContent, CardHeader } from "@mui/material";
import { useUser } from "../../../../hooks/useUser";

export default function CharactersStatisticsPane(props: {
    year: number
}) {

    const { year } = props;

    const statsApi = useApi(getCharacterStatistics)
    const { user } = useUser();
    const artist = user?.isArtist

    useEffect(() => {
        statsApi.fetch(undefined, undefined, year < 0 ? undefined : year)
    }, [year])

    return <div>
        <div style={{ marginBottom: "20px" }}>
            <CommCountPieChartPane statistics={statsApi.data} title="Commissions with Character" statisticType="CHARACTER" />
        </div>
        <div>
            <CommSpentBarChartPane statistics={statsApi.data} title={artist ? "Earned from Characters" : "Spent on Characters"} />
        </div>
        <div>
            <Card style={{ marginTop: "20px" }} >
                <CardHeader title="Characters" />
                <CardContent>
                    <StatisticDataGrid statistics={statsApi.data} statisticType="CHARACTER" />
                </CardContent>
            </Card>
        </div>
    </div>

}

import { useEffect } from "react";
import { getCharacterStatistics } from "../../../../../api/Statistics";
import useApi from "../../../../hooks/useApi";
import CommCountPieChartPane from "./subcomponents/CommCountPieChartPane";
import CommSpentBarChartPane from "./subcomponents/CommSpentBarChartPane";
import StatisticDataGrid from "./StatisticDataGrid";
import { Card, CardContent, CardHeader } from "@mui/material";

export default function CharactersStatisticsPane(props: {
    year: number
}) {

    const { year } = props;

    const statsApi = useApi(getCharacterStatistics)

    useEffect(() => {
        statsApi.fetch(undefined, undefined, year < 0 ? undefined : year)
    }, [year])

    return <div>
        <div style={{ marginBottom: "20px" }}>
            <CommCountPieChartPane statistics={statsApi.data} title="Commissions with Character" statisticType="CHARACTER" />
        </div>
        <div>
            <CommSpentBarChartPane statistics={statsApi.data} title="Spent on Characters" />
        </div>
        <div>
            <Card style={{ marginTop: "20px" }} >
                <CardHeader title="Character Data" />
                <CardContent>
                    <StatisticDataGrid statistics={statsApi.data} statisticType="CHARACTER" />
                </CardContent>
            </Card>
        </div>
    </div>

}

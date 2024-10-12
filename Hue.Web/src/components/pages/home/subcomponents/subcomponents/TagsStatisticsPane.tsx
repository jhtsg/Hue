import { useEffect } from "react";
import { getTagStatistics } from "../../../../../api/Statistics";
import useApi from "../../../../hooks/useApi";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import CommSpentBarChartPane from "./subcomponents/CommSpentBarChartPane";
import CommCountBarChart from "./subcomponents/CommCountBarChart";
import { Card, CardContent, CardHeader } from "@mui/material";
import StatisticDataGrid from "./StatisticDataGrid";
import { useUser } from "../../../../hooks/useUser";

export default function TagsStatisticsPane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical } = useWindowDimensions();

    const statsApi = useApi(getTagStatistics)
    const { user } = useUser();
    const artist = user?.isArtist

    useEffect(() => {
        statsApi.fetch(undefined, undefined, year < 0 ? undefined : year)
    }, [year])

    return <>

        <div style={vertical ? {} : { display: "flex" }}>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
                <CommSpentBarChartPane title={artist ? "Earned from Tags" : "Spent on Tags"} statistics={statsApi.data} />
            </div>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px", marginRight: "10px" }}>
                <CommCountBarChart title="Commissions with Tags" statistics={statsApi.data} />
            </div>
            <Card style={vertical ? { marginBottom: "20px" } : { flex: "1", marginLeft: "10px" }}>
                <CardHeader title="Tags" />
                <CardContent>
                    <StatisticDataGrid statisticType="TAG" statistics={statsApi.data} pageSize={3} />
                </CardContent>
            </Card>
        </div>

    </>

}

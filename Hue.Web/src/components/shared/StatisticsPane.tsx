import { Card, CardContent, Skeleton } from "@mui/material";
import Statistic from "../../model/statistics/Statistic";
import ApiAlert from "./ApiAlert";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { useUser } from "../hooks/useUser";
import ArtistStatistic from "../../model/statistics/ArtistStatistic";

export function StatisticsPane(props: {
    overall?: Statistic,
    overallLoading: boolean,
    overallError: any,
    thisYear?: Statistic,
    thisYearLoading: boolean,
    thisYearError: any
    verticalOverride?: boolean
}) {

    const { width } = useWindowDimensions();
    const { user } = useUser();
    const artist = user?.isArtist

    const vertical = width < 700

    const { overall, thisYear, overallError, overallLoading, thisYearError, thisYearLoading, verticalOverride } = props;


    return <div style={{ margin: "0 auto", maxWidth: vertical || verticalOverride ? undefined : "800px", display: vertical || verticalOverride ? "" : "flex" }}>
        <Card style={vertical || verticalOverride ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
            <CardContent>
                <div>Overall</div>
                <hr />
                {overallLoading
                    ? <Skeleton width={'100%'} height={'3em'} />
                    : overallError ? <ApiAlert result={overallError} />
                        : <table width={"100%"}>
                            <tr>
                                <td width="50%">Commissions</td>
                                <td>{overall?.count?.toLocaleString() ?? 'None'}</td>
                            </tr>
                            {
                                (overall as any)?.averageDaysToComplete ? <tr>
                                    <td>Avg. Turnaround</td>
                                    <td>{Math.ceil((overall as ArtistStatistic).averageDaysToComplete)} Day(s)</td>
                                </tr> : <></>
                            }
                            <tr>
                                <td>Total {artist ? "earned" : "spent"}</td>
                                <td>${overall?.spent?.toLocaleString() ?? '0'}</td>
                            </tr>
                            <tr>
                                <td>Last Seen</td>
                                <td>
                                    {overall?.lastSeen
                                        ? new Date(overall.lastSeen).toLocaleDateString()
                                        : "Not seen yet!"}
                                </td>
                            </tr>
                        </table>
                }

            </CardContent>
        </Card>
        <Card style={vertical || verticalOverride ? {} : { flex: "1", marginLeft: "10px" }}>
            <CardContent>
                <div>So far this year</div>
                <hr />
                {thisYearLoading
                    ? <Skeleton width={'100%'} height={'3em'} />
                    : thisYearError ? <ApiAlert result={thisYearError} />
                        : <table width={"100%"}>
                            <tr>
                                <td width="50%">Commissions</td>
                                <td>{thisYear?.count?.toLocaleString() ?? 'None'}</td>
                            </tr>
                            <tr>
                                <td>Total {artist ? "earned" : "spent"}</td>
                                <td>${thisYear?.spent?.toLocaleString() ?? 0}</td>
                            </tr>
                        </table>
                }
            </CardContent>
        </Card>
    </div>
}
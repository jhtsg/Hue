import { Card, CardContent, Skeleton } from "@mui/material";
import Statistic from "../../model/statistics/Statistic";
import ApiAlert from "./ApiAlert";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

export function StatisticsPane(props: {
    overall?: Statistic,
    overallLoading: boolean,
    overallError: any,
    thisYear?: Statistic,
    thisYearLoading: boolean,
    thisYearError: any
}) {

    const { width } = useWindowDimensions();

    const vertical = width < 700

    const { overall, thisYear, overallError, overallLoading, thisYearError, thisYearLoading } = props;

    return <div style={{ margin: "20px auto 20px auto", maxWidth: "800px", display: vertical ? "" : "flex" }}>
        <Card style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}>
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
                            <tr>
                                <td>Total Spent</td>
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
        <Card style={vertical ? {} : { flex: "1", marginLeft: "10px" }}>
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
                                <td>Total Spent</td>
                                <td>${thisYear?.spent?.toLocaleString() ?? 0}</td>
                            </tr>
                        </table>
                }
            </CardContent>
        </Card>
    </div>
}
import { useEffect } from "react";
import { getGlance } from "../../../../../api/Statistics";
import useApi from "../../../../hooks/useApi";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { Card, CardContent, Skeleton } from "@mui/material";
import AtAGlance from "../../../../../model/statistics/AtAGlance";
import { useUser } from "../../../../hooks/useUser";

export default function AtAGlancePane(props: {
    year: number
}) {

    const { year } = props;
    const { vertical } = useWindowDimensions();

    const atAGlanceApi = useApi(getGlance)

    useEffect(() => {
        atAGlanceApi.fetch(undefined, undefined, year < 0 ? undefined : year)
    }, [year])

    return <div style={vertical ? {} : { display: "flex" }}>
        <div style={vertical ? { marginBottom: "20px" } : { flex: "1", marginRight: "10px" }}><TotalCard glance={atAGlanceApi.data} /></div>
        <div style={vertical ? undefined : { flex: "1", marginLeft: "10px" }}><AverageCard glance={atAGlanceApi.data} /></div>
    </div>

}

function TotalCard(props: {
    glance?: AtAGlance
}) {

    const { glance } = props;
    const { width } = useWindowDimensions();
    const vertical = width < 600

    const { user } = useUser();
    const artist = user?.isArtist

    return <Card><CardContent>
        <div style={vertical ? {} : { display: "flex" }}>
            <table style={vertical ? undefined : { width: "50%" }}>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Total Started Commissions</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : glance.totalComms?.toLocaleString() ?? 0}</td>
                </tr>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Total {artist ? "Earned" : "Spent"}</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : '$' + (glance.totalSpent?.toLocaleString() ?? 0)}</td>
                </tr>
            </table>
            {vertical && <hr />}
            <table style={vertical ? undefined : { width: "50%" }}>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Total Pending Commissions</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : glance.totalYetToComm?.toLocaleString() ?? 0}</td>
                </tr>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Total Potential {artist ? "Earnings" : "Spend"}</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : '$' + (glance.totalYetToSpend?.toLocaleString() ?? 0)}</td>
                </tr>
            </table>
        </div>
    </CardContent></Card>

}


function AverageCard(props: {
    glance?: AtAGlance
}) {

    const { glance } = props;
    const { width } = useWindowDimensions();
    const vertical = width < 600

    const { user } = useUser();
    const artist = user?.isArtist

    return <Card><CardContent>
        <div style={vertical ? undefined : { display: "flex" }}>
            <table style={vertical ? undefined : { width: "50%" }}>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Avg. Commission Price</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : '$' + (glance.averagePrice?.toFixed(2) ?? 0)}</td>
                </tr>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Avg. days to Completion</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : glance.averageTTC?.toFixed(2) ?? 0}</td>
                </tr>
            </table>
            {vertical && <hr />}
            <table style={vertical ? undefined : { width: "50%" }}>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Avg. Monthly {artist ? "Earning" : "Spending"}</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : '$' + (glance.averageSpentPerMonth?.toFixed(2) ?? 0)}</td>
                </tr>
                <tr>
                    <td style={{ width: "50%", paddingRight: "20px" }}><b>Avg. Commissions per Month</b></td>
                    <td>{!glance ? <Skeleton variant="text" /> : glance.averageCommsPerMonth?.toFixed(2) ?? 0}</td>
                </tr>
            </table>
        </div>
    </CardContent></Card>

}

import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ArtistPane from "./subcomponents/ArtistPane";
import ArtistStatisticPane from "./subcomponents/ArtistStatisticPane";
import CommsDisplay from "../comms/subcomponents/CommsDisplay";
import { useUser } from "../../hooks/useUser";
import CommissionStatisticsPane from "../../shared/statistics/CommissionStatisticsPane";
import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";

export default function ArtistPage() {

    const { id } = useParams();
    const nav = useNavigate();
    const { user } = useUser();
    const artist = user?.isArtist

    const [filter, setFilter] = useState({
        ArtistId: id
    } as CommissionFilterOptions)

    useEffect(() => {
        setFilter({
            ArtistId: id
        } as CommissionFilterOptions)
    }, [id])

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div><IconButton color="inherit" onClick={() => nav(-1)}><ArrowBack /></IconButton></div>
            <div style={{ fontSize: "1.7em", flex: "1" }}>{artist ? "Client" : "Artist"}</div>
        </div>
        <hr />

        <div style={{ maxWidth: "800px", margin: "20px auto 0 auto" }}>
            <Card elevation={5}>
                <CardContent>
                    <ArtistPane editable id={new Number(id) as number} />
                </CardContent>
            </Card>
        </div>

        <div style={{ maxWidth: "800px", margin: "20px auto 20px auto" }}>
            <CommissionStatisticsPane filter={filter} maxWidth={519} />
        </div>

        <ArtistStatisticPane id={Number(id)} />

        <div style={{ margin: "20px auto -30px auto", maxWidth: "1200px" }}>
            <div>Commissioned Works</div>
            <hr />
        </div>

        <CommsDisplay filter={{
            Page: 0,
            ArtistId: Number(id)
        }} />
    </>
}
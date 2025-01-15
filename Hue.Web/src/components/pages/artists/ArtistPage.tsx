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
import { deleteArtist } from "../../../api/Artist";
import NoCommsDeletePane from "../../shared/NoCommsDeletePane";
import useApi from "../../hooks/useApi";
import ServiceBrowser from "../../shared/services/ServiceBrowser";
import Artist from "../../../model/artist/Artist";

export default function ArtistPage() {

    const { id } = useParams();
    const deleteApi = useApi(deleteArtist);
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

        {!artist && <div style={{ maxWidth: "800px", margin: "20px auto 20px auto" }}>
            <Card elevation={5}>
                <div style={{ padding: "20px" }}>
                    <div style={{ marginBottom: "10px" }}>Services</div>
                    <ServiceBrowser artist={{ id: new Number(id) } as Artist} editable />
                </div>
            </Card>
        </div>}

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
        }} noCommsPane={<NoCommsDeletePane
            api={deleteApi}
            id={Number(id)}
            type="artist"
        />} />
    </>
}
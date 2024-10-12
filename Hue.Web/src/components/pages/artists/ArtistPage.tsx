import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ArtistPane from "./subcomponents/ArtistPane";
import ArtistStatisticPane from "./subcomponents/ArtistStatisticPane";
import CommsDisplay from "../comms/subcomponents/CommsDisplay";
import { useUser } from "../../hooks/useUser";

export default function ArtistPage() {

    const { id } = useParams();
    const nav = useNavigate();
    const { user } = useUser();
    const artist = user?.isArtist


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
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CircularProgress, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ArtistPane from "./subcomponents/ArtistPane";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { getCommissions } from "../../../api/Comm";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";
import useApi from "../../hooks/useApi";
import CommCard from "../comms/subcomponents/CommCard";

export default function ArtistPage() {

    const { id } = useParams();
    const nav = useNavigate();
    const { vertical } = useWindowDimensions();

    const commsApi = useApi(getCommissions, true, undefined, undefined, {
        ArtistId: Number(id)
    } as CommissionFilterOptions)


    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div><IconButton color="inherit" onClick={() => nav(-1)}><ArrowBack /></IconButton></div>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Artist</div>
        </div>
        <hr />

        <div style={{ maxWidth: "800px", margin: "20px auto 0 auto" }}>
            <Card elevation={5}>
                <CardContent>
                    <ArtistPane editable id={new Number(id) as number} />
                </CardContent>
            </Card>
        </div>

        <div style={{ maxWidth: "1200px", margin: "40px auto", display: "flex", flexWrap: 'wrap', justifyContent: 'center' }}>
            {commsApi.loading && <CircularProgress />}
            {commsApi.data?.map(a => <div style={vertical ? { width: "50%" } : { width: "33%" }}><CommCard commission={a} noContextMenu /></div>)}
        </div>

    </>
}
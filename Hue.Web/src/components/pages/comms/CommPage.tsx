import { useNavigate, useParams } from "react-router-dom";
import { Card, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import CommPane from "./subcomponents/CommPane";

export default function CommPage() {
    const { id } = useParams();
    const nav = useNavigate();


    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div><IconButton color="inherit" onClick={() => nav(-1)}><ArrowBack /></IconButton></div>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Commission</div>
        </div>
        <hr />

        <div style={{ maxWidth: "1200px", margin: "20px auto 20px auto" }}>
            <Card elevation={5}>
                <CommPane id={new Number(id) as number} />
            </Card>
        </div>

    </>
}
import { useNavigate, useParams } from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import { Card, CardContent, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import CharacterPane from "./subcomponents/CharacterPane";

export default function CharPage() {
    const { id } = useParams();
    const nav = useNavigate();
    usePageTitle("Character")


    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div><IconButton color="inherit" onClick={() => nav(-1)}><ArrowBack /></IconButton></div>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Character</div>
        </div>
        <hr />

        <div style={{ maxWidth: "800px", margin: "20px auto 0 auto" }}>
            <Card elevation={5}>
                <CardContent>
                    <CharacterPane editable id={new Number(id) as number} />
                </CardContent>
            </Card>
        </div>

    </>
}
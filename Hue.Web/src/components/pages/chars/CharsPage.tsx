import { useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import useApi from "../../hooks/useApi";
import { getCharacters } from "../../../api/Char";
import { Button, Dialog } from "@mui/material";
import { Add } from "@mui/icons-material";
import ApiAlert from "../../shared/ApiAlert";
import LoadingBackdrop from "../../shared/LoadingBackdrop";
import CharacterTile from "./subcomponents/CharacterTile";
import CharacterPane from "./subcomponents/CharacterPane";

export default function CharsPage() {

    const [newOpen, setNewOpen] = useState(false)

    usePageTitle("Characters")
    const artistsApi = useApi(getCharacters, true)

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Characters</div>
            <div><Button variant="contained" onClick={() => setNewOpen(true)} startIcon={<Add />}>New</Button></div>
        </div>
        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px" }} >
            {artistsApi.data?.map(a => <CharacterTile character={a} />)}
        </div>

        <LoadingBackdrop loading={artistsApi.loading} />

        <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="md" fullWidth>
            <div style={{ padding: 20 }}>
                <CharacterPane create open={newOpen} setOpen={setNewOpen} onOk={() => {
                    setNewOpen(false);
                    artistsApi.fetch();
                }} />

            </div>
        </Dialog>

    </>
}
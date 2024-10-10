import { useState } from "react";
import useApi from "../../hooks/useApi";
import { getCharacters } from "../../../api/Char";
import { Button, Dialog } from "@mui/material";
import { Add } from "@mui/icons-material";
import ApiAlert from "../../shared/ApiAlert";
import LoadingBackdrop from "../../shared/LoadingBackdrop";
import CharacterTile from "./subcomponents/CharacterTile";
import CharacterPane from "./subcomponents/CharacterPane";
import Character from "../../../model/character/Character";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

export default function CharsPage(props: {
    onSelect?: (val: Character) => void
}) {

    const [newOpen, setNewOpen] = useState(false)
    const artistsApi = useApi(getCharacters, true)
    const { vertical } = useWindowDimensions();

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Characters</div>
            <div><Button variant="contained" onClick={() => setNewOpen(true)} startIcon={<Add />}>New</Button></div>
        </div>
        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px", justifyContent: props.onSelect || vertical ? "center" : undefined }} >
            {artistsApi.data?.map(a => <CharacterTile character={a} onClick={props.onSelect ? () => {
                props.onSelect?.(a)
            } : undefined} />)}
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
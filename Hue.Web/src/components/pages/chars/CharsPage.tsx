import { useState } from "react";
import useApi from "../../hooks/useApi";
import { getCharacters } from "../../../api/Char";
import { Fab, Tooltip } from "@mui/material";
import { Add, Groups } from "@mui/icons-material";
import ApiAlert from "../../shared/ApiAlert";
import LoadingBackdrop from "../../shared/LoadingBackdrop";
import CharacterTile from "./subcomponents/CharacterTile";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import CreateCharacterModal from "./subcomponents/CreateCharacterModal";

export default function CharsPage() {

    const [newOpen, setNewOpen] = useState(false)
    const charactersApi = useApi(getCharacters, true)
    const { vertical, maxComponentHeight } = useWindowDimensions();

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Characters</div>
        </div>
        <hr />
        <ApiAlert result={charactersApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ overflowY: 'auto', height: maxComponentHeight - 30 }}>
            {charactersApi.data?.length === 0
                ? <div style={{
                    height: "100%", width: "100%", color: "#AAA",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}>
                    <Groups fontSize="large" />
                    <div>There are no characters</div>
                    <div>(yet)</div>
                </div>
                : <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px", justifyContent: vertical ? "center" : undefined }} >
                    {charactersApi.data?.map(a => <CharacterTile character={a} />)}
                </div>
            }
        </div>

        <Tooltip title="Create a new Character">
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => setNewOpen(true)} >
                <Add />
            </Fab>
        </Tooltip>


        <LoadingBackdrop loading={charactersApi.loading} />
        <CreateCharacterModal open={newOpen} setOpen={setNewOpen} onOk={() => { charactersApi.fetch(); }} />

    </>
}
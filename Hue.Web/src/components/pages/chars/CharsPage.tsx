import { useState } from "react";
import useApi from "../../hooks/useApi";
import { getCharacters } from "../../../api/Char";
import { Button, Dialog, Fab, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import ApiAlert from "../../shared/ApiAlert";
import LoadingBackdrop from "../../shared/LoadingBackdrop";
import CharacterTile from "./subcomponents/CharacterTile";
import CharacterPane from "./subcomponents/CharacterPane";
import Character from "../../../model/character/Character";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

export default function CharsPage(props: {
    onSelect?: (val: Character) => void
}) {

    const { onSelect } = props

    const [newOpen, setNewOpen] = useState(false)
    const [search, setSearch] = useState('')
    const charactersApi = useApi(getCharacters, true)
    const { vertical, maxComponentHeight } = useWindowDimensions();

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            {onSelect ? <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <div style={{ flex: "1", marginRight: "40px" }}>
                    <TextField variant="standard" placeholder="Search Characters" style={{ maxWidth: "400px" }} fullWidth value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        }
                    }} />
                </div>
                <div>
                    <Button variant="contained" onClick={() => setNewOpen(true)} startIcon={vertical ? undefined : <Add />}>
                        {vertical ? <Add /> : 'New Character'}
                    </Button>
                </div>
            </div> : <div style={{ fontSize: "1.7em", flex: "1" }}>Characters</div>}
        </div>
        <hr />
        <ApiAlert result={charactersApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ overflowY: 'auto', height: maxComponentHeight - (onSelect ? 200 : 30), }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px", justifyContent: props.onSelect || vertical ? "center" : undefined }} >
                {charactersApi.data?.filter((a) => search.trim().length === 0
                    ? true
                    : a.name.toLowerCase().includes(search.toLowerCase())
                ).map(a => <CharacterTile character={a} onClick={props.onSelect ? () => {
                    props.onSelect?.(a)
                } : undefined} />)}
            </div>
        </div>

        {!onSelect && <Tooltip title="Create a new Character">
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => setNewOpen(true)} >
                <Add />
            </Fab>
        </Tooltip>}


        <LoadingBackdrop loading={charactersApi.loading} />

        <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="md" fullWidth>
            <div style={{ padding: 20 }}>
                <CharacterPane create open={newOpen} setOpen={setNewOpen} onOk={() => {
                    setNewOpen(false);
                    charactersApi.fetch();
                }} />

            </div>
        </Dialog>

    </>
}
import { Button, Dialog } from "@mui/material"
import { getArtists } from "../../../api/Artist"
import useApi from "../../hooks/useApi"
import { usePageTitle } from "../../hooks/usePageTitle"
import ApiAlert from "../../shared/ApiAlert"
import LoadingBackdrop from "../../shared/LoadingBackdrop"
import ArtistTile from "./subcomponents/ArtistTile"
import { Add } from "@mui/icons-material"
import { useState } from "react"
import ArtistPane from "./subcomponents/ArtistPane"

export default function ArtistsPage() {

    const [newOpen, setNewOpen] = useState(false)

    usePageTitle("Artists")
    const artistsApi = useApi(getArtists, true)

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Artists</div>
            <div><Button variant="contained" onClick={() => setNewOpen(true)} startIcon={<Add />}>New</Button></div>
        </div>
        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px" }} >
            {artistsApi.data?.map(a => <ArtistTile artist={a} />)}
        </div>

        <LoadingBackdrop loading={artistsApi.loading} />

        <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="sm" fullWidth>
            <div style={{ padding: 20 }}>
                <ArtistPane create open={newOpen} setOpen={setNewOpen} onOk={() => {
                    setNewOpen(false);
                    artistsApi.fetch();
                }} />

            </div>
        </Dialog>

    </>
}
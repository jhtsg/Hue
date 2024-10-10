import { Button, Dialog } from "@mui/material"
import { getArtists } from "../../../api/Artist"
import useApi from "../../hooks/useApi"
import ApiAlert from "../../shared/ApiAlert"
import LoadingBackdrop from "../../shared/LoadingBackdrop"
import ArtistTile from "./subcomponents/ArtistTile"
import { Add } from "@mui/icons-material"
import { useState } from "react"
import ArtistPane from "./subcomponents/ArtistPane"
import Artist from "../../../model/artist/Artist"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"

export default function ArtistsPage(props: {
    onSelect?: (val: Artist) => void
}) {

    const [newOpen, setNewOpen] = useState(false)
    const artistsApi = useApi(getArtists, true)
    const { vertical } = useWindowDimensions();

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Artists</div>
            <div><Button variant="contained" onClick={() => setNewOpen(true)} startIcon={<Add />}>New</Button></div>
        </div>
        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px", justifyContent: props.onSelect || vertical ? "center" : undefined }} >
            {artistsApi.data?.map(a => <ArtistTile artist={a} onClick={props.onSelect ? () => {
                props.onSelect?.(a)
            } : undefined} />)}
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
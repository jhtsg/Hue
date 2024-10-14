import { Dialog, Fab, Tooltip } from "@mui/material"
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
import { useUser } from "../../hooks/useUser"

export default function ArtistsPage(props: {
    onSelect?: (val: Artist) => void
}) {

    const [newOpen, setNewOpen] = useState(false)
    const artistsApi = useApi(getArtists, true)
    const { vertical } = useWindowDimensions();
    const { user } = useUser();
    const artist = user?.isArtist

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>{artist ? "Clients" : "Artist"}</div>
        </div>
        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: "20px", justifyContent: props.onSelect || vertical ? "center" : undefined }} >
            {artistsApi.data?.map(a => <ArtistTile artist={a} onClick={props.onSelect ? () => {
                props.onSelect?.(a)
            } : undefined} />)}
        </div>

        <Tooltip title={`Create a new ${artist ? 'client' : 'artist'}`}>
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => setNewOpen(true)} >
                <Add />
            </Fab>
        </Tooltip>

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
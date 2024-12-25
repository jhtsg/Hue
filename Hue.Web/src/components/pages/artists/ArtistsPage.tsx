import { Fab, Tooltip } from "@mui/material"
import { getArtists } from "../../../api/Artist"
import useApi from "../../hooks/useApi"
import ApiAlert from "../../shared/ApiAlert"
import LoadingBackdrop from "../../shared/LoadingBackdrop"
import ArtistTile from "./subcomponents/ArtistTile"
import { Add, ColorLens } from "@mui/icons-material"
import { useState } from "react"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { useUser } from "../../hooks/useUser"
import CreateArtistModal from "./subcomponents/CreateArtistModal"

export default function ArtistsPage() {


    const [newOpen, setNewOpen] = useState(false)
    const artistsApi = useApi(getArtists, true)
    const { vertical, maxComponentHeight } = useWindowDimensions();
    const { user } = useUser();
    const artist = user?.isArtist

    return <>

        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ fontSize: "1.7em", flex: "1" }}>{artist ? "Clients" : "Artists"}</div>
        </div>

        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ overflowY: 'auto', height: maxComponentHeight - 30, }}>
            {
                artistsApi.data?.length === 0
                    ? <div style={{
                        height: "100%", width: "100%", color: "#AAA",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                    }}>
                        <ColorLens fontSize="large" />
                        <div>There are no {artist ? "clients" : "artists"}</div>
                        <div>(yet)</div>
                    </div>
                    : <div style={{
                        display: 'flex', flexWrap: 'wrap',
                        width: '100%', marginTop: "20px",
                        justifyContent: vertical ? "center" : undefined
                    }} >
                        {artistsApi.data?.map(a => <ArtistTile artist={a} />)}
                    </div>
            }
        </div>

        <Tooltip title={`Create a new ${artist ? 'client' : 'artist'}`}>
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => setNewOpen(true)} >
                <Add />
            </Fab>
        </Tooltip>

        <LoadingBackdrop loading={artistsApi.loading} />
        <CreateArtistModal open={newOpen} setOpen={setNewOpen} onOk={artistsApi.fetch} />

    </>
}
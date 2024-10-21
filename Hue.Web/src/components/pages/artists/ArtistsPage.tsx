import { Button, Dialog, Fab, InputAdornment, TextField, Tooltip } from "@mui/material"
import { getArtists } from "../../../api/Artist"
import useApi from "../../hooks/useApi"
import ApiAlert from "../../shared/ApiAlert"
import LoadingBackdrop from "../../shared/LoadingBackdrop"
import ArtistTile from "./subcomponents/ArtistTile"
import { Add, Search } from "@mui/icons-material"
import { useState } from "react"
import ArtistPane from "./subcomponents/ArtistPane"
import Artist from "../../../model/artist/Artist"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { useUser } from "../../hooks/useUser"

export default function ArtistsPage(props: {
    onSelect?: (val: Artist) => void
}) {

    const { onSelect } = props

    const [newOpen, setNewOpen] = useState(false)
    const [search, setSearch] = useState('')
    const artistsApi = useApi(getArtists, true)
    const { vertical, maxComponentHeight } = useWindowDimensions();
    const { user } = useUser();
    const artist = user?.isArtist

    return <>

        <div style={{ display: "flex", alignItems: "end" }}>
            {onSelect ? <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                <div style={{ flex: "1", marginRight: "40px" }}>
                    <TextField variant="standard" placeholder={artist ? 'Search Clients' : 'Search Artists'} style={{ maxWidth: "400px" }} fullWidth value={search} onChange={(e) => setSearch(e.target.value)} slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        }
                    }} />
                </div>
                <div>
                    <Button onClick={() => setNewOpen(true)} variant="contained" startIcon={vertical ? undefined : <Add />}>
                        {vertical ? <Add /> : 'New Artist'}
                    </Button>
                </div>
            </div> : <div style={{ fontSize: "1.7em", flex: "1" }}>{artist ? "Clients" : "Artists"}</div>}
        </div>

        <hr />
        <ApiAlert result={artistsApi.error} style={{ marginBottom: "20px" }} />
        <div style={onSelect ? { overflowY: 'auto', height: maxComponentHeight - 200, } : undefined}>
            <div style={{
                display: 'flex', flexWrap: 'wrap',
                width: '100%', marginTop: "20px",
                justifyContent: props.onSelect || vertical ? "center" : undefined
            }} >
                {artistsApi.data?.filter((a) => search.trim().length === 0
                    ? true
                    : a.name.toLowerCase().includes(search.toLowerCase()) ||
                    a.socialUrl.toLowerCase().includes(search.toLowerCase())
                ).map(a => <ArtistTile artist={a} onClick={props.onSelect ? () => {
                    props.onSelect?.(a)
                } : undefined} />)}

            </div>
        </div>

        {!onSelect && <Tooltip title={`Create a new ${artist ? 'client' : 'artist'}`}>
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => setNewOpen(true)} >
                <Add />
            </Fab>
        </Tooltip>}

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
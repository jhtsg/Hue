import { useEffect, useState } from "react"
import { getArtists } from "../../../../api/Artist"
import Artist from "../../../../model/artist/Artist"
import useApi from "../../../hooks/useApi"
import SelectorModal from "../../../shared/modals/SelectorModal"
import ArtistTile from "./ArtistTile"
import CreateArtistModal from "./CreateArtistModal"

export default function ArtistSelector(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    setArtist: (val: Artist) => void
}) {

    const artistApi = useApi(getArtists)
    const { open, setOpen, setArtist } = props
    const [newOpen, setNewOpen] = useState(false)

    useEffect(() => {
        if (open) { artistApi.fetch(); }
    }, [open])


    if (!open) return <></>

    return <>
        <SelectorModal
            entries={artistApi.data} loading={artistApi.loading}
            open={open} setOpen={setOpen} onSelect={setArtist}
            onNewClick={() => setNewOpen(true)} type="artist"
            entryFilterDecider={(entry, filter) => entry.name.toLowerCase().includes(filter.toLowerCase())}
            renderEntry={(props) =>
                <div style={{ paddingRight: "10px" }}><ArtistTile artist={props.entry} onClick={props.onClick} autoSize /></div>
            }
        />

        <CreateArtistModal open={newOpen} setOpen={setNewOpen} onOk={() => { artistApi.fetch(); }} />

    </>

}
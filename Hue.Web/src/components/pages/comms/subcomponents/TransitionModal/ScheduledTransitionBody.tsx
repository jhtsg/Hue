import { Button, DialogActions, DialogContent, TextField } from "@mui/material"
import Commission from "../../../../../model/commission/Commission"
import { useEffect, useState } from "react";
import { dateFromBackend } from "../../../../shared/Utils";
import Artist from "../../../../../model/artist/Artist";
import { ArtistInformation } from "../CommPane";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";

export default function ScheduledTransitionBody(props: {
    comm: Commission
    update: (val: Commission) => void
    close: () => void
}) {

    const { comm, update, close } = props;

    const { width } = useWindowDimensions();
    const vertical = width < 800

    //Show Start Date, artist, price
    const [startTs, setStartTs] = useState("");

    const [artist, setArtist] = useState(undefined as Artist | undefined)
    const [price, setPrice] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [commType, setCommType] = useState(0);

    const [dirty, setDirty] = useState(false);
    const markDirty = () => setDirty(true);

    useEffect(() => {
        setStartTs(comm.startTs ? dateFromBackend(comm.startTs) : dateFromBackend(new Date().toISOString()))
        setArtist(comm.artist)
        setPrice(comm.price)
        setCharCount(comm.charCount)
        setCommType(comm.charCount)
        setDirty(false)
    }, [comm])

    const ok = () => {
        if (!dirty) { update(comm); }
        else {
            update({
                ...comm,
                startTs: startTs,
                artist: artist,
                price: price,
                charCount: charCount,
                type: commType
            } as Commission)
        }
    }

    return <>
        <DialogContent>

            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
                <TextField type="date" value={startTs} label="Start" fullWidth onChange={(e) => {
                    setStartTs(e.target.value)
                    markDirty();
                }} />
            </div>

            <ArtistInformation markDirty={markDirty} vertical={vertical}
                price={price} setPrice={setPrice}
                artist={artist} setArtist={setArtist}
                charCount={charCount} setCharCount={setCharCount}
                commType={commType} setCommType={setCommType}
            />

        </DialogContent>
        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={ok}>OK</Button>
        </DialogActions>

    </>

}
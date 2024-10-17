import { useEffect, useState } from "react";
import Commission from "../../../../../model/commission/Commission"
import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { PublishingInformation } from "../CommPane";
import { dateFromBackend } from "../../../../shared/Utils";

export default function PublishedTransitionBody(props: {
    comm: Commission
    update: (val: Commission) => void
    close: () => void
}) {

    const { comm, update, close } = props;
    const { width } = useWindowDimensions();
    const vertical = width < 800

    //Show publish date, publish tags, post description
    const [name, setName] = useState("")
    const [postTags, setPostTags] = useState("")
    const [postDescription, setPostDescription] = useState("")
    const [postUrl, setPostUrl] = useState("")
    const [publishTs, setPublishTs] = useState("")

    const [dirty, setDirty] = useState(false);
    const markDirty = () => setDirty(true);

    useEffect(() => {
        setName(comm.name)
        setPostTags(comm.postTags)
        setPostDescription(comm.postDescription)
        setPostUrl(comm.postUrl)
        setPublishTs(comm.publishTs ? dateFromBackend(comm.publishTs) : dateFromBackend(new Date().toLocaleDateString()))
        setDirty(false)
    }, [comm])

    const ok = () => {
        if (!dirty) { update(comm); }
        else {
            update({
                ...comm,
                name: name,
                postTags: postTags,
                postDescription: postDescription,
                postUrl: postUrl,
                publishTs: publishTs
            })
        }
    }


    return <>
        <DialogContent>

            <TextField label='Name' fullWidth variant="standard" value={name}
                sx={{ '& .MuiInputBase-input': { fontSize: '1.5em' } }}
                style={{ marginBottom: "20px" }}
                onChange={(e) => { setName(e.target.value); markDirty(); }} />

            <PublishingInformation markDirty={markDirty} vertical={vertical}
                postDescription={postDescription} setPostDescription={setPostDescription}
                postTags={postTags} setPostTags={setPostTags}
                publishTs={publishTs} setPublishTs={setPublishTs}
                postUrl={postUrl} setPostUrl={setPostUrl}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={close}>Cancel</Button>
            <Button onClick={ok}>OK</Button>
        </DialogActions>
    </>

}
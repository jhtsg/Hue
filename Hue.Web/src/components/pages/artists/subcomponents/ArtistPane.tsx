import { Button, CircularProgress, Skeleton, Link, TextField, InputAdornment } from "@mui/material"
import { artistImage, createArtist, getArtist, updateArtist, updateArtistProfile } from "../../../../api/Artist"
import SafeAvatar from "../../../shared/SafeAvatar"
import SocialDisplay from "../../../shared/SocialDisplay"
import useApi from "../../../hooks/useApi"
import useUpload from "../../../hooks/useUpload"
import { useEffect, useRef, useState } from "react"
import ApiAlert from "../../../shared/ApiAlert"
import Artist from "../../../../model/artist/Artist"
import SocialIcon from "../../../shared/SocialIcon"
import Social from "../../../../model/Social"
import { useSnackbar } from "notistack"
import { useUser } from "../../../hooks/useUser"

export default function ArtistPane(props: {
    create?: boolean,
    editable?: boolean,
    id?: number
    open?: boolean
    setOpen?: (val: boolean) => void
    onOk?: () => void
}) {

    const { id, create, editable, onOk } = props

    const { enqueueSnackbar } = useSnackbar();
    const { user } = useUser();
    const artist = user?.isArtist

    const [editMode, setEditMode] = useState(create)
    const [name, setName] = useState("")
    const [social, setSocial] = useState("")
    const [commSheet, setCommSheet] = useState("")
    const [selectedFile, setSelectedFile] = useState(null as File | null)
    const [selectedFileUrl, setSelectedFileUrl] = useState(undefined as string | undefined)

    const artistApi = useApi(getArtist, !!id, undefined, undefined, id)
    const updateArtistApi = useApi(updateArtist);
    const createArtistApi = useApi(createArtist)
    const updateArtistProfileApi = useUpload(updateArtistProfile)

    const fileInputRef = useRef(null);

    const refreshArtist = () => {
        artistApi.fetch(undefined, undefined, id)
    }

    useEffect(() => {
        setName("")
        setSocial("")
        setCommSheet("");
        setSelectedFile(null)
        artistApi.resetError()
        updateArtistApi.resetError();
        createArtistApi.resetError();
        updateArtistProfileApi.resetError();
    }, [props.open])

    const handleActionClick = () => {
        if (!editMode) {
            setName(artistApi.data?.name)
            setSocial(artistApi.data?.socialUrl)
            setCommSheet(artistApi.data?.commSheetUrl);
            setSelectedFile(null)
            setEditMode(true)
            artistApi.resetError()
            updateArtistApi.resetError();
            createArtistApi.resetError();
            updateArtistProfileApi.resetError();
            return;
        }

        if (create) {
            createArtistApi.fetch(onCreateSuccess, undefined, {
                name: name,
                commSheetUrl: commSheet,
                socialUrl: social
            } as Artist)
        } else {
            updateArtistApi.fetch(onUpdateSuccess, undefined, {
                id: id,
                name: name,
                commSheetUrl: commSheet,
                socialUrl: social
            } as Artist)
        }

    }

    const onCreateSuccess = (val?: Artist) => {
        if (selectedFile) {
            updateArtistProfileApi.fetch(onUploadCreateSuccess, undefined, val?.id, selectedFile)
        } else {
            enqueueSnackbar("Artist created!", { variant: 'success' })
            if (onOk) onOk();
        }
    }

    const onUpdateSuccess = () => {
        if (onOk) onOk();
        setEditMode(false)
        refreshArtist();
        if (selectedFile) {
            updateArtistProfileApi.fetch(onUploadSuccess, undefined, id, selectedFile)
        } else {
            enqueueSnackbar("Artist Updated!", { variant: 'success' })
        }
    }

    const onUploadCreateSuccess = () => {
        if (selectedFileUrl) { URL.revokeObjectURL(selectedFileUrl) }
        setSelectedFile(null)
        enqueueSnackbar("Artist Created!")
        if (onOk) onOk();
    }

    const onUploadSuccess = () => {
        if (selectedFileUrl) { URL.revokeObjectURL(selectedFileUrl) }
        setSelectedFile(null)
        enqueueSnackbar("Artist Updated!", { variant: 'success' })
    }


    const anyLoading = artistApi.loading || updateArtistApi.loading || createArtistApi.loading || updateArtistProfileApi.loading

    return <>

        <input
            type="file"
            accept="image/*" // Restrict file types to images only
            onChange={(e) => {
                if (e.target.files) {
                    setSelectedFile(e.target.files[0])
                    setSelectedFileUrl(URL.createObjectURL(e.target.files[0]))
                }
            }}
            ref={fileInputRef}
            style={{ display: 'none' }}
        />

        <ApiAlert result={artistApi.error} style={{ marginBottom: "20px" }} />
        <ApiAlert result={updateArtistApi.error} style={{ marginBottom: "20px" }} />
        <ApiAlert result={createArtistApi.error} style={{ marginBottom: "20px" }} />
        <ApiAlert result={updateArtistProfileApi.error} style={{ marginBottom: "20px" }} />
        <div style={{ width: "100%", display: "flex" }}>
            <div style={{ marginRight: "20px", textAlign: 'center' }}>
                <SafeAvatar size={128} src={
                    selectedFile ? selectedFileUrl : artistImage(id ?? 0)
                } text={"?"} />
                {editMode && <Button style={{ marginTop: "10px" }} onClick={() => { (fileInputRef?.current as any)?.click(); }}>Change</Button>}
            </div>
            <div style={{ flex: "1", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: "1" }}>
                    {editMode ? <>
                        <div style={{ marginBottom: "20px" }}>
                            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                        </div>
                        <div style={{ marginBottom: "20px" }}>
                            <TextField label="Social URL" value={social}
                                onChange={(e) => setSocial(e.target.value)} fullWidth
                                slotProps={{
                                    input: {
                                        startAdornment: <InputAdornment position="start">
                                            <SocialIcon social={Social.fromUrl(social)} size={25} />
                                        </InputAdornment>
                                    }
                                }}
                            />
                        </div>
                        <div hidden={artist} style={{}}>
                            <TextField label="Commission Sheet URL" value={commSheet} onChange={(e) => setCommSheet(e.target.value)} fullWidth />
                        </div>
                    </> :
                        artistApi.data ? <>
                            <div style={{ fontSize: "2em" }}>{artistApi.data.name}</div>
                            <SocialDisplay url={artistApi.data.socialUrl} link />
                            {artistApi.data.commSheetUrl && artistApi.data.commSheetUrl.trim().length > 0 &&
                                <div style={{ marginTop: "5px", fontSize: ".7em" }}><Link href={artistApi.data.commSheetUrl}>Commission Sheet</Link></div>
                            }
                        </> :
                            <>
                                <Skeleton variant="text" sx={{ fontSize: '2em' }} animation='wave' />
                                <Skeleton variant="text" sx={{ fontSize: '.8em' }} animation='wave' />
                            </>
                    }
                </div>
                {(editable || editMode) && <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: "20px" }}>
                    <Button onClick={handleActionClick} disabled={anyLoading}>
                        {anyLoading ? <CircularProgress size={25} /> : editMode ? "OK" : "Edit"}
                    </Button>
                    {editMode && !anyLoading && <Button
                        style={{ marginRight: "20px" }}
                        onClick={() => {
                            if (create && props.setOpen) { props.setOpen(false) }
                            else { setEditMode(false) }
                        }}
                    >
                        Cancel
                    </Button>}
                </div>}
            </div>
        </div>
    </>
}
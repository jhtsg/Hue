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
import { useWindowDimensions } from "../../../hooks/useWindowDimensions"
import AreYouSureModal from "../../../shared/modals/AreYouSureModal"
import ArtistTile from "./ArtistTile"
import RetiredAvatar from "../../../shared/RetiredAvatar"
import CharacterCategoryPill from "../../chars/subcomponents/CharacterCategoryPill"
import CharacterCategory from "../../../../model/character/CharacterCategory"

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

    const { width } = useWindowDimensions();
    const ultraVertical = width < 500

    const [editMode, setEditMode] = useState(create)
    const [name, setName] = useState("")
    const [social, setSocial] = useState("")
    const [commSheet, setCommSheet] = useState("")
    const [selectedFile, setSelectedFile] = useState(null as File | null)
    const [selectedFileUrl, setSelectedFileUrl] = useState(undefined as string | undefined)

    const [retireAys, setRetireAys] = useState(false);

    const artistApi = useApi(getArtist)
    const updateArtistApi = useApi(updateArtist);
    const createArtistApi = useApi(createArtist)
    const updateArtistProfileApi = useUpload(updateArtistProfile)

    const fileInputRef = useRef(null);

    const refreshArtist = () => {
        artistApi.fetch(undefined, undefined, id)
    }

    useEffect(() => {
        if (id) { refreshArtist() }
    }, [id])

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
                socialUrl: social,
                isRetired: artistApi.data?.isRetired
            } as Artist)
        }

    }

    const retireArtist = () => {
        updateArtistApi.fetch(onRetireSuccess(!artistApi.data?.isRetired), undefined, {
            id: artistApi.data?.id,
            name: artistApi.data?.name,
            commSheetUrl: artistApi.data?.commSheetUrl,
            socialUrl: artistApi.data?.socialUrl,
            isRetired: !artistApi.data?.isRetired
        } as Artist)
    }

    const onCreateSuccess = (val?: Artist) => {
        if (selectedFile) {
            updateArtistProfileApi.fetch(artistImage(val?.id ?? 0), onUploadCreateSuccess, undefined, val?.id, selectedFile)
        } else {
            enqueueSnackbar("Artist created!", { variant: 'success' })
            if (onOk) onOk();
        }
    }

    const onUpdateSuccess = () => {
        if (onOk) onOk();
        refreshArtist();
        if (selectedFile) {
            updateArtistProfileApi.fetch(artistImage(id ?? 0), onUploadSuccess, undefined, id, selectedFile)
        } else {
            setEditMode(false)
            enqueueSnackbar("Artist Updated!", { variant: 'success' })
        }
    }

    const onRetireSuccess = (retired: boolean) => () => {
        if (onOk) onOk();
        refreshArtist();
        setRetireAys(false)
        enqueueSnackbar(`Artist ${retired ? "" : "un"}retired!`, { variant: 'success' })
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
        setEditMode(false)
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
        <div style={{ width: "100%", display: "flex", flexDirection: ultraVertical ? 'column' : undefined }}>
            <div style={ultraVertical ? { textAlign: 'center', margin: "0px auto 20px auto" } : { marginRight: "20px", textAlign: 'center' }}>
                {artistApi.data?.isRetired && !editMode
                    ? <RetiredAvatar size={128} src={
                        selectedFile ? selectedFileUrl : artistImage(id ?? 0)
                    } text={"?"} hasImage={!create} />
                    : <SafeAvatar size={128} src={
                        selectedFile ? selectedFileUrl : artistImage(id ?? 0)
                    } text={"?"} hasImage={!create} />
                } {/* Assume we have an image if we're not creating since it'd be faster to error out than to wait for the artist */}
                {editMode && <Button style={{ marginTop: "10px" }} onClick={() => { (fileInputRef?.current as any)?.click(); }}>Change</Button>}
            </div>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", margin: ultraVertical && !editMode ? "0 auto" : undefined }}>
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
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                {artistApi.data?.isRetired && <CharacterCategoryPill category={{ name: "Retired", color: "#777" } as CharacterCategory} />}
                                <SocialDisplay url={artistApi.data.socialUrl} link />
                            </div>
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
                {(editable || editMode) &&
                    <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: "20px", gap: "10px" }}>
                        <Button onClick={handleActionClick} disabled={anyLoading}>
                            {anyLoading ? <CircularProgress size={25} /> : editMode ? "OK" : "Edit"}
                        </Button>

                        {!editMode && !anyLoading && !create && <Button onClick={() => setRetireAys(true)}>
                            {artistApi.data?.isRetired ? "Un-" : ""}Retire
                        </Button>
                        }

                        {editMode && !anyLoading && <Button onClick={() => {
                            if (create && props.setOpen) { props.setOpen(false) } else { setEditMode(false) }
                        }}
                        > Cancel </Button>}
                    </div>}
            </div>
        </div>

        <AreYouSureModal open={retireAys} setOpen={setRetireAys} onYes={retireArtist} loading={updateArtistApi.loading} title={`${artistApi.data?.isRetired ? "Un-" : ""}Retire this artist?`}>
            <div style={{ display: "flex", justifyContent: 'center' }}>
                {artistApi.data && <ArtistTile artist={artistApi.data} onClick={() => { }} />}
            </div>
            <hr />
            {artistApi.data?.name} {artistApi.data?.isRetired
                ? "will now be selectable to take up commissions. You can retire them later again at any time"
                : "will no longer be selectable to take up commissions. This will not delete them, and you can un-retire them later at any time"
            }
        </AreYouSureModal>
    </>
}
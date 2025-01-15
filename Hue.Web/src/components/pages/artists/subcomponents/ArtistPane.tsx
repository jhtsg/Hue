import { Button, CircularProgress, Skeleton, Link, TextField, InputAdornment, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material"
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
    artist?: Artist
    size?: number
    fontSize?: string
    open?: boolean
    setOpen?: (val: boolean) => void
    onOk?: () => void
}) {

    const { id, create, editable, onOk, artist: artistOverride, size, fontSize } = props

    const { enqueueSnackbar } = useSnackbar();
    const { user } = useUser();

    const { width } = useWindowDimensions();
    const ultraVertical = width < 500

    const PAYPAL_MODE = "PayPal"
    const INVOICE_MODE = "Invoice"
    const OTHER_MODE = "Other"

    const [editMode, setEditMode] = useState(create)
    const [name, setName] = useState("")
    const [social, setSocial] = useState("")
    const [payment, setPayment] = useState("")
    const [paymentMode, setPaymentMode] = useState(PAYPAL_MODE)
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
        if (artistOverride) return
        artistApi.fetch(undefined, undefined, id)
    }

    const artist = artistOverride ?? artistApi.data

    useEffect(() => {
        if (id && !artistOverride) { refreshArtist() }
    }, [id])

    useEffect(() => {
        setName("")
        setSocial("")
        setCommSheet("");
        setPayment("")
        setPaymentMode(PAYPAL_MODE)
        setSelectedFile(null)
        artistApi.resetError()
        updateArtistApi.resetError();
        createArtistApi.resetError();
        updateArtistProfileApi.resetError();
    }, [props.open])

    const handleActionClick = () => {
        if (!editMode) {
            setName(artist?.name)
            setSocial(artist?.socialUrl)
            setCommSheet(artist?.commSheetUrl);
            setPayment(artist?.paymentUrl)
            setPaymentMode(artist?.paymentUrl === "INVOICE" ? INVOICE_MODE : isPaypal() ? PAYPAL_MODE : OTHER_MODE)
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
                paymentUrl: paymentMode === INVOICE_MODE ? "INVOICE" : payment,
                socialUrl: social
            } as Artist)
        } else {
            updateArtistApi.fetch(onUpdateSuccess, undefined, {
                id: id,
                name: name,
                commSheetUrl: commSheet,
                socialUrl: social,
                paymentUrl: paymentMode === INVOICE_MODE ? "INVOICE" : payment,
                isRetired: artist?.isRetired
            } as Artist)
        }

    }

    const retireArtist = () => {
        updateArtistApi.fetch(onRetireSuccess(!artist?.isRetired), undefined, {
            id: artist?.id,
            name: artist?.name,
            commSheetUrl: artist?.commSheetUrl,
            socialUrl: artist?.socialUrl,
            paymentUrl: artist?.paymentUrl,
            isRetired: !artist?.isRetired
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

    const payPalPrefix = "https://paypal.me/"

    const getPaypalUsername = (): string =>
        payment?.startsWith(payPalPrefix) ? payment.substring(payPalPrefix.length) : ""

    const setPaypalUsername = (val: string) => setPayment(payPalPrefix + val);

    const isPaypal = () => artist?.paymentUrl?.startsWith(payPalPrefix) || (artist?.paymentUrl?.length ?? 0) === 0;

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
        <div style={{ width: "100%", display: "flex", flexDirection: ultraVertical ? 'column' : undefined, alignItems: (!!size || !!fontSize) ? 'center' : undefined }}>

            {/* Avatar */}
            <div style={ultraVertical ? { textAlign: 'center', margin: "0px auto 20px auto" } : { marginRight: "20px", textAlign: 'center' }}>

                {/* Avatar */}
                {artist?.isRetired && !editMode
                    ? <RetiredAvatar size={size ?? 128} src={
                        selectedFile ? selectedFileUrl : artistImage(id ?? 0)
                    } text={"?"} hasImage={artist?.hasImage} />
                    : <SafeAvatar size={size ?? 128} src={
                        selectedFile && editMode ? selectedFileUrl : artistImage(id ?? 0)
                    } text={artist?.name ?? "?"} hasImage />
                } {/* Assume we have an image if we're not creating since it'd be faster to error out than to wait for the artist */}

                {/* Change button */}
                {editMode && <Button style={{ marginTop: "10px" }} onClick={() => { (fileInputRef?.current as any)?.click(); }}>Change</Button>}
            </div>

            <div style={{ flex: "1", display: "flex", flexDirection: "column", margin: ultraVertical && !editMode ? "0 auto" : undefined, fontSize: fontSize }}>
                <div style={{ flex: "1" }}>
                    {editMode ? <div style={{ display: 'flex', flexDirection: "column", gap: "20px" }}>
                        {/* Editor mode */}
                        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
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

                        {/* Options hidden to artists */}
                        <div hidden={user?.isArtist}>
                            <TextField label="Commission Sheet URL" value={commSheet} onChange={(e) => setCommSheet(e.target.value)} fullWidth />
                        </div>

                        <div hidden={user?.isArtist}>
                            <FormControl style={{ width: "100%" }}>
                                <FormLabel>Payment</FormLabel>
                                <RadioGroup value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                        <div style={{ width: "150px" }}><FormControlLabel value={PAYPAL_MODE} control={<Radio />} label="PayPal™" /></div>
                                        <TextField
                                            label="Username" fullWidth disabled={paymentMode !== PAYPAL_MODE}
                                            value={paymentMode === PAYPAL_MODE ? getPaypalUsername() : ""}
                                            onChange={(e) => setPaypalUsername(e.target.value)}
                                            slotProps={paymentMode === PAYPAL_MODE ? {
                                                input: {
                                                    startAdornment: <InputAdornment position="start">
                                                        @
                                                    </InputAdornment>
                                                }
                                            } : undefined}
                                        />
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
                                        <div style={{ width: "150px" }}><FormControlLabel value={INVOICE_MODE} control={<Radio />} label="Invoice" /></div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div style={{ width: "150px" }}><FormControlLabel value={OTHER_MODE} control={<Radio />} label="Other" /></div>
                                        <TextField
                                            label="URL" fullWidth disabled={paymentMode !== OTHER_MODE}
                                            value={paymentMode === OTHER_MODE ? payment : ""}
                                            onChange={(e) => setPayment(e.target.value)}
                                        />
                                    </div>
                                </RadioGroup>
                            </FormControl>

                        </div>

                    </div> : artist ? <>
                        {/* Tile mode */}
                        <div style={{ fontSize: "2em" }}>{artist.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {artist?.isRetired && <CharacterCategoryPill category={{ name: "Retired", color: "#777" } as CharacterCategory} />}
                            <SocialDisplay url={artist.socialUrl} link />
                            {artist?.paymentUrl?.length > 0 && (
                                artist?.paymentUrl === "INVOICE" ? <SocialDisplay url="https://paypal.me/Invoice" prefixOverride=" " /> :
                                    <SocialDisplay url={artist?.paymentUrl} link />
                            )}
                        </div>
                        {artist.commSheetUrl && artist.commSheetUrl.trim().length > 0 &&
                            <div style={{ marginTop: "5px", fontSize: ".7em" }}><Link href={artist.commSheetUrl}>Commission Sheet</Link></div>
                        }
                    </> :
                        <>
                            <Skeleton variant="text" sx={{ fontSize: '2em' }} animation='wave' />
                            <Skeleton variant="text" sx={{ fontSize: '.8em' }} animation='wave' />
                        </>
                    }
                </div>

                {/* Buttons */}
                {(editable || editMode) &&
                    <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: "20px", gap: "10px" }}>
                        <Button onClick={handleActionClick} disabled={anyLoading}>
                            {anyLoading ? <CircularProgress size={25} /> : editMode ? "OK" : "Edit"}
                        </Button>

                        {!editMode && !anyLoading && !create && <Button onClick={() => setRetireAys(true)}>
                            {artist?.isRetired ? "Un-" : ""}Retire
                        </Button>
                        }

                        {editMode && !anyLoading && <Button onClick={() => {
                            if (create && props.setOpen) { props.setOpen(false) } else { setEditMode(false) }
                        }}
                        > Cancel </Button>}
                    </div>}
            </div>
        </div>

        <AreYouSureModal open={retireAys} setOpen={setRetireAys} onYes={retireArtist} loading={updateArtistApi.loading} title={`${artist?.isRetired ? "Un-" : ""}Retire this artist?`}>
            <div style={{ display: "flex", justifyContent: 'center' }}>
                {artist && <ArtistTile artist={artist} onClick={() => { }} />}
            </div>
            <hr />
            {artist?.name} {artist?.isRetired
                ? "will now be selectable to take up commissions. You can retire them later again at any time"
                : "will no longer be selectable to take up commissions. This will not delete them, and you can un-retire them later at any time"
            }
        </AreYouSureModal>
    </>
}
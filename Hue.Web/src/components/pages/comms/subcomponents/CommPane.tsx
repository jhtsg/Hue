import { Alert, AlertTitle, Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, Menu, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material"
import useApi from "../../../hooks/useApi"
import useUpload from "../../../hooks/useUpload"
import { CSSProperties, useEffect, useRef, useState } from "react"
import ApiAlert from "../../../shared/ApiAlert"
import { useSnackbar } from "notistack"
import { useWindowDimensions } from "../../../hooks/useWindowDimensions"
import Character from "../../../../model/character/Character"
import CommissionTag from "../../../../model/commission/CommissionTag"
import { commHeaderImage, createCommission, deleteCommission, getCommission, updateCommission, updateCommissionHeader } from "../../../../api/Comm"
import { updateCommTag } from "../../../../api/CommTag"
import Artist from "../../../../model/artist/Artist"
import Commission from "../../../../model/commission/Commission"

import { ArrowDownward, ArrowForward, Calculate, Close, InsertPhoto } from "@mui/icons-material"
import useEnhancedBlocker from "../../../hooks/useEnhancedBlocker"
import BlockerConfirmModal from "../../../shared/modals/BlockerConfirmModal"
import { CommissionStatus, CommissionTypes } from "../../../../model/commission/CommissionEnums"
import LoadingBackdrop from "../../../shared/LoadingBackdrop"
import CharacterTile from "../../chars/subcomponents/CharacterTile"
import { addDays, dateFromBackend, dateToBackend, daysSince, daysUntil, months, RemoveIndex as removeIndex } from "../../../shared/Utils"
import AvatarTile from "../../../shared/AvatarTile"
import ColorPill from "../../../shared/ColorPill"
import CommTagEditor from "./CommTagEditor"
import CommTagSelector from "./CommTagSelector"
import ArtistTile from "../../artists/subcomponents/ArtistTile"
import { useNavigate } from "react-router-dom"
import AreYouSureModal from "../../../shared/modals/AreYouSureModal"
import CharacterSelector from "../../chars/subcomponents/CharacterSelector"
import { useUser } from "../../../hooks/useUser"
import Social from "../../../../model/Social"
import SocialIcon from "../../../shared/SocialIcon"
import ArtistSelector from "../../artists/subcomponents/ArtistSelector"
import { getStatisticForArtist } from "../../../../api/Statistics"
import ArtistStatistic from "../../../../model/statistics/ArtistStatistic"
import ServiceEstimator from "../../../shared/services/ServiceEstimator"


export default function CommPane(props: {
    create?: boolean,
    editable?: boolean,
    id?: number
    open?: boolean
    setOpen?: (val: boolean) => void
    onOk?: () => void
}) {

    const { id, create, onOk } = props

    const { enqueueSnackbar } = useSnackbar();
    const nav = useNavigate();
    const { width } = useWindowDimensions();
    const vertical = width < 900

    const [dirty, setDirty] = useState(!!create)
    const blocker = useEnhancedBlocker(dirty);

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [postTags, setPostTags] = useState("")
    const [postDescription, setPostDescription] = useState("")
    const [postUrl, setPostUrl] = useState("")
    const [charCount, setCharCount] = useState(0);
    const [price, setPrice] = useState(0);
    const [status, setStatus] = useState(0);
    const [type, setType] = useState(0);

    const [startTs, setStartTs] = useState("" as string | undefined)
    const [doneTs, setDoneTs] = useState("" as string | undefined)
    const [publishTs, setPublishTs] = useState("" as string | undefined)

    const [characters, setCharacters] = useState([] as Character[])
    const [tags, setTags] = useState([] as CommissionTag[])
    const [artist, setArtist] = useState(undefined as Artist | undefined)

    const [selectedFile, setSelectedFile] = useState(null as File | null)
    const [selectedFileUrl, setSelectedFileUrl] = useState(undefined as string | undefined)

    const [deleteOpen, setDeleteOpen] = useState(false)

    const commApi = useApi(getCommission)

    const updateCommApi = useApi(updateCommission);
    const createCommApi = useApi(createCommission)
    const deleteCommApi = useApi(deleteCommission);
    const updateCommHeaderApi = useUpload(updateCommissionHeader)

    const color = commApi.data?.characters?.[0]?.color ?? "#999999"

    const refreshComm = () => {
        commApi.fetch(undefined, undefined, id)
    }

    useEffect(() => {
        if (id && commApi.data?.id !== id) { refreshComm() }
    }, [id])

    useEffect(() => {
        setName("")
        setDescription("")

        setStatus(0)
        setType(0)

        setStartTs("")
        setDoneTs("")
        setPublishTs("")

        setPostTags("")
        setPostDescription("")
        setPostUrl("")

        setCharCount(0)
        setPrice(0)

        setArtist(undefined)
        setCharacters([])
        setTags([])

        setSelectedFile(null)
        commApi.resetError()
        updateCommApi.resetError();
        createCommApi.resetError();
        updateCommHeaderApi.resetError();

        setDirty(false)

    }, [props.open])

    useEffect(() => {
        if (!commApi.data) return;
        const comm = commApi.data;
        setName(comm.name)
        setDescription(comm.description)

        setStatus(comm.status)
        setType(comm.type)

        setStartTs(comm.startTs ? dateFromBackend(comm.startTs) : "")
        setDoneTs(comm.doneTs ? dateFromBackend(comm.doneTs) : "")
        setPublishTs(comm.publishTs ? dateFromBackend(comm.publishTs) : "")

        setPostTags(comm.postTags)
        setPostDescription(comm.postDescription)
        setPostUrl(comm.postUrl)

        setCharCount(comm.charCount)
        setPrice(comm.price)

        setArtist(comm.artist)
        setCharacters(comm.characters)
        setTags(comm.commissionTags)

        setSelectedFile(null)
        commApi.resetError()
        updateCommApi.resetError();
        createCommApi.resetError();
        updateCommHeaderApi.resetError();

        setDirty(false)

    }, [commApi.data])


    const saveClick = () => {
        if (create) { createChar() }
        else { updateChar() }
    }

    const createChar = () => {
        createCommApi.fetch(onCreateSuccess, undefined, {
            name: name,
            description: description,

            status: status,
            type: type,

            startTs: dateToBackend(startTs),
            doneTs: dateToBackend(doneTs),
            publishTs: dateToBackend(publishTs),

            postTags: postTags,
            postDescription: postDescription,
            postUrl: postUrl,

            charCount: charCount,
            price: price,

            artist: artist,
            characters: characters,
            commissionTags: tags

        } as Commission)
    }

    const updateChar = () => {
        updateCommApi.fetch(onUpdateSuccess, undefined, {
            id: id,
            name: name,
            description: description,

            status: status,
            type: type,

            startTs: dateToBackend(startTs),
            doneTs: dateToBackend(doneTs),
            publishTs: dateToBackend(publishTs),

            postTags: postTags,
            postDescription: postDescription,
            postUrl: postUrl,

            charCount: charCount,
            price: price,

            artist: artist,
            characters: characters,
            commissionTags: tags
        } as Commission)
    }

    const onCreateSuccess = (val?: Commission) => {
        if (selectedFile) {
            updateCommHeaderApi.fetch(commHeaderImage(val?.id ?? 0), onUploadCreateSuccess, undefined, val?.id, selectedFile)

        } else {
            enqueueSnackbar("Commission created!", { variant: 'success' })
            if (onOk) onOk();
        }
    }

    const onUpdateSuccess = () => {
        if (onOk) onOk();
        if (selectedFile) {
            updateCommHeaderApi.fetch(commHeaderImage(id ?? 0), onUploadSuccess, undefined, id, selectedFile)
        } else {
            setDirty(false)
            refreshComm();
            enqueueSnackbar("Commission Updated!", { variant: 'success' })
            nav(-1)
        }
    }

    const onUploadCreateSuccess = () => {
        if (selectedFileUrl) { URL.revokeObjectURL(selectedFileUrl) }
        setSelectedFile(null)
        enqueueSnackbar("Commission Created!", { variant: 'success' })
        if (onOk) onOk();
    }

    const onUploadSuccess = () => {
        if (selectedFileUrl) { URL.revokeObjectURL(selectedFileUrl) }
        setSelectedFile(null)
        setDirty(false)
        refreshComm();
        enqueueSnackbar("Commission Updated!", { variant: 'success' })
        nav(-1)
    }

    const markDirty = () => {
        setDirty(true);
    }

    const anyLoading = commApi.loading || updateCommApi.loading || createCommApi.loading || updateCommHeaderApi.loading || createCommApi.loading

    return <>

        <BlockerConfirmModal blocker={blocker} />

        <ApiAlert result={commApi.error} />
        <ApiAlert result={updateCommApi.error} />
        <ApiAlert result={createCommApi.error} />
        <ApiAlert result={updateCommHeaderApi.error} />

        <CoverHeader
            id={id} color={color} selectedFileUrl={selectedFileUrl} setDirty={setDirty}
            setSelectedFile={setSelectedFile} setSelectedFileUrl={setSelectedFileUrl}
        />

        <WarningsBanner artist={artist} startTs={startTs} doneTs={doneTs} publishTs={publishTs} status={status} />

        <div style={{ padding: "20px" }}>
            <div style={vertical ? {} : { display: "flex" }}>
                <div style={vertical ? {} : { flex: "1", paddingTop: "0px", paddingRight: "10px" }}>

                    {/* Name */}
                    <TextField label='Name' fullWidth variant="standard" value={name}
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.5em' } }}
                        onChange={(e) => { setName(e.target.value); markDirty(); }} />


                    {/* Dates */}
                    <DateInformation
                        vertical={vertical} markDirty={markDirty}
                        startTs={startTs} setStartTs={setStartTs}
                        doneTs={doneTs} setDoneTs={setDoneTs}
                    />


                    <hr style={{ marginBottom: "25px" }} />


                    {/* Description */}
                    <TextField label="Description" fullWidth multiline minRows={12}
                        value={description} onChange={(e) => {
                            setDescription(e.target.value)
                            markDirty();
                        }} />

                    <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

                    <ArtistInformation markDirty={markDirty}
                        charCount={charCount} setCharCount={setCharCount}
                        price={price} setPrice={setPrice}
                        artist={artist} setArtist={setArtist}
                        commType={type} setCommType={setType}
                        vertical={vertical}
                    />

                    <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

                    <PublishingInformation markDirty={markDirty}
                        postDescription={postDescription} setPostDescription={setPostDescription}
                        postUrl={postUrl} setPostUrl={setPostUrl}
                        postTags={postTags} setPostTags={setPostTags}
                        publishTs={publishTs} setPublishTs={setPublishTs}
                        vertical={vertical}
                    />


                </div>
                {vertical && <hr style={{ marginTop: "20px", marginBottom: "20px" }} />}
                <div style={vertical ? {} : { width: "33%", paddingTop: "10px", paddingLeft: "10px", paddingRight: "10px", display: "flex", flexDirection: "column" }}>

                    {!vertical && <SaveButton anyLoading={anyLoading} dirty={dirty} saveClick={saveClick} />}

                    {!create && <div style={{ marginBottom: "20px" }}>
                        <StatusSelect status={status} setStatus={(e) => { setStatus(e); markDirty(); }} />
                    </div>}
                    <div style={{ marginBottom: "10px" }}>
                        <TypeSelect type={type} setType={(e) => { setType(e); markDirty(); }} />
                    </div>

                    <div style={{ marginTop: "10px" }}>Characters</div>
                    <hr style={{ width: "100%" }} />
                    <CharactersDisplay chars={characters} setChars={(val) => {
                        setCharacters(val)
                        markDirty()
                    }} />

                    <div style={{ marginTop: "20px" }}>Tags</div>
                    <hr style={{ width: "100%" }} />
                    <TagsDisplay tags={tags} setTags={(val) => {
                        setTags(val)
                        markDirty();

                    }} />
                    <hr style={{ marginTop: '20px', width: "100%" }} />

                    <div style={{ fontSize: ".8em", color: "#999", display: "flex" }}>
                        {commApi.data?.createTs && <div>
                            <div>Created:</div>
                            <div>{new Date(commApi.data?.createTs + "Z").toLocaleDateString()}</div>
                        </div>}
                        {commApi.data?.updateTs && <div style={{ marginLeft: "20px" }}>
                            <div>Last Updated:</div>
                            <div>{new Date(commApi.data?.updateTs + "Z").toLocaleDateString()}</div>
                        </div>}
                    </div>

                    <div style={{ flex: "1" }} />

                    {vertical && <SaveButton
                        anyLoading={anyLoading} dirty={dirty} saveClick={saveClick}
                        style={{ marginBottom: "10px", marginTop: "20px" }}
                    />

                    }
                    {
                        !create && <Button fullWidth variant="contained" color="secondary" onClick={() => { setDeleteOpen(true) }}
                            style={{ marginTop: "10px", marginBottom: "12px" }}>
                            Delete Commission
                        </Button>
                    }


                </div>
            </div>

        </div >

        <AreYouSureModal open={deleteOpen} setOpen={setDeleteOpen}
            error={deleteCommApi.error} loading={deleteCommApi.loading} onYes={() => {
                deleteCommApi.fetch(() => {
                    nav(-1)
                    enqueueSnackbar("Commission deleted!", { variant: 'success' })
                }, undefined, id)
            }} >
            Are you sure you want to delete this commission?
        </AreYouSureModal>
        <LoadingBackdrop loading={commApi.loading} />

    </>
}

function WarningsBanner(props: {
    artist?: Artist,
    status: number,
    startTs?: string,
    doneTs?: string,
    publishTs?: string,
}) {

    const { artist, doneTs, startTs, status } = props;

    const statsApi = useApi(getStatisticForArtist);

    useEffect(() => {
        if (status < 3 && artist) {
            //If we're still before done, and we have an artist:
            statsApi.fetch(undefined, undefined, artist.id)
        }
    }, [artist])

    const trueDoneTs = doneTs && doneTs.length > 0 ? new Date(Date.parse(doneTs)) : undefined
    const avgDaysToCompelte = statsApi.data ? Math.ceil((statsApi.data as ArtistStatistic).averageDaysToComplete) : undefined
    const avgDaysToCompleteWithBuffer = avgDaysToCompelte ? Math.max(Math.ceil(avgDaysToCompelte * 1.25), 1) : undefined
    const avgDaysToCompleteWithMegaBuffer = avgDaysToCompelte ? Math.max(Math.ceil(avgDaysToCompelte * 2), 100) : undefined
    const eta = trueDoneTs ?? (startTs && startTs.length > 0 && avgDaysToCompleteWithBuffer ? addDays(startTs, avgDaysToCompleteWithBuffer) : undefined)
    const daysFromNow = eta ? daysUntil(eta) : undefined
    const daysSinceDone = doneTs ? daysSince(doneTs) : undefined

    if (statsApi.loading) { return <></> }

    if (status < 2 && artist) {
        //We're still in preplanning
        if (!avgDaysToCompelte && !statsApi.loading) {
            return <Alert severity="info">
                This is your first commission with this artist!
            </Alert>
        }
        return <Alert severity="info">
            You should expect this commission to {
                eta ? `be done by ${months[eta.getUTCMonth()]} ${eta.getUTCDate()} (${avgDaysToCompelte} - ${avgDaysToCompleteWithBuffer} days)` : `take ${avgDaysToCompelte}-${avgDaysToCompleteWithBuffer} days`
            }
        </Alert>
    }

    if (status === 2 && eta) {
        //We're in progress
        if (daysFromNow && daysFromNow < 0) {
            if (daysFromNow < -1 * (avgDaysToCompleteWithMegaBuffer ?? 100)) {
                return <Alert severity="error">
                    <AlertTitle>This commission is running very late</AlertTitle>
                    This commission should've been done by {months[eta.getUTCMonth()]} {eta.getUTCDate()} ({-1 * daysFromNow} days ago)
                </Alert>
            }
            return <Alert severity="warning">
                <AlertTitle>This commission is running late</AlertTitle>
                This commission should've been done by {months[eta.getUTCMonth()]} {eta.getUTCDate()} ({-1 * daysFromNow} days ago)
            </Alert>
        } else {
            return <Alert severity="info">
                <AlertTitle>This commission is in progress</AlertTitle>
                This commission should be done by {months[eta.getUTCMonth()]} {eta.getUTCDate()} ({daysFromNow} days from now)
            </Alert>
        }
    }

    if (status === 3 && daysSinceDone && daysSinceDone > 7) {
        return <Alert severity="warning">
            <AlertTitle>This commission hasn't been posted</AlertTitle>
            This commission was done {daysSinceDone} days ago and should be posted soon
        </Alert>
    }

    if (status === 4) {
        return <Alert severity="success">
            Commission has been posted!
        </Alert>
    }

    return <></>
}

function SaveButton(props: {
    saveClick: () => void,
    anyLoading: boolean,
    dirty: boolean,
    style?: CSSProperties
}) {

    const { anyLoading, dirty, saveClick, style } = props

    return <Button variant="contained" fullWidth onClick={saveClick}
        style={{ marginBottom: "25px", ...style }} disabled={anyLoading || !dirty}>
        {anyLoading ? <CircularProgress size={25} /> : 'Save'}
    </Button>
}

function CoverHeader(props: {
    id?: number,
    selectedFileUrl?: string,
    setSelectedFile: (val: File | null) => void,
    setSelectedFileUrl: (val: string | undefined) => void,
    setDirty: (val: boolean) => void,
    color: string,
}) {

    const [imageError, setImageError] = useState(false)
    const { id, color, selectedFileUrl, setSelectedFile, setSelectedFileUrl, setDirty } = props

    useEffect(() => {
        setImageError(false)
        const img = new Image();
        img.src = commHeaderImage(id ?? 0)
        img.onerror = () => {
            setImageError(true)
        }
    }, [id])

    const fileInputRef = useRef(null);

    return <>


        <input
            type="file"
            accept="image/*" // Restrict file types to images only
            onChange={(e) => {
                if (e.target.files) {
                    setSelectedFile(e.target.files[0])
                    setSelectedFileUrl(URL.createObjectURL(e.target.files[0]))
                    setDirty(true)
                }
            }}
            ref={fileInputRef}
            style={{ display: 'none' }}
        />

        <div style={{
            paddingTop: "15%",
            display: "block",
            boxSizing: 'border-box',
            backgroundColor: color,
            backgroundImage: selectedFileUrl ? `url("${selectedFileUrl}")`
                : imageError || !id ? `
           repeating-linear-gradient(
                    45deg, /* Diagonal angle */
                    rgba(0,0,0,0), /* First color stop (the given color) */
                    rgba(0,0,0,0) 10px, /* Width of the first stripe */
                    rgba(0,0,0,0.15) 10px, /* Slightly darker stripe */
                    rgba(0,0,0,0.15) 20px /* Total width of a stripe pair */
                )
        ` : `url("${commHeaderImage(id ?? 0)}")`,
            backgroundPosition: imageError && !selectedFileUrl ? undefined : 'center',
            backgroundRepeat: imageError && !selectedFileUrl ? undefined : 'no-repeat',
            backgroundSize: imageError && !selectedFileUrl ? undefined : 'cover',
            textAlign: "right"
        }}>
            <Button
                variant="contained" size="small"
                style={{ marginRight: "10px", marginBottom: "10px" }}
                startIcon={<InsertPhoto />}
                onClick={() => (fileInputRef?.current as any)?.click()}
            >Change Cover</Button>
        </div>
    </>

}

function StatusSelect(props: {
    status: number,
    setStatus: (val: number) => void
}) {

    const { setStatus, status } = props

    return <FormControl fullWidth>
        <InputLabel id="statusSelectLabel">Status</InputLabel>
        <Select labelId="statusSelectLabel" value={status} onChange={(e) => setStatus(e.target.value as number)} label="Category">
            <MenuItem value={-1}>Archived</MenuItem>
            {CommissionStatus.map((a, i) => <MenuItem value={i}>{a}</MenuItem>)}
        </Select>
    </FormControl>
}

export function TypeSelect(props: {
    type: number,
    setType: (val: number) => void
}) {

    const { setType, type } = props

    return <FormControl fullWidth>
        <InputLabel id="typeSelectLabel">Type</InputLabel>
        <Select labelId="typeSelectLabel" value={type} onChange={(e) => setType(e.target.value as number)} label="Category">
            {CommissionTypes.map((a, i) => <MenuItem value={i} >
                <div>
                    <Typography noWrap>{a.type}</Typography>
                    <Typography noWrap fontSize=".7em" color="#BBB">{a.desc}</Typography>
                </div>
            </MenuItem>)}
        </Select>
    </FormControl>
}

function CharactersDisplay(props: {
    chars: Character[]
    setChars: (val: Character[]) => void
}) {

    const { chars, setChars } = props
    const [charSelector, setCharSelector] = useState(false)

    return <>
        {chars.map((a, i) => <div style={{ display: "flex", alignItems: "center" }}>
            <div>
                <IconButton onClick={() => {
                    setChars(removeIndex(chars, i))
                }}><Close /></IconButton>
            </div>
            <div style={{ flex: "1" }}>
                <CharacterTile character={a} autoSize />
            </div>
        </div>)}

        <AvatarTile hasImage={false} avatarString="+New" avatarColor="#999" onClick={() => setCharSelector(true)}>
            Add a Character
        </AvatarTile>

        <CharacterSelector
            open={charSelector}
            setOpen={setCharSelector}
            setChar={(val) => {
                setChars([...chars, val]);
                setCharSelector(false);
            }}
        />
    </>

}

function TagsDisplay(props: {
    tags: CommissionTag[]
    setTags: (val: CommissionTag[]) => void
}) {

    const { enqueueSnackbar } = useSnackbar();
    const { tags, setTags } = props
    const [tag, setTag] = useState(undefined as CommissionTag | undefined)
    const [tagSelector, setTagSelector] = useState(false)

    const updateCommTagApi = useApi(updateCommTag)

    return <>
        {tags.map((a, i) => <div style={{ display: "flex", alignItems: "center" }}>
            <div>
                <IconButton onClick={() => {
                    setTags(removeIndex(tags, i))
                }}><Close /></IconButton>
            </div>
            <div style={{ flex: "1" }}>
                <Tooltip title={a.description}>
                    <ColorPill color={a.color} onClick={() => setTag(a)}>
                        #{a.name}
                    </ColorPill>
                </Tooltip>
            </div>
        </div>)}

        <ColorPill color='#999999' onClick={() => setTagSelector(true)}>+ Add a Tag</ColorPill>

        <CommTagSelector open={tagSelector} setOpen={setTagSelector} setTag={(tag) => {
            setTags([...tags, tag])
            setTagSelector(false)
        }} />

        <CommTagEditor open={!!tag} setOpen={() => setTag(undefined)} tag={tag} onOk={(val) => {
            updateCommTagApi.fetch(() => {
                const updatedTags = tags.map(a => {
                    if (a.id === val.id) {
                        return val;
                    } else { return a; }
                })

                setTags([...updatedTags])
                setTag(undefined)
                enqueueSnackbar("Tag updated", { variant: 'success' })

            }, () => {
                enqueueSnackbar("Tag could not be updated", { variant: 'error' })
            }, val)
        }} />


    </>

}

export function DateInformation(props: {
    vertical?: boolean,
    startTs?: string,
    doneTs?: string,
    setStartTs: (val: string) => void,
    setDoneTs: (val: string) => void,
    markDirty: () => void

}) {

    const { doneTs, markDirty, setDoneTs, setStartTs, startTs, vertical } = props;

    return <div style={{ marginTop: "20px", marginBottom: "20px", display: vertical ? undefined : "flex", flexWrap: "wrap", alignItems: "center" }}>

        {/* Start Date */}
        <div style={vertical ? { marginBottom: "20px" } : { flex: "1", paddingRight: "10px" }}>
            <TextField type="date" value={startTs} label="Start" fullWidth onChange={(e) => {
                setStartTs(e.target.value)
                markDirty();
            }} />
        </div>

        <div style={vertical ? { marginBottom: "20px", textAlign: "center" } : undefined}>
            {vertical ? <ArrowDownward /> : <ArrowForward />}
        </div>
        {/* End Date */}
        <div style={vertical ? { marginBottom: "20px" } : { flex: "1", paddingLeft: "10px" }}>
            <TextField type="date" value={doneTs} label="Done" fullWidth onChange={(e) => {
                setDoneTs(e.target.value)
                markDirty();
            }} />
        </div>

    </div>

}

export function ArtistInformation(props: {
    artist?: Artist,
    price: number,
    charCount: number,
    commType: number,
    setArtist: (val: Artist | undefined) => void,
    setPrice: (val: number) => void,
    setCharCount: (val: number) => void,
    setCommType: (val: number) => void
    markDirty: () => void
    vertical?: boolean
}) {

    const { charCount, markDirty, price, setArtist, setCharCount, setPrice, artist, vertical, commType, setCommType } = props
    const { user } = useUser();
    const isArtist = user?.isArtist

    const [serviceEstimatorOpen, setServiceEstimatorOpen] = useState(false)

    return <>
        <div>{isArtist ? "Client" : "Artist"}</div>
        <div style={vertical ? {} : { display: "flex", alignItems: 'center' }}>

            <ArtistSelectorTile
                artist={artist}
                setArtist={(val: Artist | undefined) => {
                    setArtist(val);
                    markDirty();
                }}
                vertical={vertical}
            />

            <div style={vertical ? {} : { flex: "1", marginLeft: "20px", display: 'flex' }}>

                <div style={{ width: vertical ? undefined : "50%", display: "flex", alignItems: 'center', marginBottom: vertical ? "20px" : undefined }}>
                    <TextField type="number" label='Price'
                        style={vertical ? {} : { marginRight: "10px" }} value={price} fullWidth
                        onChange={(e) => {
                            setPrice(new Number(e.target.value) as number)
                            markDirty()
                        }}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }}
                    />
                    {!isArtist && <>
                        <IconButton onClick={() => setServiceEstimatorOpen(true)}><Calculate /></IconButton>

                        <ServiceEstimator
                            open={serviceEstimatorOpen} setOpen={setServiceEstimatorOpen}
                            setPrice={setPrice} artist={artist}
                            charCount={charCount} commType={commType}
                            setArtist={setArtist} setCharCount={setCharCount}
                            setCommType={setCommType} markDirty={markDirty}
                        /></>
                    }
                </div>


                <div style={vertical ? {} : { width: "50%" }}>
                    <TextField type="number" label='Character Count' fullWidth
                        style={vertical ? {} : { marginLeft: "10px" }} value={charCount}
                        onChange={(e) => {
                            setCharCount(new Number(e.target.value) as number)
                            markDirty()
                        }}
                    />
                </div>
            </div>
        </div >




    </>
}

export function ArtistSelectorTile(props: {
    artist?: Artist,
    setArtist: (val: Artist | undefined) => void,
    vertical?: boolean
}) {

    const { artist, setArtist, vertical } = props

    const [anchorEl, setAnchorEl] = useState(undefined as undefined | HTMLElement);
    const [artistPicker, setArtistPicker] = useState(false)
    const nav = useNavigate();

    const { user } = useUser();
    const isArtist = user?.isArtist

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(undefined);
    };

    const openArtist = () => {
        setAnchorEl(undefined)
        nav(`/artists/${artist?.id}`)
    }

    const unassignArtist = () => {
        setArtist(undefined)
        setAnchorEl(undefined)
    }

    return <>
        <div style={vertical ? { marginBottom: "20px" } : undefined}>
            {artist ?
                <ArtistTile artist={artist} onClick={handleClick} />
                : <AvatarTile hasImage={false} width={280}
                    avatarSize={48}
                    onClick={() => { setArtistPicker(true) }}
                    avatarColor="#999999"
                    avatarString={'+'}>
                    Assign {isArtist ? "a Client" : "an Artist"}
                </AvatarTile>
            }
        </div>

        {artistPicker && <ArtistSelector
            open={artistPicker}
            setOpen={setArtistPicker}
            setArtist={(val) => {
                setArtist(val);
                setArtistPicker(false);
            }}
        />
        }

        <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
        >
            <MenuItem onClick={openArtist}>Open</MenuItem>
            <MenuItem onClick={unassignArtist}>Unassign</MenuItem>
        </Menu>

    </>
}

export function PublishingInformation(props: {
    postTags: string,
    publishTs?: string,
    postDescription: string,
    postUrl: string,
    setPostTags: (val: string) => void,
    setPublishTs: (val: string) => void,
    setPostDescription: (val: string) => void,
    setPostUrl: (val: string) => void,
    markDirty: () => void
    vertical?: boolean
}) {

    const { markDirty, postDescription, postTags, publishTs, postUrl, setPostDescription, setPostTags, setPublishTs, setPostUrl, vertical } = props
    const social = Social.fromUrl(postUrl);


    return <>
        <div style={vertical ? {} : { display: "flex" }}>
            <div style={vertical ? { marginBottom: "20px" } : { flex: "1" }}>
                {/* Post Tags */}
                <TextField label='Post Tags' fullWidth
                    value={postTags} onChange={(e) => {
                        setPostTags(e.target.value)
                        markDirty();
                    }}
                />
            </div>
            <div style={vertical ? {} : { width: "250px", paddingLeft: "10px" }}>
                {/* Post Date */}
                <TextField type="date" value={publishTs} label="Published" fullWidth onChange={(e) => {
                    setPublishTs(e.target.value)
                    markDirty();
                }} />
            </div>
        </div>

        {/* Post Description */}
        {postDescription.length > 280 &&
            <Alert style={{ marginTop: "20px" }} severity="warning" >
                This post may be too long for Twitter {postDescription.length > 300 ? 'and Bluesky' : ''}
            </Alert>
        }

        <TextField label="Description" fullWidth multiline minRows={5}
            style={{ marginTop: "20px" }} helperText={`${postDescription.length}`}
            value={postDescription} onChange={(e) => {
                setPostDescription(e.target.value)
                markDirty();
            }} />


        <div style={{ marginTop: '20px' }}>
            <TextField label="Post URL" value={postUrl}
                onChange={(e) => {
                    setPostUrl(e.target.value)
                    markDirty();
                }} fullWidth
                slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start" style={{ cursor: social.url.length > 0 ? "pointer" : "" }}>
                            <Box height={'100%'} display={'flex'} onClick={() => {
                                if (social.url.length > 0) {
                                    window.open(social.url)
                                }
                            }}><SocialIcon social={social} size={25} /></Box>
                        </InputAdornment>
                    }
                }}
            />
        </div>

    </>
}
import { useEffect, useState } from "react"
import Artist from "../../../model/artist/Artist"
import useApi from "../../hooks/useApi"
import { createService, deleteService, getServices, updateService } from "../../../api/Service"
import Service from "../../../model/artist/Service"
import { Button, Card, CardActionArea, CircularProgress, TextField } from "@mui/material"
import { CommissionTypes } from "../../../model/commission/CommissionEnums"
import { useUser } from "../../hooks/useUser"
import { AddCircleOutline, Brush } from "@mui/icons-material"
import { currencies, isCharAddition } from "../Utils"
import SafeAvatar from "../SafeAvatar"
import { artistImage } from "../../../api/Artist"
import ServiceEditor from "./ServiceEditor"
import { useSnackbar } from "notistack"
import { ArtistSelectorTile, TypeSelect } from "../../pages/comms/subcomponents/CommPane"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"

export default function ServiceBrowser(props: {
    searchEnabled?: boolean,
    estimateEnabled?: boolean,
    editable?: boolean,
    artist?: Artist,
    setArtist?: (val: Artist | undefined) => void,
    commType?: number,
    setCommType?: (val: number) => void,
    charCount?: number,
    setCharCount?: (val: number) => void,
    noRetired?: boolean
    onSelect?: (val: Service) => void,
    height?: string,
}) {

    const {
        searchEnabled, estimateEnabled, noRetired, height,
        artist, setArtist,
        commType, setCommType,
        charCount, setCharCount,
        editable, onSelect,
    } = props

    const servicesApi = useApi(getServices)
    const createServiceApi = useApi(createService)
    const updateServiceApi = useApi(updateService)
    const deleteServiceApi = useApi(deleteService)
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useUser()
    const { vertical } = useWindowDimensions();

    const [newOpen, setNewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [editService, setEditService] = useState(undefined as undefined | Service);

    const refresh = () => {
        let options = {};
        if (artist) { options = { ...options, artistId: artist.id } }
        if (commType) { options = { ...options, commType: commType } }
        if (noRetired) { options = { ...options, noRetired: true } }

        if (!user?.isArtist) {
            servicesApi.fetch(undefined, undefined, options)
        }
    }

    useEffect(() => { refresh(); }, [artist, commType])

    const onCreate = (val: Service) => {

        if (artist) { val.artist = artist }

        createServiceApi.fetch(() => {
            setNewOpen(false)
            enqueueSnackbar("Service Created", { variant: "success" })
            refresh();
        }, undefined, val);

    }

    const onUpdate = (val: Service) => {
        if (artist) { val.artist = artist }

        updateServiceApi.fetch(() => {
            setEditOpen(false)
            enqueueSnackbar("Service Updated", { variant: "success" })
            refresh();
        }, undefined, val);
    }

    const onDelete = () => {
        if (!editService) return;

        deleteServiceApi.fetch(() => {
            setEditOpen(false)
            enqueueSnackbar("Service Deleted", { variant: "success" })
            refresh();
        }, undefined, editService.id);
    }

    return <>
        {searchEnabled && <><div style={{
            display: "flex", flexDirection: vertical ? 'column' : undefined,
            gap: "10px", marginTop: "5px",
            alignItems: 'center'
        }}>
            <TypeSelect
                type={commType ?? 0}
                setType={setCommType ?? console.error}
            />

            <div style={{ display: "flex", gap: "10px", alignItems: 'center', width: "100%" }}>
                <ArtistSelectorTile
                    setArtist={setArtist ?? console.error}
                    artist={artist}
                />

                <TextField
                    type='number'
                    label='Chars'
                    value={Math.max(1, charCount ?? 1)}
                    onChange={(e) => setCharCount?.(new Number(e.target.value) as number)}
                    style={{ flex: "1" }}
                />
            </div>


        </div>
            <hr />
        </>}
        <div style={{ height: height ?? "200px", display: "flex", flexDirection: "column", overflowY: "hidden" }}>
            {servicesApi.loading ? <div style={{ display: "flex", flex: "1", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><CircularProgress /></div>
                : servicesApi.data
                    ? servicesApi.data.length === 0
                        ? <div style={{ display: "flex", flex: "1", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <Brush fontSize="large" />
                            <div style={{ marginTop: "10px" }}>No Services</div>
                        </div>
                        : <div style={{ flex: "1", overflowY: "auto", }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                {servicesApi.data?.map(a => <ServiceCard
                                    service={a}
                                    hideArtist={!!artist && !searchEnabled}
                                    estimateEnabled={estimateEnabled}
                                    charCount={charCount}
                                    onClick={editable ? () => {
                                        setEditService(a);
                                        setEditOpen(true)
                                    } : () => onSelect?.(a)}
                                />)}
                            </div>
                        </div> : <></>}
        </div>
        {editable && <>
            <div style={{ display: "flex", flexDirection: "row-reverse", marginTop: "10px" }}>
                <Button size="small" startIcon={<AddCircleOutline />} onClick={() => setNewOpen(true)}>Add a Service</Button>
            </div>
            <ServiceEditor open={newOpen} setOpen={setNewOpen} onOk={onCreate} />
            <ServiceEditor open={!!editService && editOpen} setOpen={setEditOpen} service={editService ?? {} as Service} onOk={onUpdate} onDelete={onDelete} />
        </>}
    </>
}

function ServiceCard(props: {
    service: Service,
    onClick?: () => void,
    hideArtist?: boolean
    estimateEnabled?: boolean
    charCount?: number
}) {

    const { service, onClick, hideArtist, estimateEnabled, charCount } = props

    const addtlCharAddition = estimateEnabled ? service.additions
        .filter(isCharAddition)[0] : undefined

    const hasMore = addtlCharAddition ? service.additions.length > 1 : service.additions.length > 0

    const estimate = estimateEnabled
        ? `${service.basePrice + (((Math.max(1, charCount ?? 1)) - 1) * (addtlCharAddition?.price ?? 0))
        } ${hasMore ? '+' : ''}`
        : ""

    return <Card>
        <CardActionArea onClick={onClick}>
            <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "1.2em" }}>
                        {CommissionTypes[service.commissionType].emoji}
                    </div>
                    <div>
                        <b>{service.name?.trim().length === 0 ? CommissionTypes[service.commissionType].type : service.name}</b>
                        <div style={{ marginTop: "5px", fontSize: ".8em" }}>{
                            service.description?.trim().length === 0 ? "N/A" : service.description
                        }</div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {!hideArtist && <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <SafeAvatar hasImage={service.artist.hasImage} text={service.artist.name} src={artistImage(service.artist.id)} size={32} />
                    </div>}
                    <div style={{ fontSize: "1.2em", fontWeight: "700", width: "70px" }}>
                        {currencies[service.currency] ?? service.currency + " "}{
                            estimateEnabled ? estimate : (service.basePrice + "") + (service.additions.length > 0 && " +")
                        }
                    </div>
                </div>
            </div>
        </CardActionArea>
    </Card>
}
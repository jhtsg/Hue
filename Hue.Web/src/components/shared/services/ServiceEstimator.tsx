import { useState } from "react"
import Artist from "../../../model/artist/Artist"
import Service from "../../../model/artist/Service"
import ServiceBrowser from "./ServiceBrowser"
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { ArrowBack } from "@mui/icons-material"
import { CommissionTypes } from "../../../model/commission/CommissionEnums"
import { currencies, isCharAddition } from "../Utils"
import SafeAvatar from "../SafeAvatar"
import { artistImage } from "../../../api/Artist"
import ServiceAddition from "../../../model/artist/ServiceAddition"
import { updateInCollection } from "../CollectionUtils"

class AdditionEstimate {
    public addition: ServiceAddition = {} as ServiceAddition
    public amount: number = 0;
}

export default function ServiceEstimator(props: {
    open: boolean,
    setOpen: (val: boolean) => void

    artist?: Artist,
    setArtist: (val: Artist | undefined) => void,
    commType?: number,
    setCommType: (val: number) => void,
    charCount?: number,
    setCharCount: (val: number) => void,

    setPrice: (val: number) => void
    markDirty: () => void

}) {

    const { open, setOpen, setPrice, artist, charCount, commType, setArtist, setCharCount, setCommType, markDirty } = props

    const [service, setService] = useState(undefined as undefined | Service)
    const { height, vertical } = useWindowDimensions()

    const [tip, setTip] = useState(10);
    const [additionAmounts, setAdditionAmounts] = useState([] as AdditionEstimate[])

    const estimate = (service?.basePrice ?? 0) + tip
        + (additionAmounts.map(a => a.amount * a.addition.price).reduce((accumulator, current) => accumulator + current, 0))

    return <>

        <Dialog open={open && !service} onClose={() => setOpen(false)} fullWidth maxWidth='md'>
            <DialogTitle>Select a Service</DialogTitle>
            <DialogContent>
                <ServiceBrowser
                    searchEnabled estimateEnabled noRetired
                    artist={artist} charCount={charCount}
                    commType={commType}
                    onSelect={(val) => {
                        setService(val)
                        setArtist(val.artist)
                        setCommType(val.commissionType)
                        setCharCount(Math.max(1, charCount ?? 1))
                        markDirty();

                        setAdditionAmounts(
                            val.additions.map(a => {
                                return {
                                    addition: a,
                                    amount: isCharAddition(a) ? Math.max(1, charCount ?? 1) - 1 : 0
                                }
                            })
                        )
                    }}
                    setArtist={(val) => {
                        setArtist(val)
                        markDirty();
                    }} setCharCount={(val) => {
                        setCharCount(val)
                        markDirty();
                    }}
                    setCommType={(val) => {
                        setCommType(val)
                        markDirty();
                    }} height={`${height - 400}px`}
                />
            </DialogContent>
        </Dialog>

        <Dialog open={open && !!service} onClose={() => setOpen(false)} fullWidth maxWidth='md'>
            <DialogTitle style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Tooltip title='Select another service'><IconButton onClick={() => { setService(undefined) }}><ArrowBack /></IconButton></Tooltip>
                <div>Build an Estimate</div>
            </DialogTitle>
            <DialogContent>
                {service && <>
                    <div style={{ display: "flex", gap: "30px", flexDirection: vertical ? 'column' : undefined }}>
                        <div style={{ flex: "1" }}>
                            <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: "800", fontSize: '1.2em' }}>
                                        {CommissionTypes[service?.commissionType ?? 0].emoji} {service?.name.trim().length === 0 ? CommissionTypes[service?.commissionType ?? 0].type : service?.name}
                                    </div>
                                    <div style={{ fontSize: ".8em" }}>Starting at {currencies[service?.currency ?? 'USD']}{service?.basePrice}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
                                    <SafeAvatar hasImage={service.artist.hasImage} text={service.artist.name} src={artistImage(service.artist.id)} size={28} />
                                    <div>{service.artist.name}</div>
                                </div>
                            </div>
                            <hr style={{ marginBottom: "30px" }} />
                            <div style={{ display: "flex", flexWrap: 'wrap', gap: "0px", margin: "-10px", alignItems: 'center' }}>
                                {
                                    additionAmounts.map((a, i) => <EstimateBox
                                        currency={service.currency}
                                        estimate={a}
                                        setAmount={
                                            (amount) => {
                                                setAdditionAmounts(updateInCollection(additionAmounts, i, { ...a, amount: amount }))
                                                if (isCharAddition(a.addition)) setCharCount(amount + 1)
                                            }
                                        }
                                    />)
                                }
                                <TextField type="number" label='Tip' value={tip}
                                    onChange={(e) => { setTip(new Number(e.target.value) as number) }}
                                    slotProps={{ input: { startAdornment: <InputAdornment position="start">{currencies[service.currency]}</InputAdornment> } }}
                                    style={{ width: vertical ? "100%" : "50%", padding: "10px" }}
                                />
                            </div>
                        </div>
                        {!vertical && <hr />}
                        <div style={vertical ? { marginBottom: "20px" } : { width: "160px" }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '2em' }}>{currencies[service.currency] ?? 'USD '}{estimate}</div>
                                <div>Estimate</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
                        <Button onClick={() => {
                            setOpen(false)
                            setPrice(estimate)
                            markDirty();
                        }}>OK</Button>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </div>

                </>}
            </DialogContent>
        </Dialog>

    </>
}

function EstimateBox(props: {
    estimate: AdditionEstimate,
    currency: string,
    setAmount: (val: number) => void
}) {

    const { estimate, setAmount, currency } = props
    const { vertical } = useWindowDimensions()
    const label = `${estimate.addition.name} (${currencies[currency] ?? 'USD '}${estimate.addition.price})`;

    if (estimate.addition.limit === 1) {
        const checked = estimate.amount === 1;
        return <div style={{ width: vertical ? "100%" : "50%", padding: "10px" }}>
            <FormControlLabel control={<Checkbox checked={checked} onChange={(e) => setAmount(e.target.checked ? 1 : 0)} />} label={label} />
        </div>
    }

    return <TextField type="number" label={label} value={estimate.amount}
        onChange={(e) => {
            const val = Math.max(0, new Number(e.target.value) as number);
            setAmount(estimate.addition.limit < 1 ? val : Math.min(estimate.addition.limit, val))
        }}
        style={{ width: vertical ? "100%" : "50%", padding: "10px" }}
    />
}


import { useState } from "react"
import Artist from "../../../model/artist/Artist"
import Service from "../../../model/artist/Service"
import ServiceBrowser from "./ServiceBrowser"
import { Button, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, InputAdornment, Link, TextField, Tooltip } from "@mui/material"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { ArrowBack } from "@mui/icons-material"
import { CommissionTypes } from "../../../model/commission/CommissionEnums"
import { currencies, isCharAddition } from "../Utils"
import SafeAvatar from "../SafeAvatar"
import { artistImage } from "../../../api/Artist"
import ServiceAddition from "../../../model/artist/ServiceAddition"
import { updateInCollection } from "../CollectionUtils"
import { useCurrency } from "../../hooks/useCurrency"
import { availableCurrenciesSet } from "../../contexts/CurrencyContext"

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
    const { currencyConversions } = useCurrency();

    const [service, setService] = useState(undefined as undefined | Service)
    const { height, width } = useWindowDimensions()
    const vertical = width < 700

    const [tip, setTip] = useState(10);
    const [additionAmounts, setAdditionAmounts] = useState([] as AdditionEstimate[])

    const estimate = (service?.basePrice ?? 0) + tip
        + (additionAmounts.map(a => a.amount * a.addition.price).reduce((accumulator, current) => accumulator + current, 0))

    const shouldConvert = service ? service.currency.trim().toLowerCase() !== 'usd' : false;
    const canConvert = availableCurrenciesSet.includes(service?.currency.toLowerCase() ?? "")

    const conversionRate = shouldConvert && canConvert ?
        currencyConversions('USD') ? (1 / currencyConversions('USD')[service?.currency.toLowerCase() ?? "eur"]) : undefined
        : undefined

    const converted = conversionRate ? conversionRate * estimate : undefined



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
                    <div style={{ display: "flex", gap: "20px", flexDirection: vertical ? 'column' : undefined }}>
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
                                    additionAmounts.sort((a, _) => a.addition.limit === 1 ? -1 : 1).map((a, i) => <EstimateBox
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
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">{currencies[service.currency]}</InputAdornment>,
                                            endAdornment: <InputAdornment position="end" style={{ color: '#AAA', fontSize: ".8em" }}>{((tip * 100) / (estimate - tip)).toFixed(0)}%</InputAdornment>,

                                        }
                                    }}
                                    style={{ width: vertical ? "100%" : "50%", padding: "10px", marginBottom: "10px" }}
                                />
                            </div>
                        </div>
                        {!vertical && <hr />}
                        <div style={vertical ? { marginBottom: "20px" } : { width: "160px", display: "flex", flexDirection: "column", justifyContent: 'space-between' }}>
                            <EstimatePanel estimate={estimate}
                                conversionRate={conversionRate} convertedEstimate={converted}
                                currency={service.currency} artist={service.artist}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row-reverse", gap: "10px" }}>
                        <Button onClick={() => {
                            setOpen(false)
                            setPrice(converted ? Math.ceil(converted) : estimate)
                            markDirty();
                        }}>OK</Button>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </div>

                </>}
            </DialogContent>
        </Dialog>

    </>
}

function EstimatePanel(props: {
    estimate: number,
    currency: string,
    artist: Artist,
    conversionRate?: number,
    convertedEstimate?: number
}) {


    const { currency, estimate, artist, conversionRate, convertedEstimate } = props
    const { width } = useWindowDimensions();
    const vertical = width < 700

    return <>
        <div style={{ textAlign: vertical ? "left" : 'center' }}>
            <div style={{ fontSize: '1.8em' }}>
                {convertedEstimate ? `$${convertedEstimate.toFixed(2)}` : `${currencies[currency] ?? 'USD '}${estimate}`}
            </div>
            <div style={{ fontSize: ".6em" }}>{
                convertedEstimate ? <>{currencies[currency] ?? 'USD '}{estimate} at {conversionRate?.toFixed(2)} USD per {currency}</>
                    : <>Estimate</>
            }</div>
        </div>
        <div style={{ paddingBottom: "10px", fontSize: '.6em', color: '#AAA' }}>
            <div style={{ marginTop: "20px" }}>Verify this artist's prices haven't changed. <Link href={artist.commSheetUrl} target="_blank">Check their commission information</Link></div>
            <div style={{ marginTop: "10px" }}>Your artist may charge addtl. fees for complexity or other services not mentioned here</div>
            <div style={{ marginTop: "10px", display: convertedEstimate ? undefined : "none" }}>Your payment processor's conversion rate may differ slightly</div>
        </div>

    </>
}

function EstimateBox(props: {
    estimate: AdditionEstimate,
    currency: string,
    setAmount: (val: number) => void
}) {

    const { estimate, setAmount, currency } = props
    const { width } = useWindowDimensions()
    const vertical = width < 700

    const label = `${estimate.addition.name} (${currencies[currency] ?? 'USD '}${estimate.addition.price})`;

    if (estimate.addition.limit === 1) {
        const checked = estimate.amount === 1;
        return <FormControlLabel control={<Checkbox checked={checked} onChange={(e) => setAmount(e.target.checked ? 1 : 0)} />} label={label} style={{ width: '100%', marginBottom: "10px", padding: "10px" }} />
    }

    return <TextField type="number" label={label} value={estimate.amount}
        onChange={(e) => {
            const val = Math.max(0, new Number(e.target.value) as number);
            setAmount(estimate.addition.limit < 1 ? val : Math.min(estimate.addition.limit, val))
        }}
        style={{ width: vertical ? "100%" : "50%", padding: "10px", marginBottom: "10px" }}
    />
}


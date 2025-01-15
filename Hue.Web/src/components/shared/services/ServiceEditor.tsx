import { Card, CardContent, Dialog, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import Service from "../../../model/artist/Service"
import { useEffect, useState } from "react"
import ServiceAddition from "../../../model/artist/ServiceAddition"
import { TypeSelect } from "../../pages/comms/subcomponents/CommPane"
import { currencies } from "../Utils"
import { AddCircleOutline, Brush, Delete, Save } from "@mui/icons-material"
import { CommissionTypes } from "../../../model/commission/CommissionEnums"
import { addToCollection, deleteFromCollection, updateInCollection } from "../CollectionUtils"
import { useWindowDimensions } from "../../hooks/useWindowDimensions"

export default function ServiceEditor(props: {
    service?: Service
    onOk: (val: Service) => void,
    onDelete?: () => void,
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { service, onOk, onDelete, open, setOpen } = props

    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState(0)
    const [currency, setCurrency] = useState("USD")
    const [type, setType] = useState(0)
    const [additions, setAdditions] = useState([] as ServiceAddition[])

    const { height } = useWindowDimensions();

    useEffect(() => {
        if (open) {
            setName(service?.name ?? "")
            setDesc(service?.description ?? "")
            setPrice(service?.basePrice ?? 0)
            setCurrency(service?.currency ?? "USD")
            setType(service?.commissionType ?? 0)
            setAdditions(service?.additions ?? [])
        }
    }, [open])

    const createAddition = () =>
        setAdditions(addToCollection(additions, {
            id: -1, dirty: true,
            name: '', description: '',
            limit: 0, price: 0,
        } as ServiceAddition));

    const updateAddition = (index: number, addition: ServiceAddition) =>
        setAdditions(updateInCollection(additions, index, addition))

    const deleteAddition = (index: number) =>
        setAdditions(deleteFromCollection(additions, index))

    const onSave = () => {
        onOk({
            ...service,
            name: name,
            description: desc,
            commissionType: type,
            currency: currency,
            basePrice: price,
            additions: additions,
        } as Service)
    }


    return <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
            <div>{onDelete ? "Editing" : "Creating"} Service</div>
            <div style={{ display: "flex", gap: "5px" }}>
                {onDelete && <IconButton onClick={onDelete}><Delete /></IconButton>}
                <IconButton onClick={onSave}><Save /></IconButton>
            </div>
        </DialogTitle>
        <DialogContent>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth style={{ marginTop: "5px" }} placeholder={CommissionTypes[type]?.type} />
            <TextField label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} fullWidth style={{ marginTop: "15px" }} />
            <div style={{ display: "flex", gap: "10px", marginTop: "15px", alignItems: 'flex-start' }}>
                <TextField label="Currency" value={currency}
                    onChange={(e) => {
                        setCurrency(e.target.value)
                    }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start">{currencies[currency]}</InputAdornment> } }}
                    style={{ width: "200px" }}
                />
                <TextField type="number" label='Price' value={price}
                    onChange={(e) => { setPrice(new Number(e.target.value) as number) }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start">{currencies[currency]}</InputAdornment> } }}
                    style={{ width: "200px" }}
                />
                <TypeSelect type={type} setType={setType} />
            </div>
            <div style={{ marginTop: "15px", marginBottom: "-10px", display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                <div>Additions</div>
                <IconButton onClick={createAddition}><AddCircleOutline /></IconButton>
            </div>
            <hr />
            <Card>
                <CardContent >
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: height - 480, minHeight: "157px", overflowY: 'auto' }}>
                        {additions?.map((a, i) => <AdditionEditorCard addition={a} currency={currency} updateSelf={(val) => updateAddition(i, val)} deleteSelf={() => deleteAddition(i)} />)}
                        {(additions?.length ?? 0) === 0 && <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center', gap: "15px", color: '#999' }}>
                            <Brush fontSize='large' />
                            <div>No Additions</div>
                        </div>}
                    </div>
                </CardContent>
            </Card>
        </DialogContent>
    </Dialog>

}

function AdditionEditorCard(props: {
    addition: ServiceAddition,
    currency: string,
    updateSelf: (val: ServiceAddition) => void,
    deleteSelf: () => void
}) {

    const { addition, currency, deleteSelf, updateSelf } = props
    const { limit, name, price } = addition

    const setName = (value: string) => updateSelf({ ...addition, name: value, dirty: true })
    // const setDescription = (value: string) => updateSelf({ ...addition, description: value, dirty: true })
    const setLimit = (value: number) => updateSelf({ ...addition, limit: value, dirty: true })
    const setPrice = (value: number) => updateSelf({ ...addition, price: value, dirty: true })

    const limitMode = Math.min(2, limit) - 1

    return <Card elevation={5} style={{ flex: "0 0 auto" }}>
        <div style={{ padding: "15px 10px", display: "flex", alignItems: "flex-start", gap: "5px" }}>
            <IconButton onClick={deleteSelf}><Delete /></IconButton>
            <div style={{ flex: "1" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <TextField label='Name' value={name} onChange={(e) => setName(e.target.value)} style={{ flex: '1' }} />
                    <TextField type="number" label='Price' value={price}
                        onChange={(e) => { setPrice(new Number(e.target.value) as number) }}
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">{currencies[currency]}</InputAdornment> } }}
                        style={{ width: "90px" }}
                    />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <FormControl style={{ flex: "1" }}>
                        <InputLabel>Type</InputLabel>
                        <Select value={limitMode} label="Type" onChange={(e) => setLimit((e.target.value as number) + 1)}>
                            <MenuItem value={-1}>Unlimited</MenuItem>
                            <MenuItem value={0}>Y/N</MenuItem>
                            <MenuItem value={1}>Limited</MenuItem>
                        </Select>
                    </FormControl>
                    {limit >= 2 &&
                        <TextField
                            type='number' label='Limit' value={limit}
                            onChange={(e) => setLimit(Math.max(2, new Number(e.target.value) as number))}
                            style={{ width: "90px" }}
                        />
                    }
                </div>
            </div>
        </div>
    </Card>

}
import { PhotoLibrary } from "@mui/icons-material"
import { Api } from "../hooks/useApi"
import { Button } from "@mui/material"
import AreYouSureModal from "./modals/AreYouSureModal"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSnackbar } from "notistack"

export default function NoCommsDeletePane(props: {
    api: Api<unknown>
    id: number
    type: string
}) {

    const { api, type, id } = props

    const [ays, setAys] = useState(false)
    const nav = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const onDelete = () => {
        api.fetch(() => {
            setAys(false);
            enqueueSnackbar(`${type.charAt(0).toUpperCase()}${type.substring(1)} deleted!`, { variant: "success" })
            nav(-1)
        }, undefined, id)
    }

    return <div style={{ marginTop: "20px", width: "100%", maxWidth: "350px", display: "flex", flexDirection: "column", alignItems: 'center', color: "#999" }}>
        <div><PhotoLibrary fontSize="large" /></div>
        <div>This {type} has no commissions</div>
        <Button onClick={() => setAys(true)} color="secondary" fullWidth variant="contained" style={{ marginTop: "20px" }}>Delete {type}</Button>
        <AreYouSureModal setOpen={setAys} open={ays} onYes={onDelete} loading={api.loading} error={api.error}>
            Are you sure you want to delete this {type}?
        </AreYouSureModal>
    </div>
}
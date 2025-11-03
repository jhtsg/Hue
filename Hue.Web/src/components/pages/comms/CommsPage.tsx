import { Add, Archive, Close, Download, PhotoLibrary } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Drawer, Fab, IconButton, Tab, Tabs, Tooltip } from "@mui/material"
import { useState } from "react"
import CommBoard from "./subcomponents/CommBoard/Board";
import { useSearchParams } from "react-router-dom";
import CommPane from "./subcomponents/CommPane";
import { useRefresh } from "../../hooks/useRefresh";
import { REFRESH_SPECIFIC_COLUMN_PREFIX } from "../../contexts/RefreshContext";
import CommColumn from "./subcomponents/CommBoard/Column";
import useApi from "../../hooks/useApi";
import { getCommissionYears } from "../../../api/Comm";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { API_PREFIX } from "../../../api/Common";
import AreYouSureModal from "../../shared/modals/AreYouSureModal";

export default function CommsPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const yearFromParams = Number(searchParams.get("year"))
    const { refresh } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "0")
    const { width, vertical, maxComponentHeight } = useWindowDimensions()

    //We will not support commissions from before the 80s and after the 31st century
    const year = yearFromParams > 1980 && yearFromParams < 3000 ? yearFromParams : new Date().getFullYear();

    const yearsApi = useApi(getCommissionYears, true)

    const setYear = (year: number) => {
        setSearchParams({ ...searchParams, year: `${year}` })
    }

    const [newOpen, setNewOpen] = useState(false);
    const [newDirty, setNewDirty] = useState(false);
    const [newAys, setNewAys] = useState(false)
    const [archived, setArchived] = useState(false)

    const newClose = () => {
        if (newDirty) { setNewAys(true) }
        else { setNewOpen(false) }
    }

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ flex: "1", maxWidth: `${width - (vertical ? 186 : 280)}px`, marginRight: "20px" }}>
                <Tabs value={year} onChange={(_, newval) => { setYear(newval) }}
                    variant="scrollable"
                >
                    {!yearsApi.data || yearsApi.data.length === 0 ?
                        <Tab label={`${year}`} value={year} /> :
                        yearsApi.data.map(y => <Tab label={`${y}`} value={y} />)
                    }
                </Tabs>
            </div>

            <Button variant="outlined" onClick={() => setArchived(true)} startIcon={vertical ? undefined : <Archive />} style={{ marginRight: "20px" }}>{vertical ? <Archive /> : 'Archived'}</Button>
            <Button variant="contained" onClick={() => window.open(API_PREFIX + "comm/export?year=" + year)} startIcon={vertical ? undefined : <Download />}>{vertical ? <Download /> : 'Export'}</Button>
        </div>
        <hr />

        <Drawer open={archived} anchor="right" onClose={() => setArchived(false)}>
            <CommColumn code={-1} fullHeight />
        </Drawer>

        {yearsApi.data?.length === 0
            ? <div style={{
                width: "100%", height: `${maxComponentHeight - 50}px`,
                display: "flex", flexDirection: "column",
                justifyContent: 'center', alignItems: 'center',
                color: "#AAA"
            }}>
                <PhotoLibrary fontSize="large" />
                <div>There are no commissions</div>
                <div>(yet)</div>
            </div >
            : <CommBoard year={year} />
        }


        <Tooltip title="Create a new commission">
            <Fab color="primary" style={{ position: "fixed", bottom: "20px", right: "20px" }}
                onClick={() => {
                    setNewOpen(true)
                    setNewDirty(false)
                }} >
                <Add />
            </Fab>
        </Tooltip>

        <Dialog open={newOpen} maxWidth="lg" fullWidth>
            <DialogTitle>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>Create a Commission</div>
                    <IconButton
                        onClick={() => {
                            newClose();
                        }}
                    ><Close /></IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <CommPane create open={newOpen}
                    onDirty={() => {
                        setNewDirty(true)
                    }}
                    onOk={() => {
                        setNewOpen(false);
                        refresh();
                    }}
                />
            </DialogContent>
        </Dialog>

        <AreYouSureModal onYes={() => { setNewAys(false); setNewOpen(false); setNewDirty(false); }} open={newAys} setOpen={setNewAys} title="Are you sure?">
            Are you sure you want to close? This commission has not been saved!
        </AreYouSureModal>



    </>
}
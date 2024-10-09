import { Add, Archive } from "@mui/icons-material";
import { Button, Dialog, Drawer, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import CommBoard from "./subcomponents/CommBoard/Board";
import { useSearchParams } from "react-router-dom";
import CommPane from "./subcomponents/CommPane";
import { useRefresh } from "../../hooks/useRefresh";
import { REFRESH_SPECIFIC_COLUMN_PREFIX } from "../../contexts/RefreshContext";
import CommColumn from "./subcomponents/CommBoard/Column";
import useApi from "../../hooks/useApi";
import { getCommissionYears } from "../../../api/Comm";

export default function CommsPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const yearFromParams = Number(searchParams.get("year"))
    const { refresh } = useRefresh(REFRESH_SPECIFIC_COLUMN_PREFIX + "0")

    //We will not support commissions from before the 80s and after the 31st century
    const year = yearFromParams > 1980 && yearFromParams < 3000 ? yearFromParams : new Date().getFullYear();

    const yearsApi = useApi(getCommissionYears, true)

    const setYear = (year: number) => {
        setSearchParams({ ...searchParams, year: `${year}` })
    }

    const [newOpen, setNewOpen] = useState(false);
    const [archived, setArchived] = useState(false)

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div style={{ flex: "1" }}>
                <Tabs value={year} onChange={(_, newval) => { setYear(newval) }}
                    variant="scrollable"
                >
                    {!yearsApi.data || yearsApi.data.length === 0 ?
                        <Tab label={`${year}`} value={year} /> :
                        yearsApi.data.map(y => <Tab label={`${y}`} value={y} />)
                    }
                </Tabs>
            </div>


            <div><Button variant="outlined" onClick={() => setArchived(true)} startIcon={<Archive />} style={{ marginRight: "20px" }}>Archived</Button></div>
            <div><Button variant="contained" onClick={() => setNewOpen(true)} startIcon={<Add />}>New</Button></div>
        </div>
        <hr />

        <Drawer open={archived} anchor="right" onClose={() => setArchived(false)}>
            <CommColumn code={-1} title="Archived Commissions" fullHeight />
        </Drawer>

        <div>
            <CommBoard year={year} />
        </div>
        <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="lg" fullWidth>
            <div style={{ padding: 20 }}>
                <CommPane create open={newOpen} setOpen={setNewOpen} onOk={() => {
                    setNewOpen(false);
                    refresh();
                }} />

            </div>
        </Dialog>
    </>
}
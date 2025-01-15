import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, IconButton, Tab, Tabs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import ArtistPane from "./subcomponents/ArtistPane";
import ArtistStatisticPane from "./subcomponents/ArtistStatisticPane";
import CommsDisplay from "../comms/subcomponents/CommsDisplay";
import { useUser } from "../../hooks/useUser";
import CommissionStatisticsPane from "../../shared/statistics/CommissionStatisticsPane";
import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";
import { deleteArtist } from "../../../api/Artist";
import NoCommsDeletePane from "../../shared/NoCommsDeletePane";
import useApi from "../../hooks/useApi";
import ServiceBrowser from "../../shared/services/ServiceBrowser";
import Artist from "../../../model/artist/Artist";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

export default function ArtistPage() {

    const { id } = useParams();

    const [artistId, setArtistId] = useState(new Number(id) as number)
    const [fauxArtist, setFauxArtist] = useState({ id: artistId } as Artist);
    const [filter, setFilter] = useState({ ArtistId: id } as CommissionFilterOptions)
    const [selectedTab, setSelectedTab] = useState(0)

    const deleteApi = useApi(deleteArtist);
    const { maxComponentHeight, vertical } = useWindowDimensions();
    const nav = useNavigate();
    const { user } = useUser();
    const artist = user?.isArtist

    useEffect(() => {
        const idNumber = new Number(id) as number;
        if (artistId !== (idNumber)) {
            setArtistId(idNumber)
        }
    }, [id])

    useEffect(() => {
        setFilter({
            ArtistId: artistId
        } as CommissionFilterOptions)
        setFauxArtist({ id: artistId } as Artist)
    }, [artistId])

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div><IconButton color="inherit" onClick={() => nav(-1)}><ArrowBack /></IconButton></div>
            <div style={{ fontSize: "1.7em", flex: "1" }}>{artist ? "Client" : "Artist"}</div>
        </div>
        <hr />

        <div style={{ maxWidth: "1200px", margin: "20px auto 0 auto" }}>
            <Card elevation={5}>
                <CardContent>
                    <ArtistPane editable id={artistId} />
                </CardContent>
            </Card>
        </div>

        <div style={{ maxWidth: "1200px", margin: "10px auto 0 auto" }}>
            <Tabs value={selectedTab} onChange={(_, newVal) => setSelectedTab(newVal)}>
                <Tab label="Statistics" value={0} />
                {!artist && <Tab label="Services" value={1} />}
                <Tab label="Commissions" value={2} />
            </Tabs>
            <hr />
        </div>

        <div style={{ maxWidth: "1200px", margin: "20px auto 0 auto", display: selectedTab === 0 ? "flex" : "none", flexDirection: vertical ? "column" : "row-reverse", gap: "20px", }}>
            <div style={vertical ? undefined : { width: "400px" }}>
                <ArtistStatisticPane id={artistId} verticalOverride />
            </div>
            <div style={{ flex: "1" }}>
                <CommissionStatisticsPane filter={filter} maxWidth={519} />
            </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "20px auto 20px auto", display: selectedTab === 1 ? undefined : 'none', minHeight: "200px" }}>
            <Card elevation={5}>
                <div style={{ padding: "20px" }}>
                    <div style={{ marginBottom: "10px" }}>Services</div>
                    <ServiceBrowser artist={fauxArtist} editable height={`${maxComponentHeight - 450}px`} />
                </div>
            </Card>
        </div>

        <div style={{ display: selectedTab === 2 ? undefined : 'none', height: vertical ? undefined : maxComponentHeight - 320, overflowY: vertical ? undefined : "auto", maxWidth: "1200px", margin: "0 auto 20px auto", minHeight: "300px" }}>
            <CommsDisplay
                filter={filter} style={{ marginTop: "10px", marginBottom: 0 }}
                noCommsPane={<NoCommsDeletePane
                    api={deleteApi}
                    id={artistId}
                    type="artist"
                />}
            />
        </div>
    </>
}
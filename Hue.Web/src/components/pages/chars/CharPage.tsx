import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, IconButton, Tab, Tabs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import CharacterPane from "./subcomponents/CharacterPane";
import CommsDisplay from "../comms/subcomponents/CommsDisplay";
import CharsStatisticPane from "./subcomponents/CharsStatisticPane";
import CommissionStatisticsPane from "../../shared/statistics/CommissionStatisticsPane";
import { useEffect, useState } from "react";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";
import NoCommsDeletePane from "../../shared/NoCommsDeletePane";
import useApi from "../../hooks/useApi";
import { deleteCharacter } from "../../../api/Char";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";

export default function CharPage() {

    const { id } = useParams();

    const [charId, setCharId] = useState(new Number(id) as number)
    const [filter, setFilter] = useState({ CharacterId: id } as CommissionFilterOptions)
    const [selectedTab, setSelectedTab] = useState(0)


    const nav = useNavigate();
    const deleteApi = useApi(deleteCharacter)
    const { maxComponentHeight, vertical } = useWindowDimensions();


    useEffect(() => {
        const idNumber = new Number(id) as number;
        if (charId !== (idNumber)) {
            setCharId(idNumber)
        }
    }, [id])

    useEffect(() => {
        setFilter({
            CharacterId: charId
        } as CommissionFilterOptions)
    }, [charId])

    return <>
        <div style={{ display: "flex", alignItems: "end" }}>
            <div><IconButton color="inherit" onClick={() => nav(-1)}><ArrowBack /></IconButton></div>
            <div style={{ fontSize: "1.7em", flex: "1" }}>Character</div>
        </div>
        <hr />

        <div style={{ maxWidth: "1200px", margin: "20px auto 0 auto" }}>
            <Card elevation={5}>
                <CardContent>
                    <CharacterPane editable id={charId} />
                </CardContent>
            </Card>
        </div>

        <div style={{ maxWidth: "1200px", margin: "10px auto 0 auto" }}>
            <Tabs value={selectedTab} onChange={(_, newVal) => setSelectedTab(newVal)}>
                <Tab label="Statistics" value={0} />
                <Tab label="Commissions" value={2} />
            </Tabs>
            <hr />
        </div>

        <div style={{ maxWidth: "1200px", margin: "20px auto 0 auto", display: selectedTab === 0 ? "flex" : "none", flexDirection: vertical ? "column" : "row-reverse", gap: "20px", }}>
            <div style={vertical ? undefined : { width: "400px" }}>
                <CharsStatisticPane id={charId} verticalOverride />
            </div>
            <div style={{ flex: "1" }}>
                <CommissionStatisticsPane filter={filter} maxWidth={519} />
            </div>
        </div>


        <div style={{ display: selectedTab === 2 ? undefined : 'none', height: vertical ? undefined : maxComponentHeight - 390, overflowY: vertical ? undefined : "auto", maxWidth: "1200px", margin: "0 auto 20px auto", minHeight: "300px" }}>
            <CommsDisplay
                filter={filter} style={{ marginTop: "10px", marginBottom: 0 }}
                noCommsPane={<NoCommsDeletePane
                    api={deleteApi}
                    id={charId}
                    type="character"
                />}
            />
        </div>

    </>
}
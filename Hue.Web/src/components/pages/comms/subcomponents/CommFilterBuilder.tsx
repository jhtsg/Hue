import { Card, CardContent } from "@mui/material";
import CommissionFilterOptions from "../../../../model/commission/CommissionFilterOptions";

export default function CommFilterBuilder(props: {
    filter: CommissionFilterOptions
    setFilter: (val: CommissionFilterOptions) => void
}) {

    /*
    We need to edit
        ArtistId: undefined,
        CharacterId: undefined,
        CommissionStatus: undefined,
        CommissionTagId: undefined,
        Year: new Date().getFullYear()
    */

    return <Card>
        <CardContent>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', alignItems: "center" }} >
                <div style={{ width: "300" }}>
                    Artist Picker
                </div>
                <div style={{ width: "300" }}>
                    Character Picker
                </div>
                <div style={{ width: "300px" }}>
                    Commission Status
                </div>
                <div style={{ width: "250px" }}>
                    Artist Picker
                </div>
                <div style={{ width: "250px" }}>
                    Artist Picker
                </div>
            </div>
        </CardContent>
    </Card>

}
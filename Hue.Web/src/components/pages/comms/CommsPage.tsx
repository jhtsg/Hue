import { useState } from "react"
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions"
import CommFilterBuilder from "./subcomponents/CommFilterBuilder";

export default function CommsPage() {

    var [filter, setFilter] = useState({
        Page: 0,
        ArtistId: undefined,
        CharacterId: undefined,
        CommissionStatus: undefined,
        CommissionTagId: undefined,
        Year: new Date().getFullYear()
    } as CommissionFilterOptions);

    return <>
        <div>
            <CommFilterBuilder filter={filter} setFilter={setFilter} />
        </div>
    </>
}
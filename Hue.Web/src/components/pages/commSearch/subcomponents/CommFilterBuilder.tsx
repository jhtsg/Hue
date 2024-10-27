import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import CommissionFilterOptions from "../../../../model/commission/CommissionFilterOptions";
import { useUser } from "../../../hooks/useUser";
import { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import useApi from "../../../hooks/useApi";
import { getCommissionYears } from "../../../../api/Comm";
import { artistImage, getArtists } from "../../../../api/Artist";
import { getCommTags } from "../../../../api/CommTag";
import { characterImage, getCharacters } from "../../../../api/Char";
import { CommissionStatus } from "../../../../model/commission/CommissionEnums";
import SafeAvatar from "../../../shared/SafeAvatar";

export default function CommFilterBuilder(props: {
    filter?: CommissionFilterOptions
    setFilter: (val: CommissionFilterOptions | undefined) => void
}) {

    const { filter, setFilter } = props

    const { user } = useUser();
    const isArtist = user?.isArtist

    const [artistId, setArtistId] = useState(-1)
    const [characterId, setCharacterId] = useState(-1)
    const [tagId, setTagId] = useState(-1)
    const [status, setStatus] = useState(-3)
    const [year, setYear] = useState(-1)
    const [query, setQuery] = useState('')

    const yearsApi = useApi(getCommissionYears, true)
    const artistApi = useApi(getArtists, true)
    const tagsApi = useApi(getCommTags, true)
    const charApi = useApi(getCharacters, true)

    useEffect(() => {
        setArtistId(filter?.ArtistId ?? -1)
        setCharacterId(filter?.CharacterId ?? -1)
        setTagId(filter?.CommissionTagId ?? -1)
        setStatus(filter?.CommissionStatus ?? -3)
        setYear(filter?.Year ?? -1)
        setQuery(filter?.Query ?? '')
    }, [filter])

    const updateFilter = () => {
        let obj = {} as CommissionFilterOptions
        if (artistId > 0) { obj = { ...obj, ArtistId: artistId } }
        if (characterId > 0) { obj = { ...obj, CharacterId: characterId } }
        if (tagId > 0) { obj = { ...obj, CommissionTagId: tagId } }
        if (status > -3) { obj = { ...obj, CommissionStatus: status } }
        if (year > 0) { obj = { ...obj, Year: year } }
        if (query.trim().length > 0) { obj = { ...obj, Query: query } }
        setFilter(Object.keys(obj).length === 0 ? undefined : obj)
    }

    const selectables = [
        {
            'label': 'Year',
            'anyValue': -1,
            'value': year,
            'setter': setYear,
            'data': yearsApi.data?.map(a => { return { 'value': a, 'label': a, 'image': undefined as undefined | string, 'color': '', 'hasImage': false } })
        },
        {
            'label': 'Status',
            'anyValue': -3,
            'value': status,
            'setter': setStatus,
            'data': ["Archived", ...CommissionStatus].map((a, i) => { return { 'value': i - 1, 'label': a, 'image': undefined as undefined | string, 'color': '', 'hasImage': false } })
        },
        {
            'label': isArtist ? 'Client' : 'Artist',
            'anyValue': -1,
            'value': artistId,
            'setter': setArtistId,
            'data': artistApi.data?.map(a => { return { 'value': a.id, 'label': a.name, 'image': artistImage(a.id), 'color': '#999', 'hasImage': a.hasImage } })
        },
        {
            'label': 'Character',
            'anyValue': -1,
            'value': characterId,
            'setter': setCharacterId,
            'data': charApi.data?.map(a => { return { 'value': a.id, 'label': a.name, 'image': characterImage(a.id), 'color': a.color, 'hasImage': a.hasImage } })
        },
        {
            'label': 'Tag',
            'anyValue': -1,
            'value': tagId,
            'setter': setTagId,
            'data': tagsApi.data?.map(a => { return { 'value': a.id, 'label': a.name, 'image': undefined, 'color': a.color, 'hasImage': false } })
        }
    ]

    return <Card style={{ height: "100%", width: "100%" }}>
        <CardContent style={{ display: "flex", flexDirection: 'column', justifyContent: 'space-between', height: "100%", overflowY: 'auto' }}>
            <div>

                <TextField label="Text" fullWidth value={query} onChange={(e) => setQuery(e.target.value)} style={{ marginBottom: "10px" }} />
                <hr />
                {selectables.map(a => <FormControl fullWidth style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <InputLabel>{a.label}</InputLabel>
                    <Select
                        value={a.value}
                        label={a.label}
                        onChange={(e) => { a.setter(e.target.value as number) }}
                    >
                        <MenuItem value={a.anyValue}><div style={{ color: "#CCC" }}>Any</div></MenuItem>
                        {a.data?.map((y) => <MenuItem value={y.value}>
                            <div style={{ display: "flex" }}>
                                {(y.image || y.color.length > 0) && <SafeAvatar hasImage={y.hasImage} color={y.color} src={y.image} text={y.label.toString()} size={22} style={{ marginRight: "10px" }} />}
                                {y.label}
                            </div>
                        </MenuItem>)}
                    </Select>
                </FormControl>)
                }
            </div>
            <div>
                <hr />
                <Button fullWidth variant="contained" startIcon={<Search />} onClick={updateFilter}>
                    Search
                </Button>
            </div>
        </CardContent>

    </Card>

}
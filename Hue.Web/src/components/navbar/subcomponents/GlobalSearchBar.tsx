import { Search } from "@mui/icons-material";
import { Autocomplete, Box, CircularProgress, debounce, InputAdornment, TextField } from "@mui/material";
import useApi from "../../hooks/useApi";
import { artistImage, getArtists } from "../../../api/Artist";
import { characterImage, getCharacters } from "../../../api/Char";
import { useCallback, useEffect, useRef, useState } from "react";
import SafeAvatar from "../../shared/SafeAvatar";
import { commHeaderImage } from "../../../api/Comm";
import { useNavigate } from "react-router-dom";
import { useCommissions } from "../../hooks/useCommissions";
import CommissionFilterOptions from "../../../model/commission/CommissionFilterOptions";

export default function GlobalSearchBar(props: {
    onExit?: () => void
}) {

    class SearchResult {
        public type: 'Artists' | 'Characters' | 'Commissions' = 'Artists'
        public hasImage: boolean = false
        public name: string = ""
        public color: string = ""
        public id: number = 0
    }

    const { onExit } = props

    const inputRef = useRef(null);
    const [query, setQuery] = useState("")
    const [commissionFilter, setCommissionFilter] = useState(undefined as CommissionFilterOptions | undefined)

    const [commissionDebounce, setCommissionDebounce] = useState(false)
    const artistApi = useApi(getArtists)
    const characterApi = useApi(getCharacters)
    const commissionsApi = useCommissions(commissionFilter)
    const nav = useNavigate();

    useEffect(() => {
        if (inputRef.current) {
            (inputRef.current as any).focus();
        }
    }, [])

    const onOpen = () => {
        if (!artistApi.data && !artistApi.loading) {
            artistApi.fetch()
        }
        if (!characterApi.data && !characterApi.loading) {
            characterApi.fetch();
        }
    }

    const onInputChange = (value: string) => {
        setQuery(value)
        commissionsApi.reset()
        if (value.length !== 0) {
            setCommissionDebounce(true)
            handleSearch(value)
        }
    }

    const handleSearch = useCallback(debounce((value: string) => {
        setCommissionFilter({ Page: 0, Query: value })
        setCommissionDebounce(false)
    }, 1000), [])

    const loading = artistApi.loading || characterApi.loading

    const options = (): SearchResult[] => {
        if (loading || query.length === 0) return []

        const lowerQuery = query.toLowerCase();

        return [
            ...artistApi.data?.filter((a) =>
                a.name.toLowerCase().includes(lowerQuery) ||
                a.socialUrl.toLowerCase().includes(lowerQuery)
            ).map((a) => {
                return {
                    id: a.id,
                    name: a.name,
                    hasImage: a.hasImage,
                    color: '#999',
                    type: 'Artists'
                } as SearchResult
            }),

            ...characterApi.data?.filter((a) =>
                a.name.toLowerCase().includes(lowerQuery)
            ).map((a) => {
                return {
                    id: a.id,
                    name: a.name,
                    color: a.color,
                    hasImage: a.hasImage,
                    type: 'Characters'
                } as SearchResult
            }),

            ...commissionsApi.comms?.map((a) => {
                return {
                    id: a.id,
                    color: a.characters[0]?.color ?? "#999",
                    name: a.name,
                    type: 'Commissions',
                    hasImage: a.hasImage
                } as SearchResult
            })

        ]

    }

    const onSelect = (value: SearchResult) => {
        if (!value?.id || !value?.type) return;
        setQuery("")
        switch (value.type) {
            case 'Artists':
                nav(`/artists/${value.id}`)
                return;
            case 'Characters':
                nav(`/characters/${value.id}`)
                return;
            case 'Commissions':
                nav(`/commissions/${value.id}`)
                return;
            default:
                return;
        }


    }



    const selectOptions = options();
    return <Autocomplete
        freeSolo loading={loading || query.length === 0} loadingText={loading ? "Loading..." : "Type to begin"}
        options={selectOptions}
        groupBy={(option) => option.type}
        getOptionLabel={(option) => (option as SearchResult)?.name ?? option}
        filterOptions={(options) => options} //Disable the filtering, we do all the filtering ourselves
        onOpen={onOpen}
        onChange={(_, value) => { onSelect(value as SearchResult) }}
        inputValue={query}
        onInputChange={(_, value) => { onInputChange(value) }}
        onKeyDown={(e) => {
            switch (e.key) {
                case "Enter":
                    if (selectOptions.length === 1) {
                        onSelect(selectOptions[0]);
                    }
                    break;
                case "Escape":
                    onExit?.();
                    break;
                default:
                    break;
            }
        }}
        renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
                <Box
                    key={key}
                    component="li"
                    {...optionProps}
                    style={{ display: "flex" }}
                >
                    <SafeAvatar hasImage={option.hasImage} color={option.color} size={32} src={
                        option.type === "Artists" ? artistImage(option.id) :
                            option.type === 'Characters' ? characterImage(option.id)
                                : commHeaderImage(option.id)
                    } text={option.name} style={{ marginRight: "20px" }} />
                    {option.name}

                </Box>
            );
        }}
        renderInput={(params: any) =>
            <TextField {...params}
                onBlur={onExit}
                inputRef={inputRef}
                placeholder="Search" variant="outlined"
                slotProps={{
                    input: {
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                {loading || commissionsApi.loading || commissionDebounce ? <CircularProgress color="inherit" size={25} /> : <Search />}
                            </InputAdornment>
                        ),
                        endAdornment: (<InputAdornment position="end">
                        </InputAdornment>),
                        disableUnderline: true
                    }
                }} />}

    />
}

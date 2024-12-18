import Character from "../../../../model/character/Character";
import SelectorModal from "../../../shared/modals/SelectorModal";
import { getCharacters } from "../../../../api/Char";
import { useEffect, useState } from "react";
import CharacterTile from "./CharacterTile";
import useApi from "../../../hooks/useApi";
import CreateCharacterModal from "./CreateCharacterModal";

export default function CharacterSelector(props: {
    open: boolean,
    setOpen: (val: boolean) => void
    setChar: (val: Character) => void
}) {

    const charApi = useApi(getCharacters)
    const { open, setOpen, setChar } = props
    const [newOpen, setNewOpen] = useState(false)

    useEffect(() => {
        if (open) { charApi.fetch(); }
    }, [open])


    if (!open) return <></>

    return <>
        <SelectorModal
            entries={charApi.data?.filter(a => !a.isRetired)} loading={charApi.loading}
            open={open} setOpen={setOpen} onSelect={setChar}
            onNewClick={() => setNewOpen(true)} type="character"
            entryFilterDecider={(entry, filter) => entry.name.toLowerCase().includes(filter.toLowerCase())}
            renderEntry={(props) =>
                <div style={{ paddingRight: "10px" }}><CharacterTile character={props.entry} onClick={props.onClick} autoSize /></div>
            }
        />

        <CreateCharacterModal open={newOpen} setOpen={setNewOpen} onOk={() => { charApi.fetch(); }} />

    </>

}